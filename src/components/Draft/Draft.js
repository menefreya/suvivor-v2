import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Target, Clock, AlertCircle, CheckCircle, Save, RotateCcw, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDraft } from '../../contexts/DraftContext';

const Draft = () => {
  const {
    draftRankings,
    draftPicks,
    isDraftSubmitted,
    isDraftOpen,
    updateRanking,
    updateRankings,
    saveDraft,
    resetDraft,
    getTimeUntilDeadline
  } = useDraft();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditingDraft, setIsEditingDraft] = useState(false);

  const timeLeft = getTimeUntilDeadline();

  const handleDragEnd = (result) => {
    console.log('Drag ended:', result);
    
    if (!result.destination) {
      console.log('No destination, drag cancelled');
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) {
      console.log('Same position, no change needed');
      return;
    }

    console.log(`Moving from position ${sourceIndex} to ${destinationIndex}`);

    // Get sorted rankings
    const sortedRankings = [...draftRankings].sort((a, b) => a.rank_position - b.rank_position);
    console.log('Current rankings:', sortedRankings.map(c => `${c.name || c.contestants?.name} (${c.rank_position})`));
    
    // Reorder the array
    const [reorderedItem] = sortedRankings.splice(sourceIndex, 1);
    sortedRankings.splice(destinationIndex, 0, reorderedItem);

    // Update ranks for all contestants
    const updatedRankings = sortedRankings.map((contestant, index) => ({
      ...contestant,
      rank_position: index + 1
    }));

    console.log('Updated rankings:', updatedRankings.map(c => `${c.name || c.contestants?.name} (${c.rank_position})`));

    // Update the entire rankings array at once
    updateRankings(updatedRankings);
  };

  const handleSubmitDraft = async () => {
    setIsSubmitting(true);
    try {
      saveDraft();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTribeColor = (tribe) => {
    const colors = {
      'Ratu': 'bg-red-500',
      'Tika': 'bg-blue-500',
      'Soka': 'bg-green-500'
    };
    return colors[tribe] || 'bg-gray-500';
  };

  if (isDraftSubmitted && !isEditingDraft) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Draft Submitted!</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your draft rankings have been submitted successfully.
            </p>
            
            <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Draft Picks</h2>
              <div className="space-y-4">
                {draftPicks.map((pick, index) => (
                  <div key={pick.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-survivor-orange rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pick.name || pick.contestants?.name}</p>
                        <p className="text-sm text-gray-500">Rank #{pick.rank} in your rankings</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTribeColor(pick.tribes || pick.contestants?.tribes)}`}>
                      {pick.tribes?.name || pick.contestants?.tribes?.name || 'No Tribe'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Draft Rankings */}
            <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Complete Draft Rankings</h2>
              <p className="text-sm text-gray-600 mb-6">All contestants ranked in your preferred order</p>
              
              <div className="space-y-4">
                {draftRankings
                  .sort((a, b) => a.rank_position - b.rank_position)
                  .map((contestant, index) => {
                    const isCurrentPick = draftPicks.some(pick => pick.id === contestant.id);
                    return (
                      <div key={contestant.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                        isCurrentPick ? 'bg-green-50 border border-green-200' : 
                        contestant.is_eliminated || contestant.contestants?.is_eliminated ? 'bg-red-50 border border-red-200' : 
                        'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          isCurrentPick ? 'bg-green-600' : 
                          contestant.is_eliminated || contestant.contestants?.is_eliminated ? 'bg-red-500' : 
                          'bg-survivor-orange'
                        }`}>
                          {contestant.rank_position || contestant.rank}
                        </div>
                        
                        <img
                          src={(contestant.image_url || contestant.contestants?.image_url) || `/contestant-images/${contestant.image || contestant.contestants?.image}`}
                          alt={contestant.name || contestant.contestants?.name}
                          className="w-10 h-10 object-cover object-top rounded-full"
                          onError={(e) => {
                            const name = contestant.name || contestant.contestants?.name || 'Unknown';
                            const initials = name.split(' ').map(n => n[0]).join('');
                            e.target.src = `data:image/svg+xml;base64,${btoa(`
                              <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" fill="#cccccc"/>
                                <text x="20" y="25" text-anchor="middle" fill="#666666" font-family="Arial" font-size="14" font-weight="bold">${initials}</text>
                              </svg>
                            `)}`;
                          }}
                        />
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{contestant.name || contestant.contestants?.name}</p>
                          <div className="flex items-center space-x-2">
                            <div className={`px-2 py-1 rounded text-white text-xs font-medium ${getTribeColor(contestant.tribes || contestant.contestants?.tribes)}`}>
                              {contestant.tribes?.name || contestant.contestants?.tribes?.name || 'No Tribe'}
                            </div>
                            {isCurrentPick && (
                              <div className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                                Current Pick
                              </div>
                            )}
                            {contestant.is_eliminated || contestant.contestants?.is_eliminated && (
                              <div className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                                Eliminated
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-medium text-blue-900 mb-2">What happens next?</h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>• Your picks will earn points based on their performance in each episode</p>
                <p>• If one of your contestants is eliminated, you'll automatically get your next highest-ranked available contestant</p>
                <p>• You can view your team and track progress on the "My Team" page</p>
                <p>• Check the leaderboard to see how you rank against other players</p>
              </div>
              
              <div className="mt-4 flex justify-center space-x-3">
                <Link
                  to="/my-team"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  View My Team
                </Link>
                {isDraftOpen && (
                  <button
                    onClick={() => setIsEditingDraft(true)}
                    className="bg-survivor-orange text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm"
                  >
                    Edit Rankings
                  </button>
                )}
              </div>
            </div>

            {isDraftOpen && (
              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-yellow-800 font-medium">
                    Draft is still open! You can continue editing your rankings until the deadline.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isDraftOpen) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <Clock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Draft Closed</h1>
            <p className="text-lg text-gray-600 mb-8">
              The draft deadline has passed. Rankings are now locked.
            </p>
            
            {draftPicks.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8 max-w-2xl mx-auto mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Final Draft Picks</h2>
                <div className="space-y-4">
                  {draftPicks.map((pick, index) => (
                    <div key={pick.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-survivor-orange rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{pick.name || pick.contestants?.name}</p>
                          <p className="text-sm text-gray-500">Rank #{pick.rank} in your rankings</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTribeColor(pick.tribes || pick.contestants?.tribes)}`}>
                        {pick.tribes?.name || pick.contestants?.tribes?.name || 'No Tribe'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Full Draft Rankings for Closed Draft */}
            {draftRankings.length > 0 && (
              <div className="bg-white rounded-lg shadow p-8 max-w-4xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Complete Draft Rankings</h2>
                <p className="text-sm text-gray-600 mb-6">All contestants ranked in your preferred order</p>
                
                <div className="space-y-4">
                  {draftRankings
                    .sort((a, b) => a.rank_position - b.rank_position)
                    .map((contestant, index) => {
                      const isCurrentPick = draftPicks.some(pick => pick.id === contestant.id);
                      return (
                        <div key={contestant.id} className={`flex items-center space-x-3 p-3 rounded-lg ${
                          isCurrentPick ? 'bg-green-50 border border-green-200' : 
                          contestant.is_eliminated || contestant.contestants?.is_eliminated ? 'bg-red-50 border border-red-200' : 
                          'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            isCurrentPick ? 'bg-green-600' : 
                            contestant.is_eliminated || contestant.contestants?.is_eliminated ? 'bg-red-500' : 
                            'bg-survivor-orange'
                          }`}>
                            {contestant.rank_position || contestant.rank}
                          </div>
                          
                          <img
                            src={(contestant.image_url || contestant.contestants?.image_url) || `/contestant-images/${contestant.image || contestant.contestants?.image}`}
                            alt={contestant.name || contestant.contestants?.name}
                            className="w-10 h-10 object-cover object-top rounded-full"
                            onError={(e) => {
                              const name = contestant.name || contestant.contestants?.name || 'Unknown';
                              const initials = name.split(' ').map(n => n[0]).join('');
                              e.target.src = `data:image/svg+xml;base64,${btoa(`
                                <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                                  <rect width="40" height="40" fill="#cccccc"/>
                                  <text x="20" y="25" text-anchor="middle" fill="#666666" font-family="Arial" font-size="14" font-weight="bold">${initials}</text>
                                </svg>
                              `)}`;
                            }}
                          />
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{contestant.name || contestant.contestants?.name}</p>
                            <div className="flex items-center space-x-2">
                              <div className={`px-2 py-1 rounded text-white text-xs font-medium ${getTribeColor(contestant.tribes || contestant.contestants?.tribes)}`}>
                                {contestant.tribes?.name || contestant.contestants?.tribes?.name || 'No Tribe'}
                              </div>
                              {isCurrentPick && (
                                <div className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded">
                                  Current Pick
                                </div>
                              )}
                              {contestant.is_eliminated || contestant.contestants?.is_eliminated && (
                                <div className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded">
                                  Eliminated
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Draft Rankings</h1>
          <p className="text-gray-600">
            {isDraftOpen 
              ? "Rank all contestants to determine your draft picks. You can edit until the draft closes."
              : "Draft is closed. Rankings are now final."
            }
          </p>
          
          {isDraftSubmitted && isEditingDraft && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Editing submitted draft - Your changes will update your existing draft rankings
                </span>
              </div>
            </div>
          )}
          
          {timeLeft && isDraftOpen && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  Draft closes in: {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
                </span>
              </div>
            </div>
          )}

          {isDraftSubmitted && isDraftOpen && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Draft saved! You can continue editing until the draft closes.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">How Draft Works</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-survivor-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Rank all contestants</p>
                    <p>Drag and drop to order contestants from 1-18 based on your preferences</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-survivor-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">See live picks preview</p>
                    <p>Your top 2 available contestants are automatically assigned as your picks</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-survivor-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Edit anytime</p>
                    <p>Continue adjusting your rankings until the admin closes the draft</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-survivor-orange rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">4</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Automatic replacements</p>
                    <p>When contestants are eliminated, you get your next highest-ranked pick</p>
                  </div>
                </div>
              </div>

              {isDraftOpen && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900 mb-2">✅ Draft is Open</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Rankings update your picks instantly</li>
                      <li>• Save to secure your current rankings</li>
                      <li>• Continue editing until deadline</li>
                      <li>• View updated team on My Team page</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Current Draft Picks Preview</h4>
                {draftPicks.length > 0 ? (
                  <div className="space-y-2 mb-4">
                    {draftPicks.map((pick, index) => (
                      <div key={pick.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{index + 1}</span>
                        </div>
                        <img
                          src={(pick.image_url || pick.contestants?.image_url) || `/contestant-images/${pick.image || pick.contestants?.image}`}
                          alt={pick.name || pick.contestants?.name || pick.contestants?.name}
                          className="w-8 h-8 object-cover object-top rounded-full"
                          onError={(e) => {
                            const name = pick.name || pick.contestants?.name || pick.contestants?.name || 'Unknown';
                            const initials = name.split(' ').map(n => n[0]).join('');
                            e.target.src = `data:image/svg+xml;base64,${btoa(`
                              <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="32" fill="#cccccc"/>
                                <text x="16" y="20" text-anchor="middle" fill="#666666" font-family="Arial" font-size="12" font-weight="bold">${initials}</text>
                              </svg>
                            `)}`;
                          }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{pick.name || pick.contestants?.name || pick.contestants?.name}</p>
                          <p className="text-xs text-gray-500">Your rank #{pick.rank}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">Your picks will appear here as you rank contestants</p>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmation(true)}
                    disabled={isSubmitting || !isDraftOpen}
                    className="flex-1 bg-survivor-orange text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-survivor-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>
                      {isSubmitting ? 'Saving...' : 
                       isDraftSubmitted ? 'Update Draft' : 'Save Draft'}
                    </span>
                  </button>
                  
                  {isDraftSubmitted && (
                    <button
                      onClick={() => setIsEditingDraft(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center space-x-2"
                    >
                      <Trophy className="h-4 w-4" />
                      <span>Back to Summary</span>
                    </button>
                  )}
                  
                  <button
                    onClick={resetDraft}
                    disabled={!isDraftOpen}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Contestant Rankings</h3>
                <p className="text-sm text-gray-600">Drag to reorder contestants (1 = highest priority)</p>
              </div>
              
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="contestants">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`p-6 ${snapshot.isDraggingOver ? 'bg-gray-50' : ''}`}
                    >
                        {draftRankings
                          .sort((a, b) => a.rank_position - b.rank_position)
                          .map((contestant, index) => {
                            const isCurrentPick = draftPicks.some(pick => pick.id === contestant.id);
                            return (
                          <Draggable
                            key={contestant.id}
                            draggableId={contestant.id.toString()}
                            index={index}
                            isDragDisabled={!isDraftOpen}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`mb-3 p-4 border rounded-lg transition-colors ${
                                  snapshot.isDragging
                                    ? 'bg-orange-50 border-orange-200 shadow-lg'
                                    : isCurrentPick
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                } ${!isDraftOpen ? 'opacity-75 cursor-not-allowed' : ''}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      isCurrentPick ? 'bg-green-600' : 'bg-survivor-orange'
                                    }`}>
                                      <span className="text-white font-bold text-sm">{contestant.rank_position || contestant.rank}</span>
                                    </div>
                                    
                                    <img
                                      src={(contestant.image_url || contestant.contestants?.image_url) || `/contestant-images/${contestant.image || contestant.contestants?.image}`}
                                      alt={contestant.name || contestant.contestants?.name}
                                      className="w-12 h-12 object-cover object-top rounded-full"
                                      onError={(e) => {
                                        const name = contestant.name || contestant.contestants?.name || 'Unknown';
                                        const initials = name.split(' ').map(n => n[0]).join('');
                                        e.target.src = `data:image/svg+xml;base64,${btoa(`
                                          <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="48" height="48" fill="#cccccc"/>
                                            <text x="24" y="30" text-anchor="middle" fill="#666666" font-family="Arial" font-size="16" font-weight="bold">${initials}</text>
                                          </svg>
                                        `)}`;
                                      }}
                                    />
                                    
                                    <div>
                                      <p className="font-medium text-gray-900">{contestant.name || contestant.contestants?.name}</p>
                                      <p className="text-sm text-gray-600">{contestant.occupation || contestant.contestants?.occupation}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3">
                                    {isCurrentPick && (
                                      <div className="px-2 py-1 bg-green-600 text-white text-xs font-medium rounded-full">
                                        Current Pick
                                      </div>
                                    )}
                                    <div className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTribeColor(contestant.tribes || contestant.contestants?.tribes)}`}>
                                      {contestant.tribes?.name || contestant.contestants?.tribes?.name || 'No Tribe'}
                                    </div>
                                    
                                    {(contestant.is_eliminated || contestant.contestants?.is_eliminated) && (
                                      <div className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                                        Eliminated
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                        })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-lg font-medium text-gray-900">Confirm Draft Submission</h3>
                </div>
                
                <p className="text-gray-600 mb-6">
                  {isDraftSubmitted 
                    ? "Update your draft rankings? You can continue editing until the admin closes the draft."
                    : "Save your current draft rankings? You can continue editing until the admin closes the draft."
                  }
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Your top picks will be:</h4>
                  <div className="space-y-2">
                    {draftRankings
                      .sort((a, b) => a.rank_position - b.rank_position)
                      .slice(0, 2)
                      .map((contestant, index) => (
                        <div key={contestant.id} className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-survivor-orange rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </span>
                          <span className="text-sm font-medium text-gray-900">{contestant.name || contestant.contestants?.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitDraft}
                    disabled={isSubmitting}
                    className="flex-1 bg-survivor-orange text-white py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-survivor-orange focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 
                     isDraftSubmitted ? 'Update Draft' : 'Save Draft'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Draft;
