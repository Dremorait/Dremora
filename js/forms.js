/**
 * forms.js — Direct Supabase form submission
 * Bypasses the Render backend (cold-start latency) for contact & internship forms.
 * Data is written straight to Supabase using the publishable anon key.
 */

// ─── Supabase config (publishable key — safe in browser) ───────────────────
const SUPABASE_URL  = 'https://vtutbqzkegkgujrdkxmj.supabase.co';
const SUPABASE_ANON = 'sb_publishable_H3CvN9upPS-sZmDYqUuCsQ_7SV1HBgu';

// Lazy-initialise so we only create one client instance
let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    // supabase-js loaded via CDN <script> tag — available as window.supabase
    _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
  }
  return _supabase;
}

// ─── Toast notification (replaces alert()) ──────────────────────────────────
function showToast(message, type = 'success') {
  // Remove any existing toast
  const existing = document.getElementById('dremoraToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'dremoraToast';
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    padding:14px 20px; border-radius:12px; max-width:340px;
    font-family:inherit; font-size:14px; font-weight:500;
    display:flex; align-items:center; gap:10px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation:slideInToast .3s cubic-bezier(.34,1.56,.64,1);
    background:${type === 'success' ? '#0f2417' : '#2a0a0a'};
    border:1px solid ${type === 'success' ? '#22c55e40' : '#ef444440'};
    color:${type === 'success' ? '#86efac' : '#fca5a5'};
  `;

  const icon = type === 'success'
    ? `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
    : `<svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`;

  toast.innerHTML = `${icon}<span>${message}</span>`;

  // Inject keyframe once
  if (!document.getElementById('toastStyle')) {
    const style = document.createElement('style');
    style.id = 'toastStyle';
    style.textContent = `@keyframes slideInToast{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

// ─── Show inline success state (contact form) ───────────────────────────────
function showFormSuccess() {
  const formEl = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccessState');
  if (formEl && successEl) {
    formEl.style.display = 'none';
    successEl.style.display = 'flex';
  }
}

// ─── Contact form handler ────────────────────────────────────────────────────
async function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
  btn.disabled  = true;

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const sb = getSupabase();
    const { error } = await sb.from('contacts').insert({
      name    : data.name    || null,
      email   : data.email   || null,
      phone   : data.phone   || null,
      subject : data.subject || 'General Inquiry',
      message : data.message || null,
      inquiry_type: data.budget || null,   // re-use inquiry_type for budget context
    });

    if (error) throw error;

    // Show the inline success state
    showFormSuccess();
    showToast('Message sent! We\'ll be in touch within 4 hours.', 'success');
    form.reset();

  } catch (err) {
    console.error('Contact submit error:', err);
    const msg = err?.message || 'Unknown error';
    showToast(`Failed to submit inquiry. ${msg}`, 'error');
    btn.innerHTML = orig;
    btn.disabled  = false;
  }
}

// ─── Internship form handler ─────────────────────────────────────────────────
async function handleInternshipSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn  = form.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;

  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting…';
  btn.disabled  = true;

  const data = Object.fromEntries(new FormData(form).entries());

  try {
    const sb = getSupabase();
    const { error } = await sb.from('internships').insert({
      name    : data.name     || data.full_name || null,
      email   : data.email    || null,
      college : data.college  || data.college_name || null,
      domain  : data.domain   || data.selected_domain || null,
      why_join: data.why_join || data.message || null,
    });

    if (error) throw error;

    showToast('Application submitted! We\'ll review it shortly.', 'success');
    form.reset();

  } catch (err) {
    console.error('Internship submit error:', err);
    const msg = err?.message || 'Unknown error';
    showToast(`Failed to submit application. ${msg}`, 'error');
  } finally {
    btn.innerHTML = orig;
    btn.disabled  = false;
  }
}

// ─── Wire up on DOM ready ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const contactForm    = document.getElementById('contactForm');
  const internshipForm = document.getElementById('internshipForm');

  if (contactForm)    contactForm.addEventListener('submit', handleContactSubmit);
  if (internshipForm) internshipForm.addEventListener('submit', handleInternshipSubmit);
});
