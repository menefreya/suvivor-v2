import React from 'react';
import { User, Trophy, Target, Eye } from 'lucide-react';

const Players = () => {
  // In a real implementation, this would come from an API call to get all league participants
  const players = [
    // This would be populated with actual user data from the database
    // For now, showing empty state until real player data is implemented
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Players</h1>
          <p className="text-gray-600">View all league participants and their strategies</p>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.length > 0 ? players.map((player) => (
            <div 
              key={player.id} 
              className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 ${
                player.isCurrentUser ? 'ring-2 ring-survivor-orange' : ''
              }`}
            >
              <div className="p-6">
                {/* Player Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-700">
                        {(player.name || 'Unknown').split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {player.name}
                        {player.isCurrentUser && (
                          <span className="ml-2 text-xs bg-survivor-orange text-white px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">Rank #{player.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{player.points}</p>
                    <p className="text-sm text-gray-600">points</p>
                  </div>
                </div>

                {/* Team Details */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-survivor-orange" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Sole Survivor</p>
                      <p className="text-sm text-gray-600">{player.soleSurvivor}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-survivor-blue" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Draft Picks</p>
                      <div className="text-sm text-gray-600">
                        {player.draftPicks.map((pick, index) => (
                          <span key={index}>
                            {pick}
                            {index < player.draftPicks.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-survivor-green" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Eliminated</p>
                      <p className="text-sm text-gray-600">
                        {player.eliminated} contestant{player.eliminated !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="w-full flex items-center justify-center space-x-2 text-survivor-orange hover:text-orange-600 text-sm font-medium">
                    <Eye className="h-4 w-4" />
                    <span>View Detailed Team</span>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Players Yet</h3>
              <p className="text-gray-600">No league participants have been set up yet. Check back later!</p>
            </div>
          )}
        </div>

        {/* League Stats */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">League Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">TBD</p>
              <p className="text-sm text-gray-600">Total Players</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">TBD</p>
              <p className="text-sm text-gray-600">Highest Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">TBD</p>
              <p className="text-sm text-gray-600">Lowest Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">TBD</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </div>

        {/* Strategy Insights */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Strategy Insights</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Strategy insights will be available once players start completing their drafts</p>
            <p>• Popular picks and trends will be displayed here after league begins</p>
            <p>• Player performance statistics will be tracked throughout the season</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Players;
