import React from 'react';
import { BarChart3, Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Leaderboard = () => {
  const players = [
    { rank: 1, name: 'Alex Thompson', points: 142, change: '+12', changeType: 'up', isCurrentUser: false },
    { rank: 2, name: 'Sarah Chen', points: 138, change: '+8', changeType: 'up', isCurrentUser: false },
    { rank: 3, name: 'Mike Rodriguez', points: 135, change: '+15', changeType: 'up', isCurrentUser: true },
    { rank: 4, name: 'Emma Johnson', points: 128, change: '+5', changeType: 'up', isCurrentUser: false },
    { rank: 5, name: 'David Kim', points: 125, change: '-2', changeType: 'down', isCurrentUser: false },
    { rank: 6, name: 'Lisa Parker', points: 122, change: '+3', changeType: 'up', isCurrentUser: false },
    { rank: 7, name: 'John Smith', points: 118, change: '0', changeType: 'same', isCurrentUser: false },
    { rank: 8, name: 'Maria Garcia', points: 115, change: '+7', changeType: 'up', isCurrentUser: false },
  ];

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">League Leaderboard</h1>
          <p className="text-gray-600">Current standings after Episode 5</p>
        </div>

        {/* Leaderboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-8 w-8 text-survivor-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">League Leader</p>
                <p className="text-xl font-semibold text-gray-900">Alex Thompson</p>
                <p className="text-sm text-gray-600">142 points</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-survivor-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Your Rank</p>
                <p className="text-xl font-semibold text-gray-900">#3</p>
                <p className="text-sm text-gray-600">135 points</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-survivor-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Points Behind Leader</p>
                <p className="text-xl font-semibold text-gray-900">7</p>
                <p className="text-sm text-gray-600">This week: +15</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Players</p>
                <p className="text-xl font-semibold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Active league</p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Current Standings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Player
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    This Week
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {players.map((player) => (
                  <tr 
                    key={player.rank} 
                    className={`hover:bg-gray-50 ${player.isCurrentUser ? 'bg-orange-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {player.rank <= 3 ? (
                          <Trophy className={`h-5 w-5 ${
                            player.rank === 1 ? 'text-yellow-500' : 
                            player.rank === 2 ? 'text-gray-400' : 
                            'text-orange-600'
                          }`} />
                        ) : (
                          <span className="text-sm font-medium text-gray-900">{player.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {(player.name || 'Unknown').split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {player.name}
                            {player.isCurrentUser && (
                              <span className="ml-2 text-xs bg-survivor-orange text-white px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{player.points}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{player.change}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center text-sm ${getChangeColor(player.changeType)}`}>
                        {getChangeIcon(player.changeType)}
                        <span className="ml-1">
                          {player.changeType === 'up' ? 'Gained' : 
                           player.changeType === 'down' ? 'Lost' : 'No change'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">How Rankings Work</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Rankings are updated after each episode's scoring is published</p>
            <p>• Points are earned through immunity wins, idol finds, eliminations, and other events</p>
            <p>• Your sole survivor pick earns bonus points for each episode they remain</p>
            <p>• Click on any player to view their detailed team and performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
