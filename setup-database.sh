#!/bin/bash

# Supabase Database Setup Script
# This script sets up your complete database schema

echo "🚀 Setting up Survivor Fantasy League Database..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. Please install PostgreSQL or use Supabase SQL Editor instead."
    echo "📱 Go to: https://supabase.com/dashboard → Your Project → SQL Editor"
    echo "📋 Copy and paste the SQL files in this order:"
    echo "   1. create-schema.sql"
    echo "   2. seed-data.sql" 
    echo "   3. setup-security.sql"
    exit 1
fi

# Database connection string from your .env.local
DATABASE_URL="postgresql://postgres:h@rm0ny-Qu@$ar-1845@db.hzgypgftaddklkypygys.supabase.co:5432/postgres"

echo "📊 Step 1: Creating database schema..."
psql "$DATABASE_URL" -f create-schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Schema created successfully!"
else
    echo "❌ Error creating schema. Check the output above."
    exit 1
fi

echo "🌱 Step 2: Inserting initial data..."
psql "$DATABASE_URL" -f seed-data.sql

if [ $? -eq 0 ]; then
    echo "✅ Initial data inserted successfully!"
else
    echo "❌ Error inserting data. Check the output above."
    exit 1
fi

echo "🔒 Step 3: Setting up security policies..."
psql "$DATABASE_URL" -f setup-security.sql

if [ $? -eq 0 ]; then
    echo "✅ Security policies set up successfully!"
else
    echo "❌ Error setting up security. Check the output above."
    exit 1
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your .env.local with your Supabase anon and service role keys"
echo "2. Restart your development server: npm start"
echo "3. Update your AuthContext to use Supabase"
echo ""
echo "🔑 Get your API keys from: https://supabase.com/dashboard → Settings → API"
