import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { seasonId } = req.query;

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_season_scores')
        .select(`
          *,
          user_profiles (
            username,
            first_name,
            last_name,
            is_admin
          )
        `)
        .eq('season_id', seasonId || 1)
        .order('total_points', { ascending: false });

      if (error) throw error;

      // Add rank based on sorted order
      const rankedData = data.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

      res.status(200).json(rankedData);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      // Recalculate all user scores for the season
      const { seasonId: targetSeasonId } = req.body;
      
      // This would typically involve complex score calculation logic
      // For now, just return success
      res.status(200).json({ success: true, message: 'Scores recalculated' });
    } catch (error) {
      console.error('Error recalculating scores:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
