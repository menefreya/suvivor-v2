import React from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { RankedContestant, DragItem, DragCollectedProps, DropCollectedProps } from '../types/draft'

interface ContestantCardProps {
  contestant: RankedContestant
  index: number
  onMove: (dragIndex: number, hoverIndex: number) => void
  isDeadlinePassed: boolean
  isSubmitted: boolean
  hideRankPosition?: boolean
}

const CARD_TYPE = 'CONTESTANT_CARD'

export const ContestantCard: React.FC<ContestantCardProps> = ({
  contestant,
  index,
  onMove,
  isDeadlinePassed,
  isSubmitted,
  hideRankPosition = false
}) => {
  const isDragDisabled = isDeadlinePassed || isSubmitted
  
  console.log('ContestantCard rendered:', {
    name: contestant.name,
    index,
    isDragDisabled,
    isDeadlinePassed,
    isSubmitted
  })

  // Drag functionality
  const [{ isDragging }, drag] = useDrag<DragItem, void, DragCollectedProps>({
    type: CARD_TYPE,
    item: () => {
      console.log('Drag started for:', contestant.name, 'at index:', index)
      return {
        id: contestant.id,
        index,
        type: CARD_TYPE,
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isDragDisabled,
    isDragging: (monitor) => monitor.getItem()?.id === contestant.id,
  })

  // Drop functionality
  const [{ isOver, canDrop }, drop] = useDrop<DragItem, void, DropCollectedProps>({
    accept: CARD_TYPE,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (item: DragItem, monitor) => {
      console.log('Hover over:', contestant.name, 'canDrop:', canDrop, 'isDragDisabled:', isDragDisabled)
      
      if (!monitor.canDrop() || isDragDisabled) return
      
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) return

      console.log('Calling onMove with:', dragIndex, '->', hoverIndex)
      // Move the card
      onMove(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  // Combine drag and drop refs
  const ref = React.useCallback((node: HTMLDivElement | null) => {
    drag(drop(node))
  }, [drag, drop])

  const getCardStyles = () => {
    let baseStyles = 'contestant-card'
    
    if (isDragging) baseStyles += ' dragging'
    if (isOver && canDrop) baseStyles += ' drop-target'
    if (isDragDisabled) baseStyles += ' disabled'
    if (contestant.is_eliminated) baseStyles += ' eliminated'
    
    return baseStyles
  }

  const getPlaceholderImage = () => {
    // Generate a simple colored placeholder based on contestant name
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#FFB347']
    const colorIndex = contestant.name.length % colors.length
    return colors[colorIndex]
  }

  const handleClick = () => {
    console.log('ContestantCard clicked:', contestant.name, 'isDragDisabled:', isDragDisabled)
  }

  return (
    <div
      ref={ref}
      className={getCardStyles()}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragDisabled ? 'not-allowed' : 'grab',
        transform: isDragging ? 'rotate(5deg)' : 'none',
      }}
      onClick={handleClick}
    >
      {/* Rank Position */}
      {!hideRankPosition && (
        <div className="rank-position">
          {contestant.rank_position || index + 1}
        </div>
      )}

      {/* Contestant Image */}
      <div className="contestant-image">
        {contestant.image_url ? (
          <img
            src={contestant.image_url}
            alt={contestant.name}
            onError={(e) => {
              // Fallback to placeholder on image error
              e.currentTarget.style.display = 'none'
              if (e.currentTarget.nextSibling) {
                (e.currentTarget.nextSibling as HTMLElement).style.display = 'flex'
              }
            }}
          />
        ) : null}
        <div
          className="placeholder-image"
          style={{
            backgroundColor: getPlaceholderImage(),
            display: contestant.image_url ? 'none' : 'flex'
          }}
        >
          {contestant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
        </div>
      </div>

      {/* Contestant Info */}
      <div className="contestant-info">
        <h3 className="contestant-name">{contestant.name}</h3>
        
        <div className="contestant-details">
          {contestant.age && (
            <span className="detail-item">Age {contestant.age}</span>
          )}
          {contestant.occupation && (
            <span className="detail-item">{contestant.occupation}</span>
          )}
          {contestant.residence && (
            <span className="detail-item">{contestant.residence}</span>
          )}
        </div>

        {/* Tribe Info */}
        {contestant.tribe && (
          <div 
            className="tribe-indicator"
            style={{ backgroundColor: contestant.tribe.color || '#666' }}
          >
            {contestant.tribe.name}
          </div>
        )}

        {/* Status Indicators */}
        <div className="status-indicators">
          {contestant.is_eliminated && (
            <span className="status-badge eliminated">Eliminated</span>
          )}
          {contestant.points > 0 && (
            <span className="status-badge points">{contestant.points} pts</span>
          )}
        </div>
      </div>

      {/* Drag Handle */}
      {!isDragDisabled && (
        <div className="drag-handle">
          ⋮⋮
        </div>
      )}
    </div>
  )
}