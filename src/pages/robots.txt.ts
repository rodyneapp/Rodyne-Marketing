import type { APIRoute } from 'astro';
import { legalConfig } from '../data/legal';
import { site } from '../data/site';

export const prerender = true;

export const GET: APIRoute = ({ site: astroSite }) => {
  const origin = astroSite ?? new URL(site.placeholderOrigin);
  const sitemapUrl = new URL('/sitemap-index.xml', origin);

  const legalRule = legalConfig.isDraft ? 'Disallow: /legal/\n' : '';

  return new Response(
    `User-agent: *\nAllow: /\n${legalRule}Sitemap: ${sitemapUrl}\n`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );
};
