// Certificate check: valid ID, invalid ID, malformed input. Run with `npm test`.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { GET, POST, PUBLIC_FIELDS } from '../api/verify.js';

const realFetch = globalThis.fetch;
let calls;
let ip = 0;

const row = {
  intern_id: 'DRM-INT-2026-001',
  full_name: 'Test Intern',
  certificate_number: 'DRM-CERT-2026-WD-001',
  domain: 'Web Development',
  batch: '2026',
  status: 'Completed',
  start_date: '2026-01-05',
  end_date: '2026-03-31',
  email: 'private@example.com',
  phone: '9999999999',
};

const mockSupabase = (rows) => {
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    return new Response(JSON.stringify(rows), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };
};

const get = (id) => GET(new Request(`https://www.dremorait.in/api/verify?id=${encodeURIComponent(id)}`, { headers: { 'x-forwarded-for': `10.0.0.${++ip}` } }));
const post = (body) =>
  POST(new Request('https://www.dremorait.in/api/verify', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `10.0.1.${++ip}` }, body: JSON.stringify(body) }));

beforeEach(() => {
  calls = [];
  process.env.SUPABASE_URL = 'https://example.supabase.co';
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

test('valid ID returns the record with public fields only', async () => {
  mockSupabase([row]);
  const res = await get('DRM-INT-2026-001');
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.ok, true);
  assert.equal(body.record.full_name, 'Test Intern');
  assert.deepEqual(Object.keys(body.record).sort(), [...PUBLIC_FIELDS].sort());
  assert.equal(body.record.email, undefined);
  // The query asks Supabase for public columns only, by exact (case-insensitive) ID.
  const url = new URL(calls[0].url);
  assert.equal(url.searchParams.get('intern_id'), 'ilike.DRM-INT-2026-001');
  assert.ok(!url.searchParams.get('select').includes('email'));
  assert.equal(calls[0].init.headers.apikey, 'test-key');
});

test('unknown ID returns 404', async () => {
  mockSupabase([]);
  const res = await get('DRM-INT-2026-999');
  assert.equal(res.status, 404);
  assert.equal((await res.json()).ok, false);
});

test('malformed IDs are rejected before Supabase is called', async () => {
  mockSupabase([row]);
  for (const bad of ['', 'abc', '%', 'DRM_INT_2026_001', 'DRM-INT-2026-*', "x' or 1=1", 'a,b.c', 'DRM-INT-2026-001)', 'A'.repeat(51)]) {
    const res = await get(bad);
    assert.equal(res.status, 400, `expected 400 for ${JSON.stringify(bad)}`);
  }
  assert.equal(calls.length, 0);
});

test('dashboard sign-in matches ID and full name', async () => {
  mockSupabase([row]);
  const res = await post({ id: 'DRM-INT-2026-001', name: '  Test   Intern ' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, intern_id: 'DRM-INT-2026-001' });
  assert.equal(new URL(calls[0].url).searchParams.get('full_name'), 'ilike.Test Intern');
});

test('dashboard sign-in rejects names with filter characters', async () => {
  mockSupabase([row]);
  for (const name of ['%', 'Test%', 'Te_st', 'a*', 'x,y', '']) {
    const res = await post({ id: 'DRM-INT-2026-001', name });
    assert.equal(res.status, 400, `expected 400 for ${JSON.stringify(name)}`);
  }
  assert.equal(calls.length, 0);
});

test('Supabase failure returns 500 without details', async () => {
  globalThis.fetch = async () => new Response('boom', { status: 503 });
  const res = await get('DRM-INT-2026-001');
  assert.equal(res.status, 500);
  assert.deepEqual(await res.json(), { ok: false, error: 'server_error' });
});
