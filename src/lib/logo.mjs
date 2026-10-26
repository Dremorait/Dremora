// Dremora logos as SVG, built from src/assets/brand/logo.json (traced from the brand sheet).
//   wordmark  :DREMORA, for headers and small widths
//   mark      :D, for icons
//   smile     the D turned into a smile, for fun moments such as the 404 page
// The site loads public/brand/logo.svg (a sprite) once and colours it with CSS, so the
// letters follow `color` and the grey squares follow --logo-accent. Favicons, social cards
// and the old intern/admin pages use standalone files with fixed colours.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const logos = JSON.parse(readFileSync(join(process.cwd(), 'src/assets/brand/logo.json'), 'utf8'));

// Brand sheet colours.
export const BRAND = {
  ink: '#0B0B0C', // "on ink" background
  dark: '#1A1C20', // letters on white
  greyOnLight: '#8A9099', // squares on white
  white: '#FFFFFF', // letters on ink
  greyOnDark: '#C8CCD2', // squares on ink
};

const shapes = (name, letters, squares) => {
  const l = logos[name];
  const rects = l.squares.map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${squares}/>`).join('');
  return `${rects}<path transform="translate(${l.path.dx} ${l.path.dy})" fill-rule="evenodd" ${letters} d="${l.path.d}"/>`;
};

/** Standalone SVG in fixed colours. `pad` adds space round the logo, in viewBox units;
 *  `width` sets the rendered pixel width (height follows), so rasterising stays sharp. */
export function logoSvg(name, { letters = BRAND.dark, squares = BRAND.greyOnLight, background, pad = 0, radius = 0, width } = {}) {
  const [w, h] = logos[name].viewBox;
  const W = w + pad * 2, H = h + pad * 2;
  const size = width ? ` width="${width}" height="${Math.round((width * H) / W)}"` : '';
  const bg = background ? `<rect width="${W}" height="${H}" rx="${radius}" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"${size}>${bg}<g transform="translate(${pad} ${pad})">${shapes(name, `fill="${letters}"`, `fill="${squares}"`)}</g></svg>`;
}

/** The :D mark centred on a square tile, for icons. `fill` is the share of the tile the mark's width takes. */
export function markTile(size, { background = BRAND.ink, fill = 0.66, radius = 0.22 } = {}) {
  const [w, h] = logos.mark.viewBox;
  const S = w / fill; // tile side in viewBox units
  const x = (S - w) / 2, y = (S - h) / 2;
  const bg = background ? `<rect width="${S}" height="${S}" rx="${S * radius}" fill="${background}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${size}" height="${size}">${bg}<g transform="translate(${x} ${y})">${shapes('mark', `fill="${BRAND.white}"`, `fill="${BRAND.greyOnDark}"`)}</g></svg>`;
}

/** Sprite of all three logos for <use href="/brand/logo.svg#wordmark">, coloured by CSS. */
export function logoSprite() {
  const symbols = Object.keys(logos).filter((k) => !k.startsWith('_')).map((name) => {
    const [w, h] = logos[name].viewBox;
    return `<symbol id="${name}" viewBox="0 0 ${w} ${h}">${shapes(name, 'fill="currentColor"', 'style="fill: var(--logo-accent, #8A9099)"')}</symbol>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>\n`;
}
