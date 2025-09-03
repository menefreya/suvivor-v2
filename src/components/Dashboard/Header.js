import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { gameState } from '../../data/contestants';

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">🏝️ Survivor Fantasy League</h1>
          <p className="season-info">{gameState.season}</p>
          <p className="episode-info">Episode {gameState.currentEpisode} of {gameState.totalEpisodes}</p>
        </div>
        
        <div className="header-right">
          <div className="user-info">
            <span className="welcome-text">Welcome, {currentUser.username}!</span>
            <div className="score-summary">
              <span className="score-item">
                Total: <strong>{currentUser.scores?.total || 0}</strong>
              </span>
            </div>
          </div>
          <button 
            className="logout-button"
            onClick={logout}
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;