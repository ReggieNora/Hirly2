const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize the Supabase client with environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required Supabase environment variables');
}

// Create and export the Supabase client
exports.supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
});

/**
 * Get the Supabase client
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
const getSupabase = () => {
  return exports.supabase;
};

/**
 * Get the Supabase client with admin privileges
 * Note: In a production environment, use Row Level Security (RLS) and service roles appropriately
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
const getAdminSupabase = () => {
  // This is a placeholder for admin client if needed
  // In production, you would use the service role key here
  return exports.supabase;
};

module.exports = {
  supabase: exports.supabase,
  getSupabase,
  getAdminSupabase
};
