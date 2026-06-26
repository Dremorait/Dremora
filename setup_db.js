const { Client } = require('pg');

const dbUrl = 'postgresql://postgres:7238981226@db.vtutbqzkegkgujrdkxmj.supabase.co:5432/postgres';

const sql = `
  CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );

  -- Enable RLS
  ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

  -- Create policies to prevent anonymous access
  -- Only the service_role (backend) can select/insert/update
  -- We don't want clients querying the admins table directly!
  
  -- Drop existing policies if any to avoid errors during re-runs
  DROP POLICY IF EXISTS "Deny all access to anon" ON public.admins;
  
  CREATE POLICY "Deny all access to anon"
  ON public.admins
  FOR ALL
  TO anon
  USING (false);

  -- Insert a default admin if none exists
  INSERT INTO public.admins (admin_id, full_name, email, password_hash)
  VALUES ('ADMIN-001', 'System Admin', 'admin@dremora.com', '$2a$10$f/2296T8/M3g3Uv2K0eY0On.sI.lD2uS.1a92aM3hKkXnL2l8Y4R6') -- password: admin
  ON CONFLICT (email) DO NOTHING;
`;

async function run() {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    console.log("Connected to DB.");
    await client.query(sql);
    console.log("Admins table created successfully with RLS.");
  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

run();
