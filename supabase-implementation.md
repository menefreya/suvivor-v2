# Supabase + Vercel Implementation Guide

## 1. Supabase Project Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Set project name: `survivor-fantasy-league`
5. Set database password (save this!)
6. Choose region closest to your users
7. Click "Create new project"

### Get Project Details
Once created, go to Settings > API and copy:
- **Project URL**: `https://your-project.supabase.co`
- **anon public key**: `eyJ...` (for client-side)
- **service_role key**: `eyJ...` (for server-side, keep secret!)

## 2. Database Schema Implementation

### Create Tables in Supabase

Go to **SQL Editor** in your Supabase dashboard and run this complete schema:

```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (Supabase Auth integration)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Seasons table
CREATE TABLE public.seasons (
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

-- Episodes table
CREATE TABLE public.episodes (
    id SERIAL PRIMARY KEY,
    season_id INTEGER REFERENCES public.seasons(id) ON DELETE CASCADE,
    episode_number INTEGER NOT NULL,
    air_date DATE NOT NULL,
    is_finale BOOLEAN DEFAULT FALSE,
    is_scored BOOLEAN DEFAULT FALSE,
    scoring_locked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season_id, episode_number)
);

-- Tribes table
CREATE TABLE public.tribes (
    id SERIAL PRIMARY KEY,
    season_id INTEGER REFERENCES public.seasons(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season_id, name)
);

-- Contestants table
CREATE TABLE public.contestants (
    id SERIAL PRIMARY KEY,
    season_id INTEGER REFERENCES public.seasons(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    age INTEGER,
    hometown VARCHAR(200),
    residence VARCHAR(200),
    occupation VARCHAR(200),
    tribe VARCHAR(100),
    initial_tribe_id INTEGER REFERENCES public.tribes(id),
    current_tribe_id INTEGER REFERENCES public.tribes(id),
    is_eliminated BOOLEAN DEFAULT FALSE,
    elimination_episode_id INTEGER REFERENCES public.episodes(id),
    image_filename VARCHAR(200),
    points INTEGER DEFAULT 0,
    episodes INTEGER DEFAULT 1,
    final_placement INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(season_id, name)
);

-- Scoring event types
CREATE TABLE public.scoring_event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    points INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    is_penalty BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    scope VARCHAR(20) DEFAULT 'contestant'
);

-- Draft rankings
CREATE TABLE public.draft_rankings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES public.seasons(id) ON DELETE CASCADE,
    contestant_id INTEGER REFERENCES public.contestants(id) ON DELETE CASCADE,
    rank_position INTEGER NOT NULL CHECK (rank_position >= 1 AND rank_position <= 18),
    submitted_at TIMESTAMP WITH TIME ZONE,
    is_submitted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, season_id, contestant_id),
    UNIQUE(user_id, season_id, rank_position)
);

-- Draft picks
CREATE TABLE public.draft_picks (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES public.seasons(id) ON DELETE CASCADE,
    contestant_id INTEGER REFERENCES public.contestants(id) ON DELETE CASCADE,
    pick_number INTEGER NOT NULL CHECK (pick_number IN (1, 2)),
    assigned_from_rank INTEGER NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    replaced_at TIMESTAMP WITH TIME ZONE,
    replaced_by_pick_id INTEGER REFERENCES public.draft_picks(id)
);

-- Sole survivor picks
CREATE TABLE public.sole_survivor_picks (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES public.seasons(id) ON DELETE CASCADE,
    contestant_id INTEGER REFERENCES public.contestants(id) ON DELETE CASCADE,
    selected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    episodes_held INTEGER DEFAULT 0,
    is_original_pick BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    replaced_at TIMESTAMP WITH TIME ZONE,
    replaced_by_pick_id INTEGER REFERENCES public.sole_survivor_picks(id)
);

-- Episode scoring events
CREATE TABLE public.episode_scoring_events (
    id SERIAL PRIMARY KEY,
    episode_id INTEGER REFERENCES public.episodes(id) ON DELETE CASCADE,
    contestant_id INTEGER REFERENCES public.contestants(id) ON DELETE CASCADE,
    scoring_event_type_id INTEGER REFERENCES public.scoring_event_types(id),
    points_awarded INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by_user_id UUID REFERENCES public.user_profiles(id)
);

-- User episode scores (cached)
CREATE TABLE public.user_episode_scores (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    episode_id INTEGER REFERENCES public.episodes(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES public.seasons(id) ON DELETE CASCADE,
    draft_points INTEGER DEFAULT 0,
    sole_survivor_points INTEGER DEFAULT 0,
    elimination_bonus_points INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, episode_id)
);

-- User season scores (cached)
CREATE TABLE public.user_season_scores (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    season_id INTEGER REFERENCES public.seasons(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    current_rank INTEGER,
    episodes_scored INTEGER DEFAULT 0,
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, season_id)
);

-- User actions audit
CREATE TABLE public.user_actions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique indexes
CREATE UNIQUE INDEX idx_active_draft_picks 
ON public.draft_picks(user_id, season_id, pick_number) 
WHERE is_active = TRUE;

CREATE UNIQUE INDEX idx_active_sole_survivor 
ON public.sole_survivor_picks(user_id, season_id) 
WHERE is_active = TRUE;

-- Create performance indexes
CREATE INDEX idx_contestants_season ON public.contestants(season_id);
CREATE INDEX idx_contestants_active ON public.contestants(season_id, is_eliminated);
CREATE INDEX idx_draft_rankings_user_season ON public.draft_rankings(user_id, season_id, rank_position);
CREATE INDEX idx_user_season_scores_leaderboard ON public.user_season_scores(season_id, total_points DESC, current_rank);
```

### Insert Initial Data

Run this to populate your database:

```sql
-- Insert scoring event types
INSERT INTO public.scoring_event_types (name, display_name, points, category, icon, is_penalty) VALUES
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
('immunityTeam', 'Team Immunity', 2, 'team', 'Shield', false),
('rewardTeam', 'Team Reward', 1, 'team', 'Award', false),
('soleSurvivorWeekly', 'Sole Survivor Weekly', 1, 'special', 'Crown', false);

-- Insert Season 49
INSERT INTO public.seasons (season_number, season_name, start_date, end_date, draft_deadline, sole_survivor_deadline, episode_2_deadline) VALUES
(49, 'Survivor 49', '2024-09-18', '2024-12-18', '2026-02-15 23:59:59', '2026-02-15 23:59:59', '2024-10-02 23:59:59');

-- Insert tribes
INSERT INTO public.tribes (season_id, name, color) VALUES
(1, 'Ratu', 'red'),
(1, 'Tika', 'blue'), 
(1, 'Soka', 'green');

-- Insert contestants
INSERT INTO public.contestants (season_id, name, age, hometown, residence, occupation, tribe, image_filename) VALUES
(1, 'Alex Moore', 27, 'Evanston, Ill.', 'Washington, D.C.', 'Political comms director', 'Ratu', 'Alex Moore.png'),
(1, 'Jake Latimer', 36, 'Regina, Saskatchewan', 'St. Albert, Alberta', 'Correctional officer', 'Tika', 'Jake Latimer.png'),
(1, 'Jason Treul', 32, 'Anaheim, Calif.', 'Santa Ana, Calif.', 'Law clerk', 'Soka', 'Jason Treul.png'),
(1, 'Jawan Pitts', 28, 'Salem, N.J.', 'Los Angeles, Calif.', 'Video editor', 'Ratu', 'Jawan Pitts.png'),
(1, 'Jeremiah Ing', 39, 'Windsor, Ontario', 'Toronto, Ontario', 'Global events manager', 'Tika', 'Jeremiah Ing.png'),
(1, 'Kimberly "Annie" Davis', 49, 'Portland, Ore.', 'Austin, Texas', 'Musician', 'Soka', 'Kimberly Annie Davis.png'),
(1, 'Kristina Mills', 36, 'Houston, Texas', 'Edmond, Okla.', 'MBA career coach', 'Ratu', 'Kristina Mills.png'),
(1, 'Matt Williams', 52, 'Farmington, Utah', 'St. George, Utah', 'Airport ramp agent', 'Tika', 'Matt Williams.png'),
(1, 'Michelle "MC" Chukwujekwu', 29, 'Sachse, Texas', 'San Diego, Calif.', 'Fitness trainer', 'Soka', 'Michelle Chukwujekwu.png'),
(1, 'Nate Moore', 47, 'Clovis, Calif.', 'Hermosa Beach, Calif.', 'Film producer', 'Ratu', 'Nate Moore.png'),
(1, 'Nicole Mazullo', 26, 'Long Island, N.Y.', 'Philadelphia, Pa.', 'Financial crime consultant', 'Tika', 'Nicole Mazullo.png'),
(1, 'Rizo Velovic', 25, 'Yonkers, N.Y.', 'Yonkers, N.Y.', 'Tech sales', 'Soka', 'Rizo Velovic.png'),
(1, 'Sage Ahrens-Nichols', 30, 'Roxboro, N.C.', 'Olympia, Wash.', 'Clinical social worker', 'Ratu', 'Sage Ahrens-Nichols.png'),
(1, 'Savannah Louie', 31, 'Walnut Creek, Calif.', 'Atlanta, Ga.', 'Former reporter', 'Tika', 'Savannah Louie.png'),
(1, 'Shannon Fairweather', 28, 'Wakefield, Mass.', 'Boston, Mass.', 'Wellness specialist', 'Soka', 'Shannon Fairweather.png'),
(1, 'Sophi Balerdi', 27, 'Miami, Fla.', 'Miami, Fla.', 'Entrepreneur', 'Ratu', 'Sophi Balerdi.png'),
(1, 'Sophie Segreti', 31, 'Darnestown, Md.', 'New York City, N.Y.', 'Strategy associate', 'Tika', 'Sophie Segreti.png'),
(1, 'Steven Ramm', 35, 'Littleton, Colo.', 'Denver, Colo.', 'Rocket scientist', 'Soka', 'Steven Ramm.png');
```

## 3. Row Level Security (RLS) Setup

In Supabase SQL Editor, enable RLS for security:

```sql
-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draft_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sole_survivor_picks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_episode_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_season_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_actions ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Draft policies
CREATE POLICY "Users can view all draft data" ON public.draft_rankings FOR SELECT USING (true);
CREATE POLICY "Users can manage own draft" ON public.draft_rankings FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view all picks" ON public.draft_picks FOR SELECT USING (true);
CREATE POLICY "Users can manage own picks" ON public.draft_picks FOR ALL USING (auth.uid() = user_id);

-- Sole survivor policies
CREATE POLICY "Users can view all sole survivor picks" ON public.sole_survivor_picks FOR SELECT USING (true);
CREATE POLICY "Users can manage own sole survivor" ON public.sole_survivor_picks FOR ALL USING (auth.uid() = user_id);

-- Score policies
CREATE POLICY "Users can view all scores" ON public.user_episode_scores FOR SELECT USING (true);
CREATE POLICY "Users can view all season scores" ON public.user_season_scores FOR SELECT USING (true);

-- Admin policies for scoring (you'll need to set is_admin = true for admin users)
CREATE POLICY "Admins can manage episodes" ON public.episodes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can manage scoring" ON public.episode_scoring_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);
```

## 4. Install Dependencies

```bash
# Install Supabase client
npm install @supabase/supabase-js

# Install additional dependencies for Vercel API routes
npm install bcryptjs jsonwebtoken
```

## 5. Environment Variables Setup

Create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration (for custom auth if needed)
JWT_SECRET=your-super-secret-jwt-key

# App Configuration
NODE_ENV=development
```

For Vercel deployment, add these same variables in your Vercel dashboard under Settings > Environment Variables.

## 6. Create Supabase Client

Create `lib/supabase.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

## 7. Update AuthContext

Update `src/contexts/AuthContext.js`:

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (error) throw error;

      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: data.user.id,
          email: userData.email,
          username: userData.username,
          first_name: userData.firstName,
          last_name: userData.lastName
        }]);

      if (profileError) throw profileError;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
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

## 8. Create Vercel API Routes

Since you're using Create React App, you'll need to either:

**Option A: Keep Create React App** - Create a separate backend folder with Vercel functions
**Option B: Migrate to Next.js** - Use built-in API routes

I'll show you **Option A** (keeping your current setup):

Create `api/contestants.js`:

```javascript
import { supabaseAdmin } from '../lib/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('contestants')
        .select('*')
        .eq('season_id', 1)
        .order('name');

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

Create `api/draft/rankings.js`:

```javascript
import { supabaseAdmin } from '../../lib/supabase';

export default async function handler(req, res) {
  const { userId, seasonId } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('draft_rankings')
        .select(`
          *,
          contestants (*)
        `)
        .eq('user_id', userId)
        .eq('season_id', seasonId)
        .order('rank_position');

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { rankings } = req.body;

      // Delete existing rankings
      await supabaseAdmin
        .from('draft_rankings')
        .delete()
        .eq('user_id', userId)
        .eq('season_id', seasonId);

      // Insert new rankings
      const { data, error } = await supabaseAdmin
        .from('draft_rankings')
        .insert(rankings.map(ranking => ({
          user_id: userId,
          season_id: seasonId,
          contestant_id: ranking.id,
          rank_position: ranking.rank,
          is_submitted: true,
          submitted_at: new Date().toISOString()
        })));

      if (error) throw error;
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
```

## 9. Update Frontend to Use Supabase

Update your `DraftContext.js`:

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const DraftContext = createContext();

export const useDraft = () => {
  const context = useContext(DraftContext);
  if (!context) {
    throw new Error('useDraft must be used within a DraftProvider');
  }
  return context;
};

export const DraftProvider = ({ children }) => {
  const { user } = useAuth();
  const [draftRankings, setDraftRankings] = useState([]);
  const [draftPicks, setDraftPicks] = useState([]);
  const [isDraftSubmitted, setIsDraftSubmitted] = useState(false);
  const [isDraftOpen, setIsDraftOpen] = useState(true);

  useEffect(() => {
    if (user) {
      loadDraftData();
    }
  }, [user]);

  const loadDraftData = async () => {
    try {
      // Load draft rankings
      const { data: rankings, error: rankingsError } = await supabase
        .from('draft_rankings')
        .select(`
          *,
          contestants (*)
        `)
        .eq('user_id', user.id)
        .eq('season_id', 1)
        .order('rank_position');

      if (rankingsError) throw rankingsError;

      if (rankings.length > 0) {
        setDraftRankings(rankings);
        setIsDraftSubmitted(rankings[0].is_submitted);
      } else {
        // Initialize with default rankings
        await initializeDefaultRankings();
      }

      // Load draft picks
      const { data: picks, error: picksError } = await supabase
        .from('draft_picks')
        .select(`
          *,
          contestants (*)
        `)
        .eq('user_id', user.id)
        .eq('season_id', 1)
        .eq('is_active', true)
        .order('pick_number');

      if (picksError) throw picksError;
      setDraftPicks(picks);

    } catch (error) {
      console.error('Error loading draft data:', error);
    }
  };

  const initializeDefaultRankings = async () => {
    try {
      // Get all contestants
      const { data: contestants, error } = await supabase
        .from('contestants')
        .select('*')
        .eq('season_id', 1);

      if (error) throw error;

      // Create shuffled rankings
      const shuffled = [...contestants].sort(() => Math.random() - 0.5);
      const rankings = shuffled.map((contestant, index) => ({
        user_id: user.id,
        season_id: 1,
        contestant_id: contestant.id,
        rank_position: index + 1,
        is_submitted: false
      }));

      // Insert rankings
      const { error: insertError } = await supabase
        .from('draft_rankings')
        .insert(rankings);

      if (insertError) throw insertError;

      await loadDraftData();
    } catch (error) {
      console.error('Error initializing rankings:', error);
    }
  };

  const updateRankings = async (newRankings) => {
    try {
      // Update local state immediately
      setDraftRankings(newRankings);

      // Prepare data for database
      const rankingsData = newRankings.map(ranking => ({
        user_id: user.id,
        season_id: 1,
        contestant_id: ranking.contestants?.id || ranking.id,
        rank_position: ranking.rank,
        is_submitted: isDraftSubmitted
      }));

      // Delete existing and insert new
      await supabase
        .from('draft_rankings')
        .delete()
        .eq('user_id', user.id)
        .eq('season_id', 1);

      const { error } = await supabase
        .from('draft_rankings')
        .insert(rankingsData);

      if (error) throw error;

      // Recalculate draft picks
      await calculateDraftPicks(newRankings);

    } catch (error) {
      console.error('Error updating rankings:', error);
    }
  };

  const calculateDraftPicks = async (rankings) => {
    // Your existing pick calculation logic
    // Then save to database
  };

  const saveDraft = async () => {
    try {
      // Mark as submitted
      await supabase
        .from('draft_rankings')
        .update({ 
          is_submitted: true,
          submitted_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('season_id', 1);

      setIsDraftSubmitted(true);
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const value = {
    draftRankings,
    draftPicks,
    isDraftSubmitted,
    isDraftOpen,
    updateRankings,
    saveDraft,
    // ... other methods
  };

  return (
    <DraftContext.Provider value={value}>
      {children}
    </DraftContext.Provider>
  );
};
```

## 10. Vercel Deployment Configuration

Create `vercel.json`:

```json
{
  "functions": {
    "api/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This implementation gives you:
✅ **Supabase PostgreSQL database** with your complete schema
✅ **Built-in authentication** with Supabase Auth
✅ **Row Level Security** for data protection
✅ **Serverless API routes** with Vercel
✅ **Real-time capabilities** (can add subscriptions later)
✅ **Easy deployment** with automatic scaling

Would you like me to continue with the remaining API routes or help you with any specific part of the implementation?
