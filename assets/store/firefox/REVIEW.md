# Firefox source build and review notes

## Uploads

- Extension: `.output/interline-1.2.1-firefox.zip`.
- Matching source: `.output/interline-1.2.1-sources.zip`.
- Version: 1.2.1. Add-on ID: `interline@eigenlux.com`.
- Target: desktop Firefox 140 or later, using Manifest V3. Android is not declared supported.

Submit updates to the [published Firefox Add-ons listing](https://addons.mozilla.org/en-US/firefox/addon/interline-%E8%A1%8C%E9%97%B4/) using this ID.

Upload the extension ZIP to AMO, then attach the source ZIP when asked whether this extension uses a build process. The ZIP is unsigned; AMO signs it after submission. The source archive includes this file, the lockfile, local build plugins, generated translations and their editable message sources. It excludes credentials, local browser profiles, captures and dependencies.

## Reproduce the extension

The release was built on macOS arm64 with Node.js 22.23.5 and pnpm 10.7.1. Use the same tool versions for comparison. The project requires Node.js 22.12 or later.

Install [Node.js](https://nodejs.org/en/download), then install the pinned package manager:

```sh
npm install --global pnpm@10.7.1
```

Extract the source archive into an empty directory, change into it, and run:

```sh
pnpm install --frozen-lockfile
pnpm zip:firefox
```

The install's `postinstall` step runs `wxt prepare`. `manifestVersion: 3` in `wxt.config.ts` overrides WXT's Firefox default for development, build and ZIP commands. The ZIP command generates third-party notices from the locked dependencies, builds the extension with WXT/Vite, and creates the two archives in `.output/`. Compare the extracted extension ZIP contents, not ZIP timestamps. `.output/firefox-mv3/surface-css/` holds build-audit copies of CSS already embedded in scripts; these copies are intentionally excluded from the extension ZIP.

WXT emits Firefox's MV3 background scripts (a non-persistent event page), rather than Chrome's service worker entry. Host access is declared in `host_permissions`, and toolbar controls use `action`.

Tailwind scans only application sources under `src/`, excluding tests, so omitted repository documentation and test pages cannot change the compiled CSS. After `pnpm zip:firefox`, run `pnpm audit:repro:firefox` to extract the source archive into a temporary directory, install its locked dependencies, rebuild, and compare every extension file byte-for-byte. This audit requires `unzip` on PATH and runs in CI; ZIP metadata is not compared.

No `.env`, API key, private package, account or downloaded browser profile is required to build. `WXT_EXTENSION_KEY` is ignored for Firefox. Translations in `src/paraglide/` are committed generated files; `pnpm i18n` regenerates them from `messages/` if needed, but is not required for this build.

## Data and permissions

Firefox presents the required data permissions at installation:

- `websiteContent`: page/selected text and available YouTube captions sent directly to the chosen translation provider; optional AI context may include surrounding text and page titles.
- `authenticationInfo`: provider API keys or configured authentication headers sent to that selected service when required.
- `personalCommunications`: message or email drafts sent to the chosen provider when the user invokes input translation, and communications explicitly translated on a page.

There is no telemetry or project-operated translation relay. Settings and translated results are retained locally. Subtitle diagnostics omit caption text, page titles, URLs and credentials. See the [privacy policy](https://github.com/eigenlux-ai/interline-translator/blob/main/PRIVACY.md) for the full feature-by-feature description.

The extension requests `storage` for local preferences and credentials, `contextMenus` for translation actions, `alarms` for cache maintenance and retrying initial preference saves, and `<all_urls>` for page translation and cross-origin access to the user-selected translation endpoint. Data permissions describe these existing transfers; they do not add an analytics service.

## Review steps

1. Click the toolbar icon to open settings. The Firefox Manifest V3 build uses `action` for this entry point.
2. Use the built-in key-free Google translation engine; reviewers do not need paid credentials. Choose a target language different from the test page.
3. On an ordinary article, use the floating control, the context menu, or Alt+T to toggle bilingual translation. Select a sentence to test selection translation.
4. In settings, enable input translation if it is off (it starts disabled for English browser languages). Keep its target set to English. In a supported input field, type a non-English draft and press Space three times to translate it. The resulting draft offers Undo.
5. On a YouTube video with captions, enable Interline's CC control. Automatic subtitle activation is off by default. When translation falls behind an ordinary video, the prompt offers an explicit pause to prepare translations; resume manually. Live streams suggest a faster engine instead. No audio transcription is performed.

Browser-restricted pages cannot be translated. The optional Chrome language-detection capability is not available in Firefox; other translation engines remain configurable. Existing Chrome/Ego Lite validation is not a substitute for a full Firefox interaction test.

## Automated validator notes

The bundle contains minified React, Mantine, AI SDK and Zod dependencies. The original sources and exact dependency versions are provided for review. Static validator warnings for `innerHTML` and the `Function` constructor require inspecting the matching sources:

- Translation markup passes through `restoreInline` in `src/dom/inject/placeholder.ts`, which escapes translated text and restores allowed inline markup, before the insertion in `src/dom/inject/wrapper.ts` and `src/dom/page-translation.ts`.
- React DOM's bundled HTML insertion helpers are also detected by static scans.
- Zod contains a feature probe and generated-parser support for `Function`; the extension uses `script-src 'self'; object-src 'self';` and does not enable `unsafe-eval` or fetch executable code from translation providers. The explicit CSP omits `upgrade-insecure-requests` so user-configured HTTP translation endpoints (such as local Ollama) remain reachable.

These explanations are review context, not a claim that AMO has approved the extension.
