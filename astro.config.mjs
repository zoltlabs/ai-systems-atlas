// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://aisystemsatlas.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  compressHTML: true,
  integrations: [
    sitemap({
      // OG render targets and the 404 page are not content.
      filter: (page) => !page.includes('/og/') && !page.endsWith('/404'),
      changefreq: 'weekly',
    }),
  ],
  vite: { build: { assetsInlineLimit: 0 } },
});
