import React, { useState } from 'react';
import { Search, Filter, Users, Trophy, Crown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContestants } from '../../contexts/ContestantsContext';
import { useSoleSurvivor } from '../../contexts/SoleSurvivorContext';
import ContestantCard from '../shared/ContestantCard';

const Contestants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTribe, setSelectedTribe] = useState('All');
  const [showEliminated, setShowEliminated] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, getActiveContestants, getEliminatedContestants, searchContestants } = useContestants();
  const { soleSurvivorPick, changeSoleSurvivor, isSoleSurvivorOpen } = useSoleSurvivor();
  
  
  // Check if we're in sole survivor selection mode
  const searchParams = new URLSearchParams(location.search);
  const isSoleSurvivorMode = searchParams.get('mode') === 'sole-survivor';
  
  // Handle sole survivor selection
  const handleSoleSurvivorSelect = (contestant) => {
    if (!isSoleSurvivorOpen || contestant.is_eliminated) return;
    
    changeSoleSurvivor(contestant.id);
    // Navigate back to dashboard after selection
    navigate('/dashboard');
  };

  const tribes = ['All', 'Ratu', 'Tika', 'Soka'];
  
  const filteredContestants = searchContestants(searchTerm, {
    tribe: selectedTribe,
    showEliminated: showEliminated
  });


  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-survivor-orange mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contestants...</p>
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading contestants</h3>
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
            const isSelectable = isSoleSurvivorMode && !contestant.is_eliminated && isSoleSurvivorOpen;
            const isDisabled = isSoleSurvivorMode && (contestant.is_eliminated || !isSoleSurvivorOpen);
            
            return (
              <ContestantCard
                key={contestant.id}
                contestant={contestant}
                showDetails={true}
                showPoints={true}
                showStatus={true}
                onClick={isSoleSurvivorMode && isSelectable ? handleSoleSurvivorSelect : undefined}
                isSelected={isCurrentPick}
                isSelectable={isSelectable}
                isDisabled={isDisabled}
                size="normal"
                badgeContent={isCurrentPick ? (
                  <div className="px-2 py-1 bg-survivor-orange text-white text-xs font-medium rounded-full flex items-center space-x-1">
                    <Crown className="h-3 w-3" />
                    <span>Your Pick</span>
                  </div>
                ) : null}
              />
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
