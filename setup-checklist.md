# Supabase Setup Checklist

Follow these steps to implement your Survivor app with Supabase:

## ✅ Phase 1: Supabase Project Setup

- [ ] 1. Go to [supabase.com](https://supabase.com) and create account
- [ ] 2. Create new project named "survivor-fantasy-league"
- [ ] 3. Save your database password
- [ ] 4. Wait for project to finish setting up (2-3 minutes)

## ✅ Phase 2: Database Schema

- [ ] 5. Go to SQL Editor in Supabase dashboard
- [ ] 6. Copy the complete schema from `supabase-implementation.md` section 2
- [ ] 7. Run the schema SQL to create all tables
- [ ] 8. Run the initial data SQL to populate scoring types, season, tribes, and contestants
- [ ] 9. Run the Row Level Security (RLS) SQL from section 3

## ✅ Phase 3: Environment Setup

- [ ] 10. Copy your Supabase project URL and keys from Settings > API
- [ ] 11. Create `.env.local` file using template from `environment-setup.md`
- [ ] 12. Add your actual Supabase URL and keys to `.env.local`
- [ ] 13. Restart your development server (`npm start`)

## ✅ Phase 4: Test Database Connection

- [ ] 14. Update your AuthContext to use Supabase (code in `supabase-implementation.md` section 7)
- [ ] 15. Test login/registration functionality
- [ ] 16. Verify data is being saved to Supabase (check tables in dashboard)

## ✅ Phase 5: Update Other Contexts

- [ ] 17. Update DraftContext to use Supabase (section 9)
- [ ] 18. Update SoleSurvivorContext similarly
- [ ] 19. Test draft rankings and sole survivor functionality

## ✅ Phase 6: Deploy to Vercel

- [ ] 20. Connect your GitHub repo to Vercel
- [ ] 21. Add environment variables in Vercel dashboard
- [ ] 22. Deploy and test production version

## 🚀 Quick Start Commands

```bash
# Already done for you:
npm install @supabase/supabase-js

# Start development server
npm start

# When ready to deploy
vercel --prod
```

## 🔧 Files Created/Modified

- ✅ `lib/supabase.js` - Supabase client configuration
- 📄 `supabase-implementation.md` - Complete implementation guide
- 📄 `environment-setup.md` - Environment variables guide
- 📄 `setup-checklist.md` - This checklist

## 🆘 Need Help?

- **Supabase docs**: [supabase.com/docs](https://supabase.com/docs)
- **Authentication**: Follow section 7 in `supabase-implementation.md`
- **Database queries**: Check Supabase dashboard > SQL Editor
- **Environment variables**: Use exact format from `environment-setup.md`

## 🎯 Next Steps

1. **Start with Phase 1** - Create your Supabase project
2. **Follow the implementation guide** step by step
3. **Test each feature** as you implement it
4. **Deploy to Vercel** when everything works locally

Your database is now ready to replace localStorage with a production-ready PostgreSQL database!
