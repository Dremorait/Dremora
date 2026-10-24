// Small helpers shared by the Vercel functions in api/.

export const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });

export const clientIp = (request) =>
  (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || 'unknown';

/**
 * Fixed-window rate limiter per key.
 * ponytail: in-memory, so each warm function instance counts separately and a cold
 * start resets it. The real limit is the Vercel Firewall rule on /api/* (see
 * DEPLOYMENT.md); this is the backstop. Move to Upstash or Vercel KV if abuse appears.
 */
export function rateLimiter({ limit, windowMs }) {
  const hits = new Map();
  return (key, now = Date.now()) => {
    const entry = hits.get(key);
    if (!entry || now - entry.start >= windowMs) {
      hits.set(key, { start: now, count: 1 });
      if (hits.size > 5000) for (const [k, v] of hits) if (now - v.start >= windowMs) hits.delete(k);
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

/** Read a JSON or form-encoded body into a plain object. */
export async function readBody(request) {
  const type = request.headers.get('content-type') || '';
  const text = await request.text();
  if (text.length > 20000) return null;
  if (type.includes('application/json')) {
    try {
      const v = JSON.parse(text);
      return v && typeof v === 'object' && !Array.isArray(v) ? v : null;
    } catch {
      return null;
    }
  }
  return Object.fromEntries(new URLSearchParams(text));
}

export const wantsJson = (request) => (request.headers.get('accept') || '').includes('application/json');
