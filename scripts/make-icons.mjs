// Generates the logo files and favicon set in public/ from src/assets/brand/logo.json
// (the Dremora logos traced from the brand sheet). Run from the project root after
// changing the logos: `node scripts/make-icons.mjs`. Outputs are committed.
//
//   public/brand/logo.svg          sprite used by Logo.astro, coloured by CSS
//   public/brand/*.svg             standalone logos in fixed colours (old intern and admin pages, email, press)
//   favicon.ico, icon.svg, PNGs    the :D mark on ink, as the brand sheet shows it "for icons"
import sharp from 'sharp';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { BRAND, logoSprite, logoSvg, markTile } from '../src/lib/logo.mjs';

const out = (f) => new URL(`../public/${f}`, import.meta.url);
const png = (svg) => sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();

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

// Logos
await mkdir(out('brand'), { recursive: true });
await writeFile(out('brand/logo.svg'), logoSprite());
const onInk = { letters: BRAND.white, squares: BRAND.greyOnDark };
const onWhite = { letters: BRAND.dark, squares: BRAND.greyOnLight };
for (const name of ['wordmark', 'mark', 'smile']) {
  await writeFile(out(`brand/dremora-${name}.svg`), logoSvg(name, onWhite) + '\n');
  await writeFile(out(`brand/dremora-${name}-white.svg`), logoSvg(name, onInk) + '\n');
}

// Favicons: rounded ink tile. Small sizes give the mark more of the tile so the D reads at 16px.
const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(markTile(size, { fill: 0.78, radius: 0.2 })) })));
await writeFile(out('favicon.ico'), ico(small));
await writeFile(out('icon.svg'), markTile(96, { fill: 0.72, radius: 0.22 }).replace(/ width="96" height="96"/, '') + '\n');

// iPhone and Android maskable: full-bleed ink, the phone crops to its own shape.
await writeFile(out('apple-touch-icon.png'), await png(markTile(180, { fill: 0.62, radius: 0 })));
await writeFile(out('icon-512-maskable.png'), await png(markTile(512, { fill: 0.52, radius: 0 })));
await writeFile(out('icon-192.png'), await png(markTile(192, { fill: 0.66 })));
await writeFile(out('icon-512.png'), await png(markTile(512, { fill: 0.66 })));

await writeFile(
  out('site.webmanifest'),
  JSON.stringify(
    {
      name: 'Dremora IT',
      short_name: 'Dremora',
      start_url: '/',
      display: 'browser',
      theme_color: BRAND.ink,
      background_color: '#000000',
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
console.log('Logos and icons written to public/');
