# Environment Variables Setup

Create a `.env.local` file in your project root with these variables:

```env
# Supabase Configuration
# Get these from your Supabase project settings > API
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# For server-side operations (keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Configuration (if needed for custom auth)
JWT_SECRET=your-super-secret-jwt-key

# App Configuration
NODE_ENV=development
```

## How to get Supabase keys:

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** key → `REACT_APP_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Important Notes:

- Never commit `.env.local` to git (it's already in .gitignore)
- The `REACT_APP_` prefix makes variables available in your React app
- The service role key should only be used server-side
- For Vercel deployment, add these same variables in your Vercel dashboard
