import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.dremorait.in',
  trailingSlash: 'never',
  build: {
    format: 'file',
    // The whole stylesheet is small, so it ships inline (no render-blocking CSS request).
    inlineStylesheets: 'always',
  },
  vite: {
    // Keep every script external so the CSP can stay at script-src 'self'.
    build: { assetsInlineLimit: 0 },
  },
});
