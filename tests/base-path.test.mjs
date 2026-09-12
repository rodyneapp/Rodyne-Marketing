import assert from 'node:assert/strict';
import test from 'node:test';
import { withBase } from '../src/lib/paths.mjs';
import remarkBasePath from '../scripts/remark-base-path.mjs';

test('local links work at both a domain root and a Pages repository path', () => {
  for (const base of [
    '/',
    '',
    '/new-disc-to-rblx-management-app',
    '/new-disc-to-rblx-management-app/',
  ]) {
    const prefix = base.replace(/\/$/, '');
    assert.equal(withBase('/', base), `${prefix}/`);
    assert.equal(withBase('/#pricing', base), `${prefix}/#pricing`);
    assert.equal(withBase('/blog/post/', base), `${prefix}/blog/post/`);
    assert.equal(
      withBase('/favicon.ico?v=2', base),
      `${prefix}/favicon.ico?v=2`,
    );
  }
});

test('external URLs, anchors and already prefixed routes are preserved', () => {
  const base = '/repo/';
  for (const url of [
    'https://example.com/a',
    '//example.com/a',
    '#section',
    'mailto:team@example.com',
    'image.png',
    '/repo/blog/',
    '/repo?search=1',
    '/repo#section',
  ]) {
    assert.equal(withBase(url, base), url);
  }
  assert.equal(withBase('/repository/', base), '/repo/repository/');
});

test('Markdown rewrites links, images and reference definitions without changing external links', () => {
  const tree = {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'link', url: '/blog/', children: [] },
          { type: 'image', url: '/blog/image.png' },
          { type: 'link', url: 'https://discord.com/', children: [] },
          { type: 'link', url: '#heading', children: [] },
        ],
      },
      { type: 'definition', url: '/#workflows' },
    ],
  };
  const transform = remarkBasePath({ base: '/repo/' });
  transform(tree);
  assert.deepEqual(
    tree.children[0].children.map((node) => node.url),
    ['/repo/blog/', '/repo/blog/image.png', 'https://discord.com/', '#heading'],
  );
  assert.equal(tree.children[1].url, '/repo/#workflows');
  transform(tree);
  assert.equal(tree.children[1].url, '/repo/#workflows');
});
