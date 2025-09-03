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
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('survivorUsers');
    const savedCurrentUser = localStorage.getItem('survivorCurrentUser');
    
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
    }
    
    setLoading(false);
  }, []);

  // Save to localStorage when users or currentUser changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('survivorUsers', JSON.stringify(users));
    }
  }, [users, loading]);

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        localStorage.setItem('survivorCurrentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('survivorCurrentUser');
      }
    }
  }, [currentUser, loading]);

  const isUsernameUnique = (username) => {
    return !users.some(user => user.username.toLowerCase() === username.toLowerCase());
  };

  const register = (username) => {
    if (!username || username.trim().length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }

    if (!isUsernameUnique(username.trim())) {
      throw new Error('Username already exists');
    }

    const newUser = {
      id: Date.now(),
      username: username.trim(),
      createdAt: new Date().toISOString(),
      draftRankings: {}, // { contestantId: rank } - rank 1 is highest
      votePredictions: {},
      winnerPrediction: {
        contestantId: null,
        episodes: []
      },
      scores: {
        survivorPoints: 0,
        votePoints: 0,
        bonusPoints: 0,
        total: 0
      }
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const login = (username) => {
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      throw new Error('Username not found');
    }
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (updates) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    
    setUsers(prev => 
      prev.map(user => 
        user.id === currentUser.id ? updatedUser : user
      )
    );
  };

  const value = {
    currentUser,
    users,
    loading,
    register,
    login,
    logout,
    updateUser,
    isUsernameUnique
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};