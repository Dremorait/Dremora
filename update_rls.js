const { Client } = require('pg');
const dbUrl = 'postgresql://postgres:7238981226@db.vtutbqzkegkgujrdkxmj.supabase.co:5432/postgres';
async function run() {
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  await client.query('DROP POLICY IF EXISTS "Deny anon interns" ON public.interns;');
  await client.query('CREATE POLICY "Allow anon select interns" ON public.interns FOR SELECT TO anon USING (true);');
  console.log("RLS Policy Updated for Interns!");
  await client.end();
}
run();
