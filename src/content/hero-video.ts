import { existsSync } from 'node:fs';
import { join } from 'node:path';

// The home hero shows the video frame only once both files are in public/media/.
// Until then it keeps the example inbox window. Use a 16:9 MP4 (H.264, under about 8 MB,
// no sound needed: it plays muted) and a WebP poster of the same size, e.g. 1920 by 1080.
export const heroVideo = {
  src: '/media/hero.mp4',
  poster: '/media/hero-poster.webp',
  label: 'Video from Dremora IT',
};

const has = (path: string) => existsSync(join(process.cwd(), 'public', path));
export const hasHeroVideo = () => has(heroVideo.src) && has(heroVideo.poster);
