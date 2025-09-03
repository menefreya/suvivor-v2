import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { contestants } from '../../data/contestants';
import './RankingList.css';

const RankingList = () => {
  const { currentUser, updateUser } = useAuth();
  const [rankedList, setRankedList] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [filterTribe, setFilterTribe] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Initialize ranked list from user's rankings or create empty list
  useEffect(() => {
    const initializeList = () => {
      if (currentUser.draftRankings && Object.keys(currentUser.draftRankings).length > 0) {
        // Convert rankings object to sorted array
        const rankedContestants = contestants
          .filter(c => currentUser.draftRankings[c.id])
          .sort((a, b) => currentUser.draftRankings[a.id] - currentUser.draftRankings[b.id]);
        
        // Add unranked contestants at the end
        const unrankedContestants = contestants.filter(c => !currentUser.draftRankings[c.id]);
        
        setRankedList([...rankedContestants, ...unrankedContestants]);
      } else {
        // Start with all contestants unranked
        setRankedList([...contestants]);
      }
    };

    initializeList();
  }, [currentUser.draftRankings]);

  // Update user rankings based on list position
  const updateRankings = (newList) => {
    const newRankings = {};
    newList.forEach((contestant, index) => {
      newRankings[contestant.id] = index + 1; // Position in list = rank (1-based)
    });
    
    setRankedList(newList);
    updateUser({ draftRankings: newRankings });
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newList = [...rankedList];
    const draggedContestant = newList[draggedIndex];
    
    // Remove from old position
    newList.splice(draggedIndex, 1);
    
    // Insert at new position
    newList.splice(dropIndex, 0, draggedContestant);
    
    updateRankings(newList);
    setDraggedIndex(null);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    
    const newList = [...rankedList];
    [newList[index - 1], newList[index]] = [newList[index], newList[index - 1]];
    updateRankings(newList);
  };

  const moveDown = (index) => {
    if (index === rankedList.length - 1) return;
    
    const newList = [...rankedList];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    updateRankings(newList);
  };

  const getFilteredList = () => {
    return rankedList.filter(contestant => {
      const tribeMatch = filterTribe === 'all' || contestant.tribe === filterTribe;
      const statusMatch = filterStatus === 'all' || contestant.status === filterStatus;
      return tribeMatch && statusMatch;
    });
  };

  const getRankColor = (rank) => {
    if (rank <= 5) return '#4CAF50'; // Green for top 5
    if (rank <= 10) return '#FF9800'; // Orange for 6-10
    return '#757575'; // Gray for rest
  };

  const tribes = [...new Set(contestants.map(c => c.tribe))];
  const totalContestants = contestants.length;
  const filteredList = getFilteredList();

  return (
    <div className="ranking-list">
      <div className="ranking-header">
        <h2>Stack Rank All Contestants</h2>
        <p>Drag contestants to reorder them. Position in list determines rank (1st = most likely to win, {totalContestants}th = least likely to win)</p>
      </div>

      <div className="ranking-controls">
        <div className="filter-controls">
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
        </div>

        <div className="ranking-info">
          <span>Total contestants ranked: {totalContestants}</span>
        </div>
      </div>

      <div className="contestants-list">
        {filteredList.map((contestant, displayIndex) => {
          // Find actual position in full list for ranking
          const actualIndex = rankedList.findIndex(c => c.id === contestant.id);
          const rank = actualIndex + 1;
          
          return (
            <div 
              key={contestant.id}
              className={`ranking-row ${contestant.status === 'eliminated' ? 'eliminated' : ''} ${draggedIndex === actualIndex ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, actualIndex)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, actualIndex)}
            >
              <div className="rank-display">
                <span className="rank-number" style={{ backgroundColor: getRankColor(rank) }}>
                  {rank}
                </span>
              </div>

              <div className="contestant-avatar">
                <img src={contestant.profileImage} alt={contestant.name} />
                {contestant.status === 'eliminated' && (
                  <div className="eliminated-badge">
                    E{contestant.episodeEliminated}
                  </div>
                )}
              </div>

              <div className="contestant-details">
                <h4>{contestant.name}</h4>
                <span className="details-text">
                  {contestant.age}, {contestant.occupation} • {contestant.tribe}
                </span>
                {contestant.status === 'eliminated' && (
                  <span className="eliminated-text">
                    Eliminated Episode {contestant.episodeEliminated}
                  </span>
                )}
              </div>

              <div className="stats-summary">
                <div className="stat">
                  <span className="stat-label">Rewards:</span>
                  <span className="stat-value">{contestant.stats.rewardWins}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Immunity:</span>
                  <span className="stat-value">{contestant.stats.immunityWins}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Idols:</span>
                  <span className="stat-value">{contestant.stats.idolsFound}</span>
                </div>
              </div>

              <div className="ranking-controls-buttons">
                <button 
                  className="move-button"
                  onClick={() => moveUp(actualIndex)}
                  disabled={actualIndex === 0}
                  title="Move up"
                >
                  ▲
                </button>
                <button 
                  className="move-button"
                  onClick={() => moveDown(actualIndex)}
                  disabled={actualIndex === rankedList.length - 1}
                  title="Move down"
                >
                  ▼
                </button>
              </div>

              <div className="drag-handle">
                <span>⋮⋮</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredList.length === 0 && (
        <div className="no-contestants">
          <p>No contestants match your current filters.</p>
        </div>
      )}

      <div className="ranking-legend">
        <h3>Ranking Guide</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#4CAF50' }}></span>
            <span>Ranks 1-5: Top contenders</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#FF9800' }}></span>
            <span>Ranks 6-10: Strong players</span>
          </div>
          <div className="legend-item">
            <span className="legend-color" style={{ backgroundColor: '#757575' }}></span>
            <span>Ranks 11+: Unlikely to win</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingList;