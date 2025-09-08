import React from 'react';
import { Trophy, Users, Target, BarChart3, Crown, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDraft } from '../../contexts/DraftContext';
import { useSoleSurvivor } from '../../contexts/SoleSurvivorContext';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { draftPicks, isDraftSubmitted } = useDraft();
  const { soleSurvivorPick, isSoleSurvivorSubmitted } = useSoleSurvivor();
  const { user } = useAuth();

  // Mock leaderboard data - in a real app this would come from an API
  const mockLeaderboard = [
    {
      id: 1,
      username: 'SurvivorFan2024',
      firstName: 'Sarah',
      lastName: 'Chen',
      totalPoints: 87,
      weeklyPoints: 12,
      rank: 1,
      previousRank: 2,
      draftPicks: ['Sophie Segreti', 'Jawan Pitts'],
      soleSurvivor: 'Sophie Segreti',
      isCurrentUser: false
    },
    {
      id: 2,
      username: user?.username || 'player',
      firstName: user?.firstName || 'You',
      lastName: user?.lastName || '',
      totalPoints: 73,
      weeklyPoints: 8,
      rank: 2,
      previousRank: 1,
      draftPicks: isDraftSubmitted ? draftPicks.map(p => p.name) : ['Not Set'],
      soleSurvivor: isSoleSurvivorSubmitted ? soleSurvivorPick?.name : 'Not Set',
      isCurrentUser: true
    },
    {
      id: 3,
      username: 'OutwitOutplay',
      firstName: 'Mike',
      lastName: 'Rodriguez',
      totalPoints: 69,
      weeklyPoints: 15,
      rank: 3,
      previousRank: 4,
      draftPicks: ['Alex Moore', 'Kristina Mills'],
      soleSurvivor: 'Alex Moore',
      isCurrentUser: false
    },
    {
      id: 4,
      username: 'TorchSnuffer',
      firstName: 'Emma',
      lastName: 'Johnson',
      totalPoints: 64,
      weeklyPoints: 6,
      rank: 4,
      previousRank: 3,
      draftPicks: ['Savannah Louie', 'Nicole Mazullo'],
      soleSurvivor: 'Savannah Louie',
      isCurrentUser: false
    },
    {
      id: 5,
      username: 'TribalCouncil',
      firstName: 'David',
      lastName: 'Kim',
      totalPoints: 58,
      weeklyPoints: 9,
      rank: 5,
      previousRank: 5,
      draftPicks: ['Jake Latimer', 'Shannon Fairweather'],
      soleSurvivor: 'Jake Latimer',
      isCurrentUser: false
    }
  ];

  const currentUser = mockLeaderboard.find(player => player.isCurrentUser);

  const getRankChange = (currentRank, previousRank) => {
    if (currentRank < previousRank) return 'up';
    if (currentRank > previousRank) return 'down';
    return 'same';
  };

  const getRankIcon = (change) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Season 49 Dashboard
          </h2>
          <p className="text-gray-600">
            Welcome to Survivor Season 49! Complete your draft and sole survivor pick to get started.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="h-8 w-8 text-survivor-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Rank</p>
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-semibold text-gray-900">#{currentUser?.rank || 'TBD'}</p>
                  {currentUser && getRankIcon(getRankChange(currentUser.rank, currentUser.previousRank))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-survivor-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Points</p>
                <p className="text-2xl font-semibold text-gray-900">{currentUser?.totalPoints || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-survivor-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Draft Picks</p>
                <p className="text-2xl font-semibold text-gray-900">{isDraftSubmitted ? draftPicks.length : 'Not Set'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Crown className="h-8 w-8 text-survivor-red" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sole Survivor</p>
                <p className="text-lg font-semibold text-gray-900">
                  {isSoleSurvivorSubmitted ? soleSurvivorPick?.name : 'Not Set'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Leaderboard */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">League Leaderboard</h3>
                <Link 
                  to="/leaderboard"
                  className="text-sm text-survivor-orange hover:text-orange-600 font-medium"
                >
                  View Full Leaderboard
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {mockLeaderboard.slice(0, 5).map((player, index) => (
                  <div 
                    key={player.id} 
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      player.isCurrentUser 
                        ? 'bg-survivor-orange bg-opacity-10 border-2 border-survivor-orange border-opacity-30' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-600' : 'bg-blue-500'
                      }`}>
                        {index === 0 ? (
                          <Trophy className="h-5 w-5" />
                        ) : (
                          <span>{player.rank}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className={`font-medium ${player.isCurrentUser ? 'text-survivor-orange' : 'text-gray-900'}`}>
                            {player.firstName} {player.lastName}
                          </p>
                          {player.isCurrentUser && (
                            <span className="text-xs bg-survivor-orange text-white px-2 py-1 rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">@{player.username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <p className="text-lg font-semibold text-gray-900">{player.totalPoints}</p>
                        {getRankIcon(getRankChange(player.rank, player.previousRank))}
                      </div>
                      <p className="text-sm text-gray-500">+{player.weeklyPoints} this week</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span>Your Position: </span>
                    <span className="font-semibold text-gray-900">#{currentUser?.rank || 'TBD'}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span>Points Behind Leader: </span>
                    <span className="font-semibold text-gray-900">
                      {currentUser ? (mockLeaderboard[0].totalPoints - currentUser.totalPoints) : 'TBD'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* My Team */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">My Team</h3>
                <Link 
                  to="/my-team"
                  className="text-sm text-survivor-orange hover:text-orange-600 font-medium"
                >
                  View Full Team
                </Link>
              </div>
            </div>
            <div className="p-6">
              {/* Sole Survivor Section */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Crown className="h-4 w-4 mr-2 text-survivor-orange" />
                  Sole Survivor Pick
                </h4>
                {isSoleSurvivorSubmitted && soleSurvivorPick ? (
                  <Link 
                    to="/contestants?mode=sole-survivor"
                    className="block hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 transition-colors rounded-lg"
                  >
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center space-x-3">
                        <img
                          src={`/contestant-images/${soleSurvivorPick.image}`}
                          alt={soleSurvivorPick.name}
                          className="w-12 h-12 object-cover object-top rounded-full"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/48x48/cccccc/666666?text=${soleSurvivorPick.name.split(' ').map(n => n[0]).join('')}`;
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{soleSurvivorPick.name}</p>
                          <p className="text-sm text-gray-600">{soleSurvivorPick.occupation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-survivor-orange">15 pts</p>
                        <p className="text-xs text-gray-500">Episodes held: 1</p>
                        <p className="text-xs text-survivor-orange font-medium mt-1">Click to change →</p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Crown className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No sole survivor selected</p>
                      <Link 
                        to="/contestants?mode=sole-survivor"
                        className="text-sm text-survivor-orange hover:text-orange-600 font-medium"
                      >
                        Select your winner →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Draft Picks Section */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-survivor-blue" />
                  Draft Picks
                </h4>
                {isDraftSubmitted && draftPicks.length > 0 ? (
                  <div className="space-y-3">
                    {draftPicks.map((pick, index) => (
                      <div key={pick.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-survivor-blue rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                          <img
                            src={`/contestant-images/${pick.image}`}
                            alt={pick.name}
                            className="w-10 h-10 object-cover object-top rounded-full"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/40x40/cccccc/666666?text=${pick.name.split(' ').map(n => n[0]).join('')}`;
                            }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{pick.name}</p>
                            <p className="text-sm text-gray-600">{pick.occupation}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {index === 0 ? '42 pts' : '38 pts'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {pick.eliminated ? 'Eliminated' : 'Active'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No draft picks yet</p>
                      <Link 
                        to="/draft"
                        className="text-sm text-survivor-orange hover:text-orange-600 font-medium"
                      >
                        Complete your draft →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Team Score Summary */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-survivor-orange" />
                    <span className="text-sm font-medium text-gray-700">Total Team Score</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {currentUser?.totalPoints || 0} pts
                    </p>
                    <p className="text-sm text-gray-500">
                      +{currentUser?.weeklyPoints || 0} this week
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Get Started</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link 
                to="/draft"
                className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block"
              >
                <h4 className="font-medium text-gray-900 mb-1">Complete Draft</h4>
                <p className="text-sm text-gray-500">Rank contestants and get your picks</p>
              </Link>
              
              <Link 
                to="/sole-survivor"
                className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block"
              >
                <h4 className="font-medium text-gray-900 mb-1">Pick Sole Survivor</h4>
                <p className="text-sm text-gray-500">Choose your winner prediction</p>
              </Link>
              
              <Link 
                to="/contestants"
                className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block"
              >
                <h4 className="font-medium text-gray-900 mb-1">View Contestants</h4>
                <p className="text-sm text-gray-500">Browse all season contestants</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
