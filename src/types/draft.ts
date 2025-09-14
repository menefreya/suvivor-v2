// Draft System Types and Interfaces

export interface Contestant {
  id: number
  season_id: number
  name: string
  age?: number
  hometown?: string
  residence?: string
  occupation?: string
  current_tribe_id?: number
  is_eliminated: boolean
  elimination_episode_id?: number
  image_url?: string
  points: number
  episodes: number
  final_placement?: number
  created_at: string
  updated_at: string
}

export interface Tribe {
  id: number
  season_id: number
  name: string
  color?: string
  is_active: boolean
  created_at: string
}

export interface Season {
  id: number
  season_number: number
  season_name: string
  start_date: string
  end_date?: string
  draft_deadline: string
  sole_survivor_deadline: string
  episode_2_deadline: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DraftRanking {
  id: number
  user_id: string
  season_id: number
  contestant_id: number
  rank_position: number
  submitted_at?: string
  is_submitted: boolean
  created_at: string
  updated_at: string
}

export interface DraftPick {
  id: number
  user_id: string
  season_id: number
  contestant_id: number
  pick_number: number
  assigned_from_rank: number
  assigned_at: string
  is_active: boolean
  replaced_at?: string
  replaced_by_pick_id?: number
}

export interface Episode {
  id: number
  season_id: number
  episode_number: number
  air_date: string
  is_finale: boolean
  is_scored: boolean
  scoring_locked: boolean
  created_at: string
  updated_at: string
}

// Extended interfaces for UI
export interface ContestantWithTribe extends Contestant {
  tribe?: Tribe
}

export interface RankedContestant extends ContestantWithTribe {
  rank_position: number
  is_ranked: boolean
}

export interface DraftRankingWithContestant extends DraftRanking {
  contestant: ContestantWithTribe
}

// Draft UI State
export interface DraftState {
  contestants: ContestantWithTribe[]
  rankings: DraftRanking[]
  season: Season | null
  currentEpisode: Episode | null
  isDeadlinePassed: boolean
  isSubmitted: boolean
  isLoading: boolean
  isSaving: boolean
  error: string | null
  lastSaved?: Date
}

// Draft Actions
export interface DraftActions {
  loadContestants: () => Promise<void>
  loadRankings: () => Promise<void>
  updateRankings: (rankings: RankedContestant[]) => Promise<void>
  submitRankings: () => Promise<void>
  reorderContestant: (dragIndex: number, hoverIndex: number) => void
  clearError: () => void
  getRankedContestants: () => RankedContestant[]
}

// API Response Types
export interface ContestantsResponse {
  contestants: ContestantWithTribe[]
  season: Season
  currentEpisode: Episode | null
}

export interface RankingsResponse {
  rankings: DraftRanking[]
  isSubmitted: boolean
  submittedAt?: string
}

// Hook return type
export type UseDraft = DraftState & DraftActions

// Drag and Drop Types
export interface DragItem {
  index: number
  id: number
  type: string
}

export interface DragCollectedProps {
  isDragging: boolean
}

export interface DropCollectedProps {
  isOver: boolean
  canDrop: boolean
}