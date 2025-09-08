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
        .eq('season_id', seasonId || 1)
        .order('rank_position');

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching draft rankings:', error);
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
        .eq('season_id', seasonId || 1);

      // Insert new rankings
      const rankingsData = rankings.map(ranking => ({
        user_id: userId,
        season_id: parseInt(seasonId) || 1,
        contestant_id: ranking.contestants?.id || ranking.id,
        rank_position: ranking.rank,
        is_submitted: true,
        submitted_at: new Date().toISOString()
      }));

      const { data, error } = await supabaseAdmin
        .from('draft_rankings')
        .insert(rankingsData);

      if (error) throw error;
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error updating draft rankings:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { rankings } = req.body;

      const rankingsData = rankings.map(ranking => ({
        user_id: userId,
        season_id: parseInt(seasonId) || 1,
        contestant_id: ranking.id,
        rank_position: ranking.rank,
        is_submitted: false
      }));

      const { data, error } = await supabaseAdmin
        .from('draft_rankings')
        .insert(rankingsData);

      if (error) throw error;
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error creating draft rankings:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
