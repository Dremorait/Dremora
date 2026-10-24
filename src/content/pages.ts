// Meta for every page: one place so titles, descriptions, OG images and the
// sitemap stay unique and in sync. Titles under 60 characters, descriptions
// under 155 (enforced by scripts/check-banned.mjs on the built HTML).
import { services, clientWork, hasCaseStudy, workName } from './site';

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  og: string; // slug of the generated /og/<slug>.png
  ogTitle: string; // big text on the social image
  updated: string;
  index?: boolean; // false = noindex, left out of the sitemap
};

const updated = '2026-10-24';

export const pages: Record<string, PageMeta> = {
  home: {
    path: '/',
    title: 'Dremora IT: Web Development and WhatsApp Automation in Pune',
    description: 'Websites, web apps and WhatsApp automation for Pune businesses. Fixed price, fixed timeline, built and supported by the founder.',
    og: 'home',
    ogTitle: 'Websites and WhatsApp automation for Pune businesses',
    updated,
  },
  services: {
    path: '/services',
    title: 'Services: Websites, Web Apps and Automation | Dremora IT',
    description: 'Three things we build for Pune businesses: websites, web applications, and AI and WhatsApp automation. What each includes and how long it takes.',
    og: 'services',
    ogTitle: 'Websites, web apps and WhatsApp automation',
    updated,
  },
  ...Object.fromEntries(
    services.map((s) => [
      `service-${s.slug}`,
      { path: `/services/${s.slug}`, title: s.title, description: s.description, og: `service-${s.slug}`, ogTitle: s.name, updated },
    ]),
  ),
  work: {
    path: '/work',
    title: 'Client Work and Case Studies | Dremora IT',
    description: 'Real client projects from Dremora IT in Pune, followed by concept builds we made to show what we can do. Each one is labelled.',
    og: 'work',
    ogTitle: 'Client work and concept builds',
    updated,
  },
  ...Object.fromEntries(
    clientWork.filter(hasCaseStudy).map((w) => [
      `work-${w.slug}`,
      {
        path: `/work/${w.slug}`,
        title: `${workName(w)}: case study | Dremora IT`.slice(0, 60),
        description: `${w.built} What the problem was, what we built and the stack we used.`,
        og: `work-${w.slug}`,
        ogTitle: workName(w),
        updated,
      },
    ]),
  ),
  about: {
    path: '/about',
    title: 'About Dremora IT, Pune Technology Studio',
    description: 'Dremora IT is a founder-led studio in Pune, established in 2025. Why it exists, how we work, and our internship program for students.',
    og: 'about',
    ogTitle: 'About Dremora IT',
    updated,
  },
  contact: {
    path: '/contact',
    title: 'Contact Dremora IT, Pune | Get a Fixed Quote',
    description: 'Tell us what you need and get a written fixed quote. Form, WhatsApp, phone and email for Dremora IT in Pune.',
    og: 'contact',
    ogTitle: 'Get a fixed quote',
    updated,
  },
  contactThanks: {
    path: '/contact/thanks',
    title: 'Message received | Dremora IT',
    description: 'Your enquiry reached Dremora IT. Here is what happens next.',
    og: 'contact',
    ogTitle: 'Message received',
    updated,
    index: false,
  },
  internship: {
    path: '/internship',
    title: 'Internship Program and Certificate Check | Dremora IT',
    description: 'Hands-on internship for engineering and polytechnic students in Pune, plus a public check for certificates issued by Dremora IT.',
    og: 'internship',
    ogTitle: 'Internship program and certificate check',
    updated,
  },
  guidelines: {
    path: '/internship/guidelines',
    title: 'Internship Course Guidelines | Dremora IT',
    description: 'Structure, eligibility, conduct, attendance and evaluation rules for the Dremora IT internship program.',
    og: 'guidelines',
    ogTitle: 'Internship course guidelines',
    updated,
  },
  privacy: {
    path: '/privacy-policy',
    title: 'Privacy Policy | Dremora IT',
    description: 'What personal data the Dremora IT website collects, why, who receives it, how long it is kept and how to use your rights.',
    og: 'privacy',
    ogTitle: 'Privacy Policy',
    updated,
  },
  terms: {
    path: '/terms',
    title: 'Terms and Conditions | Dremora IT',
    description: 'The terms for using the Dremora IT website, its concept demos and certificate check, and how project agreements apply.',
    og: 'terms',
    ogTitle: 'Terms and Conditions',
    updated,
  },
  refund: {
    path: '/refund-policy',
    title: 'Refund Policy | Dremora IT',
    description: 'When Dremora IT refunds payments for development, design and internship programs, and how to ask for a refund.',
    og: 'refund',
    ogTitle: 'Refund Policy',
    updated,
  },
  notFound: {
    path: '/404',
    title: 'Page not found | Dremora IT',
    description: 'This page does not exist. Try the home page, our work or the contact page.',
    og: 'home',
    ogTitle: 'Page not found',
    updated,
    index: false,
  },
};
