import assert from 'node:assert/strict';
import test from 'node:test';
import { withBase } from '../src/lib/paths.mjs';
import { markdownToHtml } from 'satteri';
import markdownBasePath from '../scripts/markdown-base-path.mjs';

test('local links work at both a domain root and a Pages repository path', () => {
  for (const base of ['/', '', '/Rodyne-Marketing', '/Rodyne-Marketing/']) {
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

test('Markdown renders prefixed links, images and references while preserving external links', () => {
  const { html } = markdownToHtml(
    '[Blog](/blog/)\n\n![Logo](/blog/image.png)\n\n[Discord](https://discord.com/)\n\n[Local](#heading)\n\n[Workflow][flow]\n\n[flow]: /#workflows',
    { mdastPlugins: [markdownBasePath({ base: '/repo/' })] },
  );
  for (const attribute of [
    'href="/repo/blog/"',
    'src="/repo/blog/image.png"',
    'href="https://discord.com/"',
    'href="#heading"',
    'href="/repo/#workflows"',
  ]) {
    assert.ok(html.includes(attribute), `Missing ${attribute}: ${html}`);
  }
});
