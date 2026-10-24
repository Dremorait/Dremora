// JSON-LD nodes. Only facts from site.ts; no Review or AggregateRating anywhere.
import { site, verifiedSocials, isTodo, type Service } from './site';

export const orgId = `${site.url}/#org`;

const address = {
  '@type': 'PostalAddress',
  addressLocality: site.address.locality,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
};

export const organization = () => ({
  '@type': ['Organization', 'ProfessionalService'],
  '@id': orgId,
  name: site.name,
  legalName: site.legalName,
  url: `${site.url}/`,
  logo: `${site.url}/icon-512.png`,
  image: `${site.url}/og/home.png`,
  telephone: site.phone.e164,
  email: site.email,
  address,
  areaServed: { '@type': 'City', name: 'Pune' },
  foundingDate: site.founded,
  ...(verifiedSocials.length ? { sameAs: verifiedSocials.map((s) => s.url) } : {}),
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: `${site.url}/`,
  name: site.name,
  inLanguage: 'en-IN',
  publisher: { '@id': orgId },
});

const priceNumber = (p: string) => Number(p.replace(/[^\d]/g, ''));

export const serviceNode = (s: Service) => ({
  '@type': 'Service',
  name: s.name,
  serviceType: s.name,
  description: s.description,
  url: `${site.url}/services/${s.slug}`,
  areaServed: { '@type': 'City', name: 'Pune' },
  provider: { '@type': 'ProfessionalService', '@id': orgId, name: site.name, url: `${site.url}/`, telephone: site.phone.e164, address },
  // Offers only when a price is published.
  ...(isTodo(s.price)
    ? {}
    : {
        offers: {
          '@type': 'Offer',
          priceCurrency: 'INR',
          priceSpecification: { '@type': 'PriceSpecification', minPrice: priceNumber(s.price), priceCurrency: 'INR' },
        },
      }),
});
