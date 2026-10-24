// Generates the favicon set in public/ from one "D" monogram. Run once after
// changing the mark: `node scripts/make-icons.mjs`. Outputs are committed.
import sharp from 'sharp';
import { writeFile, copyFile } from 'node:fs/promises';

const NAVY = '#0D1B3E';
const ORANGE = '#E8790C';
// Heavy D on a 32 unit grid. Edges sit on even units, so at 16px every edge lands on a whole pixel.
const D = 'M6 6h8a10 10 0 0 1 0 20H6zm6 4v12h2a6 6 0 0 0 0-12z';

// Browser tab icon. On dark tabs the colours swap so the square stays visible.
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
<style>.bg{fill:${NAVY}}.d{fill:${ORANGE}}@media (prefers-color-scheme:dark){.bg{fill:${ORANGE}}.d{fill:${NAVY}}}</style>
<rect class="bg" width="32" height="32" rx="4"/><path class="d" fill-rule="evenodd" d="${D}"/>
</svg>
`;

// scale: share of the canvas the D's 32 unit box takes; radius in px of output.
const png = (size, { scale = 1, radius = size / 8 } = {}) => {
  const box = 32 / scale;
  const off = (box - 32) / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${-off} ${-off} ${box} ${box}">
<rect x="${-off}" y="${-off}" width="${box}" height="${box}" rx="${(radius / size) * box}" fill="${NAVY}"/>
<path fill="${ORANGE}" fill-rule="evenodd" d="${D}"/></svg>`;
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
};

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

await writeFile(out('icon.svg'), iconSvg);
const small = await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size, { radius: size / 8 }) })));
await writeFile(out('favicon.ico'), ico(small));
// iPhone: solid navy, no transparency, about 20px inner padding (iOS rounds the corners itself).
await writeFile(out('apple-touch-icon.png'), await png(180, { scale: 1.25, radius: 0 }));
await writeFile(out('icon-192.png'), await png(192, { radius: 24 }));
await writeFile(out('icon-512.png'), await png(512, { radius: 64 }));
// Maskable: full-bleed navy, the D inside the central 80% safe zone.
await writeFile(out('icon-512-maskable.png'), await png(512, { scale: 1.1, radius: 0 }));

await writeFile(
  out('site.webmanifest'),
  JSON.stringify(
    {
      name: 'Dremora IT',
      short_name: 'Dremora',
      start_url: '/',
      display: 'browser',
      theme_color: NAVY,
      background_color: '#FAF8F4',
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
console.log('Icons written to public/');
