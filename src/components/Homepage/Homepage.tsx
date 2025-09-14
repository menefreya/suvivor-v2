import React, { useState, useEffect } from 'react'
import { supabase } from '../../supabase'
import './Homepage.css'

interface UserProfile {
  id: string
  username: string
  first_name: string
  last_name: string
  avatar_url?: string
}

interface UserSeasonScore {
  user_id: string
  total_points: number | null
  current_rank: number | null
  episodes_scored: number | null
}

interface LeaderboardEntry {
  user: UserProfile
  score: UserSeasonScore | null
  rank: number
}

interface Contestant {
  id: number
  name: string
  image_url?: string
  tribe?: {
    name: string
    color: string
  }
}

interface DraftPick {
  id: number
  contestant_id: number
  pick_number: number
  contestant: Contestant
}

interface SoleSurvivorPick {
  id: number
  contestant_id: number
  contestant: Contestant
}

interface UserTeam {
  draftPicks: DraftPick[]
  soleSurvivor: SoleSurvivorPick | null
}

export const Homepage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userTeam, setUserTeam] = useState<UserTeam | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHomepageData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadHomepageData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Load leaderboard and user team data in parallel
      await Promise.all([
        loadLeaderboard(),
        loadUserTeam()
      ])
    } catch (err) {
      console.error('Error loading homepage data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load homepage data')
    } finally {
      setIsLoading(false)
    }
  }

  const loadLeaderboard = async () => {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('user_profiles')
      .select('id, username, first_name, last_name, avatar_url')
      .order('username')

    if (usersError) {
      throw new Error(`Failed to load users: ${usersError.message}`)
    }

    // Get current active season
    const { data: activeSeason, error: seasonError } = await supabase
      .from('seasons')
      .select('id')
      .eq('is_active', true)
      .single()

    if (seasonError && seasonError.code !== 'PGRST116') {
      throw new Error(`Failed to load active season: ${seasonError.message}`)
    }

    let scores: UserSeasonScore[] = []

    if (activeSeason) {
      // Get season scores for the active season
      const { data: seasonScores, error: scoresError } = await supabase
        .from('user_season_scores')
        .select('user_id, total_points, current_rank, episodes_scored')
        .eq('season_id', activeSeason.id)

      if (scoresError) {
        console.warn('Failed to load season scores:', scoresError.message)
      } else {
        scores = seasonScores || []
      }
    }

    // Combine users with their scores
    const leaderboardData: LeaderboardEntry[] = users.map((user, index) => {
      const userScore = scores.find(score => score.user_id === user.id) || null
      
      return {
        user,
        score: userScore,
        rank: userScore?.current_rank || index + 1
      }
    })

    // Sort by total points (descending), then by username
    leaderboardData.sort((a, b) => {
      const aPoints = a.score?.total_points ?? 0
      const bPoints = b.score?.total_points ?? 0
      
      if (aPoints !== bPoints) {
        return bPoints - aPoints
      }
      
      return a.user.username.localeCompare(b.user.username)
    })

    // Update ranks based on sorted order
    leaderboardData.forEach((entry, index) => {
      entry.rank = index + 1
    })

    setLeaderboard(leaderboardData)
  }

  const loadUserTeam = async () => {
    // Get current user (for now, we'll use the first user as an example)
    const { data: currentUser } = await supabase.auth.getUser()
    
    if (!currentUser.user) {
      console.warn('No current user found')
      return
    }

    // Get active season
    const { data: activeSeason } = await supabase
      .from('seasons')
      .select('id')
      .eq('is_active', true)
      .single()

    if (!activeSeason) {
      console.warn('No active season found')
      return
    }

    // Load draft picks with contestant and tribe data
    const { data: draftPicks, error: draftError } = await supabase
      .from('draft_picks')
      .select(`
        id,
        contestant_id,
        pick_number,
        contestants!inner (
          id,
          name,
          image_url,
          tribes!inner (
            name,
            color
          )
        )
      `)
      .eq('user_id', currentUser.user.id)
      .eq('season_id', activeSeason.id)
      .eq('is_active', true)

    if (draftError) {
      console.warn('Failed to load draft picks:', draftError.message)
    }

    // Load sole survivor pick with contestant and tribe data
    const { data: soleSurvivorPick, error: soleError } = await supabase
      .from('sole_survivor_picks')
      .select(`
        id,
        contestant_id,
        contestants!inner (
          id,
          name,
          image_url,
          tribes!inner (
            name,
            color
          )
        )
      `)
      .eq('user_id', currentUser.user.id)
      .eq('season_id', activeSeason.id)
      .eq('is_active', true)
      .single()

    if (soleError && soleError.code !== 'PGRST116') {
      console.warn('Failed to load sole survivor pick:', soleError.message)
    }

    // Transform the data
    const transformedDraftPicks: DraftPick[] = (draftPicks || []).map(pick => ({
      id: pick.id,
      contestant_id: pick.contestant_id,
      pick_number: pick.pick_number,
      contestant: {
        id: (pick.contestants as any).id,
        name: (pick.contestants as any).name,
        image_url: (pick.contestants as any).image_url,
        tribe: (pick.contestants as any).tribes ? {
          name: (pick.contestants as any).tribes.name,
          color: (pick.contestants as any).tribes.color
        } : undefined
      }
    }))

    const transformedSoleSurvivor: SoleSurvivorPick | null = soleSurvivorPick ? {
      id: soleSurvivorPick.id,
      contestant_id: soleSurvivorPick.contestant_id,
      contestant: {
        id: (soleSurvivorPick.contestants as any).id,
        name: (soleSurvivorPick.contestants as any).name,
        image_url: (soleSurvivorPick.contestants as any).image_url,
        tribe: (soleSurvivorPick.contestants as any).tribes ? {
          name: (soleSurvivorPick.contestants as any).tribes.name,
          color: (soleSurvivorPick.contestants as any).tribes.color
        } : undefined
      }
    } : null

    setUserTeam({
      draftPicks: transformedDraftPicks,
      soleSurvivor: transformedSoleSurvivor
    })
  }

  const getDisplayName = (user: UserProfile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`
    }
    return user.username
  }

  const getAvatarPlaceholder = (user: UserProfile) => {
    const name = getDisplayName(user)
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  const getContestantPlaceholder = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="homepage-loading">
        <div className="spinner"></div>
        <p>Loading homepage...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="homepage-error">
        <div className="error-icon">⚠️</div>
        <h3>Error Loading Homepage</h3>
        <p>{error}</p>
        <button onClick={loadHomepageData} className="retry-btn">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="homepage-container">
      {/* Header */}
      <div className="homepage-header">
        <h1>Survivor Fantasy League</h1>
        <p className="homepage-subtitle">Current Season Overview</p>
      </div>

      {/* Two Column Layout */}
      <div className="homepage-grid">
        {/* Left Column - Leaderboard */}
        <div className="leaderboard-column">
          <div className="leaderboard-section">
            <div className="section-header">
              <h2>League Standings</h2>
              <span className="section-subtitle">Ranked by total points</span>
            </div>

            <div className="leaderboard-list">
              {leaderboard.length === 0 ? (
                <div className="no-data">
                  <div className="no-data-icon">📊</div>
                  <h3>No Players Yet</h3>
                  <p>Be the first to join the league!</p>
                </div>
              ) : (
                leaderboard.map((entry, index) => (
                  <div key={entry.user.id} className="leaderboard-item">
                    <div className="rank-number">{entry.rank}</div>
                    
                    <div className="player-info">
                      <div className="player-avatar">
                        {entry.user.avatar_url ? (
                          <img src={entry.user.avatar_url} alt={getDisplayName(entry.user)} />
                        ) : (
                          <div className="avatar-placeholder">
                            {getAvatarPlaceholder(entry.user)}
                          </div>
                        )}
                      </div>
                      <div className="player-details">
                        <div className="player-name">{getDisplayName(entry.user)}</div>
                        <div className="player-username">@{entry.user.username}</div>
                      </div>
                    </div>

                    <div className="player-stats">
                      <div className="stat-item">
                        <span className="stat-label">Points</span>
                        <span className="stat-value">
                          {entry.score?.total_points !== null && entry.score?.total_points !== undefined ? entry.score.total_points : 'N/A'}
                        </span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Episodes</span>
                        <span className="stat-value">
                          {entry.score?.episodes_scored !== null && entry.score?.episodes_scored !== undefined ? entry.score.episodes_scored : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="rank-change">
                      {index === 0 && (
                        <div className="first-place">🥇</div>
                      )}
                      {index === 1 && (
                        <div className="second-place">🥈</div>
                      )}
                      {index === 2 && (
                        <div className="third-place">🥉</div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column - User Team */}
        <div className="team-column">
          <div className="team-section">
            <div className="section-header">
              <h2>My Team</h2>
              <span className="section-subtitle">Your current picks</span>
            </div>

            {/* Sole Survivor */}
            <div className="team-subsection">
              <h3>Sole Survivor</h3>
              <div className="sole-survivor-card">
                {userTeam?.soleSurvivor ? (
                  <>
                    <div className="contestant-image">
                      {userTeam.soleSurvivor.contestant.image_url ? (
                        <img src={userTeam.soleSurvivor.contestant.image_url} alt={userTeam.soleSurvivor.contestant.name} />
                      ) : (
                        <div className="placeholder-image">
                          {getContestantPlaceholder(userTeam.soleSurvivor.contestant.name)}
                        </div>
                      )}
                    </div>
                    <div className="contestant-info">
                      <div className="contestant-name">{userTeam.soleSurvivor.contestant.name}</div>
                      <div className="contestant-tribe">
                        <span 
                          className="tribe-tag"
                          style={{ backgroundColor: userTeam.soleSurvivor.contestant.tribe?.color || '#6c757d' }}
                        >
                          {userTeam.soleSurvivor.contestant.tribe?.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="bonus-info">+25 bonus if they win!</div>
                    </div>
                  </>
                ) : (
                  <div className="no-pick">
                    <div className="no-pick-icon">👑</div>
                    <p>No sole survivor selected</p>
                    <button className="select-btn">Select Now</button>
                  </div>
                )}
              </div>
            </div>

            {/* Draft Picks */}
            <div className="team-subsection">
              <h3>Draft Picks</h3>
              <div className="draft-picks-list">
                {userTeam?.draftPicks && userTeam.draftPicks.length > 0 ? (
                  userTeam.draftPicks.map((pick) => (
                    <div key={pick.id} className="draft-pick-card">
                      <div className="pick-number">Pick #{pick.pick_number}</div>
                      <div className="contestant-image">
                        {pick.contestant.image_url ? (
                          <img src={pick.contestant.image_url} alt={pick.contestant.name} />
                        ) : (
                          <div className="placeholder-image">
                            {getContestantPlaceholder(pick.contestant.name)}
                          </div>
                        )}
                      </div>
                      <div className="contestant-info">
                        <div className="contestant-name">{pick.contestant.name}</div>
                        <div className="contestant-tribe">
                          <span 
                            className="tribe-tag"
                            style={{ backgroundColor: pick.contestant.tribe?.color || '#6c757d' }}
                          >
                            {pick.contestant.tribe?.name || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-picks">
                    <div className="no-picks-icon">📋</div>
                    <p>No draft picks assigned</p>
                    <button className="draft-btn">Complete Draft</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-value">{leaderboard.length}</div>
            <div className="stat-label">Total Players</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-value">
              {leaderboard.length > 0 ? leaderboard[0].user.username : 'N/A'}
            </div>
            <div className="stat-label">Current Leader</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">
              {leaderboard.filter(entry => entry.score?.total_points !== null).length}
            </div>
            <div className="stat-label">Players with Scores</div>
          </div>
        </div>
      </div>
    </div>
  )
}
