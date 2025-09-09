import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Users, 
  Award, 
  Shield, 
  Eye, 
  Plus, 
  Minus, 
  Edit2, 
  Settings, 
  Calendar,
  Upload,
  Download,
  Lock,
  Unlock,
  Trash2,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import { useContestants } from '../../contexts/ContestantsContext';
import { generatePlaceholderImage, getInitials } from '../../utils/imageUtils';
import { supabase } from '../../lib/supabase';

// Contestant Display Component
const ContestantDisplay = ({ contestant }) => {
  return (
    <>
      <h3 className="font-medium text-gray-900 mb-1">{contestant.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{contestant.occupation}</p>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Tribe:</span>
          <span className="text-sm font-medium">{contestant.tribes?.name || 'No tribe'}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Age:</span>
          <span className="text-sm">{contestant.age}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Hometown:</span>
          <span className="text-sm">{contestant.hometown}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Points:</span>
          <span className="text-sm font-medium">{contestant.points || 0}</span>
        </div>
        
        {contestant.image_url && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Image URL:</span>
            <span className="text-xs text-blue-600 truncate">{contestant.image_url}</span>
          </div>
        )}
      </div>
    </>
  );
};

// Edit Contestant Form Component
const EditContestantForm = ({ contestant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: contestant.name || '',
    occupation: contestant.occupation || '',
    current_tribe_id: contestant.current_tribe_id || null,
    age: contestant.age || '',
    hometown: contestant.hometown || '',
    image_url: contestant.image_url || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tribes, setTribes] = useState([]);
  const [loadingTribes, setLoadingTribes] = useState(true);

  // Load tribes on component mount
  useEffect(() => {
    const fetchTribes = async () => {
      try {
        const { data, error } = await supabase
          .from('tribes')
          .select('*')
          .eq('season_id', 1)
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        setTribes(data || []);
      } catch (error) {
        console.error('Error fetching tribes:', error);
      } finally {
        setLoadingTribes(false);
      }
    };

    fetchTribes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      const success = await onSave(contestant.id, formData);
      if (!success) {
        setError('Failed to update contestant. Please try again.');
      }
      // Note: The parent component handles closing the form and showing success message
    } catch (err) {
      setError('An error occurred while updating the contestant.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full text-sm border rounded px-2 py-1"
          required
        />
      </div>
      
      <div>
        <label className="block text-xs text-gray-500 mb-1">Occupation</label>
        <input
          type="text"
          value={formData.occupation}
          onChange={(e) => handleChange('occupation', e.target.value)}
          className="w-full text-sm border rounded px-2 py-1"
        />
      </div>
      
      <div>
        <label className="block text-xs text-gray-500 mb-1">Tribe</label>
        <select
          value={formData.current_tribe_id || ''}
          onChange={(e) => handleChange('current_tribe_id', e.target.value === '' ? null : parseInt(e.target.value))}
          className="w-full text-sm border rounded px-2 py-1"
          disabled={loadingTribes}
        >
          <option value="">No tribe</option>
          {tribes.map(tribe => (
            <option key={tribe.id} value={tribe.id}>
              {tribe.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-xs text-gray-500 mb-1">Age</label>
        <input
          type="number"
          value={formData.age}
          onChange={(e) => handleChange('age', e.target.value)}
          className="w-full text-sm border rounded px-2 py-1"
        />
      </div>
      
      <div>
        <label className="block text-xs text-gray-500 mb-1">Hometown</label>
        <input
          type="text"
          value={formData.hometown}
          onChange={(e) => handleChange('hometown', e.target.value)}
          className="w-full text-sm border rounded px-2 py-1"
        />
      </div>
      
      <div>
        <label className="block text-xs text-gray-500 mb-1">Image URL</label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
          className="w-full text-sm border rounded px-2 py-1"
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-gray-400 mt-1">Enter a cloud storage URL for the contestant's image</p>
        
        {/* Image Preview */}
        {formData.image_url && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-1">Preview:</p>
            <img
              src={formData.image_url}
              alt="Preview"
              className="w-16 h-16 object-cover object-top rounded-full border"
              onError={(e) => {
                e.target.src = generatePlaceholderImage('ER', 64);
              }}
            />
          </div>
        )}
      </div>
      
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}
      
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-green-600 text-white text-sm py-1 px-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white text-sm py-1 px-2 rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('scoring');
  const [episode, setEpisode] = useState(1);
  const [editingContestant, setEditingContestant] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const { contestants: contestantsData, loading, error, updateContestant, fetchContestants } = useContestants();
  const [tribes, setTribes] = useState([]);
  const [loadingTribes, setLoadingTribes] = useState(true);
  const [scoring, setScoring] = useState({});
  const [editingTeams, setEditingTeams] = useState(false);
  const [configuring, setConfiguring] = useState(false);
  const [seasonData, setSeasonData] = useState({
    seasonNumber: 49,
    seasonName: 'Survivor 49',
    startDate: '2024-09-18',
    endDate: '2024-12-18',
    episode2Deadline: '2024-10-02T23:59:59'
  });
  const [episodes, setEpisodes] = useState([
    { id: 1, title: 'Episode 1: The Premiere', airDate: '2024-09-18', scored: false, locked: false },
    { id: 2, title: 'Episode 2: First Elimination', airDate: '2024-09-25', scored: false, locked: false },
    { id: 3, title: 'Episode 3: Tribe Swap', airDate: '2024-10-02', scored: false, locked: false },
    { id: 4, title: 'Episode 4: Merge Begins', airDate: '2024-10-09', scored: false, locked: false },
    { id: 5, title: 'Episode 5: Final Five', airDate: '2024-10-16', scored: false, locked: false }
  ]);

  const teamColors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-pink-500'];

  // Fetch tribes data on component mount
  useEffect(() => {
    const fetchTribes = async () => {
      try {
        const { data, error } = await supabase
          .from('tribes')
          .select('*')
          .eq('season_id', 1)
          .eq('is_active', true)
          .order('name');
        
        if (error) throw error;
        setTribes(data || []);
      } catch (error) {
        console.error('Error fetching tribes:', error);
      } finally {
        setLoadingTribes(false);
      }
    };

    fetchTribes();
  }, []);

  const individualScoring = [
    { key: 'immunityIndividual', label: 'Individual Immunity', points: 3, icon: Shield },
    { key: 'rewardIndividual', label: 'Individual Reward', points: 2, icon: Award },
    { key: 'findIdol', label: 'Found Idol', points: 3, icon: Eye },
    { key: 'playIdol', label: 'Played Idol', points: 2, icon: Eye },
    { key: 'makeFire', label: 'Made Fire', points: 1, icon: Plus },
    { key: 'makeFood', label: 'Made Food', points: 1, icon: Plus },
    { key: 'readTreeMail', label: 'Read Tree Mail', points: 1, icon: Plus },
    { key: 'shotInDark', label: 'Shot in Dark', points: 1, icon: Plus },
    { key: 'shotImmunity', label: 'Shot Immunity', points: 4, icon: Plus },
    { key: 'soleSurvivor', label: 'Sole Survivor', points: 25, icon: Award },
    { key: 'final3', label: 'Made Final 3', points: 10, icon: Users },
    { key: 'eliminated', label: 'Eliminated', points: -5, icon: Minus },
    { key: 'votedWithIdol', label: 'Voted w/ Idol', points: -3, icon: Minus }
  ];

  const teamScoring = [
    { key: 'immunityTeam', label: 'Team Immunity', points: 2, icon: Shield },
    { key: 'rewardTeam', label: 'Team Reward', points: 1, icon: Award }
  ];


  const toggleEliminated = async (contestantId) => {
    const contestant = contestantsData.find(c => c.id === contestantId);
    if (!contestant) return;

    const success = await updateContestant(contestantId, { 
      is_eliminated: !contestant.is_eliminated 
    });
    
    if (success) {
      setSuccessMessage(`${contestant.name} has been ${contestant.is_eliminated ? 'reinstated' : 'eliminated'}.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
    setEditingContestant(null);
  };

  const handleContestantSave = async (contestantId, formData) => {
    const success = await updateContestant(contestantId, formData);
    if (success) {
      const contestant = contestantsData.find(c => c.id === contestantId);
      setSuccessMessage(`${contestant?.name || 'Contestant'} has been updated successfully.`);
      setEditingContestant(null); // Close the form
      setTimeout(() => setSuccessMessage(''), 3000); // Auto-dismiss after 3 seconds
    }
    return success;
  };

  // Helper functions
  const isChecked = (contestantId, scoreType) => {
    return scoring[`${contestantId}-${scoreType}`] || false;
  };

  const isDisabled = (contestantId, scoreType) => {
    if (scoreType === 'immunityIndividual' && isChecked(contestantId, 'immunityTeam')) return true;
    if (scoreType === 'immunityTeam' && isChecked(contestantId, 'immunityIndividual')) return true;
    if (scoreType === 'rewardIndividual' && isChecked(contestantId, 'rewardTeam')) return true;
    if (scoreType === 'rewardTeam' && isChecked(contestantId, 'rewardIndividual')) return true;
    return false;
  };

  const toggleScore = (contestantId, scoreType) => {
    const key = `${contestantId}-${scoreType}`;
    setScoring(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateTotal = (contestantId) => {
    const individualTotal = individualScoring.reduce((total, type) => {
      const checked = isChecked(contestantId, type.key);
      return total + (checked ? type.points : 0);
    }, 0);
    
    const teamTotal = teamScoring.reduce((total, type) => {
      const checked = isChecked(contestantId, type.key);
      return total + (checked ? type.points : 0);
    }, 0);
    
    return individualTotal + teamTotal;
  };

  const updateTeam = async (contestantId, newTribeId) => {
    await updateContestant(contestantId, { current_tribe_id: newTribeId });
  };

  const assignTeamScore = (tribeName, scoreType) => {
    contestantsData
      .filter(c => c.tribes?.name === tribeName)
      .forEach(c => {
        const key = `${c.id}-${scoreType}`;
        setScoring(prev => ({ ...prev, [key]: true }));
      });
  };

  const addTeam = async () => {
    try {
      const { data, error } = await supabase
        .from('tribes')
        .insert({
          season_id: 1,
          name: `Team ${tribes.length + 1}`,
          color: teamColors[tribes.length % teamColors.length].replace('bg-', '').replace('-500', ''),
          is_active: true
        })
        .select()
        .single();
      
      if (error) throw error;
      setTribes(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding team:', error);
    }
  };

  const updateTeamName = async (tribeId, newName) => {
    try {
      const { error } = await supabase
        .from('tribes')
        .update({ name: newName })
        .eq('id', tribeId);
      
      if (error) throw error;
      
      setTribes(prev => prev.map(tribe => 
        tribe.id === tribeId ? { ...tribe, name: newName } : tribe
      ));
    } catch (error) {
      console.error('Error updating team name:', error);
    }
  };

  const removeTeam = async (tribeId) => {
    try {
      // First, move contestants from this tribe to the first remaining tribe
      const remainingTribes = tribes.filter(t => t.id !== tribeId);
      
      if (remainingTribes.length > 0) {
        const contestantsToUpdate = contestantsData.filter(c => c.current_tribe_id === tribeId);
        const newTribeId = remainingTribes[0].id;
        
        for (const contestant of contestantsToUpdate) {
          await updateContestant(contestant.id, { current_tribe_id: newTribeId });
        }
      }
      
      // Then deactivate the tribe instead of deleting it
      const { error } = await supabase
        .from('tribes')
        .update({ is_active: false })
        .eq('id', tribeId);
      
      if (error) throw error;
      
      setTribes(prev => prev.filter(tribe => tribe.id !== tribeId));
    } catch (error) {
      console.error('Error removing team:', error);
    }
  };

  const getTeamColor = (tribeName) => {
    const tribe = tribes.find(t => t.name === tribeName);
    if (tribe && tribe.color) {
      return `bg-${tribe.color}-500`;
    }
    return 'bg-gray-400';
  };

  const saveScoring = () => {
    console.log('Saving episode', episode, 'scoring:', scoring);
    alert('Episode scoring saved successfully!');
  };

  const addEpisode = () => {
    const newEpisode = {
      id: episodes.length + 1,
      title: `Episode ${episodes.length + 1}`,
      airDate: '',
      scored: false,
      locked: false
    };
    setEpisodes(prev => [...prev, newEpisode]);
  };

  const updateEpisode = (episodeId, updates) => {
    setEpisodes(prev => prev.map(ep => 
      ep.id === episodeId ? { ...ep, ...updates } : ep
    ));
  };

  const deleteEpisode = (episodeId) => {
    setEpisodes(prev => prev.filter(ep => ep.id !== episodeId));
  };

  const tabs = [
    { id: 'scoring', label: 'Episode Scoring', icon: Target },
    { id: 'episodes', label: 'Episode Management', icon: Calendar },
    { id: 'contestants', label: 'Contestant Management', icon: Users },
    { id: 'season', label: 'Season Setup', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage Season 49 - Survivor Fantasy League</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-survivor-orange text-survivor-orange'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Episode Scoring Tab */}
          {activeTab === 'scoring' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Episode Scoring</h2>
                  <p className="text-gray-600">Episode {episode}</p>
                </div>
                <div className="flex items-center gap-4">
                  <select 
                    value={episode} 
                    onChange={(e) => setEpisode(Number(e.target.value))}
                    className="border rounded-md px-3 py-2"
                  >
                    {episodes.map(ep => (
                      <option key={ep.id} value={ep.id}>Episode {ep.id}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => setConfiguring(!configuring)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Tribes
                  </button>
                  <button 
                    onClick={() => setEditingTeams(!editingTeams)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Edit2 size={16} />
                    {editingTeams ? 'Done' : 'Assign'}
                  </button>
                  <button 
                    onClick={saveScoring}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save
                  </button>
                </div>
              </div>

              {/* Tribe Configuration */}
              {configuring && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-3">Tribe Configuration</h3>
                  {loadingTribes ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-survivor-orange"></div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tribes.map((tribe) => (
                        <div key={tribe.id} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getTeamColor(tribe.name)}`}></div>
                          <input 
                            value={tribe.name}
                            onChange={(e) => updateTeamName(tribe.id, e.target.value)}
                            className="border rounded px-2 py-1 flex-1"
                          />
                          {tribes.length > 1 && (
                            <button 
                              onClick={() => removeTeam(tribe.id)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button 
                        onClick={addTeam}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                      >
                        + Add Tribe
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tribe Assignment */}
              {editingTeams && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium mb-3">Player Assignments</h3>
                  <div className="grid gap-4" style={{gridTemplateColumns: `repeat(${tribes.length}, 1fr)`}}>
                    {tribes.map(tribe => (
                      <div key={tribe.id}>
                        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getTeamColor(tribe.name)}`}></div>
                          {tribe.name}
                        </h4>
                        {contestantsData.filter(c => c.tribes?.name === tribe.name).map(c => (
                          <div key={c.id} className="text-sm p-2 bg-white rounded mb-1">{c.name}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Reassign Players</h4>
                    {contestantsData.map(c => (
                      <div key={c.id} className="flex items-center gap-2 mb-2">
                        <span className="text-sm w-32">{c.name}</span>
                        <select 
                          value={c.current_tribe_id || ''} 
                          onChange={(e) => updateTeam(c.id, e.target.value === '' ? null : parseInt(e.target.value))}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="">No tribe</option>
                          {tribes.map(tribe => (
                            <option key={tribe.id} value={tribe.id}>{tribe.name}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tribe Challenge Quick Assign */}
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium mb-2">Tribe Challenge Winners</h3>
                <div className="grid gap-3" style={{gridTemplateColumns: `repeat(${Math.ceil(tribes.length)}, 1fr)`}}>
                  {tribes.map(tribe => (
                    <div key={tribe.id} className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-white rounded">
                        <input
                          type="checkbox"
                          id={`${tribe.name}-immunity`}
                          checked={contestantsData.filter(c => c.tribes?.name === tribe.name).every(c => isChecked(c.id, 'immunityTeam'))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              assignTeamScore(tribe.name, 'immunityTeam');
                            } else {
                              // Remove immunity from all team members
                              contestantsData.filter(c => c.tribes?.name === tribe.name).forEach(c => {
                                const key = `${c.id}-immunityTeam`;
                                setScoring(prev => ({ ...prev, [key]: false }));
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`${tribe.name}-immunity`}
                          className={`flex-1 text-center text-white px-2 py-1 rounded text-sm cursor-pointer ${getTeamColor(tribe.name)}`}
                        >
                          {tribe.name} Immunity (+2 pts)
                        </label>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-white rounded">
                        <input
                          type="checkbox"
                          id={`${tribe.name}-reward`}
                          checked={contestantsData.filter(c => c.tribes?.name === tribe.name).every(c => isChecked(c.id, 'rewardTeam'))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              assignTeamScore(tribe.name, 'rewardTeam');
                            } else {
                              // Remove reward from all team members
                              contestantsData.filter(c => c.tribes?.name === tribe.name).forEach(c => {
                                const key = `${c.id}-rewardTeam`;
                                setScoring(prev => ({ ...prev, [key]: false }));
                              });
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`${tribe.name}-reward`}
                          className={`flex-1 text-center text-white px-2 py-1 rounded text-sm cursor-pointer ${getTeamColor(tribe.name)} opacity-75`}
                        >
                          {tribe.name} Reward (+1 pt)
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-600 mt-2">Check boxes to award points to all tribe members. Uncheck to remove points.</p>
              </div>

              {/* Scoring Table */}
              <div className="mb-4">
                <h3 className="font-medium mb-3">Episode Scoring</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2 font-medium">Contestant</th>
                        <th className="text-center py-2 px-2 font-medium bg-yellow-200 text-yellow-900 min-w-32">Episode Total</th>
                        {teamScoring.map(type => (
                          <th key={type.key} className="text-center py-2 px-2 font-medium min-w-20 bg-blue-50">
                            <div className="flex flex-col items-center gap-1">
                              <type.icon size={14} />
                              <span className="text-xs">{type.label}</span>
                              <span className="text-xs text-gray-500">({type.points > 0 ? '+' : ''}{type.points})</span>
                            </div>
                          </th>
                        ))}
                        {individualScoring.map(type => (
                          <th key={type.key} className="text-center py-2 px-2 font-medium min-w-20">
                            <div className="flex flex-col items-center gap-1">
                              <type.icon size={14} />
                              <span className="text-xs">{type.label}</span>
                              <span className="text-xs text-gray-500">({type.points > 0 ? '+' : ''}{type.points})</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {contestantsData.map(contestant => (
                        <tr key={contestant.id} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getTeamColor(contestant.tribes?.name)}`}></div>
                              <span className="font-medium text-sm">{contestant.name}</span>
                              {contestant.is_eliminated && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Eliminated</span>
                              )}
                            </div>
                          </td>
                          <td className="text-center py-2 px-2 font-bold bg-yellow-200">
                            <span className={`px-3 py-2 rounded-full text-lg font-bold ${
                              calculateTotal(contestant.id) > 0 ? 'text-green-700 bg-green-100' : 
                              calculateTotal(contestant.id) < 0 ? 'text-red-700 bg-red-100' : 
                              'text-gray-700 bg-gray-100'
                            }`}>
                              {calculateTotal(contestant.id) > 0 ? '+' : ''}{calculateTotal(contestant.id)}
                            </span>
                          </td>
                          {teamScoring.map(type => (
                            <td key={type.key} className="text-center py-2 px-2 bg-blue-50">
                              <input
                                type="checkbox"
                                checked={isChecked(contestant.id, type.key)}
                                disabled={isDisabled(contestant.id, type.key)}
                                onChange={() => toggleScore(contestant.id, type.key)}
                                className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ${
                                  isDisabled(contestant.id, type.key) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              />
                            </td>
                          ))}
                          {individualScoring.map(type => (
                            <td key={type.key} className="text-center py-2 px-2">
                              <input
                                type="checkbox"
                                checked={isChecked(contestant.id, type.key)}
                                disabled={isDisabled(contestant.id, type.key)}
                                onChange={() => toggleScore(contestant.id, type.key)}
                                className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ${
                                  isDisabled(contestant.id, type.key) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Admin Scoring Summary */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Scoring Dashboard Guide</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• <span className="font-medium">Check boxes</span> to award points for each category</p>
                    <p>• <span className="font-medium">Episode Total (yellow column)</span> automatically calculates the sum of all checked points</p>
                    <p>• <span className="font-medium">Green totals</span> = positive points, <span className="font-medium">Red totals</span> = negative points</p>
                    <p>• <span className="font-medium">Team challenges</span> (blue columns) apply to all tribe members when checked</p>
                    <p>• The <span className="font-medium">Total column is sticky</span> and stays visible when scrolling</p>
                  </div>
                </div>
                
                {/* Episode Totals Summary */}
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="text-sm font-medium text-yellow-900 mb-2">Episode {episode} Point Totals</h4>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                    {contestantsData.slice(0, 6).map(contestant => {
                      const total = calculateTotal(contestant.id);
                      return (
                        <div key={contestant.id} className="text-center">
                          <p className="font-medium text-gray-900 truncate">{(contestant.name || 'Unknown').split(' ')[0]}</p>
                          <p className={`font-bold ${
                            total > 0 ? 'text-green-700' : 
                            total < 0 ? 'text-red-700' : 'text-gray-700'
                          }`}>
                            {total > 0 ? '+' : ''}{total} pts
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  {contestantsData.length > 6 && (
                    <p className="text-xs text-yellow-800 mt-2 text-center">
                      Showing first 6 contestants - scroll table to see all totals
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Episode Management Tab */}
          {activeTab === 'episodes' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Episode Management</h2>
                <button 
                  onClick={addEpisode}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Episode
                </button>
              </div>

              <div className="space-y-4">
                {episodes.map(episode => (
                  <div key={episode.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <input
                            type="text"
                            value={episode.title}
                            onChange={(e) => updateEpisode(episode.id, { title: e.target.value })}
                            className="text-lg font-medium border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                          />
                          <input
                            type="date"
                            value={episode.airDate}
                            onChange={(e) => updateEpisode(episode.id, { airDate: e.target.value })}
                            className="border rounded px-2 py-1"
                          />
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className={`flex items-center gap-2 px-2 py-1 rounded text-sm ${
                            episode.scored ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {episode.scored ? <CheckCircle size={14} /> : <Clock size={14} />}
                            {episode.scored ? 'Scored' : 'Not Scored'}
                          </div>
                          <div className={`flex items-center gap-2 px-2 py-1 rounded text-sm ${
                            episode.locked ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {episode.locked ? <Lock size={14} /> : <Unlock size={14} />}
                            {episode.locked ? 'Locked' : 'Unlocked'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateEpisode(episode.id, { scored: !episode.scored })}
                          className={`px-3 py-1 rounded text-sm ${
                            episode.scored ? 'bg-gray-600 text-white' : 'bg-green-600 text-white'
                          }`}
                        >
                          {episode.scored ? 'Mark Unscored' : 'Mark Scored'}
                        </button>
                        <button
                          onClick={() => updateEpisode(episode.id, { locked: !episode.locked })}
                          className={`px-3 py-1 rounded text-sm ${
                            episode.locked ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                          }`}
                        >
                          {episode.locked ? 'Unlock' : 'Lock'}
                        </button>
                        <button
                          onClick={() => deleteEpisode(episode.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contestant Management Tab */}
          {activeTab === 'contestants' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Contestant Management</h2>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={fetchContestants}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Refresh
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2">
                    <Upload size={16} />
                    Import CSV
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                    <Download size={16} />
                    Export CSV
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center gap-2">
                  <CheckCircle size={16} />
                  {successMessage}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-survivor-orange"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contestantsData.map(contestant => (
                    <div key={contestant.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <img
                          src={contestant.image_url || generatePlaceholderImage(getInitials(contestant.name || 'Unknown'), 64)}
                          alt={contestant.name}
                          className="w-16 h-16 object-cover object-top rounded-full"
                          onError={(e) => {
                            const name = contestant.name || 'Unknown';
                            const initials = getInitials(name);
                            e.target.src = generatePlaceholderImage(initials, 64);
                          }}
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => toggleEliminated(contestant.id)}
                            className={`px-3 py-1 rounded text-sm ${
                              contestant.is_eliminated 
                                ? 'bg-red-600 text-white' 
                                : 'bg-green-600 text-white'
                            }`}
                          >
                            {contestant.is_eliminated ? 'Eliminated' : 'Active'}
                          </button>
                          <button
                            onClick={() => setEditingContestant(editingContestant === contestant.id ? null : contestant.id)}
                            className="px-3 py-1 rounded text-sm bg-blue-600 text-white hover:bg-blue-700"
                          >
                            {editingContestant === contestant.id ? 'Cancel' : 'Edit'}
                          </button>
                        </div>
                      </div>
                      
                      {editingContestant === contestant.id ? (
                        <EditContestantForm 
                          contestant={contestant} 
                          onSave={handleContestantSave}
                          onCancel={() => setEditingContestant(null)}
                        />
                      ) : (
                        <ContestantDisplay contestant={contestant} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Season Setup Tab */}
          {activeTab === 'season' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Season Setup</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Season Number</label>
                    <input
                      type="number"
                      value={seasonData.seasonNumber}
                      onChange={(e) => setSeasonData(prev => ({ ...prev, seasonNumber: e.target.value }))}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Season Name</label>
                    <input
                      type="text"
                      value={seasonData.seasonName}
                      onChange={(e) => setSeasonData(prev => ({ ...prev, seasonName: e.target.value }))}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={seasonData.startDate}
                      onChange={(e) => setSeasonData(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={seasonData.endDate}
                      onChange={(e) => setSeasonData(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Episode 2 Deadline</label>
                    <input
                      type="datetime-local"
                      value={seasonData.episode2Deadline}
                      onChange={(e) => setSeasonData(prev => ({ ...prev, episode2Deadline: e.target.value }))}
                      className="w-full border rounded-md px-3 py-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Season Status</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Contestants:</span>
                        <span className="font-medium">{contestantsData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Active Contestants:</span>
                        <span className="font-medium">{contestantsData.filter(c => !c.eliminated).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Eliminated:</span>
                        <span className="font-medium">{contestantsData.filter(c => c.eliminated).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Episodes:</span>
                        <span className="font-medium">{episodes.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scored Episodes:</span>
                        <span className="font-medium">{episodes.filter(e => e.scored).length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm">
                        Reset Season Data
                      </button>
                      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm">
                        Export Season Data
                      </button>
                      <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 text-sm">
                        Backup Database
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;