import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useScoring } from '../../contexts/ScoringContext';

const Leaderboard = () => {
  const { currentUser } = useAuth();
  const { getLeaderboard, getCurrentUserRank, getUserPredictionAccuracy } = useScoring();
  
  const sortedUsers = getLeaderboard();
  const currentUserRank = getCurrentUserRank();
  const predictionAccuracy = getUserPredictionAccuracy();

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboard</h2>
        <p>See how you stack up against other players</p>
        {currentUserRank && (
          <div className="user-stats">
            <span className="stat">Your Rank: #{currentUserRank}</span>
            <span className="stat">Prediction Accuracy: {predictionAccuracy.accuracy}%</span>
            <span className="stat">Correct Predictions: {predictionAccuracy.correct}/{predictionAccuracy.total}</span>
          </div>
        )}
      </div>

      <div className="leaderboard-table">
        <div className="table-header">
          <div className="rank-col">Rank</div>
          <div className="player-col">Player</div>
          <div className="survivor-col">Survivor Points</div>
          <div className="vote-col">Vote Points</div>
          <div className="bonus-col">Bonus Points</div>
          <div className="total-col">Total</div>
        </div>
        
        {sortedUsers.map((user, index) => (
          <div 
            key={user.id} 
            className={`table-row ${user.id === currentUser.id ? 'current-user' : ''}`}
          >
            <div className="rank-col">
              <span className="rank">
                {index + 1}
                {index === 0 && '🥇'}
                {index === 1 && '🥈'}
                {index === 2 && '🥉'}
              </span>
            </div>
            <div className="player-col">
              <span className="username">{user.username}</span>
              {user.id === currentUser.id && <span className="you-badge">You</span>}
            </div>
            <div className="survivor-col">{user.scores?.survivorPoints || 0}</div>
            <div className="vote-col">{user.scores?.votePoints || 0}</div>
            <div className="bonus-col">{user.scores?.bonusPoints || 0}</div>
            <div className="total-col">
              <strong>{user.scores?.total || 0}</strong>
            </div>
          </div>
        ))}
      </div>

      {sortedUsers.length === 0 && (
        <div className="no-players">
          <p>No other players have joined yet!</p>
          <p>Share the app with your friends to start competing.</p>
        </div>
      )}

      <div className="scoring-legend">
        <h3>Scoring System</h3>
        <div className="legend-grid">
          <div className="legend-section">
            <h4>Survivor Points</h4>
            <ul>
              <li>Reward Challenge Win: 1 pt</li>
              <li>Immunity Challenge Win: 2 pts</li>
              <li>Find Idol/Clue: 1 pt</li>
              <li>Make Fire: 1 pt</li>
              <li>Read Tree Mail: 1 pt</li>
            </ul>
          </div>
          <div className="legend-section">
            <h4>Vote Points</h4>
            <ul>
              <li>Correctly predict elimination: 0-10 pts</li>
              <li>Points based on confidence allocation</li>
            </ul>
          </div>
          <div className="legend-section">
            <h4>Bonus Points</h4>
            <ul>
              <li>Pick season winner: Up to 13 pts</li>
              <li>Elimination streak bonus: 1 pt per episode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;