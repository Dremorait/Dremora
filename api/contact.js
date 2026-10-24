// POST /api/contact: validates an enquiry and emails it to the business inbox via Resend.
// Env: RESEND_API_KEY, CONTACT_TO (inbox), CONTACT_FROM (verified sender on dremorait.in).
import { validateContact, isEmail, NEEDS, BUDGETS } from './_lib/contact-rules.js';
import { json, clientIp, rateLimiter, readBody, wantsJson } from './_lib/http.js';

const allow = rateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

const redirect = (to) => new Response(null, { status: 303, headers: { Location: to } });

// Without JavaScript the browser posts the form directly; answer with a page, not JSON.
const htmlError = (status, message) =>
  new Response(
    `<!doctype html><html lang="en-IN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><title>Message not sent | Dremora IT</title><body style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 16px;line-height:1.6"><h1>Your message was not sent</h1><p>${message}</p><p>Use your browser's Back button: your message is still in the form. Or call <a href="tel:+919309795878">+91 9309795878</a>.</p></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
  );

export async function POST(request) {
  const asJson = wantsJson(request);
  const fail = (status, body, message) => (asJson ? json(status, body) : htmlError(status, message));

  if (!allow(clientIp(request))) {
    return fail(429, { ok: false, error: 'rate_limited' }, 'Too many messages were sent from this connection. Please wait a few minutes.');
  }

  const input = await readBody(request);
  if (!input) return fail(400, { ok: false, error: 'bad_request' }, 'The form data could not be read.');

  // Honeypot: real people never see this field. Pretend success so bots learn nothing.
  if (typeof input.website === 'string' && input.website.trim() !== '') {
    return asJson ? json(200, { ok: true }) : redirect('/contact/thanks');
  }

  const { data, errors } = validateContact(input);
  if (Object.keys(errors).length) {
    return fail(400, { ok: false, errors }, Object.values(errors).join(' '));
  }

  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error('contact: RESEND_API_KEY, CONTACT_TO or CONTACT_FROM is not set');
    return fail(500, { ok: false, error: 'not_configured' }, 'The contact form is not set up yet.');
  }

  const text = [
    `Name: ${data.name}`,
    `Phone or email: ${data.contact}`,
    `Business: ${data.business || '(not given)'}`,
    `Needs: ${NEEDS[data.need]}`,
    `Budget: ${data.budget ? BUDGETS[data.budget] : '(not given)'}`,
    `Consent to be contacted: yes, ${new Date().toISOString()}`,
    '',
    data.message,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        subject: `Website enquiry: ${NEEDS[data.need]} from ${data.name}`.slice(0, 150),
        text,
        ...(isEmail(data.contact) ? { reply_to: data.contact } : {}),
      }),
    });
    if (!res.ok) {
      console.error('contact: Resend responded', res.status, await res.text().catch(() => ''));
      return fail(502, { ok: false, error: 'send_failed' }, 'Our email service did not accept the message.');
    }
  } catch (err) {
    console.error('contact: Resend request failed', err);
    return fail(502, { ok: false, error: 'send_failed' }, 'Our email service could not be reached.');
  }

  return asJson ? json(200, { ok: true }) : redirect('/contact/thanks');
}
