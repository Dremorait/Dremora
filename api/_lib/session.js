// Intern dashboard session: a short-lived signed HttpOnly cookie set by POST /api/verify
// and read by /api/intern. The browser never sees the token, so script on the page
// cannot copy it, and a changed ID or expiry breaks the signature.
// Env: INTERN_SESSION_SECRET (random, at least 32 characters, server only).
import { createHmac, timingSafeEqual } from 'node:crypto';

// __Host- makes the browser reject the cookie unless it is Secure, Path=/ and has no Domain.
export const COOKIE_NAME = '__Host-intern_session';
export const SESSION_SECONDS = 2 * 60 * 60;

function secret() {
  const s = process.env.INTERN_SESSION_SECRET || '';
  if (s.length < 32) throw new Error('INTERN_SESSION_SECRET is not set or shorter than 32 characters');
  return s;
}

const sign = (payload, key) => createHmac('sha256', key).update(payload).digest('base64url');

/** Token for one intern: base64url(JSON {id, exp}).signature */
export function createToken(internId, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ id: internId, exp: Math.floor(now / 1000) + SESSION_SECONDS })).toString('base64url');
  return `${payload}.${sign(payload, secret())}`;
}

/** The intern ID in a valid, unexpired token, or null. */
export function readToken(token, now = Date.now()) {
  if (typeof token !== 'string' || token.length > 500) return null;
  const [payload, mac, extra] = token.split('.');
  if (!payload || !mac || extra !== undefined) return null;
  const want = Buffer.from(sign(payload, secret()));
  const got = Buffer.from(mac);
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null;
  try {
    const { id, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof id !== 'string' || typeof exp !== 'number' || exp * 1000 <= now) return null;
    return id;
  } catch {
    return null;
  }
}

export const sessionCookie = (token) =>
  `${COOKIE_NAME}=${token}; Max-Age=${SESSION_SECONDS}; Path=/; HttpOnly; Secure; SameSite=Strict`;

export const clearSessionCookie = () => `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`;

/** The session token from the request's Cookie header, or null. */
export function tokenFrom(request) {
  for (const part of (request.headers.get('cookie') || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === COOKIE_NAME) return part.slice(i + 1).trim();
  }
  return null;
}
