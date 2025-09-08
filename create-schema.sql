-- Survivor Fantasy League Database Schema
-- Run this in Supabase SQL Editor or via psql

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
