import { withBase } from '../src/lib/paths.mjs';

/** Prefix local Markdown URLs using Astro 7's native Satteri visitors.
 * @param {{base?: string}} options
 */
export default function markdownBasePath({ base = '/' } = {}) {
  const rewrite = (node, context) => {
    const url = withBase(node.url, base);
    if (url !== node.url) context.setProperty(node, 'url', url);
  };
  return {
    name: 'site-base-path',
    link: rewrite,
    image: rewrite,
    definition: rewrite,
  };
}
