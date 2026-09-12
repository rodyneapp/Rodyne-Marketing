# Writing blog posts

Add a `.md` file to `src/content/blog/`. Its filename becomes the URL: `my-update.md` is published at `/blog/my-update/`.

Start with this metadata, then write normal Markdown:

```markdown
---
title: Your post title
description: A short introduction shown in the post list and article header.
date: 2026-09-12
category: Changelog
author: Relay team
draft: true
---

Opening paragraph.

## What changed

- Describe the update.
```

Categories: `Announcement`, `Press release`, or `Changelog`. The author defaults to Relay team. Use `draft: true` while writing; drafts are excluded from the public index, article routes and sitemap. Set it to `false` (or remove it) when ready, then rebuild and deploy. Dates are publication labels, not automatic scheduling.

The title is rendered as the page heading, so begin body sections with `##`. Markdown supports lists, links, images, quotes, tables and fenced code blocks. Put images in `public/blog/` and reference them with `/blog/your-image.webp`. Root-relative Markdown links, images and link-reference definitions are automatically prefixed with the deployment base for GitHub Pages; use normal Markdown syntax rather than raw HTML for those links. Posts sort newest first. No browser editor or database is required.
