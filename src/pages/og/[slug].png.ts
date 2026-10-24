// 1200x630 social image per page, generated at build: navy background,
// the page title in IBM Plex Sans, small monogram and name.
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import satori from 'satori';
import sharp from 'sharp';
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

  const monogram = {
    type: 'svg',
    props: {
      width: 64,
      height: 64,
      viewBox: '0 0 32 32',
      children: [
        { type: 'rect', props: { width: 32, height: 32, rx: 4, fill: '#E8790C' } },
        { type: 'path', props: { fill: '#0D1B3E', 'fill-rule': 'evenodd', d: 'M6 6h8a10 10 0 0 1 0 20H6zm6 4v12h2a6 6 0 0 0 0-12z' } },
      ],
    },
  };

  // Satori adds padding outside width and height, so 1040x486 + padding = 1200x630.
  const svg = await satori(
    el('div', { width: 1040, height: 486, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#0D1B3E', color: '#F2EFE8', padding: '72px 80px', fontFamily: 'Plex' }, [
      el('div', { display: 'flex', alignItems: 'center', gap: 20, fontSize: 32, fontWeight: 600 }, [monogram, 'Dremora IT']),
      el('div', { fontSize: props.title.length > 40 ? 64 : 76, fontWeight: 600, lineHeight: 1.12, maxWidth: 1000 }, props.title),
      el('div', { display: 'flex', fontSize: 28, color: '#A9B0C0', borderTop: '2px solid #E8790C', paddingTop: 24 }, `${site.city}, India. Est. ${site.founded}. www.dremorait.in`),
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
