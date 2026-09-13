// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import process from 'node:process';
import { URL } from 'node:url';
import { satteri } from '@astrojs/markdown-satteri';
import markdownBasePath from './scripts/markdown-base-path.mjs';
import { withBase } from './src/lib/paths.mjs';

const base = withBase('/', process.env.PUBLIC_BASE_PATH ?? '/');

// https://astro.build/config
export default defineConfig({
  // Pages supplies its configured URL; local builds default to the production domain.
  site: process.env.PUBLIC_SITE_URL || 'https://rodyne.xyz',
  base,
  output: 'static',
  trailingSlash: 'always',
  markdown: {
    processor: satteri({ mdastPlugins: [markdownBasePath({ base })] }),
  },
  integrations: [
    sitemap({
      // Draft legal templates are noindexed and excluded until their launch
      // fields have been completed and PUBLIC_LEGAL_READY is explicitly set.
      filter: (page) =>
        process.env.PUBLIC_LEGAL_READY === 'true' ||
        !new URL(page).pathname.startsWith(withBase('/legal/', base)),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
