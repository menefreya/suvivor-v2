import React from 'react';
import { Calendar, MapPin, Briefcase, Crown } from 'lucide-react';
import { generatePlaceholderImage, getInitials } from '../../utils/imageUtils';

const ContestantCard = ({ 
  contestant, 
  showDetails = true, 
  showPoints = true, 
  showStatus = true, 
  onClick, 
  isSelected = false,
  isSelectable = false,
  isDisabled = false,
  size = 'normal',
  className = '',
  badgeContent = null,
  showTribe = true
}) => {
  const getTribeColor = (tribe) => {
    // If tribe is an object with color property (from database)
    if (tribe && typeof tribe === 'object' && tribe.color) {
      const colorMap = {
        'red': 'bg-red-500',
        'blue': 'bg-blue-500',
        'green': 'bg-green-500',
        'yellow': 'bg-yellow-500',
        'purple': 'bg-purple-500',
        'orange': 'bg-orange-500',
        'pink': 'bg-pink-500',
        'indigo': 'bg-indigo-500',
        'gray': 'bg-gray-500'
      };
      return colorMap[tribe.color.toLowerCase()] || `bg-${tribe.color}-500`;
    }
    
    // If tribe is a string (legacy support)
    if (typeof tribe === 'string') {
      const colors = {
        'Ratu': 'bg-red-500',
        'Tika': 'bg-blue-500',
        'Soka': 'bg-green-500',
        'Hina': 'bg-blue-500',
        'Kele': 'bg-red-500',
        'Uli': 'bg-green-500'
      };
      return colors[tribe] || 'bg-gray-500';
    }
    
    return 'bg-gray-500';
  };

  const getPointsColor = (points) => {
    if (points > 30) return 'text-green-600';
    if (points > 15) return 'text-blue-600';
    if (points > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const sizeClasses = {
    small: {
      container: 'w-full',
      image: 'h-32',
      text: {
        name: 'text-sm',
        details: 'text-xs'
      },
      padding: 'p-3'
    },
    normal: {
      container: 'w-full',
      image: 'h-64',
      text: {
        name: 'text-lg',
        details: 'text-sm'
      },
      padding: 'p-4'
    },
    large: {
      container: 'w-full',
      image: 'h-80',
      text: {
        name: 'text-xl',
        details: 'text-base'
      },
      padding: 'p-6'
    }
  };

  const currentSize = sizeClasses[size];
  const handleClick = () => {
    if (onClick && !isDisabled) {
      onClick(contestant);
    }
  };

  const containerClasses = `
    bg-white rounded-lg shadow transition-all duration-200 relative
    ${contestant.is_eliminated ? 'opacity-75' : ''}
    ${isSelectable && !isDisabled ? 'hover:shadow-lg cursor-pointer hover:scale-105' : ''}
    ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
    ${isSelected ? 'ring-4 ring-survivor-orange ring-opacity-50 shadow-lg' : 'hover:shadow-lg'}
    ${className}
  `.trim();

  return (
    <div className={containerClasses} onClick={handleClick}>
      {/* Contestant Image */}
      <div className="relative">
        <img
          src={contestant.image_url || `/contestant-images/${contestant.image_filename || contestant.image}`}
          alt={contestant.name}
          className={`w-full ${currentSize.image} object-cover object-top rounded-t-lg`}
          style={{ objectPosition: 'center top' }}
          onError={(e) => {
            const name = contestant.name || 'Unknown';
            const initials = getInitials(name);
            e.target.src = generatePlaceholderImage(initials, 300);
          }}
        />
        
        {/* Tribe Badge */}
        {showTribe && contestant.tribes?.name && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-medium ${getTribeColor(contestant.tribes)}`}>
            {contestant.tribes.name}
          </div>
        )}
        
        {/* Status Badge */}
        {showStatus && (
          <>
            {isSelected && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-survivor-orange text-white text-xs font-medium rounded-full flex items-center space-x-1">
                <Crown className="h-3 w-3" />
                <span>Selected</span>
              </div>
            )}
            {contestant.is_eliminated && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                Eliminated
              </div>
            )}
          </>
        )}
        
        {/* Custom Badge Content */}
        {badgeContent && (
          <div className="absolute top-3 right-3">
            {badgeContent}
          </div>
        )}
        
        {/* Selection Indicator */}
        {isSelectable && !isDisabled && (
          <div className="absolute inset-0 bg-survivor-orange bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-t-lg flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
              <Crown className="h-6 w-6 text-survivor-orange" />
            </div>
          </div>
        )}
      </div>

      {/* Contestant Info */}
      <div className={currentSize.padding}>
        <h3 className={`${currentSize.text.name} font-semibold text-gray-900 mb-2`}>
          {contestant.name}
        </h3>
        
        {showDetails && (
          <div className={`space-y-2 ${currentSize.text.details} text-gray-600`}>
            {contestant.age && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Age {contestant.age}</span>
              </div>
            )}
            
            {contestant.hometown && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{contestant.hometown}</span>
              </div>
            )}
            
            {contestant.occupation && (
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>{contestant.occupation}</span>
              </div>
            )}
          </div>
        )}

        {/* Points */}
        {showPoints && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className={`${currentSize.text.details} text-gray-500`}>Points:</span>
              <span className={`font-semibold ${getPointsColor(contestant.points || 0)}`}>
                {(contestant.points || 0) > 0 ? '+' : ''}{contestant.points || 0}
              </span>
            </div>
            {contestant.episodes !== undefined && (
              <div className="flex justify-between items-center mt-1">
                <span className={`${currentSize.text.details} text-gray-500`}>Episodes:</span>
                <span className={`${currentSize.text.details} font-medium text-gray-700`}>{contestant.episodes || 0}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestantCard;