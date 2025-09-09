import React, { useState, useEffect } from 'react';
import { Award, Crown, Users, TrendingUp } from 'lucide-react';
import { useDraft } from '../../contexts/DraftContext';
import { useSoleSurvivor } from '../../contexts/SoleSurvivorContext';
import { supabase } from '../../lib/supabase';
import { generatePlaceholderImage, getInitials } from '../../utils/imageUtils';

const MyTeam = () => {
  const { draftPicks, draftRankings, isDraftSubmitted, getAllReplacementPicks } = useDraft();
  const { soleSurvivorPick } = useSoleSurvivor();
  const [tribes, setTribes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tribes from Supabase
  useEffect(() => {
    const fetchTribes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tribes')
          .select('*')
          .eq('season_id', 1)
          .order('name');
        
        if (error) throw error;
        setTribes(data || []);
      } catch (error) {
        console.error('Error fetching tribes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTribes();
  }, []);

  // Debug logging
  console.log('MyTeam Debug:', {
    isDraftSubmitted,
    draftPicks,
    draftRankings: draftRankings?.length,
    soleSurvivorPick
  });

  const getTribeColor = (tribeName) => {
    const tribe = tribes.find(t => t.name === tribeName);
    if (tribe && tribe.color) {
      // Map common color names to Tailwind classes
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
    
    // Fallback to hardcoded colors if tribes not loaded yet
    const fallbackColors = {
      'Ratu': 'bg-red-500',
      'Tika': 'bg-blue-500',
      'Soka': 'bg-green-500'
    };
    return fallbackColors[tribeName] || 'bg-gray-500';
  };

  const getOriginalRank = (contestantId) => {
    const ranking = draftRankings.find(r => r.id === contestantId);
    return ranking ? ranking.rank : null;
  };

  const allReplacementPicks = getAllReplacementPicks();

  if (draftPicks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Team Yet</h1>
            <p className="text-lg text-gray-600 mb-8">
              Complete your draft rankings to see your team
            </p>
            
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto">
              <p className="text-gray-600 mb-6">
                You need to submit your draft rankings before you can view your team. 
                Go to the Draft page to rank all contestants and submit your picks.
              </p>
              
              <a 
                href="/draft"
                className="inline-flex items-center px-4 py-2 bg-survivor-orange text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Go to Draft
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Team</h1>
          <p className="text-gray-600">Track your contestants and manage your picks</p>
        </div>

        {/* Team Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Crown className="h-8 w-8 text-survivor-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sole Survivor Pick</p>
                <p className="text-xl font-semibold text-gray-900">
                  {soleSurvivorPick ? (soleSurvivorPick.name || soleSurvivorPick.contestants?.name) : 'None'}
                </p>
                <p className="text-sm text-gray-600">
                  {soleSurvivorPick ? 'Selected' : 'No pick yet'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-survivor-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Draft Picks</p>
                <p className="text-xl font-semibold text-gray-900">{draftPicks.length}</p>
                <p className="text-sm text-gray-600">
                  {draftPicks.map(pick => pick.name || pick.contestants?.name).join(', ')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-survivor-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Points</p>
                <p className="text-xl font-semibold text-gray-900">
                  {draftPicks.reduce((total, pick) => total + (pick.points || 0), 0)}
                </p>
                <p className="text-sm text-gray-600">From your team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Team */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Current Team</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {soleSurvivorPick && (
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border-l-4 border-survivor-orange">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-survivor-orange rounded-full flex items-center justify-center">
                        <Crown className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{soleSurvivorPick.name || soleSurvivorPick.contestants?.name}</p>
                        <p className="text-sm text-gray-500">Sole Survivor Pick</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{soleSurvivorPick.points || 0} pts</p>
                      <p className="text-xs text-gray-500">Episodes: {soleSurvivorPick.episodes || 0}</p>
                    </div>
                  </div>
                )}

                {draftPicks.map((pick, index) => {
                  const originalRank = getOriginalRank(pick.id);
                  return (
                    <div key={pick.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={(pick.image_url || pick.contestants?.image_url) || `/contestant-images/${pick.image || pick.contestants?.image}`}
                          alt={pick.name || pick.contestants?.name}
                          className="w-10 h-10 object-cover object-top rounded-full"
                          onError={(e) => {
                            const name = pick.name || pick.contestants?.name || 'Unknown';
                            const initials = getInitials(name);
                            e.target.src = generatePlaceholderImage(initials, 40);
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{pick.name || pick.contestants?.name}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-500">Draft Pick #{pick.pickNumber}</p>
                            {originalRank && (
                              <>
                                <span className="text-gray-300">•</span>
                                <p className="text-sm text-survivor-orange font-medium">
                                  Ranked #{originalRank}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getTribeColor(pick.tribe || pick.contestants?.tribe)}`}>
                          {pick.tribe || pick.contestants?.tribe}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{pick.points} pts</p>
                          <p className="text-xs text-gray-500">Episodes: {pick.episodes}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Replacement Queue */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Replacement Queue</h3>
            </div>
            <div className="p-6">
              {allReplacementPicks.length > 0 ? (
                <div className="space-y-3">
                  {allReplacementPicks.map((pick, index) => (
                    <div key={pick.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      index === 0 ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <img
                          src={(pick.image_url || pick.contestants?.image_url) || `/contestant-images/${pick.image || pick.contestants?.image}`}
                          alt={pick.name || pick.contestants?.name}
                          className="w-8 h-8 object-cover object-top rounded-full"
                          onError={(e) => {
                            const name = pick.name || pick.contestants?.name || 'Unknown';
                            const initials = getInitials(name);
                            e.target.src = generatePlaceholderImage(initials, 32);
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{pick.name || pick.contestants?.name}</p>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-500">
                              {index === 0 ? 'Next replacement' : `Replacement #${index + 1}`}
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-survivor-orange font-medium">
                              Ranked #{getOriginalRank(pick.id)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getTribeColor(pick.tribe || pick.contestants?.tribe)}`}>
                        {pick.tribe || pick.contestants?.tribe}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No more replacements available</p>
                  <p className="text-sm text-gray-400 mt-2">All your ranked contestants have been assigned</p>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> When your contestants are eliminated, you'll automatically 
                  receive your next highest-ranked available contestant from your draft rankings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTeam;
