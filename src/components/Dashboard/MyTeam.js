import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useScoring } from '../../contexts/ScoringContext';
import { contestants } from '../../data/contestants';

const MyTeam = () => {
  const { currentUser } = useAuth();
  const { getContestantPoints, getScoreBreakdown } = useScoring();
  
  // Get ranked contestants sorted by their rank (1 is highest)
  const getRankedContestants = () => {
    if (!currentUser.draftRankings) return [];
    
    return contestants
      .filter(c => currentUser.draftRankings[c.id])
      .sort((a, b) => {
        const rankA = currentUser.draftRankings[a.id];
        const rankB = currentUser.draftRankings[b.id];
        return rankA - rankB; // Lower rank number = higher priority
      });
  };
  
  const rankedContestants = getRankedContestants();
  const scoreBreakdown = getScoreBreakdown();

  return (
    <div className="my-team">
      <div className="team-header">
        <h2>My Contestant Rankings</h2>
        <p>Your complete contestant ranking and their performance (ranked {rankedContestants.length} of {contestants.length})</p>
        {scoreBreakdown && (
          <div className="score-overview">
            <div className="score-card">
              <span className="score-label">Survivor Points</span>
              <span className="score-value">{scoreBreakdown.survivorPoints}</span>
            </div>
            <div className="score-card">
              <span className="score-label">Vote Points</span>
              <span className="score-value">{scoreBreakdown.votePoints}</span>
            </div>
            <div className="score-card">
              <span className="score-label">Bonus Points</span>
              <span className="score-value">{scoreBreakdown.bonusPoints}</span>
            </div>
            <div className="score-card total">
              <span className="score-label">Total Score</span>
              <span className="score-value">{scoreBreakdown.total}</span>
            </div>
          </div>
        )}
      </div>

      {rankedContestants.length === 0 ? (
        <div className="no-team">
          <p>You haven't ranked any contestants yet!</p>
          <p>Go to the Rank Contestants tab to set your rankings.</p>
        </div>
      ) : (
        <div className="team-grid">
          {rankedContestants.map((contestant, index) => {
            const rank = currentUser.draftRankings[contestant.id];
            return (
            <div 
              key={contestant.id} 
              className={`team-contestant-card ${contestant.status === 'eliminated' ? 'eliminated' : ''}`}
            >
              <div className="contestant-image">
                <img src={contestant.profileImage} alt={contestant.name} />
                {contestant.status === 'eliminated' && (
                  <div className="eliminated-overlay">
                    <span>Eliminated Ep. {contestant.episodeEliminated}</span>
                  </div>
                )}
                <div className="rank-badge-team">
                  #{rank}
                </div>
              </div>
              
              <div className="contestant-details">
                <h3>{contestant.name}</h3>
                <p>{contestant.age}, {contestant.occupation}</p>
                <p className="tribe">Tribe: {contestant.tribe}</p>
                
                <div className="performance-stats">
                  <div className="stat-row">
                    <span>Points Earned:</span>
                    <span className="points-earned">{getContestantPoints(contestant.id)}</span>
                  </div>
                  <div className="stat-row">
                    <span>Reward Wins:</span>
                    <span>{contestant.stats.rewardWins}</span>
                  </div>
                  <div className="stat-row">
                    <span>Immunity Wins:</span>
                    <span>{contestant.stats.immunityWins}</span>
                  </div>
                  <div className="stat-row">
                    <span>Idols Found:</span>
                    <span>{contestant.stats.idolsFound}</span>
                  </div>
                  <div className="stat-row">
                    <span>Advantages:</span>
                    <span>{contestant.stats.advantagesGained}</span>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
      
      {rankedContestants.length > 0 && (
        <div className="team-summary">
          <h3>Ranking Statistics</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Total Reward Wins:</span>
              <span className="summary-value">
                {rankedContestants.reduce((sum, c) => sum + c.stats.rewardWins, 0)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Immunity Wins:</span>
              <span className="summary-value">
                {rankedContestants.reduce((sum, c) => sum + c.stats.immunityWins, 0)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Active Contestants:</span>
              <span className="summary-value">
                {rankedContestants.filter(c => c.status === 'active').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Top 5 Active:</span>
              <span className="summary-value">
                {rankedContestants.filter((c, i) => c.status === 'active' && currentUser.draftRankings[c.id] <= 5).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTeam;