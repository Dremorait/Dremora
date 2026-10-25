# Dremora IT redevelopment: build report

Date: 25 Oct 2026. Status: built and checked locally. **Not deployed and not committed.**

## What was built

Astro 7 (static output) for Vercel. Plain CSS on the brief's tokens, self-hosted IBM Plex
Sans, Mono and Sans Devanagari, no UI kit, no animation library.

| Route | Notes |
|---|---|
| `/` | Hero (draft A), real work (anonymous), services rows, 3-step process, concept builds, contact form |
| `/services`, `/services/websites`, `/services/web-apps`, `/services/ai-automation` | Each service page: who it is for, included, not included, timeline, stack, example, 6-question FAQ, over 400 words |
| `/work` | Client work first (anonymous), then concept builds, text only (see below) |
| `/work/[slug]` | Case study template. Pages are generated only once problem, stack and ship month are known, so none are built yet |
| `/about` | Story, how we work, internship. Founder block appears once name, role and photo exist |
| `/contact`, `/contact/thanks` | Form with consent checkbox, honeypot, rate limit; WhatsApp, tel, email, address with a Maps link. Thanks page is `noindex` |
| `/internship`, `/internship/guidelines` | Program facts, public certificate check, intern dashboard sign-in. Guidelines restyled from the old page |
| `/privacy-policy`, `/terms`, `/refund-policy` | New Privacy and Terms per section 8; Refund text kept |
| `/404` | `noindex`, links to Home, Work, Contact |
| `/api/contact`, `/api/verify` | Vercel functions. Keys only in environment variables |
| `/intern-dashboard`, `/admin-login`, `/admin-dashboard` | Old apps, unchanged except: Google Analytics removed, QR codes now point at `/internship?verify=` |

## Checks run

| Check | Result |
|---|---|
| `npm run check:banned` (source + built HTML) | Passes. Planted violations were all caught (19 of 19) |
| `npm test` | 15 of 15 pass: contact success, validation, server error, missing config, honeypot, rate limit; verify valid, unknown, malformed, sign-in, filter injection, Supabase failure |
| axe-core 4, WCAG 2.2 AA + best practice, 15 pages, light and dark, 390px wide | 0 violations |
| No horizontal scroll at 390px | All 15 pages |
| Lighthouse 12, mobile, local preview | Home, `/services/websites`, `/contact`: 100 / 100 / 100 / 100. LCP 1.4 to 1.5 s, CLS 0 to 0.001. Reports in `lighthouse/` |
| JavaScript per page | Largest is `/contact` at 2.1 KB compressed (limit 30 KB) |
| Contact form in the browser | Empty submit: 5 field errors, focus moves to the first; server failure: message kept in the form, phone and WhatsApp offered |

Lighthouse ran against `astro preview` on this PC, not the live site. Run it again on the
production URL after deploy, since Vercel adds compression and HTTP/2.

## Favicon

Option A, the bold "D" monogram (orange on navy, colours swap on dark tabs), is in use.
Option B, derived from the logo mark (navy D with the grey orbit), is in
`favicon-options.png` for comparison: at 16px the orbit turns into noise, so A was kept.
Say if you want B instead.

## Open TODOs

Printed by every `npm run build`. Everything that depends on these is hidden in production.

1. Contact response time you actually keep (old site said both 4 business hours and 24 hours)
2. Founder name, role, photo (`src/assets/founder.jpg`) and LinkedIn URL (old About page said Aniket Wable)
3. Starting prices in INR for websites, web apps and automation (old site said ₹25,000, ₹60,000, ₹40,000)
4. Agri-tech client (Doctor Soil Technology): permission to name, problem, stack, ship month, screenshots, results, quote
5. Manasvi: sector, problem, delivery month, permission
6. Six concept demos: add the "Concept demo" strip, remove fake stats and ratings, rename Dremora-branded demos, fix the restaurant encoding bug, move each to a `dremorait.in` subdomain, then take fresh screenshots. Until then the Work page lists them as text with no links or images
7. Internship fee, if any, and whether applicants under 18 are accepted
8. Grievance Officer name
9. Retention period for enquiries, intern records, certificate records and hosting logs
10. Confirm LinkedIn, Instagram and X profile URLs: LinkedIn and X returned 404 to an automated check, and Instagram cannot be checked that way. Only GitHub is linked now

Timelines (2 to 4, 4 to 10 and 2 to 6 weeks), revisions (3 rounds), payment terms
(50/50, 7 day invoices) and the 30 day warranty come from the old site's own pages.
Correct them in `src/content/site.ts` if any have changed.

## Could not do, and why

- **Deploy, DNS, Search Console, Bing, Business Profile:** need your accounts. Steps are in `DEPLOYMENT.md`.
- **Fix the demo sites:** they live in other repos and hosts (Vercel and Netlify).
- **Live test of the contact email and certificate lookup:** needs the Resend key and the
  Supabase service role key. Both are covered by tests with mocked services, and must be
  checked once on production.
- **Rich Results Test, securityheaders.com, real phones and Safari/Firefox:** need the
  public URL or devices. The JSON-LD parses and uses only schema.org types Google supports;
  no Review or AggregateRating markup exists.
- **Screen reader pass (NVDA or VoiceOver):** not run. axe found no issues; a manual pass
  is still worth doing on Home and Contact.
- **Restyle the intern dashboard and admin pages:** outside the brief's site map. They are
  kept working, `noindex`, with their own looser CSP, and excluded from `check:banned` (listed in its output).

## Security issues found (not part of the brief)

1. `.env.production` with the database password, JWT secret and admin token was in git. Now untracked and ignored. **Rotate all three.**
2. Supabase RLS lets the public key read every column of `interns`. Fixed in code: the dashboard now signs in through `POST /api/verify`, which sets a signed HttpOnly cookie, and loads certificate-level fields from `/api/intern`. **Still open on the live database** until the owner runs `database/2026-10-25_drop_anon_read_interns.sql` after deploy (see DEPLOYMENT.md).
3. `database/schema.sql` seeds an admin with password `admin`. `database/dremora_schema.sql` contains real intern names. Both are in the public repo history.
4. `node_modules` (root and backend) was committed. Now untracked.

> Build note, not shown on the site: have a lawyer in India review the Privacy Policy and Terms before publishing.
