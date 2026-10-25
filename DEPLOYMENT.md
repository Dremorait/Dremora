# Deploying www.dremorait.in

Astro (static output) on Vercel, plus two Vercel functions in `api/`.

```
npm install
npm run dev          # http://localhost:4321, shows {{TODO}} markers in yellow
npm run build        # production build + check:banned + open TODO list
npm run preview      # serve dist/ (the /api functions do not run locally)
npm test             # contact form, certificate check and intern dashboard session tests
```

`npm run build` fails if anything from the brief's banned list appears (dashes,
emoji, gradients, pill shapes, scroll effects, banned words, `{{TODO}}`, bad meta).

## 1. Before the first deploy (security)

1. **Rotate the leaked secrets.** `.env.production` was committed in `cce5abd`. In Supabase,
   reset the database password and the JWT secret; replace `ADMIN_SECRET_TOKEN` wherever it is used.
   The file is now untracked and ignored, but the old values remain in git history.
2. **Change the default admin password.** `database/schema.sql` seeds `admin@dremora.com`
   with the password `admin`. If that row exists in the live database, change it.
3. **Intern data is readable with the public key.** The live policy
   `"Allow anon select interns" ... USING (true)` lets anyone holding the anon key (it is in
   `public/js/supabaseClient.js`) read every intern's email, phone, college and remarks.
   Nothing on the site needs it any more: the certificate check and the intern dashboard both
   read through server functions (`/api/verify`, `/api/intern`) with the service role key.
   **After this version is live and `INTERN_SESSION_SECRET` is set**, run
   `database/2026-10-25_drop_anon_read_interns.sql` in the Supabase SQL editor, then sign in
   to the intern dashboard and the admin dashboard once to check both still load.

## 2. Vercel project settings

- Framework preset: Astro. Build command and output directory come from `vercel.json`.
- **Domains:** add `www.dremorait.in` as the production domain and `dremorait.in` redirecting
  to it (301). `vercel.json` also redirects `dremorait.in`, `dremora-it.vercel.app` and
  `dremora-sigma.vercel.app` to `https://www.dremorait.in` on the same path, and sends
  `X-Robots-Tag: noindex` on every other `*.vercel.app` preview.
- **Environment variables** (see `.env.example`):
  | Name | Value |
  |---|---|
  | `RESEND_API_KEY` | from resend.com |
  | `CONTACT_TO` | `dremora.itservices@gmail.com` |
  | `CONTACT_FROM` | `Dremora IT website <website@dremorait.in>` |
  | `SUPABASE_URL` | `https://vtutbqzkegkgujrdkxmj.supabase.co` |
  | `SUPABASE_SERVICE_ROLE_KEY` | Supabase, Project settings, API (server only) |
  | `INTERN_SESSION_SECRET` | random, 32+ characters: `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Signs the intern dashboard cookie; changing it signs everyone out |
  | `PUBLIC_VERCEL_ANALYTICS` | `1` once Web Analytics is enabled, else leave empty |
- **Firewall:** add a rate limit rule for `/api/contact` (5 requests per 10 minutes per IP)
  `/api/verify` (30 per 10 minutes) and `/api/intern` (60 per 10 minutes). The functions also
  limit per instance as a backstop.
- **Web Analytics:** enable it in the dashboard, then set `PUBLIC_VERCEL_ANALYTICS=1`.
  The Privacy Policy names it automatically when the variable is set.

## 3. Resend (contact form email)

1. Create an account at resend.com and add the domain `dremorait.in`.
2. Add the DNS records Resend shows (SPF and DKIM) at your DNS provider.
3. Create an API key with "sending access" only and put it in `RESEND_API_KEY`.
4. After deploy, send a test enquiry from `/contact` and check it arrives.

## 4. Checks after deploy

- `https://dremorait.in/about.html` should 301 to `https://www.dremorait.in/about`.
- `https://www.dremorait.in/intern-dashboard.html?verify=<a real ID>` should land on the
  certificate check and show the record.
- `/api/verify?id=DRM-INT-0000-000` should return 404 `{"ok":false,"error":"not_found"}`.
- Run https://search.google.com/test/rich-results on `/`, `/services/websites` and `/work`.
- Run https://securityheaders.com on the home page.
- Favicon: check a light browser tab, a dark tab, "Add to Home Screen" on an iPhone and on Android.

## 5. After launch (your accounts)

1. Verify `dremorait.in` as a **Domain property** in Google Search Console with a DNS TXT
   record, then submit `https://www.dremorait.in/sitemap.xml`.
2. Add the site to Bing Webmaster Tools (it can import from Search Console).
3. Create or update the Google Business Profile with exactly:
   `DREMORA IT Consultants & Services`, `Pune, Maharashtra 411032, India`, `+91 9309795878`,
   `https://www.dremorait.in`. Use the same on every social profile.
4. In Search Console, request indexing for `/`, `/services/websites`, `/services/web-apps`
   and `/services/ai-automation`.
5. Have a lawyer in India review `/privacy-policy` and `/terms` before you rely on them.

## Regenerating icons

`node scripts/make-icons.mjs` rebuilds `favicon.ico`, `icon.svg`, the PNG icons and
`site.webmanifest` in `public/`. Keep the file names stable once live.
