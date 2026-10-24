// Contact form: success, validation errors, server error, honeypot and rate limit.
import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from '../api/contact.js';

const realFetch = globalThis.fetch;
let sent;
let ip = 0;

const valid = {
  name: 'Asha Kulkarni',
  contact: 'asha@example.com',
  business: 'Kulkarni Clinic',
  need: 'website',
  budget: '25k-75k',
  message: 'We need a website with appointment booking for our clinic.',
  consent: 'on',
};

const post = (body, { json = true, from } = {}) =>
  POST(
    new Request('https://www.dremorait.in/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded',
        Accept: json ? 'application/json' : 'text/html',
        'x-forwarded-for': from || `10.1.0.${++ip}`,
      },
      body: json ? JSON.stringify(body) : new URLSearchParams(body).toString(),
    }),
  );

beforeEach(() => {
  sent = [];
  process.env.RESEND_API_KEY = 're_test';
  process.env.CONTACT_TO = 'inbox@example.com';
  process.env.CONTACT_FROM = 'Website <website@dremorait.in>';
  globalThis.fetch = async (url, init) => {
    sent.push({ url: String(url), body: JSON.parse(init.body) });
    return new Response(JSON.stringify({ id: 'email_1' }), { status: 200 });
  };
});
afterEach(() => {
  globalThis.fetch = realFetch;
});

test('valid enquiry is emailed and returns ok', async () => {
  const res = await post(valid);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, 'https://api.resend.com/emails');
  assert.deepEqual(sent[0].body.to, ['inbox@example.com']);
  assert.equal(sent[0].body.reply_to, 'asha@example.com');
  assert.match(sent[0].body.text, /appointment booking/);
});

test('phone number is accepted and no reply_to is set', async () => {
  const res = await post({ ...valid, contact: '+91 98765 43210' });
  assert.equal(res.status, 200);
  assert.equal(sent[0].body.reply_to, undefined);
});

test('form post without JavaScript redirects to the thanks page', async () => {
  const res = await post(valid, { json: false });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/contact/thanks');
});

test('validation errors are returned per field and nothing is sent', async () => {
  const res = await post({ name: 'A', contact: 'not-an-email', need: 'rocket', message: 'hi', consent: '' });
  assert.equal(res.status, 400);
  const body = await res.json();
  assert.deepEqual(Object.keys(body.errors).sort(), ['consent', 'contact', 'message', 'name', 'need']);
  assert.equal(sent.length, 0);
});

test('missing consent is rejected', async () => {
  const { consent, ...noConsent } = valid;
  const res = await post(noConsent);
  assert.equal(res.status, 400);
  assert.ok((await res.json()).errors.consent);
});

test('email provider failure returns 502', async () => {
  globalThis.fetch = async () => new Response('{"message":"bad"}', { status: 500 });
  const res = await post(valid);
  assert.equal(res.status, 502);
  assert.equal((await res.json()).ok, false);
});

test('missing configuration returns 500', async () => {
  delete process.env.RESEND_API_KEY;
  const res = await post(valid);
  assert.equal(res.status, 500);
  assert.equal(sent.length, 0);
});

test('honeypot submissions look successful but send nothing', async () => {
  const res = await post({ ...valid, website: 'http://spam.example' });
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(sent.length, 0);
});

test('the sixth message in ten minutes from one IP is rate limited', async () => {
  const from = '10.9.9.9';
  for (let i = 0; i < 5; i++) assert.equal((await post(valid, { from })).status, 200);
  assert.equal((await post(valid, { from })).status, 429);
});
