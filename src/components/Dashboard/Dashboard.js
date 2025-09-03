import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import RankingList from './RankingList';
import MyTeam from './MyTeam';
import Leaderboard from './Leaderboard';
import WeeklyPredictions from './WeeklyPredictions';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('draft');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'draft':
        return <RankingList />;
      case 'team':
        return <MyTeam />;
      case 'predictions':
        return <WeeklyPredictions />;
      case 'leaderboard':
        return <Leaderboard />;
      default:
        return <RankingList />;
    }
  };

  return (
    <div className="dashboard">
      <Header />
      
      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button 
            className={`nav-button ${activeTab === 'draft' ? 'active' : ''}`}
            onClick={() => setActiveTab('draft')}
          >
            Rank Contestants
          </button>
          <button 
            className={`nav-button ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            My Rankings
          </button>
          <button 
            className={`nav-button ${activeTab === 'predictions' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictions')}
          >
            Predictions
          </button>
          <button 
            className={`nav-button ${activeTab === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboard')}
          >
            Leaderboard
          </button>
        </nav>

        <main className="dashboard-main">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;