import React, { useState } from 'react';
import { Search, Filter, Users, Trophy, Crown, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContestants } from '../../contexts/ContestantsContext';
import { useSoleSurvivor } from '../../contexts/SoleSurvivorContext';
import ContestantCard from '../shared/ContestantCard';
import { generatePlaceholderImage, getInitials } from '../../utils/imageUtils';

const Contestants = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTribe, setSelectedTribe] = useState('All');
  const [showEliminated, setShowEliminated] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState(null);
  
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
    
    // Show confirmation dialog
    setSelectedContestant(contestant);
    setShowConfirmation(true);
  };

  // Confirm sole survivor selection
  const confirmSoleSurvivorSelection = async () => {
    if (!selectedContestant) return;
    
    const result = await changeSoleSurvivor(selectedContestant.id);
    if (result) {
      setShowConfirmation(false);
      setSelectedContestant(null);
      // Navigate back to dashboard after selection
      navigate('/dashboard');
    }
  };

  // Cancel sole survivor selection
  const cancelSoleSurvivorSelection = () => {
    setShowConfirmation(false);
    setSelectedContestant(null);
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
              {isSoleSurvivorMode && (
                <p className="text-sm text-survivor-orange mt-2">
                  Current pick: <span className="font-medium">
                    {soleSurvivorPick 
                      ? (soleSurvivorPick.name || soleSurvivorPick.contestants?.name)
                      : 'None'
                    }
                  </span>
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
            const isCurrentPick = isSoleSurvivorMode && soleSurvivorPick?.contestant_id === contestant.id;
            
            // Debug logging for sole survivor matching
            if (isSoleSurvivorMode && contestant.name === 'Jake Latimer') {
              console.log('Jake Latimer debug:', {
                contestantId: contestant.id,
                contestantName: contestant.name,
                soleSurvivorPickId: soleSurvivorPick?.contestant_id,
                soleSurvivorPickName: soleSurvivorPick?.contestants?.name,
                isCurrentPick
              });
            }
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

      {/* Confirmation Modal */}
      {showConfirmation && selectedContestant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="h-6 w-6 text-survivor-orange" />
                <h3 className="text-lg font-medium text-gray-900">Confirm Sole Survivor Pick</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Are you sure you want to select <strong>{selectedContestant.name}</strong> as your Sole Survivor pick?
                </p>
                
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedContestant.image_url || `/contestant-images/${selectedContestant.image}`}
                      alt={selectedContestant.name}
                      className="w-12 h-12 object-cover object-top rounded-full"
                      onError={(e) => {
                        const initials = getInitials(selectedContestant.name);
                        e.target.src = generatePlaceholderImage(initials, 48);
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{selectedContestant.name}</p>
                      <p className="text-sm text-gray-600">{selectedContestant.occupation}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="px-2 py-1 bg-survivor-orange text-white text-xs font-medium rounded">
                          {selectedContestant.tribes?.name || 'No Tribe'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {soleSurvivorPick && (
                  <p className="text-sm text-orange-600 mt-3">
                    This will replace your current pick: <strong>{soleSurvivorPick.name || soleSurvivorPick.contestants?.name}</strong>
                  </p>
                )}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={cancelSoleSurvivorSelection}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSoleSurvivorSelection}
                  className="flex-1 bg-survivor-orange text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-survivor-orange focus:ring-offset-2"
                >
                  Confirm Pick
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contestants;
