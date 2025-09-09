import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DraftProvider } from './contexts/DraftContext';
import { SoleSurvivorProvider } from './contexts/SoleSurvivorContext';
import { ContestantsProvider } from './contexts/ContestantsContext';
import AppRoutes from './components/AppRoutes';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <ContestantsProvider>
        <DraftProvider>
          <SoleSurvivorProvider>
            <Router>
              <div className="App">
                <AppRoutes />
              </div>
            </Router>
          </SoleSurvivorProvider>
        </DraftProvider>
      </ContestantsProvider>
    </AuthProvider>
  );
}

export default App;
