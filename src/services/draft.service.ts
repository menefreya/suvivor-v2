import { supabase } from '../supabase'
import { 
  Season, 
  Episode, 
  DraftRanking, 
  DraftPick,
  ContestantWithTribe,
  ContestantsResponse,
  RankingsResponse
} from '../types/draft'

export class DraftService {
  /**
   * Get the current active season with contestants
   */
  static async getCurrentSeasonContestants(): Promise<ContestantsResponse> {
    try {
      // Get active season
      const { data: season, error: seasonError } = await supabase
        .from('seasons')
        .select('*')
        .eq('is_active', true)
        .single()

      console.log('Season query result:', { season, seasonError })

      if (seasonError) {
        console.error('Error fetching active season:', seasonError)
        throw seasonError
      }
      if (!season) {
        throw new Error('No active season found. Please contact an administrator to set up a season with is_active = true.')
      }

      console.log('Found active season:', season)

      // Get current episode (to check if we're past episode 2)
      const { data: currentEpisode, error: episodeError } = await supabase
        .from('episodes')
        .select('*')
        .eq('season_id', season.id)
        .order('episode_number', { ascending: false })
        .limit(1)
        .single()

      if (episodeError && episodeError.code !== 'PGRST116') {
        throw episodeError
      }

      // Get contestants with tribe information
      const { data: contestants, error: contestantsError } = await supabase
        .from('contestants')
        .select(`
          *,
          tribe:tribes(*)
        `)
        .eq('season_id', season.id)
        .eq('is_eliminated', false)
        .order('name')

      if (contestantsError) {
        console.error('Error fetching contestants:', contestantsError)
        throw contestantsError
      }

      if (!contestants || contestants.length === 0) {
        throw new Error(`No contestants found for season "${season.season_name}". Please contact an administrator to add contestants to this season.`)
      }

      console.log(`Found ${contestants.length} contestants for season:`, season.season_name)

      return {
        contestants: contestants as ContestantWithTribe[],
        season: season as Season,
        currentEpisode: currentEpisode as Episode
      }
    } catch (error) {
      console.error('Error fetching season contestants:', error)
      throw error
    }
  }

  /**
   * Get user's draft rankings for the current season
   */
  static async getUserRankings(userId: string, seasonId: number): Promise<RankingsResponse> {
    try {
      const { data: rankings, error } = await supabase
        .from('draft_rankings')
        .select('*')
        .eq('user_id', userId)
        .eq('season_id', seasonId)
        .order('rank_position')

      if (error) throw error

      const isSubmitted = rankings.some(r => r.is_submitted)
      const submittedAt = rankings.find(r => r.submitted_at)?.submitted_at

      return {
        rankings: rankings as DraftRanking[],
        isSubmitted,
        submittedAt
      }
    } catch (error) {
      console.error('Error fetching user rankings:', error)
      throw error
    }
  }

  /**
   * Save user's draft rankings
   */
  static async saveRankings(userId: string, seasonId: number, rankings: { contestant_id: number; rank_position: number }[]): Promise<void> {
    try {
      // First, delete existing rankings for this user/season
      const { error: deleteError } = await supabase
        .from('draft_rankings')
        .delete()
        .eq('user_id', userId)
        .eq('season_id', seasonId)

      if (deleteError) throw deleteError

      // Insert new rankings
      const rankingData = rankings.map(ranking => ({
        user_id: userId,
        season_id: seasonId,
        contestant_id: ranking.contestant_id,
        rank_position: ranking.rank_position,
        is_submitted: false
      }))

      const { error: insertError } = await supabase
        .from('draft_rankings')
        .insert(rankingData)

      if (insertError) throw insertError
    } catch (error) {
      console.error('Error saving rankings:', error)
      throw error
    }
  }

  /**
   * Submit final rankings (lock them in)
   */
  static async submitRankings(userId: string, seasonId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('draft_rankings')
        .update({
          is_submitted: true,
          submitted_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('season_id', seasonId)

      if (error) throw error
    } catch (error) {
      console.error('Error submitting rankings:', error)
      throw error
    }
  }

  /**
   * Check if draft deadline has passed
   */
  static isDraftDeadlinePassed(season: Season): boolean {
    return new Date() > new Date(season.draft_deadline)
  }

  /**
   * Get user's current draft picks
   */
  static async getUserDraftPicks(userId: string, seasonId: number): Promise<DraftPick[]> {
    try {
      const { data: picks, error } = await supabase
        .from('draft_picks')
        .select(`
          *,
          contestant:contestants(*)
        `)
        .eq('user_id', userId)
        .eq('season_id', seasonId)
        .eq('is_active', true)
        .order('pick_number')

      if (error) throw error
      return picks as DraftPick[]
    } catch (error) {
      console.error('Error fetching draft picks:', error)
      throw error
    }
  }

  /**
   * Check if episode 2 has aired (for enabling/disabling draft)
   */
  static async isEpisode2Aired(seasonId: number): Promise<boolean> {
    try {
      const { data: episode2, error } = await supabase
        .from('episodes')
        .select('air_date')
        .eq('season_id', seasonId)
        .eq('episode_number', 2)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      if (!episode2) return false

      return new Date() >= new Date(episode2.air_date)
    } catch (error) {
      console.error('Error checking episode 2 air date:', error)
      return false
    }
  }

  /**
   * Get time until draft deadline
   */
  static getTimeUntilDeadline(season: Season): { timeLeft: number; isExpired: boolean } {
    const deadline = new Date(season.draft_deadline)
    const now = new Date()
    const timeLeft = deadline.getTime() - now.getTime()
    
    return {
      timeLeft: Math.max(0, timeLeft),
      isExpired: timeLeft <= 0
    }
  }
}
