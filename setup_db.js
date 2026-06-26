const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const dbUrl = 'postgresql://postgres:7238981226@db.vtutbqzkegkgujrdkxmj.supabase.co:5432/postgres';

async function run() {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    console.log("Connected to DB.");
    
    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    await client.query(sql);
    console.log("Schema v2.0 successfully migrated with RLS.");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

run();
