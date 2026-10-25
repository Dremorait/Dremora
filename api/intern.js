// Intern dashboard data for the signed-in intern only.
//   GET /api/intern -> { ok, intern } for the intern named in the session cookie set by POST /api/verify
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, INTERN_SESSION_SECRET (all server only).
import { ID_PATTERN } from './_lib/verify-rules.js';
import { json, clientIp, rateLimiter } from './_lib/http.js';
import { readToken, tokenFrom, clearSessionCookie } from './_lib/session.js';

// Columns public/intern-dashboard.html renders. Sign-in needs only the ID and name printed on
// the certificate, so this stays to certificate-level data: no email, phone, college,
// course, mentor, remarks or notes.
export const DASHBOARD_FIELDS = [
  'intern_id', 'full_name', 'certificate_number', 'domain', 'batch', 'status', 'start_date', 'end_date', 'photo', 'certificate_url',
];

const allow = rateLimiter({ limit: 60, windowMs: 10 * 60 * 1000 });

async function loadIntern(id) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
  // The ID comes from a signed token holding the stored value, so an exact match is right.
  const q = new URLSearchParams({ select: DASHBOARD_FIELDS.join(','), intern_id: `eq.${id}`, limit: '1' });
  const res = await fetch(`${SUPABASE_URL}/rest/v1/interns?${q}`, {
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
  const rows = await res.json();
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

const pick = (row) => Object.fromEntries(DASHBOARD_FIELDS.map((k) => [k, row[k] ?? null]));

export async function GET(request) {
  if (!allow(clientIp(request))) return json(429, { ok: false, error: 'rate_limited' });
  try {
    const id = readToken(tokenFrom(request));
    if (!id || !ID_PATTERN.test(id)) return json(401, { ok: false, error: 'signed_out' }, { 'Set-Cookie': clearSessionCookie() });
    const row = await loadIntern(id);
    if (!row) return json(404, { ok: false, error: 'not_found' }, { 'Set-Cookie': clearSessionCookie() });
    return json(200, { ok: true, intern: pick(row) });
  } catch (err) {
    console.error('intern:', err);
    return json(500, { ok: false, error: 'server_error' });
  }
}
