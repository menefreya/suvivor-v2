import React, { useState, useEffect } from 'react';
import { Calendar, Play, Clock, Award, Users, Shield, Eye, Plus, Minus, Crown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const Episodes = () => {
  const [selectedEpisode, setSelectedEpisode] = useState(5);
  const [viewMode, setViewMode] = useState('scoring'); // 'overview' or 'scoring'
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contestants from Supabase
  useEffect(() => {
    const fetchContestants = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contestants')
          .select('*')
          .eq('season_id', 1)
          .order('name');
        
        if (error) throw error;
        setContestants(data || []);
      } catch (error) {
        console.error('Error fetching contestants:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContestants();
  }, []);

  // Mock scoring data - in real app this would come from API
  const mockScoring = {
    5: {
      '1-immunityIndividual': true, // Alex Moore (+3)
      '17-rewardIndividual': true, // Sophie Segreti (+2)
      '6-findIdol': true, // Jawan Pitts (+3)
      '10-eliminated': true, // Matt Williams (-5)
      '1-soleSurvivorWeekly': true, // Alex Moore (+1)
      '17-makeFood': true, // Sophie Segreti (+1)
    },
    4: {
      '5-immunityIndividual': true, // Jeremiah Ing (+3)
      '1-rewardIndividual': true, // Alex Moore (+2)
      '1-soleSurvivorWeekly': true, // Alex Moore (+1)
      '5-readTreeMail': true, // Jeremiah Ing (+1)
      'ratu-immunityTeam': true, // Ratu tribe (+2 each)
    }
  };

  const individualScoring = [
    { key: 'immunityIndividual', label: 'Individual Immunity', points: 3, icon: Shield },
    { key: 'rewardIndividual', label: 'Individual Reward', points: 2, icon: Award },
    { key: 'findIdol', label: 'Found Idol', points: 3, icon: Eye },
    { key: 'playIdol', label: 'Played Idol Successfully', points: 2, icon: Eye },
    { key: 'makeFire', label: 'Made Fire', points: 1, icon: Plus },
    { key: 'makeFood', label: 'Made Food', points: 1, icon: Plus },
    { key: 'readTreeMail', label: 'Read Tree Mail', points: 1, icon: Plus },
    { key: 'shotInDark', label: 'Shot in Dark', points: 1, icon: Plus },
    { key: 'shotImmunity', label: 'Shot Immunity', points: 4, icon: Plus },
    { key: 'soleSurvivorWeekly', label: 'Sole Survivor (Weekly)', points: 1, icon: Crown },
    { key: 'soleSurvivorBonus', label: 'Sole Survivor Bonus', points: 25, icon: Award },
    { key: 'final3', label: 'Made Final 3', points: 10, icon: Users },
    { key: 'eliminated', label: 'Eliminated', points: -5, icon: Minus },
    { key: 'votedWithIdol', label: 'Voted w/ Idol', points: -3, icon: Minus }
  ];

  const teamScoring = [
    { key: 'immunityTeam', label: 'Team Immunity', points: 2, icon: Shield },
    { key: 'rewardTeam', label: 'Team Reward', points: 1, icon: Award }
  ];

  const getTribeColor = (tribe) => {
    const colors = {
      'Ratu': 'bg-red-500',
      'Tika': 'bg-blue-500',
      'Soka': 'bg-green-500'
    };
    return colors[tribe] || 'bg-gray-500';
  };

  const isScored = (contestantId, scoreType) => {
    const episodeScoring = mockScoring[selectedEpisode] || {};
    
    // For team scoring, check if the contestant's tribe won
    if (scoreType.includes('Team')) {
      const contestant = contestants.find(c => c.id === contestantId);
      if (contestant) {
        return episodeScoring[`${contestant.tribe.toLowerCase()}-${scoreType}`] || false;
      }
    }
    
    // For individual scoring, check contestant-specific scoring
    return episodeScoring[`${contestantId}-${scoreType}`] || false;
  };

  const calculateEpisodeTotal = (contestantId) => {
    const individualTotal = individualScoring.reduce((total, type) => {
      const scored = isScored(contestantId, type.key);
      return total + (scored ? type.points : 0);
    }, 0);
    
    const teamTotal = teamScoring.reduce((total, type) => {
      const scored = isScored(contestantId, type.key);
      return total + (scored ? type.points : 0);
    }, 0);
    
    return individualTotal + teamTotal;
  };

  const episodes = [
    {
      number: 5,
      title: "The Ultimate Betrayal",
      aired: "2024-01-24",
      status: "scored",
      points: 15,
      events: ["Sophie won Individual Immunity", "Jawan found Hidden Idol", "Matt eliminated"]
    },
    {
      number: 4,
      title: "Trust No One",
      aired: "2024-01-17",
      status: "scored",
      points: 12,
      events: ["Team Immunity: Ratu", "Alex won Reward", "No elimination"]
    },
    {
      number: 3,
      title: "The First Betrayal",
      aired: "2024-01-10",
      status: "scored",
      points: 8,
      events: ["Team Immunity: Tika", "Jeremiah found Idol", "First tribal council"]
    },
    {
      number: 2,
      title: "Surviving the Elements",
      aired: "2024-01-03",
      status: "scored",
      points: 5,
      events: ["Team Immunity: Soka", "First reward challenge", "Draft deadline"]
    },
    {
      number: 1,
      title: "The Adventure Begins",
      aired: "2023-12-27",
      status: "scored",
      points: 0,
      events: ["Season premiere", "Tribe assignments", "First challenges"]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scored':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'locked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scored':
        return <Award className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'locked':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-survivor-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading episodes...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading episodes</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-survivor-orange text-white px-4 py-2 rounded-md hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Episode Results</h1>
              <p className="text-gray-600">Track scoring events and your performance by episode</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'overview' 
                    ? 'bg-survivor-orange text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setViewMode('scoring')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'scoring' 
                    ? 'bg-survivor-orange text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Scoring Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Episode Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Play className="h-8 w-8 text-survivor-orange" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Episodes Scored</p>
                <p className="text-xl font-semibold text-gray-900">5</p>
                <p className="text-sm text-gray-600">Current season</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-survivor-blue" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Points</p>
                <p className="text-xl font-semibold text-gray-900">40</p>
                <p className="text-sm text-gray-600">This season</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-survivor-green" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Best Episode</p>
                <p className="text-xl font-semibold text-gray-900">Episode 5</p>
                <p className="text-sm text-gray-600">+15 points</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Next Episode</p>
                <p className="text-xl font-semibold text-gray-900">Jan 31</p>
                <p className="text-sm text-gray-600">Episode 6</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scoring Dashboard */}
        {viewMode === 'scoring' && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Episode Scoring Dashboard</h3>
                <select 
                  value={selectedEpisode} 
                  onChange={(e) => setSelectedEpisode(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-survivor-orange focus:border-transparent"
                >
                  {episodes.map(ep => (
                    <option key={ep.number} value={ep.number}>Episode {ep.number}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-gray-900">Contestant</th>
                      {teamScoring.map(type => (
                        <th key={type.key} className="text-center py-3 px-2 font-medium min-w-20 bg-blue-50">
                          <div className="flex flex-col items-center gap-1">
                            <type.icon size={16} className="text-blue-600" />
                            <span className="text-xs font-medium">{type.label}</span>
                            <span className="text-xs text-gray-500">({type.points > 0 ? '+' : ''}{type.points})</span>
                          </div>
                        </th>
                      ))}
                      {individualScoring.map(type => (
                        <th key={type.key} className="text-center py-3 px-2 font-medium min-w-20">
                          <div className="flex flex-col items-center gap-1">
                            <type.icon size={16} className="text-gray-600" />
                            <span className="text-xs font-medium">{type.label}</span>
                            <span className="text-xs text-gray-500">({type.points > 0 ? '+' : ''}{type.points})</span>
                          </div>
                        </th>
                      ))}
                      <th className="text-center py-3 px-2 font-medium bg-yellow-200 text-yellow-900 sticky right-0 min-w-32">Episode Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contestants.map(contestant => {
                      const total = calculateEpisodeTotal(contestant.id);
                      return (
                        <tr key={contestant.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getTribeColor(contestant.tribe)}`}></div>
                              <img
                                src={contestant.image_url || `/contestant-images/${contestant.image}`}
                                alt={contestant.name}
                                className="w-8 h-8 object-cover object-top rounded-full"
                                onError={(e) => {
                                  const name = contestant.name || 'Unknown';
                                  e.target.src = `https://via.placeholder.com/32x32/cccccc/666666?text=${name.split(' ').map(n => n[0]).join('')}`;
                                }}
                              />
                              <div>
                                <span className="font-medium text-sm text-gray-900">{contestant.name}</span>
                                {contestant.is_eliminated && (
                                  <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Eliminated</span>
                                )}
                              </div>
                            </div>
                          </td>
                          {teamScoring.map(type => (
                            <td key={type.key} className="text-center py-3 px-2 bg-blue-50">
                              <div className="flex items-center justify-center">
                                {isScored(contestant.id, type.key) ? (
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">✓</span>
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                )}
                              </div>
                            </td>
                          ))}
                          {individualScoring.map(type => (
                            <td key={type.key} className="text-center py-3 px-2">
                              <div className="flex items-center justify-center">
                                {isScored(contestant.id, type.key) ? (
                                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">✓</span>
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                                )}
                              </div>
                            </td>
                          ))}
                          <td className="text-center py-3 px-2 font-bold bg-yellow-200 sticky right-0">
                            <span className={`px-3 py-2 rounded-full text-lg font-bold ${
                              total > 0 ? 'text-green-700 bg-green-100' : 
                              total < 0 ? 'text-red-700 bg-red-100' : 
                              'text-gray-700 bg-gray-100'
                            }`}>
                              {total > 0 ? '+' : ''}{total}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">How to Read the Dashboard</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• <span className="font-medium">Green checkmarks (✓)</span> indicate the contestant earned points for that category</p>
                  <p>• <span className="font-medium">Gray circles</span> indicate no points earned for that category</p>
                  <p>• <span className="font-medium">Episode Total (yellow column)</span> shows the calculated sum of all points for this episode</p>
                  <p>• <span className="font-medium">Team challenges</span> (blue columns) vs <span className="font-medium">Individual challenges</span> (white columns)</p>
                  <p>• The <span className="font-medium">Total column is sticky</span> and stays visible when scrolling horizontally</p>
                </div>
              </div>
              
              {/* Episode Summary */}
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-sm font-medium text-yellow-900 mb-2">Episode {selectedEpisode} Point Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {contestants.slice(0, 4).map(contestant => {
                    const total = calculateEpisodeTotal(contestant.id);
                    return (
                      <div key={contestant.id} className="text-center">
                        <p className="font-medium text-gray-900">{(contestant.name || 'Unknown').split(' ')[0]}</p>
                        <p className={`font-bold ${
                          total > 0 ? 'text-green-700' : 
                          total < 0 ? 'text-red-700' : 'text-gray-700'
                        }`}>
                          {total > 0 ? '+' : ''}{total} pts
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Episodes List */}
        {viewMode === 'overview' && (
          <div className="space-y-6">
          {episodes.map((episode) => (
            <div key={episode.number} className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-survivor-orange rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{episode.number}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Episode {episode.number}: {episode.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Aired: {new Date(episode.aired).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(episode.status)}`}>
                      {getStatusIcon(episode.status)}
                      <span className="capitalize">{episode.status}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">+{episode.points}</p>
                      <p className="text-sm text-gray-600">Your points</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Key Events</h4>
                <div className="space-y-2">
                  {episode.events.map((event, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-survivor-orange rounded-full"></div>
                      <span>{event}</span>
                    </div>
                  ))}
                </div>
                
                {episode.status === 'scored' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="text-survivor-orange hover:text-orange-600 text-sm font-medium">
                      View detailed scoring breakdown →
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          </div>
        )}

        {/* Upcoming Episodes */}
        {viewMode === 'overview' && (
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-2">Upcoming Episodes</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>• Episode 6: "The Merge Begins" - Airs January 31, 2024</p>
              <p>• Episode 7: "New Alliances" - Airs February 7, 2024</p>
              <p>• Episode 8: "Double Elimination" - Airs February 14, 2024</p>
              <p className="mt-3 font-medium">Scoring typically published within 24 hours of episode airing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Episodes;
