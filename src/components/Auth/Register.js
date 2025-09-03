import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const Register = ({ onToggleMode }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, isUsernameUnique } = useAuth();

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    
    // Real-time validation
    if (value.length >= 3 && !isUsernameUnique(value)) {
      setError('Username already exists');
    } else if (value.length > 0 && value.length < 3) {
      setError('Username must be at least 3 characters long');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (!isUsernameUnique(username)) {
      setError('Username already exists');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register(username);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Join the Game!</h2>
        <p>Create your Survivor Fantasy League account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Choose a Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Enter a unique username"
              disabled={loading}
            />
            <small className="field-help">
              Username must be at least 3 characters long and unique
            </small>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {username.length >= 3 && !error && (
            <div className="success-message">Username is available!</div>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading || error || username.length < 3}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-toggle">
          <p>
            Already have an account? {' '}
            <button 
              type="button" 
              className="link-button"
              onClick={onToggleMode}
            >
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;