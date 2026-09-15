# GitHub Pages release

The site lives in [`rodyneapp/Rodyne-Marketing`](https://github.com/rodyneapp/Rodyne-Marketing) and its production domain is:

`https://rodyne.xyz/`

Local builds default to this domain. `actions/configure-pages` reads the actual origin and base path from GitHub Pages settings during deployment. Before the custom domain is configured, the expected project URL is `https://rodyneapp.github.io/Rodyne-Marketing/`.

## First release

1. Ensure the organisation can use Pages for this private repository (GitHub Team or Enterprise). Repository visibility should remain as intended.
2. Push this checkout, including its lockfile and `.github/workflows/`, to `origin` on `main`.
3. In the repository's **Settings → Pages**, set **Build and deployment → Source** to **GitHub Actions**.
4. Set **Custom domain** to `rodyne.xyz`, then configure the DNS records below.
5. Run **Deploy GitHub Pages** from the Actions tab. After Pages is enabled, future pushes to `main` build and deploy automatically.

The initial push can fail at the Configure Pages step if Pages has not been enabled yet; rerun it after step 3. This preparation does not itself enable Pages, push source, change access, or deploy.

The deployment runs `npm ci`, type checking, lint, unit tests, a production build, and validation of generated links, assets, canonical URLs, sitemap URLs, and draft legal indexing. Only a successful build is uploaded. The `github-pages` environment receives the deployment URL. Pull requests run the same checks for both a root deployment and the repository subpath, without publishing.

## Local release verification

Use Node 24 and the committed npm lockfile. In PowerShell:

```powershell
npm.cmd ci
$env:PUBLIC_SITE_URL = 'https://rodyne.xyz'
$env:PUBLIC_BASE_PATH = '/'
npm.cmd run check
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run verify:release
npm.cmd run preview
```

Open the preview URL at its root. To verify the fallback project URL, use `PUBLIC_SITE_URL=https://rodyneapp.github.io` and `PUBLIC_BASE_PATH=/Rodyne-Marketing/`, rebuild, and append that path to the preview URL. Use these environment variables rather than overriding only Astro's `--base` flag: the Markdown link transformer uses the configured base too.

Remove these shell overrides when returning to ordinary root-path development:

```powershell
Remove-Item Env:PUBLIC_SITE_URL, Env:PUBLIC_BASE_PATH -ErrorAction SilentlyContinue
```

## Custom domain

Add `rodyne.xyz` under the repository's **Settings → Pages → Custom domain** before changing DNS. At your DNS provider, use these records:

| Type  | Name | Value               |
| ----- | ---- | ------------------- |
| A     | @    | 185.199.108.153     |
| A     | @    | 185.199.109.153     |
| A     | @    | 185.199.110.153     |
| A     | @    | 185.199.111.153     |
| CNAME | www  | rodyneapp.github.io |

The `www` record allows GitHub to redirect `www.rodyne.xyz` to the chosen apex domain. Enable **Enforce HTTPS** when the certificate is ready. Rerun the deployment so canonical URLs, social-image URLs and sitemap entries use `https://rodyne.xyz` with base `/`.

This custom Actions workflow reads the domain from Pages settings; a repository `CNAME` file is not required and does not configure it. See [GitHub's custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Product launch settings

Optional repository Actions variables:

- `PUBLIC_APP_URL`: optional HTTPS app origin override. Defaults to `https://app.rodyne.xyz`; sign-in, Get started and plan buttons use its `/login` route.
- `PUBLIC_LEGAL_READY`: leave unset or `false` until the draft legal documents have been completed and reviewed. Only the exact value `true` enables indexing of those pages.

These are public build-time values, not secrets. GitHub Pages serves static files; the connected bot, dashboard and billing backend must be hosted separately.

Draft legal pages retain `noindex, nofollow` and stay out of the sitemap. A project-site `robots.txt` lives under the project subpath and is not the origin's root robots file, so the per-page noindex directive is the indexing control for those routes.

## References

- [Astro's GitHub Pages deployment guide](https://docs.astro.build/en/guides/deploy/github/)
- [GitHub Pages workflow configuration](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [Pages eligibility and setup](https://docs.github.com/en/pages/quickstart)
