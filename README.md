# Rodyne marketing site

Astro marketing site for a paid workspace connecting Roblox communities,
Roblox experiences and Discord servers.

GitHub Pages release setup and custom-domain instructions: [docs/github-pages.md](docs/github-pages.md).

## Commands

```sh
npm install
npm run dev
npm run check
npm run lint
npm test
npm run format:check
npm run build
npm run preview
```

## Launch configuration

Product copy, pricing and destinations are centralised in `src/data/site.ts`.
The product is named Rodyne. Replace remaining `.invalid` configuration
before a public release. Sign-in links stay hidden and pricing actions show
availability until `PUBLIC_APP_URL` is configured. The production site defaults to
`https://rodyne.xyz`; `PUBLIC_SITE_URL` can override it. Set `PUBLIC_APP_URL` to
the hosted dashboard origin when it is ready.

For GitHub Pages project URLs, `PUBLIC_BASE_PATH` sets the repository subpath.
The Pages workflow supplies the origin and base automatically from repository
settings. Navigation, Markdown content links, favicons, and sitemap URLs use
the same base. Run `npm run verify:release` after a production build with
`PUBLIC_SITE_URL` and `PUBLIC_BASE_PATH` set to check the generated output.

Legal operator details and the document set live in `src/data/legal.ts`. The
legal routes remain visibly marked as drafts, receive `noindex`, and are
excluded from the sitemap until all bracketed fields have been replaced,
production vendors and retention periods have been verified, and the documents
have been reviewed for the actual business. Only then set:

```sh
PUBLIC_LEGAL_READY=true
```

This flag removes the draft indexing restrictions; it does not validate the
content automatically.

## Legal routes

- `/legal/`
- `/legal/terms/`
- `/legal/privacy/`
- `/legal/children/`
- `/legal/cookies/`
- `/legal/acceptable-use/`
- `/legal/dpa/`
- `/legal/subprocessors/`

## Implementation notes

- Astro components and scoped CSS; no client framework.
- Vanilla TypeScript handles the mobile menu and restrained home-page motion.
- Raster avatars are processed through Astro's image pipeline.
- Continuous animation pauses offscreen, while the tab is hidden and when
  reduced motion is requested.
