// 1200x630 social image per page, generated at build: near-black background,
// the primary logo, and the page title in IBM Plex Sans.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { BRAND, logoSvg } from '../../lib/logo.mjs';
import { pages } from '../../content/pages';
import { site } from '../../content/site';

const require = createRequire(import.meta.url);
const font = (file: string) => readFile(require.resolve(`@fontsource/ibm-plex-sans/files/${file}`));

export function getStaticPaths() {
  const seen = new Set<string>();
  return Object.values(pages)
    .filter((p) => !seen.has(p.og) && seen.add(p.og))
    .map((p) => ({ params: { slug: p.og }, props: { title: p.ogTitle } }));
}

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

export async function GET({ props }: { props: { title: string } }) {
  const [regular, semibold] = await Promise.all([font('ibm-plex-sans-latin-400-normal.woff'), font('ibm-plex-sans-latin-600-normal.woff')]);

  // Primary logo on ink, as on the brand sheet: white wordmark over the spaced-out tagline.
  const wordmarkPng = await sharp(Buffer.from(logoSvg('wordmark', { letters: BRAND.white, squares: BRAND.greyOnDark, width: 640 }))).png().toBuffer();
  const logo = el('div', { display: 'flex', flexDirection: 'column', gap: 12 }, [
    { type: 'img', props: { src: `data:image/png;base64,${wordmarkPng.toString('base64')}`, width: 320, height: 43 } },
    el('div', { display: 'flex', fontSize: 15, fontWeight: 400, letterSpacing: '0.3em', color: '#AFAFAF' }, 'IT CONSULTANTS & SERVICES'),
  ]);

  // Satori adds padding outside width and height, so 1040x486 + padding = 1200x630.
  const svg = await satori(
    el('div', { width: 1040, height: 486, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0D0D0D', color: '#FFFFFF', padding: '72px 80px', fontFamily: 'Plex' }, [
      logo,
      el('div', { fontSize: props.title.length > 40 ? 64 : 76, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 1000 }, props.title),
      el('div', { display: 'flex', fontSize: 28, color: '#AFAFAF', borderTop: '1px solid #3A3A3A', paddingTop: 24 }, `Based in ${site.city}, India. Clients worldwide. www.dremorait.in`),
    ]) as any,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Plex', data: regular, weight: 400, style: 'normal' },
        { name: 'Plex', data: semibold, weight: 600, style: 'normal' },
      ],
    },
  );
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
