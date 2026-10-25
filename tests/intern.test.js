// Intern dashboard session: valid session, missing or forged cookie, private columns. Run with `npm test`.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { POST } from '../api/verify.js';
import { GET, DASHBOARD_FIELDS } from '../api/intern.js';
import { COOKIE_NAME, SESSION_SECONDS, createToken } from '../api/_lib/session.js';

const SECRET = 'test-session-secret-0123456789abcdef';
const PRIVATE = ['email', 'phone', 'college', 'course', 'mentor', 'remarks', 'notes', 'id', 'github_url', 'linkedin_url', 'portfolio_url'];

const realFetch = globalThis.fetch;
let calls;
let ip = 0;

// Every column of the table, as Supabase would return them if the select were ignored.
const row = {
  id: '6f1c1d9e-0000-4000-8000-000000000001',
  intern_id: 'DRM-INT-2026-001',
  full_name: 'Test Intern',
  email: 'private@example.com',
  phone: '9999999999',
  college: 'Private College',
  course: 'B.E.',
  mentor: 'Mentor Name',
  remarks: 'private remark',
  notes: 'private note',
  github_url: 'https://github.com/example',
  linkedin_url: 'https://linkedin.com/in/example',
  portfolio_url: 'https://example.com',
  certificate_number: 'DRM-CERT-2026-WD-001',
  certificate_url: 'certificates/DRM-INT-2026-001.png',
  photo: 'DRM-INT-2026-001.webp',
  domain: 'Web Development',
  batch: '2026',
  status: 'Completed',
  start_date: '2026-01-05',
  end_date: '2026-03-31',
};

const mockSupabase = (rows) => {
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
};

const signIn = (body) =>
  POST(new Request('https://www.dremorait.in/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.1.0.${++ip}` }, body: JSON.stringify(body) }));
const dashboard = (cookie) => {
  const headers = { 'x-forwarded-for': `10.1.1.${++ip}` };
  if (cookie) headers.cookie = cookie;
  return GET(new Request('https://www.dremorait.in/api/intern', { headers }));
};
const tokenOf = (setCookie) => setCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`))[1];

beforeEach(() => {
  calls = [];
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
  process.env.INTERN_SESSION_SECRET = SECRET;
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

test('sign-in sets a signed HttpOnly session cookie', async () => {
  mockSupabase([row]);
  const res = await signIn({ id: 'drm-int-2026-001', name: 'Test Intern' });
  assert.equal(res.status, 200);
  const cookie = res.headers.get('set-cookie');
  assert.ok(cookie.startsWith(`${COOKIE_NAME}=`));
  for (const attr of ['HttpOnly', 'Secure', 'SameSite=Strict', 'Path=/', `Max-Age=${SESSION_SECONDS}`]) assert.ok(cookie.includes(attr), attr);
  assert.ok(!/Domain=/i.test(cookie));
  // The token is not echoed in the body, so page script never holds it.
  assert.ok(!JSON.stringify(await res.json()).includes(tokenOf(cookie)));
});

test('failed sign-in sets no cookie', async () => {
  mockSupabase([]);
  const res = await signIn({ id: 'DRM-INT-2026-001', name: 'Someone Else' });
  assert.equal(res.status, 404);
  assert.equal(res.headers.get('set-cookie'), null);
});

test('sign-in fails closed when INTERN_SESSION_SECRET is missing or short', async () => {
  mockSupabase([row]);
  for (const value of [undefined, 'too-short']) {
    if (value === undefined) delete process.env.INTERN_SESSION_SECRET;
    else process.env.INTERN_SESSION_SECRET = value;
    const res = await signIn({ id: 'DRM-INT-2026-001', name: 'Test Intern' });
    assert.equal(res.status, 500);
    assert.equal(res.headers.get('set-cookie'), null);
  }
});

test('valid session returns the dashboard fields for that intern only', async () => {
  mockSupabase([row]);
  const cookie = tokenOf((await signIn({ id: 'drm-int-2026-001', name: 'Test Intern' })).headers.get('set-cookie'));
  calls = [];
  const res = await dashboard(`theme=dark; ${COOKIE_NAME}=${cookie}`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.deepEqual(Object.keys(body.intern).sort(), [...DASHBOARD_FIELDS].sort());
  assert.equal(body.intern.full_name, 'Test Intern');
  assert.equal(body.intern.certificate_url, row.certificate_url);
  // The lookup uses the stored ID from the token, matched exactly, with the service role key.
  const url = new URL(calls[0].url);
  assert.equal(url.searchParams.get('intern_id'), 'eq.DRM-INT-2026-001');
  assert.equal(calls[0].init.headers.apikey, 'test-key');
});

test('private columns never come back, even if Supabase returns them', async () => {
  mockSupabase([row]);
  const res = await dashboard(`${COOKIE_NAME}=${createToken('DRM-INT-2026-001')}`);
  const text = await res.clone().text();
  const body = await res.json();
  for (const col of PRIVATE) {
    assert.equal(body.intern[col], undefined, `${col} returned`);
    assert.ok(!DASHBOARD_FIELDS.includes(col), `${col} in DASHBOARD_FIELDS`);
  }
  for (const value of [row.email, row.phone, row.college, row.remarks, row.notes, row.id]) assert.ok(!text.includes(value), `${value} leaked`);
  const select = new URL(calls[0].url).searchParams.get('select').split(',');
  for (const col of PRIVATE) assert.ok(!select.includes(col), `${col} selected`);
});

test('missing cookie returns 401 without calling Supabase', async () => {
  mockSupabase([row]);
  for (const cookie of [undefined, '', 'theme=dark', `${COOKIE_NAME}=`]) {
    const res = await dashboard(cookie);
    assert.equal(res.status, 401, `expected 401 for ${JSON.stringify(cookie)}`);
    assert.deepEqual(await res.json(), { ok: false, error: 'signed_out' });
  }
  assert.equal(calls.length, 0);
});

test('forged, tampered or expired cookies return 401 without calling Supabase', async () => {
  mockSupabase([row]);
  const good = createToken('DRM-INT-2026-001');
  const [payload, mac] = good.split('.');
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + 3600;

  // Someone else's ID with the original signature.
  const otherPayload = b64({ id: 'DRM-INT-2026-002', exp });
  // Signed with a different secret.
  const wrongKey = `${otherPayload}.${createHmac('sha256', 'not-the-real-secret-0123456789abcdef').update(otherPayload).digest('base64url')}`;
  // Correctly signed but expired.
  const expired = createToken('DRM-INT-2026-001', Date.now() - (SESSION_SECONDS + 1) * 1000);
  // Correctly signed, but the ID carries PostgREST filter syntax.
  const badIdPayload = b64({ id: 'x,full_name.ilike.*', exp });
  const badId = `${badIdPayload}.${createHmac('sha256', SECRET).update(badIdPayload).digest('base64url')}`;

  for (const token of [
    `${otherPayload}.${mac}`,
    wrongKey,
    expired,
    badId,
    payload,
    `${payload}.`,
    `${payload}.${mac}.extra`,
    `${payload}.${mac.slice(0, -1)}${mac.endsWith('A') ? 'B' : 'A'}`,
    'DRM-INT-2026-001',
    'x'.repeat(600),
  ]) {
    const res = await dashboard(`${COOKIE_NAME}=${token}`);
    assert.equal(res.status, 401, `expected 401 for ${token.slice(0, 60)}`);
    assert.ok(res.headers.get('set-cookie').includes('Max-Age=0'), 'stale cookie is cleared');
  }
  assert.equal(calls.length, 0);
});

test('session for a deleted intern returns 404 and clears the cookie', async () => {
  mockSupabase([]);
  const res = await dashboard(`${COOKIE_NAME}=${createToken('DRM-INT-2026-001')}`);
  assert.equal(res.status, 404);
  assert.ok(res.headers.get('set-cookie').includes('Max-Age=0'));
});

test('Supabase failure returns 500 without details', async () => {
  globalThis.fetch = async () => new Response('boom', { status: 503 });
  const res = await dashboard(`${COOKIE_NAME}=${createToken('DRM-INT-2026-001')}`);
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { ok: false, error: 'server_error' });
});
