# GitHub Pages release

The site is prepared for the existing repository, `ChristianRelf/new-disc-to-rblx-management-app`, and its expected project URL:

`https://christianrelf.github.io/new-disc-to-rblx-management-app/`

The workflow also supports a custom domain. `actions/configure-pages` reads the actual origin and base path from GitHub Pages settings, so a domain does not need to be hard-coded into the source.

## First release

1. Ensure the repository can use Pages. It is currently private; private-repository Pages requires GitHub Pro or another eligible paid plan. Do not change repository visibility merely to run the workflow.
2. Push this checkout, including its lockfile and `.github/workflows/`, to `origin` on `main`.
3. In the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.
4. Run **Deploy GitHub Pages** from the Actions tab. After Pages is enabled, future pushes to `main` build and deploy automatically.

The initial push can fail at the Configure Pages step if Pages has not been enabled yet; rerun it after step 3. This preparation does not itself enable Pages, push source, change access, or deploy.

The deployment runs `npm ci`, type checking, lint, unit tests, a production build, and validation of generated links, assets, canonical URLs, sitemap URLs, and draft legal indexing. Only a successful build is uploaded. The `github-pages` environment receives the deployment URL. Pull requests run the same checks for both a root deployment and the repository subpath, without publishing.

## Local release verification

Use Node 24 and the committed npm lockfile. In PowerShell:

```powershell
npm.cmd ci
$env:PUBLIC_SITE_URL = 'https://christianrelf.github.io'
$env:PUBLIC_BASE_PATH = '/new-disc-to-rblx-management-app/'
npm.cmd run check
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run verify:release
npm.cmd run preview
```

Open the preview URL with `/new-disc-to-rblx-management-app/` appended. For a root/custom-domain build, set `PUBLIC_BASE_PATH` to `/` and `PUBLIC_SITE_URL` to the intended HTTPS origin, then rebuild. Use these environment variables rather than overriding only Astro's `--base` flag: the Markdown link transformer uses the configured base too.

Remove these shell overrides when returning to ordinary root-path development:

```powershell
Remove-Item Env:PUBLIC_SITE_URL, Env:PUBLIC_BASE_PATH -ErrorAction SilentlyContinue
```

## Custom domain

After purchasing a domain, add it under **Settings → Pages → Custom domain**, configure the DNS records GitHub specifies, and enable HTTPS when the certificate is ready. Rerun the deployment so canonical URLs, social-image URLs and sitemap entries use the new origin. The Actions deployment reads the setting directly; there is no domain baked into this release.

## Product launch settings

Optional repository Actions variables:

- `PUBLIC_APP_URL`: the HTTPS dashboard origin. Leave unset while the product is a marketing preview; empty values keep checkout and sign-in unavailable.
- `PUBLIC_LEGAL_READY`: leave unset or `false` until the draft legal documents have been completed and reviewed. Only the exact value `true` enables indexing of those pages.

These are public build-time values, not secrets. GitHub Pages serves static files; the connected bot, dashboard and billing backend must be hosted separately.

Draft legal pages retain `noindex, nofollow` and stay out of the sitemap. A project-site `robots.txt` lives under the project subpath and is not the origin's root robots file, so the per-page noindex directive is the indexing control for those routes.

## References

- [Astro's GitHub Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages workflow configuration](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Pages eligibility and setup](https://docs.github.com/en/pages/quickstart)
