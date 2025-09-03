import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ScoringProvider } from './contexts/ScoringContext';
import AuthWrapper from './components/Auth/AuthWrapper';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Survivor Fantasy League...</p>
      </div>
    );
  }

  return currentUser ? (
    <ScoringProvider>
      <Dashboard />
    </ScoringProvider>
  ) : <AuthWrapper />;
}

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;
