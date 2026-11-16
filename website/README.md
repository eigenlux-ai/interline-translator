# Interline website

A standalone static website in Chinese and English, with Chinese at the root and English under `en/`. First visits select a language from browser preferences; an explicit choice takes precedence on later visits. The site reuses the brand icon and real store screenshots without frameworks, third-party fonts, analytics or the extension runtime. Building requires Node.js 22+ and no dependency installation.

## Language selection

- Priority: explicit `?lang=zh` / `?lang=en` in a language-switch link → saved manual choice → browser language preferences → English.
- Match the first supported language in browser preference order. `zh` variants, including `zh-CN`, `zh-TW` and `zh-HK`, use the existing Simplified Chinese page; `en` and its regional variants use English. Fall back to English if none match.
- Manual choices are stored in localStorage scoped to the site's path and are not sent to a server. Clearing site data restores browser-based selection. Automatic detection never overwrites the saved manual choice.
- Automatic redirects work from either language entry point, preserve query parameters and anchors, and support GitHub Pages project subpaths. Explicit language parameters override previous choices even when storage is disabled, although the choice cannot persist across visits in that case.
- With JavaScript disabled, automatic selection and persistence are unavailable; the top-right links still open both complete static pages.

## Local preview

Run from the repository root:

```sh
node website/build.mjs
node website/preview.mjs
```

Alternatively, use `pnpm site:build` and `pnpm site:preview`. Open the printed `http://127.0.0.1:4173` URL. Set `SITE_PORT=4174` if the default port is occupied. Rebuild and refresh after changing source files.

## GitHub Pages deployment

1. Commit and push the website files and `.github/workflows/pages.yml` to `main`.
2. Under repository **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**.
3. Open **Actions → Deploy website to GitHub Pages → Run workflow**, select `main` and run it. Subsequent relevant changes pushed to `main` deploy automatically. Pull requests build without deploying.
4. After the workflow succeeds, open the actual URL from the deployment job or Settings → Pages. The expected project URL is `https://eigenlux-ai.github.io/interline-translator/`, with English under `en/`.

Follow any existing organization or repository protection requirements for GitHub Actions, Pages or the `github-pages` environment.

Build output is written to the Git-ignored `website/dist/` directory. The workflow uploads only that directory, excluding repository configuration and extension builds. Relative asset paths support both GitHub Pages project subpaths and custom domains; language switching is independent of the domain and repository name. If a custom domain is added, also review installation links, repository links and site metadata.

## Content maintenance

- `content.mjs`: Chinese and English copy.
- `build.mjs`: page templates and static asset copying.
- `style.css`: responsive styles.
- `site.js`: screenshot tabs with arrow-key, Home, End, Enter and Space support; all content remains visible without JavaScript.
- `language.js`: selects the language before rendering, restores manual preferences and handles language-switch links.
- `../assets/store/chrome/{zh_CN,global}/`: the three real screenshots reused by the site. Update them through the store asset workflow, then rebuild the website.

The FAQ uses native `details` elements without JavaScript. The site does not translate content or collect API keys; installation buttons link directly to the Chrome Web Store. Deployment uses GitHub's official Pages Actions; see the [custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
