import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Videos shown in VideoFrame.astro. Files live in public/media/.
// Encode each one as H.264 MP4 with no audio and +faststart, a 1080p file for screens
// 800px and wider and a 720p file for phones, plus a WebP poster of the same size.

// Home hero: shown only once both files exist; the example inbox window until then.
export const heroVideo = {
  src: '/media/hero.mp4',
  poster: '/media/hero-poster.webp',
  label: 'Video from Dremora IT',
};

const has = (path: string) => existsSync(join(process.cwd(), 'public', path));
export const hasHeroVideo = () => has(heroVideo.src) && has(heroVideo.poster);

// Custom software, CRM and ERP page. 18 seconds, no audio.
export const crmPromo = {
  sources: [
    { src: '/media/crm-promo-1080.mp4', media: '(min-width: 800px)' },
    { src: '/media/crm-promo-720.mp4' },
  ],
  poster: '/media/crm-promo-poster.webp',
  label: 'Dremora CRM: capture leads, organise the pipeline, automate follow-ups and track revenue',
  caption: 'Dremora CRM product demo. Names and figures are sample data.',
};
