// Generates the favicon set in public/ from the Dremora logo mark
// (src/assets/brand/dremora-mark.png, transparent). Run from the project root after
// changing the mark: `node scripts/make-icons.mjs`. Outputs are committed.
//
// Also writes src/assets/brand/dremora-mark-dark.png, the dark-mode mark (navy turned
// white, see src/lib/mark.mjs) that BrandMark.astro shows on dark backgrounds.
//
// Browser and Android icons are the bare D on transparency. The SVG favicon switches to
// the white-D version on dark browser themes. Only the iPhone and maskable icons need an
// opaque background; they get a plain white square that the phone crops to its own shape.
import sharp from 'sharp';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { darkMark, markSquare, MARK_PATH as MARK, MARK_DARK_PATH } from '../src/lib/mark.mjs';

const WHITE = '#FFFFFF';
const NAVY = '#0D1B3E';

/** The mark centred on a white square. fill = share of the square the mark's longer side takes. */
async function tile(size, { fill = 0.8, radius = Math.round(size * 0.22) } = {}) {
  const inner = Math.round(size * fill);
  const mark = await sharp(MARK).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const shape = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="${WHITE}"/></svg>`);
  return sharp(shape)
    .composite([{ input: mark, left: Math.round((size - inner) / 2), top: Math.round((size - inner) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ICO with embedded PNGs (supported by every current browser).
const ico = (images) => {
  const header = Buffer.alloc(6 + 16 * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const e = 6 + 16 * i;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(data.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((i) => i.data)]);
};

const out = (f) => new URL(`../public/${f}`, import.meta.url);

const dark = await darkMark();
await writeFile(MARK_DARK_PATH, dark);

// Small sizes give the mark most of the square so the D still reads at 16px.
const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await markSquare(MARK, size, { fill: 1 }) })));
await writeFile(out('favicon.ico'), ico(small));

// SVG favicon: navy D on light browser themes, white D on dark ones.
const svgLight = (await markSquare(MARK, 96, { fill: 1 })).toString('base64');
const svgDark = (await markSquare(dark, 96, { fill: 1 })).toString('base64');
await writeFile(
  out('icon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><style>.d{display:none}@media (prefers-color-scheme:dark){.l{display:none}.d{display:inline}}</style>` +
    `<image class="l" width="96" height="96" href="data:image/png;base64,${svgLight}"/><image class="d" width="96" height="96" href="data:image/png;base64,${svgDark}"/></svg>\n`,
);

// iPhone: must be opaque (iOS fills transparency with black) and iOS rounds the corners itself.
await writeFile(out('apple-touch-icon.png'), await tile(180, { fill: 0.76, radius: 0 }));
await writeFile(out('icon-192.png'), await markSquare(MARK, 192, { fill: 0.86 }));
await writeFile(out('icon-512.png'), await markSquare(MARK, 512, { fill: 0.86 }));
// Maskable: must be full-bleed; the mark sits inside the central 80% safe zone.
await writeFile(out('icon-512-maskable.png'), await tile(512, { fill: 0.62, radius: 0 }));

// White-D mark for the old intern and admin pages, which are always dark.
await writeFile(out('assets/images/logo-mark-dark.webp'), await sharp(dark).resize(256).webp({ quality: 90 }).toBuffer());

await writeFile(
  out('site.webmanifest'),
  JSON.stringify(
    {
      name: 'Dremora IT',
      short_name: 'Dremora',
      start_url: '/',
      display: 'browser',
      theme_color: NAVY,
      background_color: '#FCFCFC',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2,
  ) + '\n',
);

// Fallback social image: the home page card from the last build.
try {
  await copyFile(new URL('../dist/og/home.png', import.meta.url), out('og-default.png'));
} catch {
  console.warn('Run `npm run build` first to create og-default.png');
}
await readFile(MARK); // fail loudly if the mark is missing
console.log('Icons written to public/');
