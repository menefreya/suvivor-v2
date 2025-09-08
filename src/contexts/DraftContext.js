import React, { createContext, useContext, useState, useEffect } from 'react';
import { contestants } from '../data/contestants';

const DraftContext = createContext();

export const useDraft = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraft must be used within a DraftProvider');
  }
  return context;
};

export const DraftProvider = ({ children }) => {
  const [draftRankings, setDraftRankings] = useState([]);
  const [draftPicks, setDraftPicks] = useState([]);
  const [isDraftSubmitted, setIsDraftSubmitted] = useState(false);
  const [draftDeadline, setDraftDeadline] = useState(new Date('2026-02-15T23:59:59')); // After Episode 2
  const [isDraftOpen, setIsDraftOpen] = useState(true);

  const calculateDraftPicks = (rankings) => {
    if (!rankings || rankings.length === 0) return;
    
    // Calculate draft picks based on current rankings
    const sortedRankings = [...rankings].sort((a, b) => a.rank - b.rank);
    const activeContestants = sortedRankings.filter(c => !c.eliminated);
    
    // Assign top 2 available contestants
    const picks = activeContestants.slice(0, 2).map((contestant, index) => ({
      ...contestant,
      pickNumber: index + 1,
      assignedAt: new Date().toISOString()
    }));

    setDraftPicks(picks);
    
    // Save to localStorage
    localStorage.setItem('survivor_draft_picks', JSON.stringify(picks));
  };

  useEffect(() => {
    // Check if draft is still open
    const now = new Date();
    if (now > draftDeadline) {
      setIsDraftOpen(false);
    } else {
      setIsDraftOpen(true);
    }

    // Load saved draft data
    const savedRankings = localStorage.getItem('survivor_draft_rankings');
    const savedPicks = localStorage.getItem('survivor_draft_picks');
    const savedSubmitted = localStorage.getItem('survivor_draft_submitted');

    if (savedRankings) {
      try {
        const rankings = JSON.parse(savedRankings);
        setDraftRankings(rankings);
        // Calculate picks based on loaded rankings
        calculateDraftPicks(rankings);
      } catch (error) {
        console.error('Error loading draft rankings:', error);
      }
    } else {
      // Initialize with default rankings (random order)
      const shuffled = [...contestants].sort(() => Math.random() - 0.5);
      const initialRankings = shuffled.map((contestant, index) => ({
        ...contestant,
        rank: index + 1
      }));
      setDraftRankings(initialRankings);
      calculateDraftPicks(initialRankings);
    }

    if (savedPicks) {
      try {
        setDraftPicks(JSON.parse(savedPicks));
      } catch (error) {
        console.error('Error loading draft picks:', error);
      }
    }

    if (savedSubmitted === 'true') {
      setIsDraftSubmitted(true);
    }
  }, [draftDeadline]);

  const updateRanking = (contestantId, newRank) => {
    setDraftRankings(prev => {
      const updated = [...prev];
      
      // Find the contestant being moved
      const contestantIndex = updated.findIndex(c => c.id === contestantId);
      if (contestantIndex === -1) return prev;

      const contestant = updated[contestantIndex];
      
      // Find the contestant currently at the new rank
      const targetIndex = updated.findIndex(c => c.rank === newRank);
      
      if (targetIndex !== -1) {
        // Swap ranks
        updated[contestantIndex] = { ...updated[targetIndex], rank: contestant.rank };
        updated[targetIndex] = { ...contestant, rank: newRank };
      } else {
        // Just update the rank
        updated[contestantIndex] = { ...contestant, rank: newRank };
      }

      // Save to localStorage
      localStorage.setItem('survivor_draft_rankings', JSON.stringify(updated));
      return updated;
    });
  };

  const updateRankings = (newRankings) => {
    setDraftRankings(newRankings);
    localStorage.setItem('survivor_draft_rankings', JSON.stringify(newRankings));
    
    // Automatically recalculate picks when rankings change
    calculateDraftPicks(newRankings);
  };

  // Remove the old submitDraft function and replace with saveDraft
  const saveDraft = () => {
    // Just save current state - picks are already calculated
    localStorage.setItem('survivor_draft_rankings', JSON.stringify(draftRankings));
    localStorage.setItem('survivor_draft_picks', JSON.stringify(draftPicks));
    setIsDraftSubmitted(true);
    localStorage.setItem('survivor_draft_submitted', 'true');
  };

  const getReplacementPick = () => {
    if (!isDraftSubmitted || draftPicks.length === 0) return null;

    const sortedRankings = [...draftRankings].sort((a, b) => a.rank - b.rank);
    const activeContestants = sortedRankings.filter(c => !c.eliminated);
    
    // Find next available contestant not already picked
    const currentPickIds = draftPicks.map(p => p.id);
    const nextAvailable = activeContestants.find(c => !currentPickIds.includes(c.id));
    
    return nextAvailable;
  };

  const getAllReplacementPicks = () => {
    if (!isDraftSubmitted || draftPicks.length === 0) return [];

    const sortedRankings = [...draftRankings].sort((a, b) => a.rank - b.rank);
    const activeContestants = sortedRankings.filter(c => !c.eliminated);
    
    // Find all available contestants not already picked, in draft order
    const currentPickIds = draftPicks.map(p => p.id);
    const allAvailable = activeContestants.filter(c => !currentPickIds.includes(c.id));
    
    return allAvailable;
  };

  const replaceEliminatedContestant = (eliminatedContestantId) => {
    const replacement = getReplacementPick();
    if (!replacement) return null;

    setDraftPicks(prev => {
      const updated = prev.map(pick => 
        pick.id === eliminatedContestantId 
          ? { ...replacement, pickNumber: pick.pickNumber, assignedAt: new Date().toISOString() }
          : pick
      );
      
      localStorage.setItem('survivor_draft_picks', JSON.stringify(updated));
      return updated;
    });

    return replacement;
  };

  const resetDraft = () => {
    setDraftRankings([]);
    setDraftPicks([]);
    setIsDraftSubmitted(false);
    localStorage.removeItem('survivor_draft_rankings');
    localStorage.removeItem('survivor_draft_picks');
    localStorage.removeItem('survivor_draft_submitted');
  };

  const getTimeUntilDeadline = () => {
    const now = new Date();
    const timeLeft = draftDeadline.getTime() - now.getTime();
    
    if (timeLeft <= 0) return null;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const value = {
    draftRankings,
    draftPicks,
    isDraftSubmitted,
    isDraftOpen,
    draftDeadline,
    updateRanking,
    updateRankings,
    saveDraft,
    getReplacementPick,
    getAllReplacementPicks,
    replaceEliminatedContestant,
    resetDraft,
    getTimeUntilDeadline
  };

  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  );
};
