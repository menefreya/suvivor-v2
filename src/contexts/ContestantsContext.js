import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ContestantsContext = createContext();

export const useContestants = () => {
  const context = useContext(ContestantsContext);
  if (context === undefined) {
    throw new Error('useContestants must be used within a ContestantsProvider');
  }
  return context;
};

export const ContestantsProvider = ({ children }) => {
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch contestants from Supabase
  const fetchContestants = async (forceRefresh = false) => {
    try {
      // Only fetch if we don't have data, or if forced refresh, or if data is stale (older than 5 minutes)
      const isStale = lastUpdated && (Date.now() - lastUpdated) > 5 * 60 * 1000;
      
      if (!forceRefresh && contestants.length > 0 && !isStale) {
        return;
      }

      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('contestants')
        .select(`
          *,
          tribes (
            id,
            name,
            color
          )
        `)
        .eq('season_id', 1)
        .order('name');

      if (error) throw error;
      
      setContestants(data || []);
      setLastUpdated(Date.now());
    } catch (error) {
      console.error('Error fetching contestants:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Get contestant by ID
  const getContestantById = (id) => {
    return contestants.find(contestant => contestant.id === id);
  };

  // Get contestants by tribe
  const getContestantsByTribe = (tribeName) => {
    return contestants.filter(contestant => contestant.tribes?.name === tribeName);
  };

  // Get active contestants (not eliminated)
  const getActiveContestants = () => {
    return contestants.filter(contestant => !contestant.is_eliminated);
  };

  // Get eliminated contestants
  const getEliminatedContestants = () => {
    return contestants.filter(contestant => contestant.is_eliminated);
  };

  // Update contestant locally and in database
  const updateContestant = async (contestantId, updates) => {
    try {
      console.log('Updating contestant:', contestantId, 'with data:', updates);
      
      const { data, error } = await supabase
        .from('contestants')
        .update(updates)
        .eq('id', contestantId)
        .select();

      if (error) throw error;

      console.log('Update successful:', data);

      // Update local state
      setContestants(prev => prev.map(contestant => 
        contestant.id === contestantId ? { ...contestant, ...updates } : contestant
      ));

      return true;
    } catch (error) {
      console.error('Error updating contestant:', error);
      setError(error.message);
      return false;
    }
  };

  // Search contestants
  const searchContestants = (searchTerm, filters = {}) => {
    if (!searchTerm && Object.keys(filters).length === 0) {
      return contestants;
    }

    return contestants.filter(contestant => {
      // Text search
      let matchesSearch = true;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        matchesSearch = 
          (contestant.name?.toLowerCase().includes(term)) ||
          (contestant.occupation?.toLowerCase().includes(term)) ||
          (contestant.hometown?.toLowerCase().includes(term));
      }

      // Tribe filter
      let matchesTribe = true;
      if (filters.tribe && filters.tribe !== 'All') {
        matchesTribe = contestant.tribes?.name === filters.tribe;
      }

      // Elimination status filter
      let matchesElimination = true;
      if (filters.showEliminated !== undefined) {
        matchesElimination = filters.showEliminated ? contestant.is_eliminated : !contestant.is_eliminated;
      }

      return matchesSearch && matchesTribe && matchesElimination;
    });
  };

  // Get tribe statistics
  const getTribeStats = () => {
    const stats = {};
    contestants.forEach(contestant => {
      const tribeName = contestant.tribes?.name || 'No Tribe';
      if (!stats[tribeName]) {
        stats[tribeName] = {
          total: 0,
          active: 0,
          eliminated: 0,
          totalPoints: 0
        };
      }
      
      stats[tribeName].total++;
      if (contestant.is_eliminated) {
        stats[tribeName].eliminated++;
      } else {
        stats[tribeName].active++;
      }
      stats[tribeName].totalPoints += (contestant.points || 0);
    });
    
    return stats;
  };

  // Initialize data on mount
  useEffect(() => {
    fetchContestants();
  }, []);

  // Set up real-time subscription for contestant updates
  useEffect(() => {
    const channel = supabase
      .channel('contestants_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contestants',
          filter: 'season_id=eq.1'
        },
        (payload) => {
          console.log('Real-time contestant update:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setContestants(prev => [...prev, payload.new].sort((a, b) => a.name.localeCompare(b.name)));
              break;
              
            case 'UPDATE':
              setContestants(prev => prev.map(contestant => 
                contestant.id === payload.new.id ? payload.new : contestant
              ));
              break;
              
            case 'DELETE':
              setContestants(prev => prev.filter(contestant => contestant.id !== payload.old.id));
              break;
              
            default:
              // For any other changes, refetch all data
              fetchContestants(true);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const value = {
    // Data
    contestants,
    loading,
    error,
    lastUpdated,
    
    // Actions
    fetchContestants,
    updateContestant,
    
    // Getters
    getContestantById,
    getContestantsByTribe,
    getActiveContestants,
    getEliminatedContestants,
    searchContestants,
    getTribeStats
  };

  return (
    <ContestantsContext.Provider value={value}>
      {children}
    </ContestantsContext.Provider>
  );
};