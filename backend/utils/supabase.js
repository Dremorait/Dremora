const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const getSupabaseClient = () => {
  if (supabase) return supabase;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL: SUPABASE_URL or SUPABASE_KEY environment variables are missing.');
    return null;
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  } catch (error) {
    console.error('CRITICAL: Failed to initialize Supabase client:', error.message);
    return null;
  }
};

module.exports = {
  getSupabaseClient
};
