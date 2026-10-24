// Single source of facts for the whole site. Pages read from here only.
//
// Rule: every value must be something the founder can prove on a call.
// A missing fact is written with the todo() helper below. In production builds,
// anything that depends on a TODO is hidden, and `npm run build` prints the
// open TODO list (scripts/check-banned.mjs).

export type Todo = `{{TODO: ${string}}}`;
export const todo = (what: string): Todo => `{{TODO: ${what}}}`;
export const isTodo = (v: unknown): v is Todo => typeof v === 'string' && v.startsWith('{{TODO');
/** True when a fact is known. In dev, TODOs count as known so they show up on the page. */
export const known = (v: unknown): boolean => v != null && (import.meta.env.DEV || !isTodo(v));

export const site = {
  name: 'Dremora IT',
  legalName: 'DREMORA IT Consultants & Services',
  url: 'https://www.dremorait.in',
  founded: '2025',
  city: 'Pune',
  phone: { display: '+91 9309795878', e164: '+919309795878' },
  whatsapp: 'https://wa.me/919309795878',
  email: 'dremora.itservices@gmail.com',
  address: {
    locality: 'Pune',
    region: 'Maharashtra',
    postalCode: '411032',
    country: 'IN',
    countryName: 'India',
    display: 'Pune, Maharashtra 411032, India',
    maps: 'https://www.google.com/maps/search/?api=1&query=Pune%2C%20Maharashtra%20411032%2C%20India',
  },
  languages: 'English, Hindi and Marathi',
  responseTime: todo('Contact response time you actually keep (current site says both "4 business hours" and "24 hours")'),
  privacyEmail: 'dremora.itservices@gmail.com',
  blessing: 'ॐ गं गणपतये नमः',
};

// Only profiles that were checked and resolve to a real, active page.
// `verified: false` profiles are not rendered and not listed in schema sameAs.
export const socials = [
  { name: 'GitHub', url: 'https://github.com/Dremorait', verified: true },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/dremoraitservices', verified: false },
  { name: 'Instagram', url: 'https://www.instagram.com/dremora.it/', verified: false },
  { name: 'X (Twitter)', url: 'https://twitter.com/dremoraitservices', verified: false },
];
export const verifiedSocials = socials.filter((s) => s.verified);

export const founder = {
  name: todo('Founder name (the old About page said Aniket Wable)'),
  role: todo('Founder role, for example "Founder and developer"'),
  photo: todo('Real photo of the founder, at least 800px wide, saved as src/assets/founder.jpg'),
  linkedin: todo('Founder LinkedIn URL'),
};

// The founder's own words from the old About page, lightly edited.
export const story = [
  'Dremora started with a plain observation: most small businesses in India either cannot afford good software, or end up with something that looks impressive and does not solve their problem.',
  'So we ask what you need before we quote anything, explain what we are building before we build it, and write code your next developer can read.',
  'When the project ships, we stay reachable. You talk to the person who wrote the code.',
];

export const principles = [
  {
    title: 'We tell you when a project is wrong for us',
    body: 'If your timeline is unrealistic, or a simpler and cheaper option would serve you better, we say so on the first call. We would rather lose the job than overpromise.',
  },
  {
    title: 'You see working software early',
    body: 'Every week you get a link to the current version, not a slide deck. Feedback on real screens is faster and cheaper than feedback on descriptions.',
  },
  {
    title: 'The code is written to be read',
    body: 'Clear names, version control from day one, and no shortcuts that the next developer has to untangle. Badly built software costs more later, and the business pays for it.',
  },
];

export const process = [
  { title: 'A free 30 minute call', body: 'You tell us what the business does and what is not working. We ask questions and tell you honestly whether we are the right fit.' },
  { title: 'A written fixed quote', body: 'Scope, price, timeline and payment schedule on paper. The price changes only if you change the scope. Domain, hosting and third-party costs are listed separately.' },
  { title: 'We build, you see a demo every week', body: 'You get a working link every week and tell us what to change. Payment is 50% before work starts and 50% on delivery, unless your agreement says otherwise.' },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export type Service = {
  slug: 'websites' | 'web-apps' | 'ai-automation';
  name: string;
  short: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  forWhom: string;
  kinds: { name: string; body: string }[];
  included: string[];
  notIncluded: string[];
  timeline: string;
  price: string | Todo;
  stack: string;
  faq: { q: string; a: string }[];
  relatedWork: string[]; // client work slugs
  relatedConcepts: string[]; // concept slugs
};

const sharedFaq = {
  hosting: {
    q: 'Is hosting included?',
    a: 'Hosting is not part of the build price. We write the expected hosting cost into your quote as a separate line, so you know the monthly or yearly figure before you agree to anything.',
  },
  domain: {
    q: 'Do you register the domain?',
    a: 'Domain registration is a third-party cost, listed separately in the quote. If you already own a domain, tell us on the first call and we plan around it.',
  },
  payments: {
    q: 'How do payments work?',
    a: 'Fixed price, quoted in INR. 50% before work starts and 50% on delivery, unless your project agreement sets other milestones. Invoices are due within 7 business days. We do not bill by the hour.',
  },
  ownership: {
    q: 'Who owns the code?',
    a: 'Once the project is fully paid, you own the code, designs and assets made for your project. We keep ownership of our own pre-existing tools and libraries, which you can keep using inside your project.',
  },
  support: {
    q: 'What happens after launch?',
    a: 'Every project includes a 30 day bug fix warranty from launch. After that, ongoing maintenance and updates are available as a monthly retainer, quoted separately.',
  },
};

export const services: Service[] = [
  {
    slug: 'websites',
    name: 'Websites',
    short: 'Business websites, landing pages, online stores and portfolio sites.',
    title: 'Website Development in Pune, Fixed Price | Dremora IT',
    description: 'Business websites, landing pages and online stores for Pune businesses. Fixed price, 2 to 4 weeks, built and supported by the founder.',
    h1: 'A website that tells customers what you do and how to reach you',
    intro: [
      'Most people find a local business on their phone, look at it for a few seconds, and then either call, send a WhatsApp message, or go back to the search results. Your website has one job in those seconds: say what you do, where you are, and how to reach you.',
      'We build sites that load fast on a mid-range Android phone, are readable without zooming, and are set up so Google can understand them. No page builder lock-in and no theme with a hundred unused features. The code is written for your site and handed over to you.',
    ],
    forWhom: 'Service businesses, consultants, clinics, coaching classes, shops that want to sell online, and professionals who need a portfolio that wins work.',
    kinds: [
      { name: 'Business websites', body: 'Multi-page sites for service businesses and consultancies, built mobile-first with search basics in place.' },
      { name: 'Landing pages', body: 'One focused page for a campaign, launch or single offer, with one clear action.' },
      { name: 'Online stores', body: 'Product listings, cart and checkout with Razorpay or Stripe, and order tracking.' },
      { name: 'Portfolio sites', body: 'For professionals who need a clear online record of their work to win clients or jobs.' },
    ],
    included: [
      'Design and build of every page agreed in your quote',
      'Layouts made for phones first, then tablets and desktops',
      'SEO setup: page titles, descriptions and a sitemap',
      'Payment integration with Razorpay or Stripe for online stores',
      'Up to 3 rounds of revisions',
      'A working demo link every week while we build',
      '30 day bug fix warranty after launch',
      'Full ownership of the code once the project is paid',
    ],
    notIncluded: [
      'Domain registration, hosting and paid third-party services (listed separately in the quote)',
      'Revision rounds beyond the 3 included (quoted before we do them)',
      'Maintenance after the 30 day warranty (available as a monthly retainer)',
      'Rush delivery on a shorter timeline than quoted (charged separately if you need it)',
    ],
    timeline: '2 to 4 weeks',
    price: todo('Starting price for websites in INR (old site said ₹25,000)'),
    stack: 'HTML, CSS and JavaScript, or React when the site needs it',
    faq: [
      sharedFaq.hosting,
      sharedFaq.domain,
      sharedFaq.payments,
      { q: 'How many revisions do I get?', a: 'Up to 3 rounds of revisions are included. If you need more, we tell you the cost first and only go ahead once you approve it.' },
      sharedFaq.ownership,
      sharedFaq.support,
    ],
    relatedWork: ['agri-tech-maharashtra'],
    relatedConcepts: ['restaurant', 'clinic', 'online-store', 'hotel'],
  },
  {
    slug: 'web-apps',
    name: 'Web applications',
    short: 'Admin panels, CRMs, client portals and booking or inventory systems.',
    title: 'Custom Web App Development in Pune | Dremora IT',
    description: 'Admin panels, CRMs, portals and booking or inventory systems built around how your business already works. Fixed scope quote, 4 to 10 weeks.',
    h1: 'Software built around the way your business already runs',
    intro: [
      'When your orders, leads, students or stock live across notebooks, spreadsheets and WhatsApp chats, things get missed. A web application puts that work in one place, with logins for the people who need it and nothing extra.',
      'We start from your current process, not from a template. On the first call we ask who uses the system, what they enter, and what they need to see at the end of the day. The quote describes those screens. Every week you get a working link to try with your own data.',
    ],
    forWhom: 'Businesses with a process that has outgrown spreadsheets: coaching institutes, clinics, distributors, agencies and service teams with more than a few people entering data.',
    kinds: [
      { name: 'Admin panels and CRMs', body: 'Dashboards for managing customers, orders, leads or internal operations, with separate roles.' },
      { name: 'Client and staff portals', body: 'Secure logins where your clients or team can view their data and take action.' },
      { name: 'Management systems', body: 'Inventory, scheduling, booking and reporting systems that follow your business rules.' },
      { name: 'Custom platforms', body: 'For a business problem no off-the-shelf software fits, built from scratch.' },
    ],
    included: [
      'A written fixed scope before we start',
      'Role-based logins, so each person sees only what they should',
      'A working demo link every week, with your own sample data',
      'Deployment to your hosting account',
      '30 day bug fix warranty after launch',
      'Full ownership of the code once the project is paid',
    ],
    notIncluded: [
      'Hosting, database and third-party service costs (listed separately in the quote)',
      'Features outside the agreed scope (quoted separately before any work)',
      'Maintenance after the 30 day warranty (available as a monthly retainer)',
    ],
    timeline: '4 to 10 weeks',
    price: todo('Starting price for web applications in INR (old site said ₹60,000)'),
    stack: 'Python, React and PostgreSQL',
    faq: [
      sharedFaq.hosting,
      sharedFaq.payments,
      { q: 'Can the scope change during the build?', a: 'Yes. If you want to add or change a feature, we write down the change and its cost, and you approve it before we build it. The original price holds for the original scope.' },
      sharedFaq.ownership,
      sharedFaq.support,
      { q: 'Do I need a domain?', a: sharedFaq.domain.a },
    ],
    relatedWork: [],
    relatedConcepts: ['eduro'],
  },
  {
    slug: 'ai-automation',
    name: 'AI and WhatsApp automation',
    short: 'WhatsApp bots, website chatbots, reminders and lead follow-up.',
    title: 'AI Chatbots and WhatsApp Automation in Pune | Dremora IT',
    description: 'WhatsApp automation, AI chatbots and follow-up flows for Pune businesses. Order confirmations, reminders and lead replies. 2 to 6 weeks.',
    h1: 'WhatsApp replies, reminders and follow-ups that run without you',
    intro: [
      'If your phone is full of the same five questions every day, or leads go cold because nobody replied after hours, automation can take that load. We use AI only where it earns its cost, and keep a person in the loop for anything that needs judgement.',
      'Most automation projects start small: confirm an order on WhatsApp, remind a patient about an appointment, or answer common questions and pass the rest to you. We build one flow, measure whether it helps, and then decide together what comes next.',
    ],
    forWhom: 'Businesses that get many repeat questions or bookings on WhatsApp or their website: clinics, coaching classes, shops, agri businesses and service providers.',
    kinds: [
      { name: 'AI chatbots', body: 'Website and WhatsApp bots, built on Google Gemini, that answer common questions, collect lead details and hand over to a person when needed.' },
      { name: 'WhatsApp automation', body: 'Order confirmations, appointment reminders and follow-up messages through the WhatsApp Business API.' },
      { name: 'Lead qualification', body: 'Forms and chat flows that ask the right questions before a lead reaches you.' },
      { name: 'Connecting your tools', body: 'Email, Google Sheets, forms and databases connected so data is entered once.' },
    ],
    included: [
      'Mapping the messages and steps you want automated, in writing, before we build',
      'Setup of the bot or automation flow and its message templates',
      'A way for a person to take over any conversation',
      'A working demo every week while we build',
      '30 day bug fix warranty after launch',
    ],
    notIncluded: [
      'WhatsApp Business API message charges and AI usage fees (third-party costs, listed separately)',
      'Changes to flows outside the agreed scope (quoted separately)',
      'Maintenance after the 30 day warranty (available as a monthly retainer)',
    ],
    timeline: '2 to 6 weeks',
    price: todo('Starting price for AI and WhatsApp automation in INR (old site said ₹40,000)'),
    stack: 'Google Gemini, WhatsApp Business API, email and Google Sheets integrations',
    faq: [
      { q: 'Will the bot give wrong answers to my customers?', a: 'The bot answers only from information you approve, and hands the conversation to a person when it cannot answer.' },
      sharedFaq.payments,
      { q: 'Are there running costs after launch?', a: 'Yes. WhatsApp Business API messages and AI usage are billed by those providers. We estimate them for your expected volume in the quote, separately from our price.' },
      sharedFaq.hosting,
      sharedFaq.ownership,
      sharedFaq.support,
    ],
    relatedWork: ['agri-tech-maharashtra'],
    relatedConcepts: ['dre-chain'],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug)!;

// ---------------------------------------------------------------------------
// Work
// ---------------------------------------------------------------------------

export type ClientWork = {
  slug: string;
  // Real names are shown only with written permission.
  permission: boolean;
  publicName: string;
  anonymousName: string;
  sector: string;
  built: string;
  services: Service['slug'][];
  problem: string | Todo;
  stack: string | Todo;
  shipped: string | Todo; // "2025-11"
  screenshots: { src: string; alt: string }[];
  results: string[]; // only numbers the client agreed to publish
  quote: { text: string; name: string; role: string } | null;
};

export const clientWork: ClientWork[] = [
  {
    slug: 'agri-tech-maharashtra',
    permission: false,
    publicName: 'Doctor Soil Technology',
    anonymousName: 'Agri-tech company, Maharashtra',
    sector: 'Agri-tech',
    built: 'A website plus WhatsApp automation.',
    services: ['websites', 'ai-automation'],
    problem: todo('Agri-tech case study: the client problem in one sentence'),
    stack: todo('Agri-tech case study: tech stack used'),
    shipped: todo('Agri-tech case study: month shipped, as YYYY-MM'),
    screenshots: [],
    results: [],
    quote: null,
  },
  {
    slug: 'pune-growth-plan',
    permission: false,
    publicName: 'Manasvi',
    anonymousName: 'Business in Pune',
    sector: todo('Manasvi: sector to describe them anonymously'),
    built: 'An Instagram growth strategy and a 30 day digital growth plan.',
    services: [],
    problem: todo('Manasvi case study: the client problem in one sentence'),
    stack: 'Instagram',
    shipped: todo('Manasvi case study: month delivered, as YYYY-MM'),
    screenshots: [],
    results: [],
    quote: null,
  },
];

export const workName = (w: ClientWork) => (w.permission ? w.publicName : w.anonymousName);
/** A case study page exists only when the basic facts are known. */
export const hasCaseStudy = (w: ClientWork) => known(w.problem) && known(w.shipped) && known(w.stack);

// Concept builds: demos made by Dremora, not client projects.
// Links and screenshots stay hidden until each demo has the "Concept demo" strip,
// no fake stats, a fictional brand name and its own subdomain.
export type Concept = {
  slug: string;
  name: string;
  what: string;
  stack: string;
  url: string | Todo;
  image: string | Todo;
};

export const concepts: Concept[] = [
  {
    slug: 'eduro',
    name: 'EDURO, coaching institute platform',
    what: 'Admissions CRM, student and parent portals, faculty management and reports for a coaching institute.',
    stack: 'Next.js, React, TypeScript, Prisma, PostgreSQL',
    url: todo('EDURO demo cleaned up (strip, no fake stats) and moved to eduro.dremorait.in'),
    image: todo('EDURO screenshot taken after the demo cleanup'),
  },
  {
    slug: 'dre-chain',
    name: 'DRE-CHAIN, automation workflow simulator',
    what: 'An interactive walk-through of an automated lead flow: email in, AI intent check, CRM update, WhatsApp follow-up.',
    stack: 'Next.js, React, TypeScript, React Flow',
    url: todo('DRE-CHAIN demo cleaned up (strip, no fake revenue figures) and moved to a dremorait.in subdomain'),
    image: todo('DRE-CHAIN screenshot taken after the demo cleanup'),
  },
  {
    slug: 'hotel',
    name: 'Hotel and villa website',
    what: 'Villa, dining and reservation pages for a boutique hotel.',
    stack: 'Next.js, React, TypeScript',
    url: todo('Hotel demo (currently "Dremora House") renamed to a fictional brand, cleaned up and moved to a subdomain'),
    image: todo('Hotel demo screenshot taken after the rename'),
  },
  {
    slug: 'restaurant',
    name: 'Restaurant and bar website',
    what: 'Menu, gallery and table booking pages for a restaurant.',
    stack: 'HTML, CSS, JavaScript',
    url: todo('Restaurant demo: encoding bug fixed, fake rating removed, moved to a subdomain'),
    image: todo('Restaurant demo screenshot taken after the fix'),
  },
  {
    slug: 'clinic',
    name: 'Clinic and hospital website',
    what: 'Departments, doctor profiles and appointment booking for a clinic.',
    stack: 'HTML, CSS, JavaScript',
    url: todo('Healthcare demo (currently "DREMORA Healthcare") renamed to a fictional brand and moved to a subdomain'),
    image: todo('Healthcare demo screenshot taken after the rename'),
  },
  {
    slug: 'online-store',
    name: 'Online store',
    what: 'Product listing, search, cart and checkout pages for a retail store.',
    stack: 'HTML, CSS, JavaScript',
    url: todo('E-commerce demo (currently the "Dremora" store) renamed, "Trusted by" line removed, moved to a subdomain'),
    image: todo('E-commerce demo screenshot taken after the cleanup'),
  },
];

// ---------------------------------------------------------------------------
// Internship
// ---------------------------------------------------------------------------

export const internship = {
  audience: 'engineering and polytechnic students',
  duration: '1 to 3 months, depending on the project',
  mode: 'Remote or hybrid. Candidates in Pune can choose to work on-site.',
  hours: 'At least 20 hours a week',
  stipend: 'Performance-based, explained during onboarding',
  certificate: 'Issued to interns who score 70% or above in the final evaluation, with a letter of recommendation',
  fee: todo('Internship fee, if any (the Refund Policy mentions program fees)'),
  under18: todo('Does the internship accept applicants under 18? If yes, applications need guardian consent'),
};

// ---------------------------------------------------------------------------
// Legal
// ---------------------------------------------------------------------------

export const legal = {
  lastUpdated: '2026-10-24',
  effectiveDate: '2026-10-24', // confirm on launch day
  grievanceOfficer: todo('Grievance Officer name'),
  retention: {
    enquiries: todo('How long contact form enquiries and their emails are kept'),
    interns: todo('How long intern records are kept after the internship ends'),
    certificates: todo('How long certificate records stay verifiable'),
    logs: todo('How long hosting logs are kept (Vercel default retention for your plan)'),
  },
};

// Vercel Web Analytics is cookieless. Turn it on in the Vercel dashboard, then set
// PUBLIC_VERCEL_ANALYTICS=1 so the script loads and the Privacy Policy names it.
export const analyticsEnabled = import.meta.env.PUBLIC_VERCEL_ANALYTICS === '1';
