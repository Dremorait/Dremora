const { createClient } = require('@supabase/supabase-js');

let supabase = null;

const getSupabaseClient = () => {
  if (supabase) return supabase;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing environment variable: SUPABASE_URL');
  }
  if (!supabaseKey) {
    throw new Error('Missing environment variable: SUPABASE_KEY');
  }

  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    return supabase;
  } catch (error) {
    console.error('CRITICAL: Failed to initialize Supabase client:', error.message);
    throw new Error('Supabase client initialization failed: ' + error.message);
  }
};

module.exports = {
  getSupabaseClient
};
