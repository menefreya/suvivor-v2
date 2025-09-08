import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const SoleSurvivorContext = createContext();

export const useSoleSurvivor = () => {
  const context = useContext(SoleSurvivorContext);
  if (!context) {
    throw new Error('useSoleSurvivor must be used within a SoleSurvivorProvider');
  }
  return context;
};

export const SoleSurvivorProvider = ({ children }) => {
  const { user } = useAuth();
  const [soleSurvivorPick, setSoleSurvivorPick] = useState(null);
  const [isSoleSurvivorSubmitted, setIsSoleSurvivorSubmitted] = useState(false);
  const [soleSurvivorDeadline, setSoleSurvivorDeadline] = useState(new Date('2026-02-15T23:59:59')); // After Episode 2
  const [isSoleSurvivorOpen, setIsSoleSurvivorOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if sole survivor selection is still open
    const now = new Date();
    if (now > soleSurvivorDeadline) {
      setIsSoleSurvivorOpen(false);
    }

    if (user) {
      loadSoleSurvivorData();
    }
  }, [user, soleSurvivorDeadline]);

  const loadSoleSurvivorData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sole_survivor_picks')
        .select(`
          *,
          contestants (*)
        `)
        .eq('user_id', user.id)
        .eq('season_id', 1)
        .eq('is_active', true)
        .order('selected_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setSoleSurvivorPick(data[0]);
        setIsSoleSurvivorSubmitted(true);
      }
    } catch (error) {
      console.error('Error loading sole survivor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectSoleSurvivor = async (contestantId, isOriginalPick = false) => {
    if (!user) return;

    try {
      // Deactivate any existing picks
      await supabase
        .from('sole_survivor_picks')
        .update({ 
          is_active: false,
          replaced_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('season_id', 1);

      // Create new pick
      const { data, error } = await supabase
        .from('sole_survivor_picks')
        .insert([{
          user_id: user.id,
          season_id: 1,
          contestant_id: contestantId,
          episodes_held: 0,
          is_original_pick: isOriginalPick,
          is_active: true
        }])
        .select(`
          *,
          contestants (*)
        `)
        .single();

      if (error) throw error;

      setSoleSurvivorPick(data);
      setIsSoleSurvivorSubmitted(true);

      return data;
    } catch (error) {
      console.error('Error selecting sole survivor:', error);
      return null;
    }
  };

  const changeSoleSurvivor = async (contestantId) => {
    if (!isSoleSurvivorOpen || !user) return;

    return await selectSoleSurvivor(contestantId, false);
  };

  const updateEpisodesHeld = async (episodes) => {
    if (!soleSurvivorPick || !user) return;

    try {
      const { data, error } = await supabase
        .from('sole_survivor_picks')
        .update({ episodes_held: episodes })
        .eq('user_id', user.id)
        .eq('season_id', 1)
        .eq('is_active', true)
        .select(`
          *,
          contestants (*)
        `)
        .single();

      if (error) throw error;

      setSoleSurvivorPick(data);
      return data;
    } catch (error) {
      console.error('Error updating episodes held:', error);
      return null;
    }
  };

  const resetSoleSurvivor = async () => {
    if (!user) return;

    try {
      await supabase
        .from('sole_survivor_picks')
        .delete()
        .eq('user_id', user.id)
        .eq('season_id', 1);

      setSoleSurvivorPick(null);
      setIsSoleSurvivorSubmitted(false);
    } catch (error) {
      console.error('Error resetting sole survivor:', error);
    }
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
    loading,
    selectSoleSurvivor,
    changeSoleSurvivor,
    updateEpisodesHeld,
    resetSoleSurvivor,
    getTimeUntilDeadline,
    loadSoleSurvivorData
  };

  return (
    <SoleSurvivorContext.Provider value={value}>
      {children}
    </SoleSurvivorContext.Provider>
  );
};
