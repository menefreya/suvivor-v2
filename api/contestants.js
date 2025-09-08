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
      console.error('Error fetching contestants:', error);
      res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { id, updates } = req.body;
      
      const { data, error } = await supabaseAdmin
        .from('contestants')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      res.status(200).json(data);
    } catch (error) {
      console.error('Error updating contestant:', error);
      res.status(500).json({ error: error.message });
    }
  }
}
