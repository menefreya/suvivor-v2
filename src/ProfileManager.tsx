import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface UserProfile {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

interface ProfileManagerProps {
  user: User
  onUpdateProfile: (updates: { name?: string; email?: string }) => Promise<void>
  onUpdatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  onClose: () => void
  loading: boolean
  error: string | null
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  user,
  onUpdateProfile,
  onUpdatePassword,
  onClose,
  loading,
  error
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  
  // Profile form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileChanged, setProfileChanged] = useState(false)
  
  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error)
        } else if (data) {
          setProfile(data)
          setName(data.name || '')
          setEmail(data.email || user.email || '')
        } else {
          // No profile found, use auth user data
          setName(user.user_metadata?.name || '')
          setEmail(user.email || '')
        }
      } catch (err) {
        console.error('Profile loading error:', err)
      } finally {
        setProfileLoading(false)
      }
    }

    loadProfile()
  }, [user])

  // Track profile changes
  useEffect(() => {
    if (profile) {
      const hasChanges = name !== (profile.name || '') || email !== (profile.email || user.email || '')
      setProfileChanged(hasChanges)
    }
  }, [name, email, profile, user.email])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password)
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)

    // Validate inputs
    if (!name.trim()) {
      setLocalError('Name is required')
      return
    }

    if (name.trim().length < 2) {
      setLocalError('Name must be at least 2 characters long')
      return
    }

    if (!email || !validateEmail(email)) {
      setLocalError('Please enter a valid email address')
      return
    }

    try {
      const updates: { name?: string; email?: string } = {}
      
      if (name.trim() !== (profile?.name || '')) {
        updates.name = name.trim()
      }
      
      if (email !== (profile?.email || user.email || '')) {
        updates.email = email
      }

      if (Object.keys(updates).length > 0) {
        await onUpdateProfile(updates)
        setSuccessMessage('Profile updated successfully!')
        
        // Refresh profile data
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setProfile(data)
        }
      }
    } catch (err) {
      // Error is handled by parent component
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)

    // Validate inputs
    if (!currentPassword) {
      setLocalError('Current password is required')
      return
    }

    if (!newPassword) {
      setLocalError('New password is required')
      return
    }

    if (!validatePassword(newPassword)) {
      setLocalError('New password must be at least 8 characters with at least one letter and one number')
      return
    }

    if (newPassword !== confirmPassword) {
      setLocalError('New passwords do not match')
      return
    }

    if (currentPassword === newPassword) {
      setLocalError('New password must be different from current password')
      return
    }

    try {
      await onUpdatePassword(currentPassword, newPassword)
      setSuccessMessage('Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      // Error is handled by parent component
    }
  }

  const displayError = localError || error

  if (profileLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading" style={{ justifyContent: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <span>Loading profile...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" style={{ backgroundColor: 'white', borderRadius: '8px', padding: '24px', maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Account Settings</h2>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="tab-nav" style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #ddd' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'profile' ? '#0066cc' : 'transparent',
              color: activeTab === 'profile' ? 'white' : '#666',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0'
            }}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              background: activeTab === 'password' ? '#0066cc' : 'transparent',
              color: activeTab === 'password' ? 'white' : '#666',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0'
            }}
          >
            Change Password
          </button>
        </div>

        {successMessage && (
          <div className="success" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
            {successMessage}
          </div>
        )}

        {displayError && (
          <div className="error" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '4px' }}>
            {displayError}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                placeholder="Enter your full name"
                disabled={loading}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email address"
                disabled={loading}
                required
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {email !== user.email && 'Changing your email will require verification'}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Member Since
              </label>
              <div style={{ padding: '8px', backgroundColor: '#f8f9fa', border: '1px solid #ddd', borderRadius: '4px', color: '#666' }}>
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !profileChanged}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: profileChanged ? '#0066cc' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: profileChanged ? 'pointer' : 'not-allowed',
                fontSize: '16px'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div className="spinner"></div>
                  Updating...
                </div>
              ) : (
                'Update Profile'
              )}
            </button>
          </form>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Current Password *
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your current password"
                disabled={loading}
                required
                autoComplete="current-password"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                New Password *
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your new password"
                disabled={loading}
                required
                autoComplete="new-password"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Must be at least 8 characters with at least one letter and one number
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                Confirm New Password *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
                placeholder="Confirm your new password"
                disabled={loading}
                required
                autoComplete="new-password"
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: (currentPassword && newPassword && confirmPassword) ? '#0066cc' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: (currentPassword && newPassword && confirmPassword) ? 'pointer' : 'not-allowed',
                fontSize: '16px'
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div className="spinner"></div>
                  Updating...
                </div>
              ) : (
                'Update Password'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}