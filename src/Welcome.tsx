import React, { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { ProfileManager } from './ProfileManager'

interface WelcomeProps {
  user: User
  onSignOut: () => Promise<void>
  onUpdateProfile: (updates: { name?: string; email?: string }) => Promise<void>
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  loading: boolean
  error: string | null
}

export const Welcome: React.FC<WelcomeProps> = ({
  user,
  onSignOut,
  onUpdateProfile,
  onUpdatePassword,
  loading,
  error
}) => {
  const [showProfile, setShowProfile] = useState(false)

  const handleSignOut = async () => {
    try {
      await onSignOut()
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  return (
    <>
      <div className="welcome-container">
        <div className="welcome-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 className="welcome-title" style={{ margin: 0 }}>
            Hello, {user.user_metadata?.name || user.email}!
          </h1>
          <div className="user-menu" style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowProfile(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0066cc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Account Settings
            </button>
            <button 
              onClick={handleSignOut}
              className="btn btn-secondary"
              disabled={loading}
              style={{ padding: '8px 16px', fontSize: '14px' }}
            >
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  Signing out...
                </div>
              ) : (
                'Sign Out'
              )}
            </button>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px', color: '#666' }}>
          Welcome to the Survivor Fantasy League application.
        </div>
        
        <div style={{ marginBottom: '24px', fontSize: '14px', color: '#888' }}>
          <div>Email: {user.email}</div>
          <div>Member Since: {new Date(user.created_at).toLocaleDateString()}</div>
        </div>

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#d4edda', 
          border: '1px solid #c3e6cb', 
          borderRadius: '4px',
          marginBottom: '24px',
          color: '#155724'
        }}>
          🎉 Database connection successful! Authentication is working properly.
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd', 
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#333' }}>What's Next?</h3>
          <ul style={{ marginBottom: 0, color: '#666', lineHeight: '1.6' }}>
            <li>Join or create a fantasy league</li>
            <li>Wait for Episode 2 to rank contestants for the draft</li>
            <li>Select your sole survivor pick</li>
            <li>Make weekly predictions and track your progress</li>
          </ul>
        </div>
      </div>

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
    </>
  )
}