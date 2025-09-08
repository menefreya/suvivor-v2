# Vercel Deployment Guide

## Quick Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Add Supabase integration and API routes"
git push origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "New Project"
4. Import your `survivor-app` repository
5. Configure project settings:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 3. Add Environment Variables
In Vercel dashboard → Project Settings → Environment Variables, add:

```env
REACT_APP_SUPABASE_URL=https://hzgypgftaddklkypygys.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 4. Deploy
Click "Deploy" - Vercel will automatically:
- Build your React app
- Deploy serverless API functions
- Provide a live URL

## Environment Variables Setup

### Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_SUPABASE_URL` | Your Supabase project URL | `https://xyz.supabase.co` |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ0eXAiOiJKV1QiL...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret!) | `eyJ0eXAiOiJKV1QiL...` |

### How to Get Supabase Keys
1. Go to your Supabase project dashboard
2. Settings → API
3. Copy the keys:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** → `REACT_APP_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

## API Routes Structure

Your deployed app will have these endpoints:

### Authentication
- Handled by Supabase Auth (built-in)

### API Endpoints
- `GET /api/contestants` - Get all contestants
- `PUT /api/contestants` - Update contestant
- `GET /api/draft/rankings?userId=X&seasonId=1` - Get user's draft rankings
- `PUT /api/draft/rankings?userId=X&seasonId=1` - Update draft rankings
- `GET /api/draft/picks?userId=X&seasonId=1` - Get user's draft picks
- `POST /api/draft/picks?userId=X&seasonId=1` - Create draft picks
- `GET /api/sole-survivor?userId=X&seasonId=1` - Get sole survivor pick
- `POST /api/sole-survivor?userId=X&seasonId=1` - Select sole survivor
- `PUT /api/sole-survivor?userId=X&seasonId=1` - Update sole survivor
- `GET /api/leaderboard?seasonId=1` - Get leaderboard

## Testing Deployment

### 1. Check Build
```bash
npm run build
```
Should complete without errors.

### 2. Test API Locally
```bash
# Install Vercel CLI
npm i -g vercel

# Run local development with API functions
vercel dev
```

### 3. Check Environment Variables
In browser console after deployment:
```javascript
// These should be defined
console.log(process.env.REACT_APP_SUPABASE_URL);
console.log(process.env.REACT_APP_SUPABASE_ANON_KEY);
```

## Custom Domain (Optional)

### 1. In Vercel Dashboard
- Go to Project Settings → Domains
- Add your custom domain
- Follow DNS setup instructions

### 2. Update Environment Variables
Update any hardcoded URLs to use your custom domain.

## Troubleshooting

### Build Errors
- Check all environment variables are set
- Ensure no TypeScript errors
- Verify all imports are correct

### API Errors
- Check Vercel function logs in dashboard
- Verify Supabase keys are correct
- Ensure database schema is set up

### Authentication Issues
- Verify Supabase project is active
- Check RLS policies are configured
- Ensure user registration works

### Database Connection
- Test connection in Supabase dashboard
- Verify API keys have correct permissions
- Check network/firewall settings

## Performance Optimization

### 1. Build Optimization
```bash
# Analyze bundle size
npm install -g source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### 2. Vercel Settings
- Enable compression (automatic)
- Use Vercel Analytics (optional)
- Set up monitoring

### 3. Supabase Optimization
- Add database indexes for performance
- Use connection pooling
- Monitor query performance

## Security Checklist

✅ Environment variables are secure  
✅ Supabase RLS policies are enabled  
✅ API keys are not exposed in frontend  
✅ CORS is properly configured  
✅ Authentication is required for user actions  

## Going Live

### 1. Final Checks
- [ ] All features work in production
- [ ] Database is populated with initial data
- [ ] Admin user can access admin features
- [ ] Regular users can register and login
- [ ] Draft and scoring functionality works

### 2. Monitor
- Check Vercel analytics
- Monitor Supabase usage
- Set up error tracking (optional)

### 3. Backup
- Export Supabase data regularly
- Keep environment variables backed up
- Document any custom configurations

Your Survivor Fantasy League is now ready for production! 🎉
