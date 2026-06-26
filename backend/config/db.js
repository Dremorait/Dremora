const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error connecting to Supabase PostgreSQL:', err.message);
  } else {
    console.log('✅ Connected to Supabase PostgreSQL');
  }
});

// We wrap the pool.query to maintain compatibility with the 'db.execute' style used in routes
module.exports = {
  execute: async (text, params) => {
    const res = await pool.query(text, params);
    // return [rows, fields] to match mysql2 array destructuring used in the routes
    return [res.rows, res.fields];
  }
};

