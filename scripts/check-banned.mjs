// npm run check:banned
// Fails (exit 1) on anything from section 2 of the redevelopment brief, plus the
// per-page SEO and content-truth checks from section 10. Runs after every build.
// Also prints the open TODO list from src/content/site.ts.
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative, extname, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const ORIGIN = 'https://www.dremorait.in';

// Old intern dashboard and admin apps, kept unchanged for now (see docs/redevelopment).
// They still contain gradients and old styling; restyling them is a separate task.
const LEGACY = [
  'public/intern-dashboard.html',
  'public/admin-login.html',
  'public/admin-dashboard.html',
  'public/css/',
  'public/js/',
  'dist/intern-dashboard.html',
  'dist/admin-login.html',
  'dist/admin-dashboard.html',
  'dist/css/',
  'dist/js/',
];
const SKIP_FILES = ['scripts/check-banned.mjs']; // this file names the banned patterns
const TEXT = new Set(['.astro', '.ts', '.js', '.mjs', '.css', '.html', '.json', '.xml', '.svg', '.txt', '.webmanifest', '.md']);

const BANNED_WORDS = [
  'premium', 'cinematic', 'enterprise-grade', 'cutting-edge', 'seamless', 'seamlessly', 'world-class', 'next-gen',
  'innovative', 'innovating', 'innovation', 'transform', 'transforms', 'transformation', 'transformative', 'elevate',
  'elevates', 'unlock', 'unlocks', 'empower', 'empowers', 'leverage', 'leverages', 'robust', 'synergy', 'synergies',
  'digital excellence', 'solutions', 'solution', "we don't just", 'we do not just',
];
const wordRe = new RegExp(`(?<![\\w-])(${BANNED_WORDS.map((w) => w.replace(/[-']/g, (c) => `\\${c}`)).join('|')})(?![\\w-])`, 'i');

const problems = [];
const cspConfig = await readFile(join(ROOT, 'vercel.json'), 'utf8');
const report = (file, msg) => problems.push(`${file}: ${msg}`);

async function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const rel = (p) => relative(ROOT, p).split(sep).join('/');
const isLegacy = (r) => LEGACY.some((l) => r === l || r.startsWith(l));

// Visible copy of an HTML page: text nodes, user-facing attributes and JSON-LD.
function copyOf(html) {
  const ld = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join(' ');
  const attrs = [...html.matchAll(/\s(?:alt|title|aria-label|placeholder|content)="([^"]*)"/g)].map((m) => m[1]).join(' ');
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&');
  return `${text} ${attrs} ${ld}`;
}

function checkCommon(file, src, ext) {
  if (/[–—]|&[mn]dash;|\\u201[34]/i.test(src)) report(file, 'em or en dash (use commas, colons, parentheses or "to")');
  const emoji = src.match(/(?![©®™↔-↙↩↪])\p{Extended_Pictographic}/u);
  if (emoji) report(file, `emoji character ${JSON.stringify(emoji[0])}`);
  // Gradients, pill buttons and rounded boxes are not checked: the owner approved the
  // Codex-style skin (gradient wash, pills, glass) in writing on 25 Oct 2026, as the
  // brief's section 10 allows. Every other section 2 rule below still applies.
  if (/\bAOS\b|ScrollTrigger|whileInView|\blenis\b|IntersectionObserver|<marquee|scroll-?progress/i.test(src)) {
    report(file, 'scroll-triggered animation code (AOS, ScrollTrigger, whileInView, Lenis, IntersectionObserver, marquee, progress bar)');
  }
  if (ext === '.css' || ext === '.astro') {
    if (/@keyframes|animation\s*:/i.test(src)) report(file, 'CSS animation (only hover and focus transitions are allowed)');
  }
}

function checkPage(file, html, seen) {
  const copy = copyOf(html);
  const word = copy.match(wordRe);
  if (word) report(file, `banned word "${word[1]}" in copy`);
  if (copy.includes('{{TODO')) report(file, 'unresolved {{TODO}} in the production build');
  if (/vercel\.app/.test(html)) report(file, 'mentions vercel.app');

  if (!/<html lang="en-IN">/.test(html)) report(file, 'missing <html lang="en-IN">');
  if (!/<head>\s*<meta charset="utf-8"\s*\/?>/i.test(html)) report(file, '<meta charset="utf-8"> is not the first tag in <head>');
  if (/name="keywords"/.test(html)) report(file, 'meta keywords tag');

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"');
  if (!title) report(file, 'missing <title>');
  else if (decode(title).length >= 60) report(file, `title is ${decode(title).length} characters (limit 59): ${title}`);
  if (!desc) report(file, 'missing meta description');
  else if (decode(desc).length >= 155) report(file, `description is ${decode(desc).length} characters (limit 154)`);

  const noindex = /<meta name="robots" content="noindex"/.test(html);
  if (!noindex) {
    for (const [kind, value] of [['title', title], ['description', desc]]) {
      if (seen[kind].has(value)) report(file, `duplicate ${kind}, also on ${seen[kind].get(value)}`);
      seen[kind].set(value, file);
    }
    const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const ogUrl = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1];
    if (!canonical?.startsWith(ORIGIN)) report(file, `canonical must be on ${ORIGIN}`);
    if (canonical !== ogUrl) report(file, 'og:url differs from canonical');
    if (!/<meta property="og:image" content="https:\/\/www\.dremorait\.in\/og\/[\w-]+\.png"/.test(html)) report(file, 'missing per-page og:image');
    if (!/<meta property="og:locale" content="en_IN"/.test(html)) report(file, 'missing og:locale en_IN');
  }

  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1s !== 1) report(file, `has ${h1s} <h1> elements (needs exactly one)`);
  let last = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) {
    const level = Number(m[1]);
    if (last && level > last + 1) report(file, `heading jumps from h${last} to h${level}`);
    last = level;
  }

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0];
    if (!/\salt="[^"]+"/.test(tag)) report(file, `image without alt text: ${tag.slice(0, 80)}`);
    if (!/\swidth="\d+"/.test(tag) || !/\sheight="\d+"/.test(tag)) report(file, `image without width and height: ${tag.slice(0, 80)}`);
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1] ?? '';
    if (src && !/\.(webp|avif|svg)(\?|$)/.test(src)) report(file, `image is not WebP or AVIF: ${src}`);
  }

  // CSP is script-src 'self' plus listed hashes: an inline script runs only if its sha256 is in vercel.json.
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/type="application\/ld\+json"/.test(m[1])) continue;
    if (/\ssrc=/.test(m[1]) || !m[2].trim()) continue;
    const hash = `'sha256-${createHash('sha256').update(m[2]).digest('base64')}'`;
    if (!cspConfig.includes(hash)) report(file, `inline <script> would be blocked by the CSP (add ${hash} to vercel.json)`);
  }
}

async function jsWeight(file, html, dist) {
  let total = 0;
  for (const m of html.matchAll(/<script\b[^>]*\ssrc="(\/[^"]+\.js)"/g)) {
    if (m[1].startsWith('/_vercel/')) continue;
    try {
      total += gzipSync(await readFile(join(dist, m[1]))).length;
    } catch {}
  }
  if (total > 30 * 1024) report(file, `JavaScript is ${(total / 1024).toFixed(1)} KB compressed (limit 30 KB)`);
  return total;
}

// ---------------------------------------------------------------------------

const sourceDirs = ['src', 'public', 'api', 'scripts', 'tests'].map((d) => join(ROOT, d));
const files = [
  ...(await Promise.all(sourceDirs.map(walk))).flat(),
  join(ROOT, 'astro.config.mjs'),
  join(ROOT, 'vercel.json'),
];
const excluded = new Set();
for (const f of files) {
  const r = rel(f);
  const ext = extname(f);
  if (!TEXT.has(ext) || SKIP_FILES.includes(r)) continue;
  if (isLegacy(r)) {
    excluded.add(r.split('/').slice(0, 2).join('/'));
    continue;
  }
  checkCommon(r, await readFile(f, 'utf8'), ext);
}

const DIST = join(ROOT, 'dist');
let built = [];
try {
  if ((await stat(DIST)).isDirectory()) built = await walk(DIST);
} catch {}
const seen = { title: new Map(), description: new Map() };
const weights = [];
for (const f of built) {
  const r = rel(f);
  const ext = extname(f);
  if (isLegacy(r) || !TEXT.has(ext)) continue;
  const src = await readFile(f, 'utf8');
  checkCommon(r, src, ext === '.html' ? '.html' : ext);
  if (ext === '.html' && !r.startsWith('dist/google')) {
    checkPage(r, src, seen);
    weights.push([r, await jsWeight(r, src, DIST)]);
  }
}

// Open TODOs from the facts file
const facts = await readFile(join(ROOT, 'src/content/site.ts'), 'utf8');
const todos = [...facts.matchAll(/todo\((['"`])((?:(?!\1).)*)\1\)/g)].map((m) => m[2]);

console.log('\nOpen TODOs (facts needed before these parts can show on the live site):');
todos.forEach((t, i) => console.log(`  ${String(i + 1).padStart(2)}. ${t}`));
if (excluded.size) console.log(`\nNot checked (legacy intern/admin apps kept unchanged): ${[...excluded].join(', ')}`);
if (built.length) {
  const heaviest = weights.sort((a, b) => b[1] - a[1])[0];
  if (heaviest) console.log(`\nLargest page JavaScript: ${heaviest[0]} at ${(heaviest[1] / 1024).toFixed(1)} KB compressed.`);
} else {
  console.log('\nNo dist/ folder: built HTML was not checked. Run `npm run build`.');
}
console.log('\nReminder: have a lawyer in India review the Privacy Policy and Terms before publishing.');

if (problems.length) {
  console.error(`\ncheck:banned found ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('\ncheck:banned passed.');
