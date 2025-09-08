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
        .from('sole_survivor_picks')
        .select(`
          *,
          contestants (*)
        `)
        .eq('user_id', userId)
        .eq('season_id', seasonId || 1)
        .eq('is_active', true)
        .order('selected_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      res.status(200).json(data[0] || null);
    } catch (error) {
      console.error('Error fetching sole survivor pick:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { contestantId, isOriginalPick = false } = req.body;

      // Deactivate any existing picks
      await supabaseAdmin
        .from('sole_survivor_picks')
        .update({ 
          is_active: false,
          replaced_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('season_id', seasonId || 1);

      // Create new pick
      const { data, error } = await supabaseAdmin
        .from('sole_survivor_picks')
        .insert([{
          user_id: userId,
          season_id: parseInt(seasonId) || 1,
          contestant_id: contestantId,
          episodes_held: 0,
          is_original_pick: isOriginalPick,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      console.error('Error creating sole survivor pick:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { episodes_held } = req.body;

      const { data, error } = await supabaseAdmin
        .from('sole_survivor_picks')
        .update({ episodes_held })
        .eq('user_id', userId)
        .eq('season_id', seasonId || 1)
        .eq('is_active', true)
        .select()
        .single();

      if (error) throw error;
      res.status(200).json(data);
    } catch (error) {
      console.error('Error updating sole survivor pick:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
