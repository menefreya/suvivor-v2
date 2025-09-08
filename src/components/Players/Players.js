import React from 'react';
import { User, Trophy, Target, Eye } from 'lucide-react';

const Players = () => {
  const players = [
    {
      id: 1,
      name: 'Alex Thompson',
      rank: 1,
      points: 142,
      soleSurvivor: 'Alex Moore',
      draftPicks: ['Sophie Segreti', 'Jawan Pitts'],
      eliminated: 0
    },
    {
      id: 2,
      name: 'Sarah Chen',
      rank: 2,
      points: 138,
      soleSurvivor: 'Sophie Segreti',
      draftPicks: ['Alex Moore', 'Jeremiah Ing'],
      eliminated: 0
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      rank: 3,
      points: 135,
      soleSurvivor: 'Alex Moore',
      draftPicks: ['Sophie Segreti', 'Jawan Pitts'],
      eliminated: 0,
      isCurrentUser: true
    },
    {
      id: 4,
      name: 'Emma Johnson',
      rank: 4,
      points: 128,
      soleSurvivor: 'Jawan Pitts',
      draftPicks: ['Alex Moore', 'Sophie Segreti'],
      eliminated: 1
    },
    {
      id: 5,
      name: 'David Kim',
      rank: 5,
      points: 125,
      soleSurvivor: 'Jeremiah Ing',
      draftPicks: ['Nicole Mazullo', 'Savannah Louie'],
      eliminated: 0
    },
    {
      id: 6,
      name: 'Lisa Parker',
      rank: 6,
      points: 122,
      soleSurvivor: 'Sophie Segreti',
      draftPicks: ['Alex Moore', 'Jawan Pitts'],
      eliminated: 0
    },
    {
      id: 7,
      name: 'John Smith',
      rank: 7,
      points: 118,
      soleSurvivor: 'Nicole Mazullo',
      draftPicks: ['Sophie Segreti', 'Jeremiah Ing'],
      eliminated: 1
    },
    {
      id: 8,
      name: 'Maria Garcia',
      rank: 8,
      points: 115,
      soleSurvivor: 'Savannah Louie',
      draftPicks: ['Alex Moore', 'Nicole Mazullo'],
      eliminated: 0
    }
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
          {players.map((player) => (
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
                        {player.name.split(' ').map(n => n[0]).join('')}
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
          ))}
        </div>

        {/* League Stats */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">League Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Total Players</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">142</p>
              <p className="text-sm text-gray-600">Highest Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">115</p>
              <p className="text-sm text-gray-600">Lowest Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">128.5</p>
              <p className="text-sm text-gray-600">Average Score</p>
            </div>
          </div>
        </div>

        {/* Strategy Insights */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Strategy Insights</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Most popular Sole Survivor pick: Alex Moore (3 players)</p>
            <p>• Most popular draft picks: Sophie Segreti, Alex Moore, Jawan Pitts</p>
            <p>• Players with eliminated contestants: Emma Johnson, John Smith</p>
            <p>• Click on any player to see their detailed team composition and scoring history</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Players;
