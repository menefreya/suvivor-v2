-- Row Level Security (RLS) Setup for Supabase
-- Run this AFTER creating schema and seed data

-- Enable RLS on all user-related tables
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
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Draft rankings policies
CREATE POLICY "Users can view all draft rankings" ON public.draft_rankings FOR SELECT USING (true);
CREATE POLICY "Users can manage own draft rankings" ON public.draft_rankings FOR ALL USING (auth.uid() = user_id);

-- Draft picks policies
CREATE POLICY "Users can view all draft picks" ON public.draft_picks FOR SELECT USING (true);
CREATE POLICY "Users can manage own draft picks" ON public.draft_picks FOR ALL USING (auth.uid() = user_id);

-- Sole survivor picks policies
CREATE POLICY "Users can view all sole survivor picks" ON public.sole_survivor_picks FOR SELECT USING (true);
CREATE POLICY "Users can manage own sole survivor picks" ON public.sole_survivor_picks FOR ALL USING (auth.uid() = user_id);

-- Score viewing policies
CREATE POLICY "Users can view all episode scores" ON public.user_episode_scores FOR SELECT USING (true);
CREATE POLICY "Users can view all season scores" ON public.user_season_scores FOR SELECT USING (true);

-- User actions policies
CREATE POLICY "Users can view own actions" ON public.user_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own actions" ON public.user_actions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for reference tables (no RLS needed)
-- seasons, episodes, tribes, contestants, scoring_event_types are public read

-- Admin-only policies for episode management and scoring
CREATE POLICY "Admins can manage episodes" ON public.episodes FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can manage episode scoring" ON public.episode_scoring_events FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Allow public read access to episodes and scoring events
CREATE POLICY "Anyone can view episodes" ON public.episodes FOR SELECT USING (true);
CREATE POLICY "Anyone can view scoring events" ON public.episode_scoring_events FOR SELECT USING (true);
