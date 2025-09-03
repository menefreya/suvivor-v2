import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { contestants } from '../../data/contestants';
import './DraftRanker.css';

const DraftRanker = () => {
  const { currentUser, updateUser } = useAuth();
  const [rankings, setRankings] = useState(currentUser.draftRankings || {});
  const [draggedItem, setDraggedItem] = useState(null);
  const [filterTribe, setFilterTribe] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    setRankings(currentUser.draftRankings || {});
  }, [currentUser.draftRankings]);

  const handleRankChange = (contestantId, newRank) => {
    const newRankings = { ...rankings };
    
    // If this rank is already taken, swap with the contestant who has it
    const existingContestantWithRank = Object.keys(newRankings).find(
      id => newRankings[id] === parseInt(newRank) && parseInt(id) !== contestantId
    );
    
    if (existingContestantWithRank) {
      newRankings[existingContestantWithRank] = rankings[contestantId] || null;
    }
    
    newRankings[contestantId] = parseInt(newRank);
    
    setRankings(newRankings);
    updateUser({ draftRankings: newRankings });
  };

  const handleDragStart = (e, contestant) => {
    setDraggedItem(contestant);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetContestant) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetContestant.id) return;
    
    const draggedRank = rankings[draggedItem.id];
    const targetRank = rankings[targetContestant.id];
    
    const newRankings = { ...rankings };
    newRankings[draggedItem.id] = targetRank;
    newRankings[targetContestant.id] = draggedRank;
    
    setRankings(newRankings);
    updateUser({ draftRankings: newRankings });
    setDraggedItem(null);
  };

  const getFilteredContestants = () => {
    return contestants.filter(contestant => {
      const tribeMatch = filterTribe === 'all' || contestant.tribe === filterTribe;
      const statusMatch = filterStatus === 'all' || contestant.status === filterStatus;
      return tribeMatch && statusMatch;
    });
  };

  const getSortedContestants = () => {
    const filtered = getFilteredContestants();
    
    return filtered.sort((a, b) => {
      const rankA = rankings[a.id] || 999;
      const rankB = rankings[b.id] || 999;
      return rankA - rankB;
    });
  };

  const getRankColor = (rank) => {
    if (rank <= 5) return '#4CAF50'; // Green for top 5
    if (rank <= 10) return '#FF9800'; // Orange for 6-10
    return '#757575'; // Gray for rest
  };

  const getUnrankedContestants = () => {
    return contestants.filter(c => !rankings[c.id]);
  };

  const tribes = [...new Set(contestants.map(c => c.tribe))];
  const totalContestants = contestants.length;
  const rankedContestants = Object.keys(rankings).length;

  return (
    <div className="draft-ranker">
      <div className="ranker-header">
        <h2>Stack Rank All Contestants</h2>
        <p>Rank all {totalContestants} contestants from 1 (most likely to win) to {totalContestants} (least likely to win)</p>
        
        <div className="progress-bar">
          <div className="progress-info">
            <span>Progress: {rankedContestants}/{totalContestants} contestants ranked</span>
            <span className="percentage">{Math.round((rankedContestants / totalContestants) * 100)}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${(rankedContestants / totalContestants) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="ranker-controls">
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="tribe-filter">Tribe:</label>
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
            <label htmlFor="status-filter">Status:</label>
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
        </div>

        <div className="view-controls">
          <button 
            className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button 
            className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
        </div>
      </div>

      {getUnrankedContestants().length > 0 && (
        <div className="unranked-notice">
          <h3>⚠️ Unranked Contestants</h3>
          <p>You still need to rank {getUnrankedContestants().length} contestants:</p>
          <div className="unranked-list">
            {getUnrankedContestants().map(contestant => (
              <span key={contestant.id} className="unranked-name">
                {contestant.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className={`contestants-container ${viewMode}`}>
        {viewMode === 'grid' ? (
          <div className="contestants-grid">
            {getSortedContestants().map(contestant => {
              const rank = rankings[contestant.id];
              return (
                <div 
                  key={contestant.id}
                  className={`ranking-card ${contestant.status === 'eliminated' ? 'eliminated' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, contestant)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, contestant)}
                >
                  <div className="rank-input-section">
                    <label htmlFor={`rank-${contestant.id}`}>Rank:</label>
                    <input
                      type="number"
                      id={`rank-${contestant.id}`}
                      min="1"
                      max={totalContestants}
                      value={rank || ''}
                      onChange={(e) => handleRankChange(contestant.id, e.target.value)}
                      className="rank-input"
                      placeholder="?"
                    />
                  </div>

                  <div className="contestant-image">
                    <img src={contestant.profileImage} alt={contestant.name} />
                    {contestant.status === 'eliminated' && (
                      <div className="eliminated-overlay">
                        <span>Eliminated Ep. {contestant.episodeEliminated}</span>
                      </div>
                    )}
                    {rank && (
                      <div className="rank-badge" style={{ backgroundColor: getRankColor(rank) }}>
                        #{rank}
                      </div>
                    )}
                  </div>
                  
                  <div className="contestant-info">
                    <h3>{contestant.name}</h3>
                    <p>{contestant.age}, {contestant.occupation}</p>
                    <p className="tribe">Tribe: {contestant.tribe}</p>
                    
                    <div className="contestant-stats">
                      <div className="stat-item">
                        <span className="stat-label">Rewards:</span>
                        <span className="stat-value">{contestant.stats.rewardWins}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Immunity:</span>
                        <span className="stat-value">{contestant.stats.immunityWins}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="contestants-list">
            {getSortedContestants().map((contestant, index) => {
              const rank = rankings[contestant.id];
              return (
                <div 
                  key={contestant.id}
                  className={`ranking-row ${contestant.status === 'eliminated' ? 'eliminated' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, contestant)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, contestant)}
                >
                  <div className="rank-section">
                    <input
                      type="number"
                      min="1"
                      max={totalContestants}
                      value={rank || ''}
                      onChange={(e) => handleRankChange(contestant.id, e.target.value)}
                      className="rank-input-list"
                      placeholder="?"
                    />
                  </div>

                  <div className="contestant-avatar">
                    <img src={contestant.profileImage} alt={contestant.name} />
                    {rank && (
                      <div className="rank-badge-small" style={{ backgroundColor: getRankColor(rank) }}>
                        {rank}
                      </div>
                    )}
                  </div>

                  <div className="contestant-details">
                    <h4>{contestant.name}</h4>
                    <span className="details-text">{contestant.age}, {contestant.occupation} • {contestant.tribe}</span>
                    {contestant.status === 'eliminated' && (
                      <span className="eliminated-text">Eliminated Episode {contestant.episodeEliminated}</span>
                    )}
                  </div>

                  <div className="stats-summary">
                    <span>R:{contestant.stats.rewardWins} I:{contestant.stats.immunityWins}</span>
                  </div>

                  <div className="drag-handle">⋮⋮</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {rankedContestants === totalContestants && (
        <div className="completion-message">
          <h3>🎉 All Contestants Ranked!</h3>
          <p>You've successfully ranked all {totalContestants} contestants. You can still adjust your rankings at any time.</p>
        </div>
      )}
    </div>
  );
};

export default DraftRanker;