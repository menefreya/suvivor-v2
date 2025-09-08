import React, { useState } from 'react';
import { Search, Filter, Users, Trophy, MapPin, Briefcase, Calendar, Crown, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { contestants, getContestantsByTribe, getActiveContestants, getEliminatedContestants } from '../../data/contestants';
import { useSoleSurvivor } from '../../contexts/SoleSurvivorContext';

const Contestants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTribe, setSelectedTribe] = useState('All');
  const [showEliminated, setShowEliminated] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { soleSurvivorPick, changeSoleSurvivor, isSoleSurvivorOpen } = useSoleSurvivor();
  
  // Check if we're in sole survivor selection mode
  const searchParams = new URLSearchParams(location.search);
  const isSoleSurvivorMode = searchParams.get('mode') === 'sole-survivor';
  
  // Handle sole survivor selection
  const handleSoleSurvivorSelect = (contestant) => {
    if (!isSoleSurvivorOpen || contestant.eliminated) return;
    
    changeSoleSurvivor(contestant.id);
    // Navigate back to dashboard after selection
    navigate('/dashboard');
  };

  const tribes = ['All', 'Ratu', 'Tika', 'Soka'];
  
  const filteredContestants = contestants.filter(contestant => {
    const matchesSearch = contestant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contestant.occupation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contestant.hometown.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTribe = selectedTribe === 'All' || contestant.tribe === selectedTribe;
    const matchesEliminated = showEliminated ? contestant.eliminated : !contestant.eliminated;
    
    return matchesSearch && matchesTribe && matchesEliminated;
  });

  const getTribeColor = (tribe) => {
    const colors = {
      'Ratu': 'bg-red-500',
      'Tika': 'bg-blue-500',
      'Soka': 'bg-green-500'
    };
    return colors[tribe] || 'bg-gray-500';
  };

  const getPointsColor = (points) => {
    if (points > 30) return 'text-green-600';
    if (points > 15) return 'text-blue-600';
    if (points > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                {isSoleSurvivorMode && <Crown className="h-8 w-8 text-survivor-orange mr-3" />}
                {isSoleSurvivorMode ? 'Select Your Sole Survivor' : 'Season 49 Contestants'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isSoleSurvivorMode 
                  ? 'Choose your winner pick from the contestants below'
                  : 'Meet the castaways competing for the title of Sole Survivor'
                }
              </p>
              {isSoleSurvivorMode && soleSurvivorPick && (
                <p className="text-sm text-survivor-orange mt-2">
                  Current pick: <span className="font-medium">{soleSurvivorPick.name}</span>
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{getActiveContestants().length} Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="h-4 w-4" />
                <span>{getEliminatedContestants().length} Eliminated</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contestants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-survivor-orange focus:border-transparent"
              />
            </div>

            {/* Tribe Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedTribe}
                onChange={(e) => setSelectedTribe(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-survivor-orange focus:border-transparent appearance-none"
              >
                {tribes.map(tribe => (
                  <option key={tribe} value={tribe}>{tribe}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showEliminated"
                checked={showEliminated}
                onChange={(e) => setShowEliminated(e.target.checked)}
                className="h-4 w-4 text-survivor-orange focus:ring-survivor-orange border-gray-300 rounded"
              />
              <label htmlFor="showEliminated" className="text-sm text-gray-700">
                Show eliminated
              </label>
            </div>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              {filteredContestants.length} contestant{filteredContestants.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Contestants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredContestants.map(contestant => {
            const isCurrentPick = isSoleSurvivorMode && soleSurvivorPick?.id === contestant.id;
            const isSelectable = isSoleSurvivorMode && !contestant.eliminated && isSoleSurvivorOpen;
            const isDisabled = isSoleSurvivorMode && (contestant.eliminated || !isSoleSurvivorOpen);
            
            return (
              <div
                key={contestant.id}
                onClick={() => isSoleSurvivorMode && isSelectable ? handleSoleSurvivorSelect(contestant) : undefined}
                className={`bg-white rounded-lg shadow transition-all duration-200 relative ${
                  contestant.eliminated ? 'opacity-75' : ''
                } ${
                  isSoleSurvivorMode ? (
                    isSelectable ? 'hover:shadow-lg cursor-pointer hover:scale-105' :
                    isDisabled ? 'cursor-not-allowed opacity-50' : ''
                  ) : 'hover:shadow-lg'
                } ${
                  isCurrentPick ? 'ring-4 ring-survivor-orange ring-opacity-50 shadow-lg' : ''
                }`}
              >
              {/* Contestant Image */}
              <div className="relative">
                <img
                  src={`/contestant-images/${contestant.image}`}
                  alt={contestant.name}
                  className="w-full h-64 object-cover object-top rounded-t-lg"
                  style={{ objectPosition: 'center top' }}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/300x300/cccccc/666666?text=${contestant.name.split(' ').map(n => n[0]).join('')}`;
                  }}
                />
                {/* Tribe Badge */}
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-medium ${getTribeColor(contestant.tribe)}`}>
                  {contestant.tribe}
                </div>
                {/* Status Badge */}
                {isCurrentPick ? (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-survivor-orange text-white text-xs font-medium rounded-full flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Your Pick</span>
                  </div>
                ) : contestant.eliminated ? (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                    Eliminated
                  </div>
                ) : null}
                
                {/* Selection Indicator */}
                {isSoleSurvivorMode && isSelectable && (
                  <div className="absolute inset-0 bg-survivor-orange bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-t-lg flex items-center justify-center">
                    <div className="bg-white bg-opacity-90 rounded-full p-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <Crown className="h-6 w-6 text-survivor-orange" />
                    </div>
                  </div>
                )}
              </div>

              {/* Contestant Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {contestant.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Age {contestant.age}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{contestant.hometown}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{contestant.occupation}</span>
                  </div>
                </div>

                {/* Points */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Points:</span>
                    <span className={`font-semibold ${getPointsColor(contestant.points)}`}>
                      {contestant.points > 0 ? '+' : ''}{contestant.points}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-500">Episodes:</span>
                    <span className="text-sm font-medium text-gray-700">{contestant.episodes}</span>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredContestants.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contestants found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contestants;
