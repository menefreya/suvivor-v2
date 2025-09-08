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
        .from('draft_picks')
        .select(`
          *,
          contestants (*)
        `)
        .eq('user_id', userId)
        .eq('season_id', seasonId || 1)
        .eq('is_active', true)
        .order('pick_number');

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching draft picks:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { picks } = req.body;

      const picksData = picks.map(pick => ({
        user_id: userId,
        season_id: parseInt(seasonId) || 1,
        contestant_id: pick.id,
        pick_number: pick.pickNumber,
        assigned_from_rank: pick.rank,
        is_active: true
      }));

      const { data, error } = await supabaseAdmin
        .from('draft_picks')
        .insert(picksData);

      if (error) throw error;
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error('Error creating draft picks:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { pickId, updates } = req.body;

      const { data, error } = await supabaseAdmin
        .from('draft_picks')
        .update(updates)
        .eq('id', pickId)
        .select()
        .single();

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      console.error('Error updating draft pick:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
