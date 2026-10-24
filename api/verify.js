// Certificate check and intern dashboard sign-in, served from the existing Supabase `interns` table.
//   GET  /api/verify?id=DRM-INT-2026-001  -> public certificate fields only
//   POST /api/verify {id, name}           -> { ok, intern_id } when ID and full name match
// Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (server only, never sent to the browser).
import { ID_PATTERN, NAME_PATTERN, normaliseName, verifyMessage } from './_lib/verify-rules.js';
import { json, clientIp, rateLimiter, readBody } from './_lib/http.js';

// Fields a stranger holding the certificate may see. No email, phone, college or remarks.
export const PUBLIC_FIELDS = ['intern_id', 'full_name', 'certificate_number', 'domain', 'batch', 'status', 'start_date', 'end_date'];

const allow = rateLimiter({ limit: 30, windowMs: 10 * 60 * 1000 });

async function findIntern(id, name) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set');
  // ilike without wildcards is a case-insensitive exact match. ID and name are
  // pattern-checked first, so neither can contain % _ , ( ) or other filter syntax.
  const q = new URLSearchParams({ select: PUBLIC_FIELDS.join(','), intern_id: `ilike.${id}`, limit: '1' });
  if (name) q.set('full_name', `ilike.${name}`);
  const res = await fetch(`${SUPABASE_URL}/rest/v1/interns?${q}`, {
    headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Supabase responded ${res.status}`);
  const rows = await res.json();
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

const pick = (row) => Object.fromEntries(PUBLIC_FIELDS.map((k) => [k, row[k] ?? null]));

export async function GET(request) {
  if (!allow(clientIp(request))) return json(429, { ok: false, error: 'rate_limited' });
  const id = (new URL(request.url).searchParams.get('id') || '').trim();
  const message = verifyMessage(id);
  if (message) return json(400, { ok: false, error: 'invalid_id', message });
  try {
    const row = await findIntern(id);
    return row ? json(200, { ok: true, record: pick(row) }) : json(404, { ok: false, error: 'not_found' });
  } catch (err) {
    console.error('verify:', err);
    return json(500, { ok: false, error: 'server_error' });
  }
}

export async function POST(request) {
  if (!allow(clientIp(request))) return json(429, { ok: false, error: 'rate_limited' });
  const body = await readBody(request);
  const id = typeof body?.id === 'string' ? body.id.trim() : '';
  const name = normaliseName(body?.name);
  if (!ID_PATTERN.test(id) || !NAME_PATTERN.test(name)) {
    return json(400, { ok: false, error: 'invalid_input', message: 'Check the Internship ID and enter your full name using letters only.' });
  }
  try {
    const row = await findIntern(id, name);
    return row ? json(200, { ok: true, intern_id: row.intern_id }) : json(404, { ok: false, error: 'not_found' });
  } catch (err) {
    console.error('verify:', err);
    return json(500, { ok: false, error: 'server_error' });
  }
}
