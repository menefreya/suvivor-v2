import React, { createContext, useContext, useState, useEffect } from 'react';
import { contestants } from '../data/contestants';

const SoleSurvivorContext = createContext();

export const useSoleSurvivor = () => {
  const context = useContext(SoleSurvivorContext);
  if (!context) {
    throw new Error('useSoleSurvivor must be used within a SoleSurvivorProvider');
  }
  return context;
};

export const SoleSurvivorProvider = ({ children }) => {
  const [soleSurvivorPick, setSoleSurvivorPick] = useState(null);
  const [isSoleSurvivorSubmitted, setIsSoleSurvivorSubmitted] = useState(false);
  const [soleSurvivorDeadline, setSoleSurvivorDeadline] = useState(new Date('2026-02-15T23:59:59')); // After Episode 2
  const [isSoleSurvivorOpen, setIsSoleSurvivorOpen] = useState(true);

  useEffect(() => {
    // Check if sole survivor selection is still open
    const now = new Date();
    if (now > soleSurvivorDeadline) {
      setIsSoleSurvivorOpen(false);
    }

    // Load saved sole survivor pick
    const savedPick = localStorage.getItem('survivor_sole_survivor_pick');
    const savedSubmitted = localStorage.getItem('survivor_sole_survivor_submitted');

    if (savedPick) {
      try {
        const pickData = JSON.parse(savedPick);
        const contestant = contestants.find(c => c.id === pickData.contestantId);
        if (contestant) {
          setSoleSurvivorPick({
            ...contestant,
            selectedAt: pickData.selectedAt,
            episodesHeld: pickData.episodesHeld || 0
          });
        }
      } catch (error) {
        console.error('Error loading sole survivor pick:', error);
      }
    }

    if (savedSubmitted === 'true') {
      setIsSoleSurvivorSubmitted(true);
    }
  }, [soleSurvivorDeadline]);

  const selectSoleSurvivor = (contestantId) => {
    const contestant = contestants.find(c => c.id === contestantId);
    if (!contestant) return;

    const pick = {
      ...contestant,
      selectedAt: new Date().toISOString(),
      episodesHeld: 0
    };

    setSoleSurvivorPick(pick);
    setIsSoleSurvivorSubmitted(true);

    // Save to localStorage
    localStorage.setItem('survivor_sole_survivor_pick', JSON.stringify({
      contestantId: contestant.id,
      selectedAt: pick.selectedAt,
      episodesHeld: pick.episodesHeld
    }));
    localStorage.setItem('survivor_sole_survivor_submitted', 'true');
  };

  const changeSoleSurvivor = (contestantId) => {
    if (!isSoleSurvivorOpen) return;

    const contestant = contestants.find(c => c.id === contestantId);
    if (!contestant) return;

    const pick = {
      ...contestant,
      selectedAt: new Date().toISOString(),
      episodesHeld: 0
    };

    setSoleSurvivorPick(pick);

    // Save to localStorage
    localStorage.setItem('survivor_sole_survivor_pick', JSON.stringify({
      contestantId: contestant.id,
      selectedAt: pick.selectedAt,
      episodesHeld: pick.episodesHeld
    }));
  };

  const updateEpisodesHeld = (episodes) => {
    if (!soleSurvivorPick) return;

    const updatedPick = {
      ...soleSurvivorPick,
      episodesHeld: episodes
    };

    setSoleSurvivorPick(updatedPick);

    // Save to localStorage
    localStorage.setItem('survivor_sole_survivor_pick', JSON.stringify({
      contestantId: updatedPick.id,
      selectedAt: updatedPick.selectedAt,
      episodesHeld: episodes
    }));
  };

  const resetSoleSurvivor = () => {
    setSoleSurvivorPick(null);
    setIsSoleSurvivorSubmitted(false);
    localStorage.removeItem('survivor_sole_survivor_pick');
    localStorage.removeItem('survivor_sole_survivor_submitted');
  };

  const getTimeUntilDeadline = () => {
    const now = new Date();
    const timeLeft = soleSurvivorDeadline.getTime() - now.getTime();
    
    if (timeLeft <= 0) return null;
    
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return { days, hours, minutes };
  };

  const value = {
    soleSurvivorPick,
    isSoleSurvivorSubmitted,
    isSoleSurvivorOpen,
    soleSurvivorDeadline,
    selectSoleSurvivor,
    changeSoleSurvivor,
    updateEpisodesHeld,
    resetSoleSurvivor,
    getTimeUntilDeadline
  };

  return (
    <SoleSurvivorContext.Provider value={value}>
      {children}
    </SoleSurvivorContext.Provider>
  );
};
