// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import process from 'node:process';
import { URL } from 'node:url';

// https://astro.build/config
export default defineConfig({
  // Required launch configuration: replace PUBLIC_SITE_URL with the production origin.
  site: process.env.PUBLIC_SITE_URL ?? 'https://replace-before-launch.invalid',
  integrations: [
    sitemap({
      // Draft legal templates are noindexed and excluded until their launch
      // fields have been completed and PUBLIC_LEGAL_READY is explicitly set.
      filter: (page) =>
        process.env.PUBLIC_LEGAL_READY === 'true' ||
        !new URL(page).pathname.startsWith('/legal/'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
