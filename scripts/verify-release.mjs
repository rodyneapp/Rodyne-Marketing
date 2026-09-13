import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import console from 'node:console';
import { URL } from 'node:url';
import { withBase } from '../src/lib/paths.mjs';

assert.ok(
  process.env.PUBLIC_SITE_URL,
  'Set PUBLIC_SITE_URL to the intended release origin.',
);
const origin = new URL(process.env.PUBLIC_SITE_URL);
assert.equal(origin.protocol, 'https:', 'Release URLs must use HTTPS.');
assert.ok(
  !origin.hostname.endsWith('.invalid'),
  'Release origin is still a placeholder.',
);
const base = withBase('/', process.env.PUBLIC_BASE_PATH ?? '/');
const output = path.resolve('dist');
const errors = [];
let checked = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    ),
  );
  return files.flat();
}

async function checkUrl(value, pageUrl, source) {
  if (!value || /^(data:|mailto:|tel:|javascript:)/i.test(value)) return;
  const url = new URL(value.replaceAll('&amp;', '&'), pageUrl);
  if (url.origin !== origin.origin) return;
  checked++;
  if (!url.pathname.startsWith(base)) {
    errors.push(`${source}: URL escapes deployment base: ${value}`);
    return;
  }
  const relative = decodeURIComponent(url.pathname.slice(base.length));
  let file = path.resolve(output, relative || 'index.html');
  if (!file.startsWith(output + path.sep)) {
    errors.push(`${source}: invalid local path: ${value}`);
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    await stat(file);
    if (url.hash && file.endsWith('.html')) {
      const html = await readFile(file, 'utf8');
      const id = decodeURIComponent(url.hash.slice(1));
      if (!html.includes(`id="${id}"`))
        errors.push(`${source}: missing anchor ${value}`);
    }
  } catch {
    errors.push(`${source}: missing local target ${value}`);
  }
}

const files = await walk(output);
for (const file of files.filter((file) => file.endsWith('.html'))) {
  const relative = path.relative(output, file).replaceAll(path.sep, '/');
  const pagePath = relative.replace(/index\.html$/, '');
  const pageUrl = new URL(`${base}${pagePath}`, origin);
  const html = await readFile(file, 'utf8');
  const canonical = html.match(
    /<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/,
  )?.[1];
  assert.equal(canonical, pageUrl.href, `${relative}: incorrect canonical URL`);
  for (const tag of html.matchAll(/<(?:a|link|script|img|source)\b[^>]*>/g)) {
    for (const attribute of tag[0].matchAll(/\b(?:href|src)="([^"]*)"/g)) {
      await checkUrl(attribute[1], pageUrl, relative);
    }
    const srcset = tag[0].match(/\bsrcset="([^"]+)"/)?.[1];
    if (srcset)
      for (const candidate of srcset.split(','))
        await checkUrl(candidate.trim().split(/\s+/)[0], pageUrl, relative);
  }
  for (const tag of html.matchAll(
    /<meta\b[^>]*(?:property="og:image"|name="twitter:image")[^>]*content="([^"]+)"/g,
  )) {
    await checkUrl(tag[1], pageUrl, relative);
  }
  if (
    pagePath.startsWith('legal/') &&
    process.env.PUBLIC_LEGAL_READY !== 'true'
  ) {
    assert.ok(
      html.includes('noindex, nofollow'),
      `${relative}: draft legal page can be indexed`,
    );
  }
}
for (const file of files.filter((file) => file.endsWith('.css'))) {
  const relative = path.relative(output, file).replaceAll(path.sep, '/');
  const css = await readFile(file, 'utf8');
  for (const match of css.matchAll(
    /url\(\s*(?:"([^"]*)"|'([^']*)'|([^\s)]*))\s*\)/gi,
  )) {
    await checkUrl(
      match[1] ?? match[2] ?? match[3],
      new URL(`${base}${relative}`, origin),
      relative,
    );
  }
}
for (const file of files.filter((file) => /sitemap.*\.xml$/.test(file))) {
  const xml = await readFile(file, 'utf8');
  for (const match of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
    assert.ok(
      match[1].startsWith(new URL(base, origin).href),
      'Sitemap URL has the wrong origin/base.',
    );
    if (process.env.PUBLIC_LEGAL_READY !== 'true')
      assert.ok(
        !new URL(match[1]).pathname.startsWith(withBase('/legal/', base)),
        'Draft legal page is in the sitemap.',
      );
    await checkUrl(match[1], origin, path.basename(file));
  }
}
const robots = await readFile(path.join(output, 'robots.txt'), 'utf8');
assert.ok(
  robots.includes(
    `Sitemap: ${new URL(withBase('/sitemap-index.xml', base), origin)}`,
  ),
  'robots.txt has the wrong sitemap URL.',
);
assert.ok(files.includes(path.join(output, '.nojekyll')), 'Missing .nojekyll.');
assert.deepEqual(errors, [], 'Release contains broken links or assets.');
console.log(
  `Release verified: ${files.filter((file) => file.endsWith('.html')).length} pages, ${checked} local URLs, base ${base}`,
);
