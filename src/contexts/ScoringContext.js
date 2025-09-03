import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { scoringEvents, gameState } from '../data/contestants';
import { eliminations } from '../data/eliminations';
import { calculateTotalScore, updateUserScores, applyTieBreaking } from '../utils/scoring';

const ScoringContext = createContext();

export const useScoring = () => {
  const context = useContext(ScoringContext);
  if (!context) {
    throw new Error('useScoring must be used within a ScoringProvider');
  }
  return context;
};

export const ScoringProvider = ({ children }) => {
  const { users, currentUser, updateUser } = useAuth();

  // Calculate and update scores for all users
  useEffect(() => {
    if (!users || users.length === 0) return;

    const actualWinnerId = null; // Will be set when season ends
    const currentEpisode = gameState.currentEpisode;
    const finalEpisode = gameState.totalEpisodes;

    // Update scores for all users
    users.forEach(user => {
      const scoreData = calculateTotalScore(
        user,
        scoringEvents,
        eliminations,
        actualWinnerId,
        currentEpisode,
        finalEpisode
      );

      const updatedUser = updateUserScores(user, scoreData);
      
      // Update current user if this is them
      if (currentUser && user.id === currentUser.id) {
        updateUser({ scores: updatedUser.scores });
      }
    });
  }, [users, currentUser, updateUser]);

  const getLeaderboard = () => {
    if (!users || users.length === 0) return [];

    // Sort by total score (descending)
    const sortedUsers = [...users].sort((a, b) => {
      const aTotal = a.scores?.total || 0;
      const bTotal = b.scores?.total || 0;
      
      if (aTotal !== bTotal) {
        return bTotal - aTotal;
      }
      
      // Apply tie-breaking for users with same score
      const tiedUsers = users.filter(u => (u.scores?.total || 0) === aTotal);
      if (tiedUsers.length > 1) {
        const tieBrokenUsers = applyTieBreaking(tiedUsers);
        const aIndex = tieBrokenUsers.findIndex(u => u.id === a.id);
        const bIndex = tieBrokenUsers.findIndex(u => u.id === b.id);
        return aIndex - bIndex;
      }
      
      return 0;
    });

    return sortedUsers;
  };

  const getCurrentUserRank = () => {
    if (!currentUser) return null;
    
    const leaderboard = getLeaderboard();
    const rank = leaderboard.findIndex(user => user.id === currentUser.id) + 1;
    return rank || null;
  };

  const getScoreBreakdown = (userId = null) => {
    const targetUser = userId ? users.find(u => u.id === userId) : currentUser;
    if (!targetUser) return null;

    return calculateTotalScore(
      targetUser,
      scoringEvents,
      eliminations,
      null, // actualWinnerId
      gameState.currentEpisode,
      gameState.totalEpisodes
    );
  };

  const getContestantPoints = (contestantId) => {
    // Get total points earned by a specific contestant across all scoring events
    let totalPoints = 0;
    
    scoringEvents.forEach(event => {
      if (event.contestantIds.includes(contestantId) && event.episode <= gameState.currentEpisode) {
        totalPoints += event.points;
      }
    });

    return totalPoints;
  };

  const getEpisodeEvents = (episodeNumber) => {
    return scoringEvents.filter(event => event.episode === episodeNumber);
  };

  const getUserPredictionAccuracy = (userId = null) => {
    const targetUser = userId ? users.find(u => u.id === userId) : currentUser;
    if (!targetUser || !targetUser.votePredictions) return { correct: 0, total: 0, accuracy: 0 };

    let correctPredictions = 0;
    let totalPredictions = 0;

    eliminations.forEach(elimination => {
      const episodeVotes = targetUser.votePredictions[elimination.episode];
      if (episodeVotes && episodeVotes[elimination.contestantId] > 0) {
        correctPredictions++;
      }
      if (episodeVotes && Object.keys(episodeVotes).length > 0) {
        totalPredictions++;
      }
    });

    const accuracy = totalPredictions > 0 ? (correctPredictions / totalPredictions) * 100 : 0;

    return {
      correct: correctPredictions,
      total: totalPredictions,
      accuracy: Math.round(accuracy)
    };
  };

  const value = {
    getLeaderboard,
    getCurrentUserRank,
    getScoreBreakdown,
    getContestantPoints,
    getEpisodeEvents,
    getUserPredictionAccuracy,
    scoringEvents,
    eliminations,
    currentEpisode: gameState.currentEpisode
  };

  return (
    <ScoringContext.Provider value={value}>
      {children}
    </ScoringContext.Provider>
  );
};