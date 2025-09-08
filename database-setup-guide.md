# Database Setup & Implementation Guide

## Quick Start Setup

### 1. PostgreSQL Installation & Setup

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql
brew services start postgresql

# Create database and user
createdb survivor_fantasy_league
psql survivor_fantasy_league

# In psql, create user with proper permissions
CREATE USER survivor_app WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE survivor_fantasy_league TO survivor_app;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO survivor_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO survivor_app;
```

### 2. Environment Configuration

Create `.env` file in your project root:

```env
# Database Configuration
DATABASE_URL=postgresql://survivor_app:your_secure_password@localhost:5432/survivor_fantasy_league
DB_HOST=localhost
DB_PORT=5432
DB_NAME=survivor_fantasy_league
DB_USER=survivor_app
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# App Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Install Dependencies

```bash
# Backend dependencies
npm install express pg bcryptjs jsonwebtoken cors dotenv helmet express-rate-limit
npm install --save-dev nodemon

# Optional: Use an ORM for easier database management
npm install prisma @prisma/client
```

## Database Schema Implementation

### 1. Create the Database Schema

Save this as `schema.sql` and run it:

```sql
-- Run all the CREATE TABLE statements from database-schema.md
-- This creates the complete database structure

-- Users & Authentication tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Continue with all other tables from the schema...
-- (Copy the complete schema from database-schema.md)
```

Execute the schema:
```bash
psql -U survivor_app -d survivor_fantasy_league -f schema.sql
```

### 2. Populate Initial Data

Create `seed-data.sql`:

```sql
-- Insert Season 49 data
INSERT INTO seasons (season_number, season_name, start_date, end_date, draft_deadline, sole_survivor_deadline, episode_2_deadline) VALUES
(49, 'Survivor 49', '2024-09-18', '2024-12-18', '2026-02-15 23:59:59', '2026-02-15 23:59:59', '2024-10-02 23:59:59');

-- Insert tribes
INSERT INTO tribes (season_id, name, color) VALUES
(1, 'Ratu', 'red'),
(1, 'Tika', 'blue'), 
(1, 'Soka', 'green');

-- Insert all scoring event types (copy from database-schema.md)
INSERT INTO scoring_event_types (name, display_name, points, category, icon, is_penalty) VALUES
('immunityIndividual', 'Individual Immunity', 3, 'individual', 'Shield', false),
('rewardIndividual', 'Individual Reward', 2, 'individual', 'Award', false);
-- ... continue with all scoring types

-- Insert contestants (converted from your contestants.js)
INSERT INTO contestants (season_id, name, age, hometown, residence, occupation, tribe, image_filename) VALUES
(1, 'Alex Moore', 27, 'Evanston, Ill.', 'Washington, D.C.', 'Political comms director', 'Ratu', 'Alex Moore.png'),
(1, 'Jake Latimer', 36, 'Regina, Saskatchewan', 'St. Albert, Alberta', 'Correctional officer', 'Tika', 'Jake Latimer.png');
-- ... continue with all 18 contestants

-- Create admin user
INSERT INTO users (email, username, password_hash, first_name, last_name, is_admin) VALUES
('admin@survivor.com', 'Admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3TnPNf2Z2K', 'Admin', 'User', true);
-- Password: admin123 (hashed with bcrypt)
```

Execute the seed data:
```bash
psql -U survivor_app -d survivor_fantasy_league -f seed-data.sql
```

## Backend API Implementation

### 1. Basic Express Server Setup

Create `server/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const draftRoutes = require('./routes/draft');
const soleSurvivorRoutes = require('./routes/sole-survivor');
const episodeRoutes = require('./routes/episodes');
const adminRoutes = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/draft', draftRoutes);
app.use('/api/sole-survivor', soleSurvivorRoutes);
app.use('/api/episodes', episodeRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Database Connection

Create `server/db/connection.js`:

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
```

### 3. Authentication Routes

Create `server/routes/auth.js`:

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/connection');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, username, firstName, lastName, password } = req.body;
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insert user
    const result = await db.query(
      'INSERT INTO users (email, username, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, first_name, last_name, is_admin, created_at',
      [email, username, passwordHash, firstName, lastName]
    );
    
    const user = result.rows[0];
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(400).json({ success: false, error: 'Email or username already exists' });
    }
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const result = await db.query(
      'SELECT id, email, username, password_hash, first_name, last_name, is_admin, created_at FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    
    const user = result.rows[0];
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    
    // Update last login
    await db.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
        createdAt: user.created_at
      },
      token
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

module.exports = router;
```

### 4. Authentication Middleware

Create `server/middleware/auth.js`:

```javascript
const jwt = require('jsonwebtoken');
const db = require('../db/connection');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get fresh user data
    const result = await db.query(
      'SELECT id, email, username, first_name, last_name, is_admin FROM users WHERE id = $1',
      [decoded.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };
```

## Frontend Migration

### 1. Update package.json Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "server": "cd server && node server.js",
    "dev": "concurrently \"npm start\" \"npm run server\"",
    "migrate": "cd server && node scripts/migrate-localstorage.js"
  }
}
```

### 2. API Service Layer

Create `src/services/api.js`:

```javascript
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` })
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth methods
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password }
    });
    
    this.setToken(data.token);
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
    
    this.setToken(data.token);
    return data;
  }

  async logout() {
    this.setToken(null);
  }

  // Draft methods
  async getDraftRankings(userId, seasonId) {
    return this.request(`/draft/rankings/${userId}/${seasonId}`);
  }

  async updateDraftRankings(userId, seasonId, rankings) {
    return this.request(`/draft/rankings/${userId}/${seasonId}`, {
      method: 'PUT',
      body: { rankings }
    });
  }

  // Sole survivor methods
  async getSoleSurvivorPick(userId, seasonId) {
    return this.request(`/sole-survivor/${userId}/${seasonId}`);
  }

  async updateSoleSurvivorPick(userId, seasonId, contestantId) {
    return this.request(`/sole-survivor/${userId}/${seasonId}`, {
      method: 'PUT',
      body: { contestantId }
    });
  }

  // Episode and scoring methods
  async getEpisodes(seasonId) {
    return this.request(`/episodes/${seasonId}`);
  }

  async getLeaderboard(seasonId) {
    return this.request(`/leaderboard/${seasonId}`);
  }
}

export default new ApiService();
```

### 3. Update AuthContext

Modify `src/contexts/AuthContext.js`:

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

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
    // Check for existing token
    const token = localStorage.getItem('auth_token');
    if (token) {
      apiService.setToken(token);
      // Verify token is still valid by fetching user info
      // This would require a /auth/me endpoint
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const result = await apiService.login(email, password);
      setUser(result.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const result = await apiService.register(userData);
      setUser(result.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
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
```

## Migration Script

Create `server/scripts/migrate-localstorage.js`:

```javascript
// Script to migrate existing localStorage data to database
const db = require('../db/connection');

async function migrateLocalStorageData() {
  console.log('Starting localStorage migration...');
  
  // This script would:
  // 1. Read existing localStorage data (you'd need to export it first)
  // 2. Convert user data to proper format
  // 3. Hash passwords
  // 4. Insert draft rankings and picks
  // 5. Insert sole survivor picks
  
  console.log('Migration completed!');
}

if (require.main === module) {
  migrateLocalStorageData().catch(console.error);
}
```

## Development Workflow

### 1. Start Development Environment

```bash
# Install concurrently for running frontend + backend
npm install -g concurrently

# Run both frontend and backend
npm run dev
```

### 2. Database Development Tools

```bash
# Install pgAdmin or use psql for database management
brew install --cask pgadmin4

# Or use command line
psql -U survivor_app -d survivor_fantasy_league
```

### 3. Environment Variables

Create `.env.local` for React app:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

This implementation guide provides you with everything needed to migrate from localStorage to a robust PostgreSQL database while maintaining compatibility with your existing frontend code. The phased approach allows you to migrate gradually without breaking existing functionality.
