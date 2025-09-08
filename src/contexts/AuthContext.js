import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const savedUser = localStorage.getItem('survivor_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('survivor_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Simulate API call - replace with actual authentication
      if (email === 'admin@survivor.com' && password === 'admin123') {
        const userData = {
          id: 1,
          email: email,
          username: 'Admin',
          firstName: 'Admin',
          lastName: 'User',
          isAdmin: true,
          createdAt: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('survivor_user', JSON.stringify(userData));
        return { success: true };
      } else if (email === 'player@survivor.com' && password === 'player123') {
        const userData = {
          id: 2,
          email: email,
          username: 'Player',
          firstName: 'Test',
          lastName: 'Player',
          isAdmin: false,
          createdAt: new Date().toISOString()
        };
        
        setUser(userData);
        localStorage.setItem('survivor_user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const register = async (userData) => {
    try {
      // Simulate API call - replace with actual registration
      const newUser = {
        id: Date.now(),
        email: userData.email,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isAdmin: false,
        createdAt: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('survivor_user', JSON.stringify(newUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('survivor_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
