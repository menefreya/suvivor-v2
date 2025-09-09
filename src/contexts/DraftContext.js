import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useContestants } from './ContestantsContext';

const DraftContext = createContext();

export const useDraft = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraft must be used within a DraftProvider');
  }
  return context;
};

export const DraftProvider = ({ children }) => {
  const { user } = useAuth();
  const { contestants, fetchContestants } = useContestants();
  const [draftRankings, setDraftRankings] = useState([]);
  const [draftPicks, setDraftPicks] = useState([]);
  const [isDraftSubmitted, setIsDraftSubmitted] = useState(false);
  const [draftDeadline, setDraftDeadline] = useState(new Date('2026-02-15T23:59:59')); // After Episode 2
  const [isDraftOpen, setIsDraftOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const calculateDraftPicks = async (rankings) => {
    if (!rankings || rankings.length === 0 || !user) return;
    
    // Calculate draft picks based on current rankings
    const sortedRankings = [...rankings].sort((a, b) => a.rank_position - b.rank_position);
    const activeContestants = sortedRankings.filter(r => !r.contestants?.is_eliminated);
    
    // Assign top 2 available contestants
    const picks = activeContestants.slice(0, 2).map((ranking, index) => ({
      user_id: user.id,
      season_id: 1,
      contestant_id: ranking.contestants?.id || ranking.contestant_id,
      pick_number: index + 1,
      assigned_from_rank: ranking.rank_position,
      is_active: true
    }));

    // Save picks to database
    try {
      // Delete existing picks
      await supabase
        .from('draft_picks')
        .delete()
        .eq('user_id', user.id)
        .eq('season_id', 1);

      // Insert new picks
      const { data, error } = await supabase
        .from('draft_picks')
        .insert(picks)
        .select(`
          *,
          contestants (*)
        `);

      if (error) throw error;
      setDraftPicks(data);
    } catch (error) {
      console.error('Error saving draft picks:', error);
    }
  };

  useEffect(() => {
    // Check if draft is still open
    const now = new Date();
    if (now > draftDeadline) {
      setIsDraftOpen(false);
    } else {
      setIsDraftOpen(true);
    }

    if (user) {
      loadDraftData();
    }
  }, [user, draftDeadline]);

  // Recalculate draft picks when contestants change (e.g., eliminations)
  useEffect(() => {
    if (draftRankings.length > 0 && contestants.length > 0) {
      calculateDraftPicks(draftRankings);
    }
  }, [contestants]);

  const loadDraftData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Ensure we have fresh contestant data
      await fetchContestants(true);

      // Load existing draft rankings for this user
      const { data: rankings, error: rankingsError } = await supabase
        .from('draft_rankings')
        .select(`
          *,
          contestants (*)
        `)
        .eq('user_id', user.id)
        .eq('season_id', 1)
        .order('rank_position');

      if (rankingsError) throw rankingsError;

      if (rankings.length > 0) {
        // User has existing rankings
        setDraftRankings(rankings);
        setIsDraftSubmitted(rankings[0].is_submitted);
        await calculateDraftPicks(rankings);
      } else {
        // No existing rankings - create default rankings with all contestants in random order
        await initializeDefaultRankings(contestants);
      }

      // Load draft picks
      const { data: picks, error: picksError } = await supabase
        .from('draft_picks')
        .select(`
          *,
          contestants (*)
        `)
        .eq('user_id', user.id)
        .eq('season_id', 1)
        .eq('is_active', true)
        .order('pick_number');

      if (picksError) throw picksError;
      setDraftPicks(picks || []);

    } catch (error) {
      console.error('Error loading draft data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultRankings = async (contestantData = null) => {
    try {
      const contestantsToUse = contestantData || contestants;
      if (!contestantsToUse || contestantsToUse.length === 0) {
        console.error('No contestants available to create rankings');
        return;
      }

      // Create shuffled rankings
      const shuffled = [...contestantsToUse].sort(() => Math.random() - 0.5);
      const rankings = shuffled.map((contestant, index) => ({
        user_id: user.id,
        season_id: 1,
        contestant_id: contestant.id,
        rank_position: index + 1,
        is_submitted: false
      }));

      // Insert rankings
      const { error: insertError } = await supabase
        .from('draft_rankings')
        .insert(rankings);

      if (insertError) throw insertError;

      // Reload data to get the newly created rankings with contestant data
      await loadDraftData();
    } catch (error) {
      console.error('Error initializing rankings:', error);
    }
  };

  const updateRanking = async (contestantId, newRank) => {
    if (!user) return;

    try {
      // This would be complex to implement efficiently, for now use updateRankings
      console.log('Use updateRankings for batch updates');
    } catch (error) {
      console.error('Error updating ranking:', error);
    }
  };

  const updateRankings = async (newRankings) => {
    if (!user) return;

    try {
      // Update local state immediately for responsive UI
      setDraftRankings(newRankings);

      // Prepare data for database
      const rankingsData = newRankings.map(ranking => ({
        user_id: user.id,
        season_id: 1,
        contestant_id: ranking.contestants?.id || ranking.id,
        rank_position: ranking.rank || ranking.rank_position,
        is_submitted: isDraftSubmitted
      }));

      // Delete existing and insert new rankings
      await supabase
        .from('draft_rankings')
        .delete()
        .eq('user_id', user.id)
        .eq('season_id', 1);

      const { error } = await supabase
        .from('draft_rankings')
        .insert(rankingsData);

      if (error) throw error;

      // Recalculate draft picks
      await calculateDraftPicks(newRankings);

    } catch (error) {
      console.error('Error updating rankings:', error);
      // Reload data from server on error
      await loadDraftData();
    }
  };

  const saveDraft = async () => {
    if (!user) return;

    try {
      // Mark as submitted
      await supabase
        .from('draft_rankings')
        .update({ 
          is_submitted: true,
          submitted_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('season_id', 1);

      setIsDraftSubmitted(true);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const getReplacementPick = () => {
    if (!isDraftSubmitted || draftPicks.length === 0) return null;

    const sortedRankings = [...draftRankings].sort((a, b) => a.rank_position - b.rank_position);
    const activeContestants = sortedRankings.filter(r => !r.contestants?.is_eliminated);
    
    // Find next available contestant not already picked
    const currentPickIds = draftPicks.map(p => p.contestant_id);
    const nextAvailable = activeContestants.find(r => !currentPickIds.includes(r.contestant_id));
    
    return nextAvailable;
  };

  const getAllReplacementPicks = () => {
    if (!isDraftSubmitted || draftPicks.length === 0) return [];

    const sortedRankings = [...draftRankings].sort((a, b) => a.rank_position - b.rank_position);
    const activeContestants = sortedRankings.filter(r => !r.contestants?.is_eliminated);
    
    // Find all available contestants not already picked, in draft order
    const currentPickIds = draftPicks.map(p => p.contestant_id);
    const allAvailable = activeContestants.filter(r => !currentPickIds.includes(r.contestant_id));
    
    return allAvailable;
  };

  const replaceEliminatedContestant = async (eliminatedContestantId) => {
    if (!user) return null;

    const replacement = getReplacementPick();
    if (!replacement) return null;

    try {
      // Deactivate the eliminated pick
      await supabase
        .from('draft_picks')
        .update({ 
          is_active: false,
          replaced_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('contestant_id', eliminatedContestantId);

      // Create new pick
      const { data, error } = await supabase
        .from('draft_picks')
        .insert([{
          user_id: user.id,
          season_id: 1,
          contestant_id: replacement.contestant_id,
          pick_number: draftPicks.find(p => p.contestant_id === eliminatedContestantId)?.pick_number || 1,
          assigned_from_rank: replacement.rank_position,
          is_active: true
        }])
        .select(`
          *,
          contestants (*)
        `)
        .single();

      if (error) throw error;

      // Update local state
      setDraftPicks(prev => prev.map(pick => 
        pick.contestant_id === eliminatedContestantId ? data : pick
      ));

      return data;
    } catch (error) {
      console.error('Error replacing eliminated contestant:', error);
      return null;
    }
  };

  const resetDraft = async () => {
    if (!user) return;

    try {
      // Delete all draft data for user
      await supabase
        .from('draft_rankings')
        .delete()
        .eq('user_id', user.id)
        .eq('season_id', 1);

      await supabase
        .from('draft_picks')
        .delete()
        .eq('user_id', user.id)
        .eq('season_id', 1);

      // Reset local state
      setDraftRankings([]);
      setDraftPicks([]);
      setIsDraftSubmitted(false);

      // Ensure we have fresh contestant data and reinitialize
      await fetchContestants(true);
      
      if (contestants && contestants.length > 0) {
        await initializeDefaultRankings(contestants);
      }
    } catch (error) {
      console.error('Error resetting draft:', error);
    }
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
    loading,
    updateRanking,
    updateRankings,
    saveDraft,
    getReplacementPick,
    getAllReplacementPicks,
    replaceEliminatedContestant,
    resetDraft,
    getTimeUntilDeadline,
    loadDraftData
  };

  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  );
};
