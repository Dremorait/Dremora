/**
 * Regenerate all favicon / PWA icon files from public/icon.svg using sharp.
 * Run: node scripts/regen-favicons.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public', 'icon.svg');

async function png(size, outFile) {
  await sharp(src, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(path.join(root, 'public', outFile));
  console.log(`✓ ${outFile} (${size}×${size})`);
}

async function ico(outFile) {
  // ICO = 16×16 and 32×32 PNGs concatenated in ICO format
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map(s =>
      sharp(src, { density: 300 }).resize(s, s).png().toBuffer()
    )
  );

  // Build ICO manually (only valid for 1-bit per channel, full RGBA)
  const count = sizes.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const header = Buffer.alloc(headerSize);

  // ICO header
  header.writeUInt16LE(0, 0);  // reserved
  header.writeUInt16LE(1, 2);  // type: ICO
  header.writeUInt16LE(count, 4);

  const chunks = [];
  pngBuffers.forEach((buf, i) => {
    const size = sizes[i];
    const entry = 6 + i * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);     // width
    header.writeUInt8(size === 256 ? 0 : size, entry + 1); // height
    header.writeUInt8(0, entry + 2);  // color count
    header.writeUInt8(0, entry + 3);  // reserved
    header.writeUInt16LE(1, entry + 4); // planes
    header.writeUInt16LE(32, entry + 6); // bit count
    header.writeUInt32LE(buf.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += buf.length;
    chunks.push(buf);
  });

  fs.writeFileSync(path.join(root, 'public', outFile), Buffer.concat([header, ...chunks]));
  console.log(`✓ ${outFile} (${sizes.join(', ')}px)`);
}

// Generate all
await png(180, 'apple-touch-icon.png');
await png(192, 'icon-192.png');
await png(512, 'icon-512.png');
await png(512, 'icon-512-maskable.png'); // same source, maskable declared in manifest
await ico('favicon.ico');

console.log('\nAll favicon files regenerated from public/icon.svg ✅');
