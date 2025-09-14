import { useState, useEffect, useCallback } from 'react'
import { DraftService } from '../services/draft.service'
import { 
  DraftState, 
  UseDraft, 
  RankedContestant, 
  DraftRanking 
} from '../types/draft'

export const useDraft = (userId?: string): UseDraft => {
  const [state, setState] = useState<DraftState>({
    contestants: [],
    rankings: [],
    season: null,
    currentEpisode: null,
    isDeadlinePassed: false,
    isSubmitted: false,
    isLoading: true,
    isSaving: false,
    error: null,
    lastSaved: undefined
  })

  // Load contestants and season data
  const loadContestants = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await DraftService.getCurrentSeasonContestants()
      const isDeadlinePassed = DraftService.isDraftDeadlinePassed(response.season)

      console.log('useDraft - Season data:', {
        season: response.season,
        draft_deadline: response.season?.draft_deadline,
        currentDate: new Date().toISOString(),
        isDeadlinePassed
      })

      setState(prev => ({
        ...prev,
        contestants: response.contestants,
        season: response.season,
        currentEpisode: response.currentEpisode,
        isDeadlinePassed,
        isLoading: false
      }))
    } catch (error) {
      console.error('Error loading contestants:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load contestants',
        isLoading: false
      }))
    }
  }, [])

  // Load user's existing rankings
  const loadRankings = useCallback(async () => {
    if (!userId || !state.season) return

    try {
      const response = await DraftService.getUserRankings(userId, state.season.id)
      
      setState(prev => ({
        ...prev,
        rankings: response.rankings,
        isSubmitted: response.isSubmitted
      }))
    } catch (error) {
      console.error('Error loading rankings:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load rankings'
      }))
    }
  }, [userId, state.season])

  // Update rankings (auto-save)
  const updateRankings = useCallback(async (rankedContestants: RankedContestant[]) => {
    if (!userId || !state.season || state.isSubmitted || state.isDeadlinePassed) return

    try {
      setState(prev => ({ ...prev, isSaving: true, error: null }))

      const rankings = rankedContestants.map((contestant, index) => ({
        contestant_id: contestant.id,
        rank_position: index + 1
      }))

      await DraftService.saveRankings(userId, state.season.id, rankings)

      // Update local state
      const newRankings: DraftRanking[] = rankings.map((ranking, index) => ({
        id: index + 1, // Temporary ID for local state
        user_id: userId,
        season_id: state.season!.id,
        contestant_id: ranking.contestant_id,
        rank_position: ranking.rank_position,
        is_submitted: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))

      setState(prev => ({
        ...prev,
        rankings: newRankings,
        isSaving: false,
        lastSaved: new Date()
      }))
    } catch (error) {
      console.error('Error updating rankings:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to save rankings',
        isSaving: false
      }))
    }
  }, [userId, state.season, state.isSubmitted, state.isDeadlinePassed])

  // Submit final rankings
  const submitRankings = useCallback(async () => {
    if (!userId || !state.season || state.rankings.length === 0) return

    try {
      setState(prev => ({ ...prev, isSaving: true, error: null }))
      
      await DraftService.submitRankings(userId, state.season.id)
      
      setState(prev => ({
        ...prev,
        isSubmitted: true,
        isSaving: false
      }))
    } catch (error) {
      console.error('Error submitting rankings:', error)
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to submit rankings',
        isSaving: false
      }))
    }
  }, [userId, state.season, state.rankings.length])

  // Reorder contestant (for drag and drop)
  const reorderContestant = useCallback((dragIndex: number, hoverIndex: number) => {
    console.log('reorderContestant called:', {
      dragIndex,
      hoverIndex,
      isSubmitted: state.isSubmitted,
      isDeadlinePassed: state.isDeadlinePassed,
      canReorder: !state.isSubmitted && !state.isDeadlinePassed
    })

    if (state.isSubmitted || state.isDeadlinePassed) {
      console.log('Reordering blocked - deadline passed or submitted')
      return
    }

    setState(prev => {
      const newContestants = [...prev.contestants]
      const draggedContestant = newContestants[dragIndex]
      
      // Remove the dragged item
      newContestants.splice(dragIndex, 1)
      // Insert it at the new position
      newContestants.splice(hoverIndex, 0, draggedContestant)
      
      return {
        ...prev,
        contestants: newContestants
      }
    })
  }, [state.isSubmitted, state.isDeadlinePassed])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Create ranked contestants list for UI
  const getRankedContestants = useCallback((): RankedContestant[] => {
    if (state.rankings.length === 0) {
      // No rankings yet, return contestants in alphabetical order
      return state.contestants.map((contestant, index) => ({
        ...contestant,
        rank_position: index + 1,
        is_ranked: false
      }))
    }

    // User has rankings, sort contestants by their rank
    const rankedContestants: RankedContestant[] = []
    
    // First, add all ranked contestants in order
    state.rankings
      .sort((a, b) => a.rank_position - b.rank_position)
      .forEach(ranking => {
        const contestant = state.contestants.find(c => c.id === ranking.contestant_id)
        if (contestant) {
          rankedContestants.push({
            ...contestant,
            rank_position: ranking.rank_position,
            is_ranked: true
          })
        }
      })

    // Then add any unranked contestants at the end
    state.contestants.forEach(contestant => {
      const isAlreadyRanked = rankedContestants.some(rc => rc.id === contestant.id)
      if (!isAlreadyRanked) {
        rankedContestants.push({
          ...contestant,
          rank_position: rankedContestants.length + 1,
          is_ranked: false
        })
      }
    })

    return rankedContestants
  }, [state.contestants, state.rankings])

  // Initialize data on mount
  useEffect(() => {
    loadContestants()
  }, [loadContestants])

  // Load rankings when season and user are available
  useEffect(() => {
    if (userId && state.season && !state.isLoading) {
      loadRankings()
    }
  }, [userId, state.season, state.isLoading, loadRankings])

  return {
    ...state,
    loadContestants,
    loadRankings,
    updateRankings,
    submitRankings,
    reorderContestant,
    clearError,
    getRankedContestants
  }
}