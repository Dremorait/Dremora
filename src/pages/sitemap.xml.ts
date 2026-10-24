import { pages } from '../content/pages';
import { site } from '../content/site';

// Only indexable canonical URLs.
export function GET() {
  const urls = Object.values(pages)
    .filter((p) => p.index !== false)
    .map((p) => `  <url><loc>${site.url}${p.path === '/' ? '/' : p.path}</loc><lastmod>${p.updated}</lastmod></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
