import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { User } from '@supabase/supabase-js'
import { Navigation } from './Navigation'
import { Draft } from './Draft'
import { Welcome } from '../Welcome'
import { ProfileManager } from '../ProfileManager'

interface MainAppProps {
  user: User
  onSignOut: () => Promise<void>
  onUpdateProfile: (updates: { name?: string; email?: string }) => Promise<void>
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  loading: boolean
  error: string | null
}

export const MainApp: React.FC<MainAppProps> = ({
  user,
  onSignOut,
  onUpdateProfile,
  onUpdatePassword,
  loading,
  error
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [showProfile, setShowProfile] = useState(false)
  
  // Get current page from URL path
  const currentPage = location.pathname.substring(1) || 'dashboard'

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <Welcome
            user={user}
            onSignOut={onSignOut}
            onUpdateProfile={onUpdateProfile}
            onUpdatePassword={onUpdatePassword}
            loading={loading}
            error={error}
          />
        )
      case 'drafts':
        return <Draft userId={user.id} />
      case 'team':
        return (
          <div className="page-content">
            <h1>My Team</h1>
            <p>Team management page - Coming soon!</p>
          </div>
        )
      case 'leaderboard':
        return (
          <div className="page-content">
            <h1>Leaderboard</h1>
            <p>League standings - Coming soon!</p>
          </div>
        )
      case 'predictions':
        return (
          <div className="page-content">
            <h1>Weekly Predictions</h1>
            <p>Make your weekly predictions - Coming soon!</p>
          </div>
        )
      default:
        return (
          <Welcome
            user={user}
            onSignOut={onSignOut}
            onUpdateProfile={onUpdateProfile}
            onUpdatePassword={onUpdatePassword}
            loading={loading}
            error={error}
          />
        )
    }
  }

  return (
    <div className="main-app">
      <Navigation
        currentPage={currentPage}
        onPageChange={(page) => navigate(`/${page}`)}
        user={user}
      />
      
      <div className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Survivor Fantasy League</h1>
          </div>
          <div className="user-menu">
            <button
              onClick={() => setShowProfile(true)}
              className="username-link"
            >
              {user?.user_metadata?.name || user?.email || 'User'}
            </button>
            <button 
              onClick={onSignOut}
              className="btn btn-outline logout-btn"
              disabled={loading}
            >
              {loading ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      <main className="main-content">
        {renderCurrentPage()}
      </main>

      {showProfile && (
        <ProfileManager
          user={user}
          onUpdateProfile={onUpdateProfile}
          onUpdatePassword={onUpdatePassword}
          onClose={() => setShowProfile(false)}
          loading={loading}
          error={error}
        />
      )}
    </div>
  )
}
