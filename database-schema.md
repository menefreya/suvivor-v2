# Survivor Fantasy League - Database Schema

## Overview

This database schema is designed to support your existing frontend application with the exact data structures and workflows currently implemented. The schema migrates from localStorage to a robust PostgreSQL database while maintaining compatibility with your current React contexts and components.

## Database Choice: PostgreSQL

**Why PostgreSQL:**
- Excellent JSON support for flexible scoring data
- Strong transaction support for score calculations  
- Performance optimized for leaderboard queries
- Robust constraint system for data integrity

---

## Core Tables

### 1. Users & Authentication

```sql
-- Users table matches your AuthContext user model
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

-- Session management for better security than localStorage
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Season & Episode Management

```sql
-- Seasons table (supports your admin season configuration)
CREATE TABLE seasons (
    id SERIAL PRIMARY KEY,
    season_number INTEGER UNIQUE NOT NULL,
    season_name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    draft_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    sole_survivor_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    episode_2_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Episodes table (matches your admin episode management)
CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    air_date DATE NOT NULL,
    is_finale BOOLEAN DEFAULT FALSE,
    is_scored BOOLEAN DEFAULT FALSE,
    scoring_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season_id, episode_number)
);

-- Tribes/Teams table (supports your team management)
CREATE TABLE tribes (
    id SERIAL PRIMARY KEY,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50), -- For UI display colors
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season_id, name)
);
```

### 3. Contestants

```sql
-- Contestants table (matches your contestants.js data structure exactly)
CREATE TABLE contestants (
    id SERIAL PRIMARY KEY,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    age INTEGER,
    hometown VARCHAR(200),
    residence VARCHAR(200),
    occupation VARCHAR(200),
    tribe VARCHAR(100), -- Current tribe name for easy access
    initial_tribe_id INTEGER REFERENCES tribes(id),
    current_tribe_id INTEGER REFERENCES tribes(id),
    is_eliminated BOOLEAN DEFAULT FALSE,
    elimination_episode_id INTEGER REFERENCES episodes(id),
    image_filename VARCHAR(200), -- Matches your "Alex Moore.png" format
    points INTEGER DEFAULT 0, -- Current total points
    episodes INTEGER DEFAULT 1, -- Episodes appeared in
    final_placement INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season_id, name)
);

-- Tribe assignment history (tracks swaps/merges)
CREATE TABLE contestant_tribe_history (
    id SERIAL PRIMARY KEY,
    contestant_id INTEGER REFERENCES contestants(id) ON DELETE CASCADE,
    tribe_id INTEGER REFERENCES tribes(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    assignment_type VARCHAR(50) NOT NULL, -- 'initial', 'swap', 'merge'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. Draft System

```sql
-- Draft rankings (matches your DraftContext ranking system)
CREATE TABLE draft_rankings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    contestant_id INTEGER REFERENCES contestants(id) ON DELETE CASCADE,
    rank_position INTEGER NOT NULL CHECK (rank_position >= 1 AND rank_position <= 18),
    submitted_at TIMESTAMP WITH TIME ZONE,
    is_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, season_id, contestant_id),
    UNIQUE(user_id, season_id, rank_position)
);

-- Draft picks (actual assigned contestants - top 2 from rankings)
CREATE TABLE draft_picks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    contestant_id INTEGER REFERENCES contestants(id) ON DELETE CASCADE,
    pick_number INTEGER NOT NULL CHECK (pick_number IN (1, 2)),
    assigned_from_rank INTEGER NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    replaced_at TIMESTAMP WITH TIME ZONE,
    replaced_by_pick_id INTEGER REFERENCES draft_picks(id)
);

-- Ensure only one active pick per slot per user/season
CREATE UNIQUE INDEX idx_active_draft_picks 
ON draft_picks(user_id, season_id, pick_number) 
WHERE is_active = TRUE;
```

### 5. Sole Survivor System

```sql
-- Sole survivor picks (matches your SoleSurvivorContext)
CREATE TABLE sole_survivor_picks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    contestant_id INTEGER REFERENCES contestants(id) ON DELETE CASCADE,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    episodes_held INTEGER DEFAULT 0,
    is_original_pick BOOLEAN DEFAULT FALSE, -- TRUE if picked after episode 2
    is_active BOOLEAN DEFAULT TRUE,
    replaced_at TIMESTAMP WITH TIME ZONE,
    replaced_by_pick_id INTEGER REFERENCES sole_survivor_picks(id)
);

-- Ensure only one active sole survivor pick per user/season
CREATE UNIQUE INDEX idx_active_sole_survivor 
ON sole_survivor_picks(user_id, season_id) 
WHERE is_active = TRUE;
```

### 6. Scoring System

```sql
-- Scoring event types (matches your admin scoring categories)
CREATE TABLE scoring_event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    points INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'individual', 'team', 'special'
    icon VARCHAR(50), -- For UI icons (Shield, Award, etc.)
    is_penalty BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    scope VARCHAR(20) DEFAULT 'contestant' -- 'contestant', 'tribe', 'global'
);

-- Episode scoring events (matches your admin scoring interface)
CREATE TABLE episode_scoring_events (
    id SERIAL PRIMARY KEY,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    contestant_id INTEGER REFERENCES contestants(id) ON DELETE CASCADE,
    scoring_event_type_id INTEGER REFERENCES scoring_event_types(id),
    points_awarded INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id INTEGER REFERENCES users(id)
);

-- Team/tribe scoring events (for bulk team challenge wins)
CREATE TABLE episode_tribe_events (
    id SERIAL PRIMARY KEY,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    tribe_id INTEGER REFERENCES tribes(id) ON DELETE CASCADE,
    scoring_event_type_id INTEGER REFERENCES scoring_event_types(id),
    points_awarded INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id INTEGER REFERENCES users(id),
    UNIQUE(episode_id, tribe_id, scoring_event_type_id)
);

-- User episode scores (calculated totals for performance)
CREATE TABLE user_episode_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    draft_points INTEGER DEFAULT 0,
    sole_survivor_points INTEGER DEFAULT 0,
    elimination_bonus_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, episode_id)
);

-- User season totals (for leaderboard performance)
CREATE TABLE user_season_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES seasons(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_rank INTEGER,
    episodes_scored INTEGER DEFAULT 0,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, season_id)
);
```

### 7. Admin & System Tables

```sql
-- User actions audit trail
CREATE TABLE user_actions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    details JSONB, -- Flexible JSON for action details
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Score calculation audit
CREATE TABLE score_calculations (
    id SERIAL PRIMARY KEY,
    episode_id INTEGER REFERENCES episodes(id) ON DELETE CASCADE,
    calculation_type VARCHAR(50) NOT NULL,
    users_affected INTEGER NOT NULL,
    calculation_time_ms INTEGER,
    triggered_by_user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System configuration (for admin settings)
CREATE TABLE system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    updated_by_user_id INTEGER REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Essential Indexes

```sql
-- User authentication indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Season/Episode queries
CREATE INDEX idx_episodes_season ON episodes(season_id, episode_number);
CREATE INDEX idx_contestants_season ON contestants(season_id);
CREATE INDEX idx_contestants_active ON contestants(season_id, is_eliminated);
CREATE INDEX idx_contestants_tribe ON contestants(season_id, tribe);

-- Draft system performance
CREATE INDEX idx_draft_rankings_user_season ON draft_rankings(user_id, season_id, rank_position);
CREATE INDEX idx_draft_picks_user_season ON draft_picks(user_id, season_id, is_active);

-- Scoring system performance (critical for leaderboards)
CREATE INDEX idx_episode_scoring_episode ON episode_scoring_events(episode_id);
CREATE INDEX idx_episode_scoring_contestant ON episode_scoring_events(contestant_id);
CREATE INDEX idx_user_episode_scores_season ON user_episode_scores(season_id, total_points DESC);
CREATE INDEX idx_user_season_scores_leaderboard ON user_season_scores(season_id, total_points DESC, current_rank);

-- Sole survivor queries
CREATE INDEX idx_sole_survivor_user_season ON sole_survivor_picks(user_id, season_id, is_active);
```

---

## Sample Data Population

```sql
-- Insert scoring event types (matches your frontend scoring categories)
INSERT INTO scoring_event_types (name, display_name, points, category, icon, is_penalty) VALUES
-- Individual scoring (matches your individualScoring array)
('immunityIndividual', 'Individual Immunity', 3, 'individual', 'Shield', false),
('rewardIndividual', 'Individual Reward', 2, 'individual', 'Award', false),
('findIdol', 'Found Idol', 3, 'individual', 'Eye', false),
('playIdol', 'Played Idol', 2, 'individual', 'Eye', false),
('makeFire', 'Made Fire', 1, 'individual', 'Plus', false),
('makeFood', 'Made Food', 1, 'individual', 'Plus', false),
('readTreeMail', 'Read Tree Mail', 1, 'individual', 'Plus', false),
('shotInDark', 'Shot in Dark', 1, 'individual', 'Plus', false),
('shotImmunity', 'Shot Immunity', 4, 'individual', 'Plus', false),
('soleSurvivor', 'Sole Survivor', 25, 'special', 'Award', false),
('final3', 'Made Final 3', 10, 'special', 'Users', false),
('eliminated', 'Eliminated', -5, 'individual', 'Minus', true),
('votedWithIdol', 'Voted w/ Idol', -3, 'individual', 'Minus', true),
-- Team scoring (matches your teamScoring array)
('immunityTeam', 'Team Immunity', 2, 'team', 'Shield', false),
('rewardTeam', 'Team Reward', 1, 'team', 'Award', false),
-- Weekly bonus
('soleSurvivorWeekly', 'Sole Survivor Weekly', 1, 'special', 'Crown', false);

-- Insert initial season data
INSERT INTO seasons (season_number, season_name, start_date, end_date, draft_deadline, sole_survivor_deadline, episode_2_deadline) VALUES
(49, 'Survivor 49', '2024-09-18', '2024-12-18', '2026-02-15 23:59:59', '2026-02-15 23:59:59', '2024-10-02 23:59:59');

-- Insert tribes (matches your current tribes)
INSERT INTO tribes (season_id, name, color) VALUES
(1, 'Ratu', 'red'),
(1, 'Tika', 'blue'), 
(1, 'Soka', 'green');
```

---

## Migration Strategy from localStorage

### Phase 1: Database Setup
1. Create all tables and indexes
2. Populate scoring event types and initial season data
3. Set up connection pooling and ORM

### Phase 2: User Migration
1. Extract user data from localStorage
2. Hash passwords properly (bcrypt)
3. Migrate to session-based authentication

### Phase 3: Game Data Migration
1. Export draft rankings/picks from localStorage
2. Export sole survivor picks
3. Import into respective tables

### Phase 4: Frontend Integration
1. Update AuthContext to use API calls
2. Update DraftContext to use database
3. Update SoleSurvivorContext to use database
4. Replace localStorage with API calls throughout

---

## API Endpoints to Implement

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Draft System
- `GET /api/draft/rankings/:userId/:seasonId`
- `PUT /api/draft/rankings/:userId/:seasonId`
- `POST /api/draft/submit/:userId/:seasonId`
- `GET /api/draft/picks/:userId/:seasonId`

### Sole Survivor
- `GET /api/sole-survivor/:userId/:seasonId`
- `PUT /api/sole-survivor/:userId/:seasonId`

### Scoring
- `GET /api/episodes/:seasonId`
- `GET /api/episodes/:episodeId/scoring`
- `POST /api/admin/scoring/:episodeId` (admin only)
- `GET /api/leaderboard/:seasonId`

### Admin
- `GET /api/admin/contestants/:seasonId`
- `PUT /api/admin/contestants/:contestantId`
- `POST /api/admin/episodes`
- `PUT /api/admin/episodes/:episodeId`

---

## Performance Considerations

### Caching Strategy
- Cache leaderboard data in `user_season_scores`
- Use Redis for frequently accessed data
- Implement database-level materialized views for complex reports

### Score Calculation
- Use database triggers to update cached totals
- Implement batch processing for episode scoring
- Use transactions for consistent score updates

### Real-time Updates
- PostgreSQL LISTEN/NOTIFY for leaderboard updates
- WebSocket connections for live scoring
- Optimistic locking for concurrent updates

This schema directly supports your existing frontend code while providing the foundation for a scalable, performant database backend. The structure matches your current data models, making migration straightforward while adding the reliability and features needed for production use.
