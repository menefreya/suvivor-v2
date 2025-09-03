import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { contestants } from '../../data/contestants';

const DraftPicker = () => {
  const { currentUser, updateUser } = useAuth();
  const [selectedContestants, setSelectedContestants] = useState(currentUser.draftPicks || []);
  const [filterTribe, setFilterTribe] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSelected, setShowSelected] = useState(false);
  const maxPicks = 8; // Maximum number of contestants a user can draft

  useEffect(() => {
    setSelectedContestants(currentUser.draftPicks || []);
  }, [currentUser.draftPicks]);

  const handleContestantToggle = (contestantId) => {
    let newSelection;
    
    if (selectedContestants.includes(contestantId)) {
      // Remove contestant
      newSelection = selectedContestants.filter(id => id !== contestantId);
    } else {
      // Add contestant (if under limit)
      if (selectedContestants.length < maxPicks) {
        newSelection = [...selectedContestants, contestantId];
      } else {
        alert(`You can only draft ${maxPicks} contestants!`);
        return;
      }
    }
    
    setSelectedContestants(newSelection);
    updateUser({ draftPicks: newSelection });
  };

  const getFilteredContestants = () => {
    return contestants.filter(contestant => {
      const tribeMatch = filterTribe === 'all' || contestant.tribe === filterTribe;
      const statusMatch = filterStatus === 'all' || contestant.status === filterStatus;
      const selectedMatch = !showSelected || selectedContestants.includes(contestant.id);
      
      return tribeMatch && statusMatch && selectedMatch;
    });
  };

  const getContestantById = (id) => {
    return contestants.find(c => c.id === id);
  };

  const tribes = [...new Set(contestants.map(c => c.tribe))];

  return (
    <div className="draft-picker">
      <div className="draft-header">
        <h2>Draft Your Team</h2>
        <p>
          Select up to {maxPicks} contestants for your fantasy team. 
          You can change your picks at any time during the season.
        </p>
        <div className="selection-counter">
          <span className={`counter ${selectedContestants.length === maxPicks ? 'full' : ''}`}>
            {selectedContestants.length} / {maxPicks} selected
          </span>
        </div>
      </div>

      <div className="draft-filters">
        <div className="filter-group">
          <label htmlFor="tribe-filter">Filter by Tribe:</label>
          <select 
            id="tribe-filter"
            value={filterTribe} 
            onChange={(e) => setFilterTribe(e.target.value)}
          >
            <option value="all">All Tribes</option>
            {tribes.map(tribe => (
              <option key={tribe} value={tribe}>{tribe}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="status-filter">Filter by Status:</label>
          <select 
            id="status-filter"
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Contestants</option>
            <option value="active">Active</option>
            <option value="eliminated">Eliminated</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showSelected}
              onChange={(e) => setShowSelected(e.target.checked)}
            />
            Show only selected
          </label>
        </div>
      </div>

      {selectedContestants.length > 0 && (
        <div className="selected-team-preview">
          <h3>Your Current Team:</h3>
          <div className="selected-contestants">
            {selectedContestants.map(id => {
              const contestant = getContestantById(id);
              return (
                <div key={id} className="selected-contestant-chip">
                  <span>{contestant?.name}</span>
                  <button 
                    className="remove-button"
                    onClick={() => handleContestantToggle(id)}
                    title="Remove from team"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="contestants-grid">
        {getFilteredContestants().map(contestant => (
          <div 
            key={contestant.id} 
            className={`contestant-card ${selectedContestants.includes(contestant.id) ? 'selected' : ''} ${contestant.status === 'eliminated' ? 'eliminated' : ''}`}
            onClick={() => handleContestantToggle(contestant.id)}
          >
            <div className="contestant-image">
              <img src={contestant.profileImage} alt={contestant.name} />
              {contestant.status === 'eliminated' && (
                <div className="eliminated-overlay">
                  <span>Eliminated</span>
                </div>
              )}
            </div>
            
            <div className="contestant-info">
              <h3 className="contestant-name">{contestant.name}</h3>
              <p className="contestant-details">{contestant.age}, {contestant.occupation}</p>
              <p className="contestant-tribe">Tribe: {contestant.tribe}</p>
              
              <div className="contestant-stats">
                <div className="stat-item">
                  <span className="stat-label">Rewards:</span>
                  <span className="stat-value">{contestant.stats.rewardWins}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Immunity:</span>
                  <span className="stat-value">{contestant.stats.immunityWins}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Idols:</span>
                  <span className="stat-value">{contestant.stats.idolsFound}</span>
                </div>
              </div>
            </div>
            
            <div className="selection-indicator">
              {selectedContestants.includes(contestant.id) && <span className="checkmark">✓</span>}
            </div>
          </div>
        ))}
      </div>

      {getFilteredContestants().length === 0 && (
        <div className="no-contestants">
          <p>No contestants match your current filters.</p>
        </div>
      )}
    </div>
  );
};

export default DraftPicker;