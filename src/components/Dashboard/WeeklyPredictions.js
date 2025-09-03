import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { contestants, gameState } from '../../data/contestants';

const WeeklyPredictions = () => {
  const { currentUser, updateUser } = useAuth();
  const [voteAllocations, setVoteAllocations] = useState(
    currentUser.votePredictions?.[gameState.currentEpisode] || {}
  );
  const [winnerPick, setWinnerPick] = useState(
    currentUser.winnerPrediction?.contestantId || null
  );

  const activeContestants = contestants.filter(c => c.status === 'active');
  const totalPoints = Object.values(voteAllocations).reduce((sum, points) => sum + (points || 0), 0);
  const maxPoints = 10;

  const handleVoteAllocation = (contestantId, points) => {
    const newAllocations = {
      ...voteAllocations,
      [contestantId]: parseInt(points) || 0
    };
    
    setVoteAllocations(newAllocations);
    
    // Update user's vote predictions
    const newVotePredictions = {
      ...currentUser.votePredictions,
      [gameState.currentEpisode]: newAllocations
    };
    
    updateUser({ votePredictions: newVotePredictions });
  };

  const handleWinnerPick = (contestantId) => {
    setWinnerPick(contestantId);
    
    const newWinnerPrediction = {
      contestantId: contestantId,
      episodes: [...(currentUser.winnerPrediction?.episodes || []), gameState.currentEpisode]
    };
    
    updateUser({ winnerPrediction: newWinnerPrediction });
  };

  return (
    <div className="weekly-predictions">
      <div className="predictions-header">
        <h2>Weekly Predictions - Episode {gameState.currentEpisode}</h2>
        <p>Allocate points to predict who will be eliminated and pick your season winner</p>
      </div>

      <div className="predictions-content">
        <div className="vote-predictions">
          <h3>Elimination Predictions</h3>
          <p>Allocate up to 10 points across contestants you think might be eliminated this episode.</p>
          <div className="points-counter">
            <span className={`counter ${totalPoints > maxPoints ? 'over-limit' : ''}`}>
              {totalPoints} / {maxPoints} points allocated
            </span>
          </div>
          
          <div className="contestants-vote-list">
            {activeContestants.map(contestant => (
              <div key={contestant.id} className="vote-contestant-row">
                <div className="contestant-info">
                  <img src={contestant.profileImage} alt={contestant.name} />
                  <div>
                    <span className="name">{contestant.name}</span>
                    <span className="tribe">{contestant.tribe}</span>
                  </div>
                </div>
                
                <div className="vote-allocation">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={voteAllocations[contestant.id] || 0}
                    onChange={(e) => handleVoteAllocation(contestant.id, e.target.value)}
                    className="points-input"
                  />
                  <span>points</span>
                </div>
              </div>
            ))}
          </div>
          
          {totalPoints > maxPoints && (
            <div className="error-message">
              You've allocated too many points! Maximum is {maxPoints}.
            </div>
          )}
        </div>

        <div className="winner-prediction">
          <h3>Season Winner Prediction</h3>
          <p>Who do you think will win the entire season? You can change this each episode.</p>
          
          <div className="winner-grid">
            {activeContestants.map(contestant => (
              <div 
                key={contestant.id}
                className={`winner-option ${winnerPick === contestant.id ? 'selected' : ''}`}
                onClick={() => handleWinnerPick(contestant.id)}
              >
                <img src={contestant.profileImage} alt={contestant.name} />
                <span>{contestant.name}</span>
                {winnerPick === contestant.id && <div className="winner-checkmark">👑</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyPredictions;