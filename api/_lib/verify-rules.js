// Certificate check input rules, shared by the browser and api/verify.js.
// IDs look like DRM-INT-2026-001. Letters, digits and hyphens only, so the value
// can never carry PostgREST filter syntax or LIKE wildcards (% and _).

export const ID_PATTERN = /^[A-Za-z0-9-]{5,50}$/;
// Letters from any script, spaces, dots, apostrophes and hyphens. No % or _.
export const NAME_PATTERN = /^[\p{L}\p{M} .'-]{2,150}$/u;

/** Error message for a malformed ID, or null when the ID is well formed. */
export function verifyMessage(id) {
  const v = typeof id === 'string' ? id.trim() : '';
  if (!v) return 'Enter the Internship ID from the certificate.';
  if (!ID_PATTERN.test(v)) return 'An Internship ID has 5 to 50 letters, digits and hyphens, like DRM-INT-2026-001.';
  return null;
}

/** Collapse repeated spaces so "Riya  Patil" matches "Riya Patil". */
export const normaliseName = (name) => (typeof name === 'string' ? name.trim().replace(/\s+/g, ' ') : '');
