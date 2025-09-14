import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>
  onToggleMode: () => void
  onPasswordReset: (email: string) => Promise<void>
  loading: boolean
  error: string | null
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onToggleMode,
  onPasswordReset,
  loading,
  error
}) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleToggleMode = () => {
    navigate('/register')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    
    if (!email || !password) {
      setLocalError('Email and password are required')
      return
    }

    try {
      await onLogin(email, password, rememberMe)
    } catch (err) {
      // Error handling is managed by the parent component
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    
    if (!email) {
      setLocalError('Please enter your email address')
      return
    }

    try {
      await onPasswordReset(email)
      setResetEmailSent(true)
    } catch (err) {
      // Error handling is managed by the parent component
    }
  }

  const displayError = localError || error

  if (showForgotPassword) {
    return (
      <div className="auth-container">
        <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
          Reset Password
        </h2>
        
        {resetEmailSent ? (
          <div>
            <div className="success" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
              Password reset instructions have been sent to your email address.
            </div>
            <button 
              onClick={() => {
                setShowForgotPassword(false)
                setResetEmailSent(false)
              }}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset} className="auth-form">
            <div className="form-group">
              <label htmlFor="reset-email" className="form-label">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email address"
                disabled={loading}
                required
                autoComplete="email"
              />
            </div>

            {displayError && <div className="error">{displayError}</div>}

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !email}
            >
              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Instructions'
              )}
            </button>

            <div 
              className="toggle-link" 
              onClick={() => setShowForgotPassword(false)}
              style={{ cursor: 'pointer', textAlign: 'center', marginTop: '16px', color: '#0066cc', textDecoration: 'underline' }}
            >
              Back to Sign In
            </div>
          </form>
        )}
      </div>
    )
  }

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
        Welcome Back
      </h2>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email address"
            disabled={loading}
            required
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
            disabled={loading}
            required
            autoComplete="current-password"
          />
        </div>

        <div className="form-group" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
            />
            <label htmlFor="rememberMe" className="form-label" style={{ fontSize: '14px' }}>
              Remember me
            </label>
          </div>
          
          <button 
            type="button"
            onClick={() => setShowForgotPassword(true)}
            style={{ background: 'none', border: 'none', color: '#0066cc', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px' }}
            disabled={loading}
          >
            Forgot password?
          </button>
        </div>

        {displayError && <div className="error">{displayError}</div>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !email || !password}
        >
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div 
        className="toggle-link" 
        onClick={handleToggleMode}
        style={{ cursor: 'pointer', textAlign: 'center', marginTop: '16px', color: '#0066cc', textDecoration: 'underline' }}
      >
        Don't have an account? Create one
      </div>
    </div>
  )
}