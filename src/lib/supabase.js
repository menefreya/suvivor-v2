import { createClient } from '@supabase/supabase-js'

// Try multiple environment variable formats for different platforms
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 
                   process.env.NEXT_PUBLIC_SUPABASE_URL || 
                   process.env.SUPABASE_URL
                   
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 
                       process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
                       process.env.SUPABASE_ANON_KEY

// Debug logging for production issues
console.log('Supabase Config:', {
  url: supabaseUrl ? 'SET' : 'MISSING',
  key: supabaseAnonKey ? 'SET' : 'MISSING',
  fullUrl: supabaseUrl,
  keyPrefix: supabaseAnonKey?.substring(0, 20) + '...',
  env: process.env.NODE_ENV
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase configuration. Check environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations (if using Next.js API routes later)
// export const supabaseAdmin = createClient(
//   supabaseUrl,
//   process.env.SUPABASE_SERVICE_ROLE_KEY,
//   {
//     auth: {
//       autoRefreshToken: false,
//       persistSession: false
//     }
//   }
// )
