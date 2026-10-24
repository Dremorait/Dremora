# Dremora IT redevelopment: audit and proposal

Status: waiting for your approval (step 3 of the brief). Nothing has been built or deleted yet.
Date: 24 Oct 2026

---

## 1. Fix before anything else (security)

These are not in the brief, but I found them during the audit and they matter more than the redesign.

1. **`.env.production` is committed to git** (since commit `cce5abd`). It holds `JWT_SECRET`, `ADMIN_SECRET_TOKEN` and a `DATABASE_URL` that includes the Postgres password. The repo is on GitHub (`Dremorait/Dremora`). If that repo is public, or ever was, treat all three as leaked:
   - rotate the Supabase database password, the JWT secret and the admin token now, from the Supabase dashboard
   - I then remove the file from git and add it to `.gitignore` (the old values stay in git history, so rotation is the real fix)
2. **Intern records are read straight from the browser.** `internship.html` and `intern-dashboard.html` query the Supabase `interns` table with the public anon key, and the dashboard runs `select('*')`. Whether anyone can dump every intern's personal data depends on that table's RLS policy, which I have not checked. The rebuild moves verification into a serverless function that returns only the fields a certificate needs.
3. **`backend/node_modules` is committed** (3,618 files). It should be removed from git and ignored.

## 2. Audit: keep, rewrite, delete

### Keep (as is, or restyled only)
| Item | Notes |
|---|---|
| Logo `assets/images/logo.png` | Stays in the header, linked home |
| Ganesha image `assets/images/ganesha.jpg` and blessing line | Footer, per brief |
| Phone +91 9309795878, email dremora.itservices@gmail.com, Pune 411032 address | Will be written one way everywhere (today there are 3 phone formats) |
| Refund Policy text | Keep wording, restyle, fix dashes |
| Supabase project, `interns` table, admin panel, intern dashboard, certificate uploads (`intern_documents` bucket) | The data and the old URLs keep working |
| `google1991c059168d1010.html` | Search Console verification file, keep at root |
| Security headers in `vercel.json` | Keep and tighten the CSP (drop `unsafe-eval`, unused CDNs and Google Analytics) |
| Concept build screenshots (`eduro.png`, `drechain_preview.png`, restaurant, healthcare, e-commerce) | Reuse as thumbnails under "Concept builds", converted to WebP/AVIF |

### Rewrite
| Item | Why |
|---|---|
| All page copy | Banned words and patterns: 46 em/en dashes on 4 core pages, "premium", "Trusted by", "000+ customers", "100% Guaranteed", "Building Our Portfolio" |
| All CSS (7 files, 39 `gradient(` uses, glow blobs on the verify page) | Replaced by one small stylesheet built on the section 4 tokens |
| Fonts | Inter from Google Fonts becomes self-hosted IBM Plex Sans, Mono and Sans Devanagari |
| Canonicals and `og:url` | Today they point at two different Vercel domains (`dremora-it.vercel.app` and `dremora-sigma.vercel.app`). All move to `https://www.dremorait.in` |
| `robots.txt`, `sitemap.xml` | Both point at `dremora-sigma.vercel.app`; sitemap lists `.html` URLs |
| `<html lang="en">` | Becomes `en-IN`. The About page title has a broken character (`About � Dremora IT`) |
| Privacy Policy, Terms of Service | Rewritten to the section 8 structure. Kept: anything that is accurate today |
| Contact form | Today it inserts into a Supabase `contacts` table from the browser. Becomes a Vercel function with validation, honeypot, rate limit, consent checkbox and email delivery |
| Certificate verification | See section 4 below: the QR links printed on certificates are broken today |
| Analytics | Google Analytics (`G-7BGCG2F6PK`) sets cookies. Replace with Vercel Web Analytics (cookieless), so no cookie banner is needed |

### Delete
| Item | Why |
|---|---|
| `js/sparkles.js`, `js/coverflow.js`, `js/showcase.js`, `css/animations.css`, `css/coverflow.css`, `css/showcase.css` | Banned motion (sparkles, coverflow, scroll effects) |
| `js/ai-chat.js`, `js/sam-assistant.js`, `api/ai.php`, `backend/api/ai.php`, `backend/test_gemini.py` | Chat widget on a content site; also needs disclosure in the Privacy Policy if kept. **Your call, see question 5** |
| One-off scripts at the root: `add_*.js/py`, `fix_*.js/py`, `debug_*.js`, `remove_*.js`, `update_*.js/py`, `find_icons.js`, `lazy_load_images.js`, `test*.py/js`, `rewrite_dashboard.js`, `check_*.js`, `insert_admin.js`, `setup_db.js`, `supabase_script.js`, `build_icons.js`, `scratch/`, the empty file `git` | Leftover tooling, not part of the site |
| `frontend/` (old React verify app), `src/internship/` + `vite.config.ts` + `dist/` (newer React verify app, never deployed because Vercel serves the repo root with no build) | Two unused copies of the verification UI. I will reuse their validation logic, then remove them |
| `CSS_Complete_Notes.pdf` (26 MB), `2eee0d2bcd360261ff29d69486634f7b.jpg` | Unrelated files in the web root, publicly downloadable today |
| `DESIGN.md` | It is a design spec for Clerk (another company), with purple tokens. Replaced by the tokens below |
| `js/forms.js` internship application handler | No page uses it |
| `meta keywords` tags | Brief says remove |

## 3. Tech choice

**Astro, static output, on Vercel**, as the brief recommends. Reasons it fits this repo: the site is content, Astro ships zero JS by default, and `.html` pages map one to one onto Astro pages.

- Content pages ship no framework JS. The only client scripts: theme toggle, mobile menu, contact form submit, verify form submit. All plain JS, well under 30 KB.
- Two Vercel functions in `api/`: `contact` and `verify`. Keys only in Vercel environment variables.
- The intern dashboard and admin panel are apps, not content pages, and are not in the brief's site map. **Phase 1 keeps them working at their current URLs, untouched, with `noindex`.** Restyling them can be a later step.
- Email delivery: **Resend** (free tier is enough). Needs a Resend account and a verified sending domain on dremorait.in. Alternatives: Brevo, Postmark.
- Rate limiting without adding a database: Vercel's built-in firewall rate-limit rule on `/api/contact` and `/api/verify`, plus a small per-IP limit inside the function as a backstop.
- `npm run check:banned` script (plain Node, no dependency) runs on source and on built HTML, and fails the build on any section 2 or section 10 violation.

## 4. Certificate verification: what exists and what I will preserve

How it works today:
1. `/internship.html`: intern enters ID (`DRM-INT-...`) and full name. The browser queries Supabase `interns` and, on match, stores the ID in `sessionStorage` and goes to `/intern-dashboard.html`.
2. `/intern-dashboard.html`: reads `select('*')` for that ID and shows the record, certificate image and a QR code.
3. The QR code encodes `/intern-dashboard.html?verify=<ID>`. **Nothing reads that `verify` parameter**, so anyone scanning a certificate QR today lands on the login form instead of a verification result. (Only the undeployed React app reads it.)

Plan:
- `/internship` = program details + verification form. `/internship.html` 301s to it.
- `/intern-dashboard.html?verify=<ID>` (every QR already printed) and `/internship?verify=<ID>` both show a public verification result: name, program, dates, status, certificate ID. No phone, email or college unless you say otherwise.
- Verification goes through `/api/verify`, using a server-side Supabase key, returning only those fields.
- The intern login path to the dashboard keeps working as today.
- Tests (Node's built-in test runner, no framework): valid ID, invalid ID, malformed input.

## 5. Site map and redirects

Trailing slash convention: **no trailing slash** everywhere (`/services/websites`, not `/services/websites/`).

| Route | Page | 301 from |
|---|---|---|
| `/` | Home | `/index.html` |
| `/services` | Overview, links to the 3 pages | `/services.html` |
| `/services/websites` | Website development | `/services.html#websites` (see note) |
| `/services/web-apps` | Web applications | `/services.html#webapps` |
| `/services/ai-automation` | AI and WhatsApp automation | `/services.html#ai` |
| `/work` | Client work, then `#concepts` | `/projects.html` |
| `/work/[slug]` | Case study (one per real project) | new |
| `/about` | Founder, how we work, internship program | `/about.html` |
| `/contact` | Form, WhatsApp, phone, email, address | `/contact.html` |
| `/contact/thanks` | Form success page, `noindex` | new |
| `/internship` | Program + verification | `/internship.html` |
| `/internship/guidelines` | Course guidelines (existing page, restyled) | `/course-guidelines.html` |
| `/privacy-policy` | Privacy Policy | `/privacy-policy.html` |
| `/terms` | Terms and Conditions | `/terms-of-service.html` |
| `/refund-policy` | Refund Policy | `/refund-policy.html` |
| `/404` | Not found, `noindex` | new |
| `/intern-dashboard.html`, `/admin-login.html`, `/admin-dashboard.html` | Unchanged apps, `noindex` | keep URLs |

Note on the `#` rows: servers never see the part after `#`, so a 301 cannot target it. `/services.html` 301s to `/services`, and a 10-line inline script on `/services` forwards `#websites`, `#webapps`, `#ai` to the right page.

Domain redirects (Vercel project settings + `vercel.json`):
- `http://` to `https://`, `dremorait.in` to `www.dremorait.in`: Vercel domain settings
- `dremora-it.vercel.app` and `dremora-sigma.vercel.app`: 301 to the same path on `www.dremorait.in`
- Preview deployments: `X-Robots-Tag: noindex` header

Header nav: Logo, Services, Work, About, Contact, button "Get a quote". "Verify" moves to the footer.

## 6. Design tokens

All text pairings checked with the WCAG formula:

| Pairing | Ratio | AA body (4.5) |
|---|---|---|
| ink on bg (light) | 15.92 | pass |
| muted on bg (light) | 7.18 | pass |
| accent-ink on bg (light) | 4.52 | pass, barely |
| accent-ink on surface (light) | 4.80 | pass |
| navy text on orange button | 5.77 | pass |
| white on orange | 2.93 | fail, never used |
| ink on bg (dark) | 15.73 | pass |
| muted on bg (dark) | 8.31 | pass |
| accent-ink on bg (dark) | 8.16 | pass |

**One problem in the brief:** a focus outline must reach 3:1 against the background (WCAG 2.2, 1.4.11). Orange `#E8790C` on the light background is **2.76:1, a fail**. On dark it is 6.17:1. Proposal: focus outline uses `--focus`, which is `#B35A00` (4.52:1) in light and `#E8790C` in dark. It still reads as orange. See question 3.

```css
:root {
  --bg: #FAF8F4;
  --surface: #FFFFFF;
  --ink: #0D1B3E;
  --muted: #4A5468;
  --rule: #E3DED3;
  --accent: #E8790C;      /* button fill, small markers, never text on light */
  --accent-ink: #B35A00;  /* links, orange text */
  --focus: #B35A00;

  --font-sans: "IBM Plex Sans", "IBM Plex Sans Devanagari", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, monospace;

  --text-body: 1rem;      /* 16px, line-height 1.6 */
  --text-h1: 2.5rem;      /* 40px desktop, 2rem mobile */
  --text-h2: 1.75rem;     /* 28px desktop, 1.5rem mobile */
  --text-h3: 1.25rem;     /* 20px */
  --text-small: 0.875rem; /* 14px, mono labels */
  --measure: 68ch;

  --content-max: 1200px;
  --gutter: 24px;         /* 16px under 600px */
  --section-gap: 96px;    /* 64px mobile */
  --radius: 2px;          /* buttons, inputs, labels; 4px is the hard max */
  --tap: 44px;
  --shadow-shot: 0 1px 2px rgb(13 27 62 / 0.08); /* screenshots only */
  --motion: 120ms;        /* hover/focus only, 0 under prefers-reduced-motion */
}

/* applied for prefers-color-scheme: dark, unless the toggle chose light,
   and for [data-theme="dark"] */
:root[data-theme="dark"] {
  --bg: #0A1530;
  --surface: #0D1B3E;
  --ink: #F2EFE8;
  --muted: #A9B0C0;
  --rule: #22305A;
  --accent: #E8790C;
  --accent-ink: #F29A45;
  --focus: #E8790C;
}
```

Grid: 12 columns inside 1200px. Sections divided by a 1px `--rule` line and the section gap. No cards with shadows. Screenshots sit in a 1px bordered frame with `--shadow-shot`, the only shadow on the site. Icons: Lucide, inline SVG, only where they help scanning.

## 7. Homepage wireframe (desktop, plain text)

Hero headline shown is draft A from the brief. You pick (question 1).

```
+--------------------------------------------------------------------------+
| [logo]               Services   Work   About   Contact   [ Get a quote ] |
+--------------------------------------------------------------------------+

  Websites and WhatsApp automation for Pune businesses,
  built and supported by the founder.                             <- H1

  Websites from Rs {{price}}, live in {{n}} weeks. Fixed price,   <- only if
  fixed timeline.                                                    prices set
  [ Get a fixed quote ]   Message us on WhatsApp ->
  PUNE, INDIA. EST. 2025.                                        <- mono, muted

------------------------------------------------------------------------ rule
  REAL WORK                                                      <- mono label
  +-----------------------------+   Agri-tech company, Maharashtra
  |                             |   Problem: one sentence.
  |   real screenshot, 1px      |   Built: website plus WhatsApp automation.
  |   frame                     |   Read the case study ->
  +-----------------------------+
  (second case study row, same layout, if one is approved)

------------------------------------------------------------------------ rule
  WHAT WE BUILD
  Websites            For: shops, clinics, ...     Includes: ...
                      2 to 4 weeks                 Starting at Rs {{}}    ->
  ----------------------------------------------------------------------
  Web applications    For: ...                     Includes: ...
                      {{timeline}}                 Starting at Rs {{}}    ->
  ----------------------------------------------------------------------
  AI and WhatsApp     For: ...                     Includes: ...
  automation          {{timeline}}                 Starting at Rs {{}}    ->

------------------------------------------------------------------------ rule
  HOW A PROJECT RUNS
  1  A free 30 minute call.     2  A written fixed quote.     3  We build,
     ...                           ...                           you see a demo
                                                                 every week.

------------------------------------------------------------------------ rule
  WHO YOU WILL WORK WITH
  +-----------+   {{founder name}}, founder
  |  photo    |   Three sentences on why the studio exists.
  +-----------+   LinkedIn ->

------------------------------------------------------------------------ rule
  CONCEPT BUILDS  (sample work, not client projects)
  [thumb] [thumb] [thumb] [thumb] [thumb] [thumb]     See all concept builds ->

------------------------------------------------------------------------ rule
  TELL US WHAT YOU NEED
  Name  [            ]       Phone or email  [            ]
  What you need [ Website v ]   Message [                           ]
  [x] I agree to Dremora IT contacting me about this enquiry (Privacy Policy)
  [ Send ]                        Or call +91 93097 95878 / WhatsApp ->

+--------------------------------------------------------------------------+
| Footer: nav, 3 services, Internship, Verify, legal links, contact,       |
| socials, Ganesha image and blessing line, (c) {year} Dremora IT          |
+--------------------------------------------------------------------------+
```

One quote button per screen: on the home page the header and hero buttons would both sit on the first screen, so on `/` only, the header "Get a quote" renders as a plain text link and the hero button is the one primary. Every other page keeps the header button. No scroll script needed.

Mobile: single column, same order. Menu opens full screen with a 150ms fade.

Sections with missing facts (prices, founder, case study permission) are hidden in the production build until the fact exists. If no prices are confirmed at launch, the hero supporting line falls back to "Fixed price, fixed timeline. Pune, India." with no number.

## 8. Things outside this repo

- **Concept demos** live in other repos and hosts (`eduro-phi.vercel.app`, `dremora-house.vercel.app`, `drechain.netlify.app`, `prototyperestro.netlify.app`, `drmhealth.netlify.app`, `drmcommerce.netlify.app`, `drmroi.netlify.app`). The demo strip, fake stat removal, renaming, the restaurant encoding fix and subdomains all have to happen in those repos. Until they are fixed, this site can link to them with the "Concept build" label, or not link at all (question 6).
- **Social links**: GitHub `Dremorait`, LinkedIn `dremoraitservices`, Instagram `dremora.it`, Twitter `dremoraitservices`. I will check each resolves before launch. Twitter/X often blocks automated checks, so you may need to confirm that one.
- **DNS, Vercel domains, Search Console, Bing, Google Business Profile**: your accounts. I will list exact steps at the end.

## 9. Open TODOs (facts file will start with these)

1. Founder name, role, photo, LinkedIn URL. The current About page says "Aniket Wable" and uses `krushna_bhadale.png`. Confirm which is correct and send a real photo.
2. Starting price in INR for websites, web apps, AI and WhatsApp automation
3. Typical timeline for each service
4. Doctor Soil Technology: permission to name them (yes/no), short quote, results they agree to publish, screenshots, month shipped
5. Manasvi: same as above. Note this was Instagram growth and a 30-day plan, which is not one of the three services. Do you want it on the Work page?
6. Final email for privacy and grievance requests (use dremora.itservices@gmail.com?)
7. Grievance Officer name, email, address
8. Data retention period per category (enquiries, intern records, certificates, server logs)
9. Contact response time you actually keep
10. Does the internship accept applicants under 18? (decides whether the form needs guardian consent)
11. Which images are real work: `agrotrack_dashboard.png`, `agro_smart_irrigation.png`, `nagarseva_dashboard.png`, `dashboard_mockup.png`, `business_growth.png`
12. Which fields a public certificate check should show

## 10. Decisions I need from you

1. **Hero headline**: draft A ("Websites and WhatsApp automation for Pune businesses, built and supported by the founder.") or draft B ("We build the website, booking system or WhatsApp bot your business needs. Fixed price, fixed timeline.")
2. **Stack**: Astro static on Vercel (recommended) or stay on plain HTML
3. **Focus colour**: darker orange `#B35A00` in light theme (passes WCAG) or the brief's `#E8790C` everywhere (fails 3:1 on the light background)
4. **Secrets**: confirm you will rotate the leaked keys, and that I may delete `.env.production` from git
5. **AI chat widget (SAM)**: remove (recommended, no chatbot on a content site) or keep
6. **Concept demo links** until the demo sites are fixed: link with a label, or show screenshots only
7. **Email provider**: Resend (recommended), or another you already use
8. **Delete list in section 2**: approve, or tell me what to keep

Once you approve, I build in this order, checking each page against sections 2 and 10 before moving on:
foundation (Astro, tokens, fonts, layout, facts file, `check:banned`, redirects) → Home → Services (3 + overview) → Work → About → Contact + `/api/contact` → Internship + `/api/verify` + tests → legal pages → 404, icons, sitemap, robots, OG images → full checklist run.

> Note for the build log, not the site: have a lawyer in India review the Privacy Policy and Terms before publishing.
