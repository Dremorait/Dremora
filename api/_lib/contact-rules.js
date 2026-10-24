// Contact form rules, shared by the browser (src/components/ContactForm.astro)
// and the server (api/contact.js) so both give the same messages.
// No Node or browser APIs in this file.

export const NEEDS = {
  website: 'Website',
  'web-app': 'Web app',
  automation: 'Automation',
  'not-sure': 'Not sure',
};

export const BUDGETS = {
  'under-25k': 'Under ₹25,000',
  '25k-75k': '₹25,000 to ₹75,000',
  '75k-2l': '₹75,000 to ₹2,00,000',
  'over-2l': 'Above ₹2,00,000',
  'not-sure': 'Not sure yet',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (v) => (typeof v === 'string' ? v.trim() : '');

/** Is the "phone or email" value an email address? */
export const isEmail = (v) => EMAIL.test(clean(v));

/**
 * Validate a submission. Returns { data, errors }.
 * `errors` maps field name to a message; empty when valid.
 */
export function validateContact(input) {
  const data = {
    name: clean(input.name),
    contact: clean(input.contact),
    business: clean(input.business),
    need: clean(input.need),
    budget: clean(input.budget),
    message: clean(input.message),
    consent: ['on', 'true', 'yes', true].includes(input.consent),
  };
  const errors = {};

  if (data.name.length < 2) errors.name = 'Enter your name.';
  else if (data.name.length > 100) errors.name = 'Keep your name under 100 characters.';

  const digits = data.contact.replace(/[\s()+-]/g, '');
  if (!data.contact) errors.contact = 'Enter a phone number or email address so we can reply.';
  else if (!isEmail(data.contact) && !/^\d{10,13}$/.test(digits)) {
    errors.contact = 'Enter a 10 digit phone number or a full email address, like name@example.com.';
  }

  if (data.business.length > 120) errors.business = 'Keep the business name under 120 characters.';
  if (!(data.need in NEEDS)) errors.need = 'Choose what you need.';
  if (data.budget && !(data.budget in BUDGETS)) errors.budget = 'Choose a budget from the list, or leave it empty.';

  if (data.message.length < 10) errors.message = 'Tell us a little about what you need, at least 10 characters.';
  else if (data.message.length > 4000) errors.message = 'Keep the message under 4,000 characters.';

  if (!data.consent) errors.consent = 'Tick the box so we are allowed to contact you about this enquiry.';

  return { data, errors };
}
