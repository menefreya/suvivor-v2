import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface RegisterFormProps {
  onRegister: (email: string, password: string, userData?: { name: string }) => Promise<void>
  onToggleMode: () => void
  loading: boolean
  error: string | null
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onRegister,
  onToggleMode,
  loading,
  error
}) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleToggleMode = () => {
    navigate('/login')
  }

  // Email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Password strength validation
  const isValidPassword = (password: string): boolean => {
    // At least 8 characters, with at least one letter and one number
    const minLength = password.length >= 8
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    return minLength && hasLetter && hasNumber
  }

  const getPasswordStrengthMessage = (password: string): string => {
    if (password.length === 0) return ''
    if (password.length < 8) return 'Password must be at least 8 characters'
    if (!/[a-zA-Z]/.test(password)) return 'Password must contain at least one letter'
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    setSuccessMessage(null)
    
    // Validate all required fields
    if (!email || !name || !password || !confirmPassword) {
      setLocalError('All fields are required')
      return
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setLocalError('Please enter a valid email address')
      return
    }

    // Validate name
    if (name.trim().length < 2) {
      setLocalError('Name must be at least 2 characters long')
      return
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      setLocalError('Password must be at least 8 characters with at least one letter and one number')
      return
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      setLocalError('You must accept the terms and conditions')
      return
    }

    try {
      await onRegister(email, password, { name: name.trim() })
      setSuccessMessage('Account created successfully! Please check your email for verification.')
    } catch (err) {
      // Error handling is managed by the parent component
    }
  }

  const displayError = localError || error
  const passwordStrengthMessage = getPasswordStrengthMessage(password)

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#333' }}>
        Create Your Account
      </h2>
      
      {successMessage && (
        <div className="success" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb', borderRadius: '4px' }}>
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address *
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
          <label htmlFor="name" className="form-label">
            Full Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input"
            placeholder="Enter your full name"
            disabled={loading}
            required
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password *
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
            autoComplete="new-password"
          />
          {passwordStrengthMessage && (
            <div className="password-hint" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {passwordStrengthMessage}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            placeholder="Confirm your password"
            disabled={loading}
            required
            autoComplete="new-password"
          />
        </div>

        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <input
            id="acceptTerms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            disabled={loading}
            required
            style={{ marginTop: '3px' }}
          />
          <label htmlFor="acceptTerms" className="form-label" style={{ fontSize: '14px', lineHeight: '1.4' }}>
            I accept the Terms of Service and Privacy Policy *
          </label>
        </div>

        {displayError && <div className="error">{displayError}</div>}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading || !email || !name || !password || !confirmPassword || !acceptTerms}
        >
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="toggle-link" onClick={handleToggleMode} style={{ cursor: 'pointer', textAlign: 'center', marginTop: '16px', color: '#0066cc', textDecoration: 'underline' }}>
        Already have an account? Sign in
      </div>
    </div>
  )
}