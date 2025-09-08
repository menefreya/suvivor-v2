import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../components/Auth/Login';
import Dashboard from '../components/Dashboard/Dashboard';
import Contestants from '../components/Contestants/Contestants';
import Draft from '../components/Draft/Draft';
import MyTeam from '../components/MyTeam/MyTeam';
import Leaderboard from '../components/Leaderboard/Leaderboard';
import Episodes from '../components/Episodes/Episodes';
import Players from '../components/Players/Players';
import Admin from '../components/Admin/Admin';
import Navigation from '../components/Navigation/Navigation';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-survivor-orange"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-survivor-orange"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" /> : <Login />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/contestants" 
        element={
          <ProtectedRoute>
            <Contestants />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/draft" 
        element={
          <ProtectedRoute>
            <Draft />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/my-team" 
        element={
          <ProtectedRoute>
            <MyTeam />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/leaderboard" 
        element={
          <ProtectedRoute>
            <Leaderboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/episodes" 
        element={
          <ProtectedRoute>
            <Episodes />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/players" 
        element={
          <ProtectedRoute>
            <Players />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute adminOnly={true}>
            <Admin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to={user ? "/dashboard" : "/login"} />} 
      />
    </Routes>
  );
};

export default AppRoutes;
