-- Close public read access to intern records.
--
-- Apply in the Supabase SQL editor AFTER the site with api/intern.js is deployed and
-- INTERN_SESSION_SECRET is set in Vercel. Before that, the live intern dashboard still
-- reads `interns` with the public key and would break.
--
-- Who still has access afterwards:
--   * api/verify.js and api/intern.js use the service role key, which bypasses RLS.
--   * admin-login.html and admin-dashboard.html sign in with Supabase auth and keep
--     full access through "Allow auth all interns" (role authenticated).
-- Nothing on the site reads `certificates` with the public key, so its anon policy goes too.

BEGIN;

DROP POLICY IF EXISTS "Allow anon select interns" ON public.interns;
DROP POLICY IF EXISTS "Allow anon select certificates" ON public.certificates;

-- RLS stays on, so with no anon policy left the public key reads zero rows.
ALTER TABLE public.interns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

COMMIT;

-- Check (should list no policy for role anon on either table):
-- SELECT tablename, policyname, roles, cmd FROM pg_policies
--  WHERE schemaname = 'public' AND tablename IN ('interns', 'certificates');
--
-- And from a terminal, with the publishable key from public/js/supabaseClient.js
-- (should print [] ):
-- curl "https://vtutbqzkegkgujrdkxmj.supabase.co/rest/v1/interns?select=intern_id&limit=1" \
--   -H "apikey: <publishable key>"
