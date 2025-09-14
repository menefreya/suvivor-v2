import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  console.error('REACT_APP_SUPABASE_URL:', supabaseUrl ? '✓' : '✗ Missing')
  console.error('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗ Missing')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Test connection function
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log('Testing Supabase connection...')
    const { error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('Connection test failed:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection successful!')
    return true
  } catch (error) {
    console.error('Connection test error:', error)
    return false
  }
}