import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { MainApp } from './components/MainApp'
import { useAuth } from './useAuth'
import { testConnection } from './supabase'
import './utils/admin' // Import admin utilities for development
import './utils/databaseSetup' // Import database setup utilities

const App: React.FC = () => {
  const [connectionTested, setConnectionTested] = useState(false)
  
  const { 
    user, 
    loading, 
    error, 
    signIn, 
    signUp, 
    signOut, 
    sendPasswordReset,
    updateProfile,
    updatePassword
  } = useAuth()

  // Test connection on app load
  useEffect(() => {
    const runConnectionTest = async () => {
      await testConnection()
      setConnectionTested(true)
    }
    
    if (!connectionTested) {
      runConnectionTest()
    }
  }, [connectionTested])


  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    await signIn(email, password, rememberMe)
  }

  const handleRegister = async (email: string, password: string, userData?: { name: string }) => {
    await signUp(email, password, userData)
  }

  const handlePasswordReset = async (email: string) => {
    await sendPasswordReset(email)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Show loading while checking authentication
  if (loading && !user) {
    return (
      <div className="app">
        <div className="auth-container">
          <div className="loading" style={{ justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              !user ? (
                <LoginForm
                  onLogin={handleLogin}
                  onToggleMode={() => {}}
                  onPasswordReset={handlePasswordReset}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/homepage" replace />
              )
            } 
          />
          <Route 
            path="/register" 
            element={
              !user ? (
                <RegisterForm
                  onRegister={handleRegister}
                  onToggleMode={() => {}}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/homepage" replace />
              )
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/homepage" 
            element={
              user ? (
                <MainApp 
                  user={user}
                  onSignOut={handleSignOut}
                  onUpdateProfile={updateProfile}
                  onUpdatePassword={updatePassword}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <MainApp 
                  user={user}
                  onSignOut={handleSignOut}
                  onUpdateProfile={updateProfile}
                  onUpdatePassword={updatePassword}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/drafts" 
            element={
              user ? (
                <MainApp 
                  user={user}
                  onSignOut={handleSignOut}
                  onUpdateProfile={updateProfile}
                  onUpdatePassword={updatePassword}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/team" 
            element={
              user ? (
                <MainApp 
                  user={user}
                  onSignOut={handleSignOut}
                  onUpdateProfile={updateProfile}
                  onUpdatePassword={updatePassword}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/leaderboard" 
            element={
              user ? (
                <MainApp 
                  user={user}
                  onSignOut={handleSignOut}
                  onUpdateProfile={updateProfile}
                  onUpdatePassword={updatePassword}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route 
            path="/predictions" 
            element={
              user ? (
                <MainApp 
                  user={user}
                  onSignOut={handleSignOut}
                  onUpdateProfile={updateProfile}
                  onUpdatePassword={updatePassword}
                  loading={loading}
                  error={error}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Default redirects */}
          <Route 
            path="/" 
            element={
              <Navigate to={user ? "/homepage" : "/login"} replace />
            } 
          />
          <Route 
            path="*" 
            element={
              <Navigate to={user ? "/homepage" : "/login"} replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App