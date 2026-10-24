import { founder, known } from './site';

// The founder section appears only with a real photo at src/assets/founder.(jpg|png|webp).
const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/founder.{jpg,jpeg,png,webp}', { eager: true });
export const founderPhoto = Object.values(photos)[0]?.default;
export const showFounder = () => known(founder.name) && known(founder.role) && (import.meta.env.DEV || !!founderPhoto);
