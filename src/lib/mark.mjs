// The Dremora D mark for generated images (social cards, favicons), plus its dark-mode
// version: the navy parts turn near-white and the grey orbit and pixels stay grey, so
// the logo reads on dark backgrounds without a box or a glow.
import sharp from 'sharp';
import { join } from 'node:path';

export const MARK_PATH = join(process.cwd(), 'src/assets/brand/dremora-mark.png');
export const MARK_DARK_PATH = join(process.cwd(), 'src/assets/brand/dremora-mark-dark.png');

const LIGHT = [245, 247, 250];

/** The mark as a PNG buffer with navy recoloured to near-white. */
export async function darkMark() {
  const { data, info } = await sharp(MARK_PATH).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    // Navy is blue-heavy (about 16,32,80); grey has equal channels. Blend by how blue the pixel is.
    const t = Math.min(1, Math.max(0, (data[i + 2] - data[i] - 8) / 40));
    for (let c = 0; c < 3; c++) data[i + c] = Math.round(data[i + c] + (LIGHT[c] - data[i + c]) * t);
  }
  return sharp(data, { raw: info }).png({ compressionLevel: 9 }).toBuffer();
}

/** A mark (path or buffer) fitted into a transparent `size` x `size` square. */
export async function markSquare(input, size, { fill = 0.92 } = {}) {
  const inner = Math.round(size * fill);
  const mark = await sharp(input).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  const pad = Math.round((size - inner) / 2);
  return sharp({ create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: mark, left: pad, top: pad }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}
