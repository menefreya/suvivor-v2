import React, { useState, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import { TouchBackend } from 'react-dnd-touch-backend' // Temporarily disabled for testing
import { ContestantCard } from '../ContestantCard'
import { useDraft } from '../../hooks/useDraft'
import { RankedContestant } from '../../types/draft'
import './Draft.css'

interface DraftProps {
  userId: string
}

export const Draft: React.FC<DraftProps> = ({ userId }) => {
  const draft = useDraft(userId)
  const [rankedContestants, setRankedContestants] = useState<RankedContestant[]>([])
  const [timeUntilDeadline, setTimeUntilDeadline] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Update ranked contestants when draft data changes
  useEffect(() => {
    const ranked = draft.getRankedContestants()
    setRankedContestants(ranked)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft.contestants, draft.rankings])

  // Auto-save when rankings change (only in edit mode)
  useEffect(() => {
    if (isEditing && rankedContestants.length > 0 && hasUnsavedChanges && !draft.isSubmitted && !draft.isDeadlinePassed) {
      const timeoutId = setTimeout(() => {
        draft.updateRankings(rankedContestants)
        setHasUnsavedChanges(false)
      }, 1000) // Auto-save after 1 second of inactivity

      return () => clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rankedContestants, hasUnsavedChanges, isEditing])

  // Update countdown timer
  useEffect(() => {
    if (!draft.season) return

    const updateTimer = () => {
      const deadline = new Date(draft.season!.draft_deadline)
      const now = new Date()
      const timeLeft = deadline.getTime() - now.getTime()

      if (timeLeft <= 0) {
        setTimeUntilDeadline('Deadline passed')
        return
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) {
        setTimeUntilDeadline(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeUntilDeadline(`${hours}h ${minutes}m`)
      } else {
        setTimeUntilDeadline(`${minutes}m`)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [draft.season])

  // Handle card reordering (drag and drop)
  const handleMoveCard = (dragIndex: number, hoverIndex: number) => {
    console.log('handleMoveCard called:', { dragIndex, hoverIndex, isEditing, isSubmitted: draft.isSubmitted, isDeadlinePassed: draft.isDeadlinePassed })
    
    if (!isEditing) {
      console.log('Not in edit mode, ignoring move')
      return
    }

    const newRankedContestants = [...rankedContestants]
    const draggedCard = newRankedContestants[dragIndex]
    
    console.log('Moving card:', draggedCard.name, 'from', dragIndex, 'to', hoverIndex)
    
    // Remove and reinsert
    newRankedContestants.splice(dragIndex, 1)
    newRankedContestants.splice(hoverIndex, 0, draggedCard)
    
    // Update rank positions
    const updatedContestants = newRankedContestants.map((contestant, index) => ({
      ...contestant,
      rank_position: index + 1,
      is_ranked: true
    }))
    
    setRankedContestants(updatedContestants)
    setHasUnsavedChanges(true)
    console.log('Updated rankings:', updatedContestants.map(c => ({ name: c.name, rank: c.rank_position })))
  }

  // Handle edit mode toggle
  const handleEditToggle = () => {
    console.log('Edit toggle clicked. Current state:', { 
      isEditing, 
      hasUnsavedChanges, 
      rankedContestantsLength: rankedContestants.length,
      isDeadlinePassed: draft.isDeadlinePassed,
      isSubmitted: draft.isSubmitted 
    })
    
    if (isEditing) {
      // Save changes when exiting edit mode
      if (hasUnsavedChanges) {
        console.log('Saving changes before exiting edit mode')
        draft.updateRankings(rankedContestants)
        setHasUnsavedChanges(false)
      }
    }
    setIsEditing(!isEditing)
    console.log('Edit mode toggled to:', !isEditing)
  }

  // Handle final submission
  const handleSubmit = async () => {
    if (window.confirm('Are you sure you want to submit your final rankings? This cannot be changed after submission.')) {
      await draft.submitRankings()
      setIsEditing(false)
    }
  }

  // Get DnD backend based on device - temporarily force HTML5Backend for testing
  const backend = HTML5Backend
  
  console.log('DnD Backend selected: HTML5Backend (forced for testing)')
  console.log('Edit mode:', isEditing)
  console.log('Ranked contestants:', rankedContestants.length)

  if (draft.isLoading) {
    return (
      <div className="draft-loading">
        <div className="spinner"></div>
        <h2>Loading Draft...</h2>
        <p>Fetching contestants and your rankings...</p>
      </div>
    )
  }

  if (draft.error) {
    return (
      <div className="draft-error">
        <h2>Unable to Load Draft</h2>
        <div className="error-message">
          <p><strong>Error:</strong> {draft.error}</p>
          <div className="error-help">
            <h3>What you can do:</h3>
            <ul>
              <li>Check if there's an active season set up</li>
              <li>Verify that contestants have been added to the season</li>
              <li>Contact an administrator if the problem persists</li>
            </ul>
          </div>
        </div>
        <button onClick={draft.clearError} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  if (!draft.season) {
    return (
      <div className="draft-no-season">
        <h2>No Active Season</h2>
        <div className="no-season-message">
          <p>There is currently no active season available for drafting.</p>
          <div className="help-info">
            <h3>What this means:</h3>
            <ul>
              <li>No season has been marked as active (is_active = true)</li>
              <li>The draft system requires an active season to function</li>
              <li>An administrator needs to set up a season and mark it as active</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  console.log('Draft debug info:', {
    isDeadlinePassed: draft.isDeadlinePassed,
    isSubmitted: draft.isSubmitted,
    season: draft.season,
    contestantsCount: rankedContestants.length,
    deadlineDate: draft.season?.episode_2_deadline,
    currentDate: new Date().toISOString(),
    timeUntilDeadline,
    contestantsWithTribes: rankedContestants.map(c => ({
      name: c.name,
      tribe: c.tribe,
      tribeName: c.tribe?.name,
      tribeColor: c.tribe?.color
    }))
  })

  return (
    <div className="draft-container">
      {/* Header */}
      <div className="draft-success-header">
        <h1>{isEditing ? 'Edit Your Draft Rankings' : 'Draft Submitted!'}</h1>
        <p className="success-subtitle">
          {isEditing 
            ? 'Drag and drop contestants to reorder your rankings. Changes are auto-saved.'
            : 'Your draft rankings have been submitted successfully.'
          }
        </p>
        
        {/* Edit Button */}
        {!draft.isDeadlinePassed && (
          <div className="edit-controls">
            <button 
              onClick={handleEditToggle}
              className={`edit-button ${isEditing ? 'cancel' : 'edit'}`}
            >
              {isEditing ? '✕ Cancel Edit' : '✏️ Edit Rankings'}
            </button>
          </div>
        )}
      </div>

      {/* Draft Picks Section */}
      <div className="draft-picks-section">
        <div className="section-card">
          <h2 className="section-title">Your Draft Picks</h2>
          <div className="picks-list">
            {rankedContestants.slice(0, 2).map((contestant, index) => (
              <div key={contestant.id} className="pick-item">
                <div className="pick-number">{index + 1}</div>
                <div className="pick-content">
                  <div className="pick-name">{contestant.name}</div>
                  <div className="pick-rank">Rank #{index + 1} in your rankings</div>
                </div>
                <div 
                  className="tribe-tag" 
                  style={{ 
                    backgroundColor: contestant.tribe?.color || '#6c757d',
                    color: 'white'
                  }}
                >
                  {contestant.tribe?.name || 'Unknown'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Rankings Section */}
      <div className="complete-rankings-section">
        <div className="section-card">
          <h2 className="section-title">Your Complete Draft Rankings</h2>
          <p className="section-subtitle">
            {isEditing 
              ? 'Drag and drop to reorder contestants. Your top 2 will be your draft picks.'
              : 'All contestants ranked in your preferred order'
            }
          </p>
          
          {/* Action Bar for Edit Mode */}
          {isEditing && (
            <div className="edit-action-bar">
              <div className="action-status">
                {draft.isSaving && (
                  <div className="saving-indicator">
                    <div className="spinner small"></div>
                    <span>Saving...</span>
                  </div>
                )}
                
                {hasUnsavedChanges && !draft.isSaving && (
                  <div className="unsaved-indicator">
                    <span>⚠️ Unsaved changes</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={handleSubmit}
                className="submit-button"
                disabled={draft.isSaving || rankedContestants.length === 0}
              >
                <span className="button-icon">🚀</span>
                Submit Final Rankings
              </button>
            </div>
          )}
          
          {/* Rankings List */}
          {isEditing ? (
            <DndProvider backend={backend}>
              <div className="edit-rankings-list">
                {rankedContestants.map((contestant, index) => (
                  <div key={contestant.id} className="edit-ranking-item">
                    <div className="edit-rank-number">{index + 1}</div>
                    <ContestantCard
                      contestant={contestant}
                      index={index}
                      onMove={handleMoveCard}
                      isDeadlinePassed={false}
                      isSubmitted={false}
                      hideRankPosition={true}
                    />
                  </div>
                ))}
              </div>
            </DndProvider>
          ) : (
            <div className="rankings-list">
              {rankedContestants.map((contestant, index) => (
                <div 
                  key={contestant.id} 
                  className={`ranking-item ${index < 2 ? 'current-pick' : ''}`}
                >
                  <div className={`ranking-number ${index < 2 ? 'current' : 'other'}`}>
                    {index + 1}
                  </div>
                  <div className="contestant-image">
                    {contestant.image_url ? (
                      <img src={contestant.image_url} alt={contestant.name} />
                    ) : (
                      <div className="placeholder-image">
                        {contestant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="contestant-name">{contestant.name}</div>
                  <div 
                    className="tribe-tag" 
                    style={{ 
                      backgroundColor: contestant.tribe?.color || '#6c757d',
                      color: 'white'
                    }}
                  >
                    {contestant.tribe?.name || 'Unknown'}
                  </div>
                  {index < 2 && (
                    <div className="current-pick-tag">Current Pick</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
