#!/usr/bin/env node

/**
 * Create Admin User Script
 * This script creates an admin user in your Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please ensure you have REACT_APP_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('🚀 Creating admin user...');
  
  try {
    // First, create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@survivor.com',
      password: 'admin123',
      email_confirm: true
    });

    if (authError) {
      console.error('❌ Error creating auth user:', authError.message);
      return;
    }

    console.log('✅ Auth user created successfully');

    // Then create the user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .insert([{
        id: authData.user.id,
        email: 'admin@survivor.com',
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        is_admin: true
      }])
      .select()
      .single();

    if (profileError) {
      console.error('❌ Error creating user profile:', profileError.message);
      return;
    }

    console.log('✅ Admin user profile created successfully');
    console.log('');
    console.log('🎉 Admin account created!');
    console.log('');
    console.log('📋 Login credentials:');
    console.log('   Email: admin@survivor.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('🔐 You can now access the admin dashboard at /admin');
    console.log('⚠️  Remember to change the password after first login!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the script
createAdminUser();
