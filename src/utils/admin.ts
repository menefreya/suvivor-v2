import { supabase } from '../supabase'

export class AdminUtils {
  /**
   * Create a new season with future deadline
   */
  static async createSeason(
    seasonNumber: number,
    seasonName: string,
    daysUntilDeadline: number = 7
  ) {
    try {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + daysUntilDeadline)
      
      const { data: season, error } = await supabase
        .from('seasons')
        .insert({
          season_number: seasonNumber,
          season_name: seasonName,
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          draft_deadline: futureDate.toISOString(),
          sole_survivor_deadline: futureDate.toISOString(),
          episode_2_deadline: futureDate.toISOString(),
          is_active: true
        })
        .select()
        .single()

      if (error) throw error
      console.log('Created season:', season)
      return season
    } catch (error) {
      console.error('Error creating season:', error)
      throw error
    }
  }

  /**
   * Add contestants to a season
   */
  static async addContestants(seasonId: number, contestants: Array<{
    name: string
    age: number
    occupation: string
    hometown: string
    residence: string
  }>) {
    try {
      const contestantsData = contestants.map(contestant => ({
        season_id: seasonId,
        name: contestant.name,
        age: contestant.age,
        occupation: contestant.occupation,
        hometown: contestant.hometown,
        residence: contestant.residence,
        is_eliminated: false,
        points: 0,
        episodes: 1
      }))

      const { data, error } = await supabase
        .from('contestants')
        .insert(contestantsData)
        .select()

      if (error) throw error
      console.log('Added contestants:', data)
      return data
    } catch (error) {
      console.error('Error adding contestants:', error)
      throw error
    }
  }

  /**
   * Get all seasons
   */
  static async getSeasons() {
    try {
      const { data, error } = await supabase
        .from('seasons')
        .select('*')
        .order('season_number', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching seasons:', error)
      throw error
    }
  }

  /**
   * Get contestants for a season
   */
  static async getContestants(seasonId: number) {
    try {
      const { data, error } = await supabase
        .from('contestants')
        .select('*')
        .eq('season_id', seasonId)
        .order('name')

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching contestants:', error)
      throw error
    }
  }

  /**
   * Check current database state
   */
  static async checkDatabaseState() {
    try {
      console.log('=== DATABASE STATE CHECK ===')
      
      // Check seasons
      const { data: seasons, error: seasonsError } = await supabase
        .from('seasons')
        .select('*')
        .order('season_number', { ascending: false })

      if (seasonsError) {
        console.error('Error fetching seasons:', seasonsError)
      } else {
        console.log('All seasons:', seasons)
        const activeSeason = seasons?.find(s => s.is_active)
        console.log('Active season:', activeSeason)
      }

      // Check contestants
      const { data: contestants, error: contestantsError } = await supabase
        .from('contestants')
        .select('*')
        .order('name')

      if (contestantsError) {
        console.error('Error fetching contestants:', contestantsError)
      } else {
        console.log('All contestants:', contestants)
      }

      // Check draft rankings
      const { data: rankings, error: rankingsError } = await supabase
        .from('draft_rankings')
        .select('*')

      if (rankingsError) {
        console.error('Error fetching rankings:', rankingsError)
      } else {
        console.log('All draft rankings:', rankings)
      }

      console.log('=== END DATABASE STATE CHECK ===')
    } catch (error) {
      console.error('Error checking database state:', error)
    }
  }
  static async updateSeasonDeadline(seasonId: number, daysFromNow: number) {
    try {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + daysFromNow)
      
      const { data, error } = await supabase
        .from('seasons')
        .update({
          episode_2_deadline: futureDate.toISOString(),
          draft_deadline: futureDate.toISOString(),
          sole_survivor_deadline: futureDate.toISOString()
        })
        .eq('id', seasonId)
        .select()

      if (error) throw error
      console.log('Updated season deadline:', data)
      return data
    } catch (error) {
      console.error('Error updating deadline:', error)
      throw error
    }
  }
}

// Console helpers for development
if (typeof window !== 'undefined') {
  (window as any).admin = AdminUtils
  console.log('Admin utilities available at window.admin')
  console.log('Usage examples:')
  console.log('  window.admin.checkDatabaseState() - Check current DB state')
  console.log('  window.admin.createSeason(1, "Season 2024", 7)')
  console.log('  window.admin.getSeasons()')
  console.log('  window.admin.updateSeasonDeadline(seasonId, 7)')
}
