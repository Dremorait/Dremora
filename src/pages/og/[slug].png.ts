// 1200x630 social image per page, generated at build: near-black background,
// the page title in IBM Plex Sans, the bare logo mark and the name.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
import { darkMark, markSquare } from '../../lib/mark.mjs';
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

  // The bare D mark in its dark-background version (white D), no tile or glow.
  const markPng = await markSquare(await darkMark(), 176, { fill: 1 });
  const monogram = { type: 'img', props: { src: `data:image/png;base64,${markPng.toString('base64')}`, width: 88, height: 88 } };

  // Satori adds padding outside width and height, so 1040x486 + padding = 1200x630.
  const svg = await satori(
    el('div', { width: 1040, height: 486, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0D0D0D', color: '#FFFFFF', padding: '72px 80px', fontFamily: 'Plex' }, [
      el('div', { display: 'flex', alignItems: 'center', gap: 20, fontSize: 32, fontWeight: 600 }, [monogram, 'Dremora IT']),
      el('div', { fontSize: props.title.length > 40 ? 64 : 76, fontWeight: 600, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 1000 }, props.title),
      el('div', { display: 'flex', fontSize: 28, color: '#AFAFAF', borderTop: '1px solid #3A3A3A', paddingTop: 24 }, `${site.city}, India. Est. ${site.founded}. www.dremorait.in`),
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
