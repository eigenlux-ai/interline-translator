# Contributing to Interline

Thanks for helping make reading across languages easier. **PRs welcome** — code is only one way to contribute. Bug reports, feature ideas, translations, documentation and small reproducible examples are useful too.

[Project](https://github.com/eigenlux-ai/interline-translator) · [Issues](https://github.com/eigenlux-ai/interline-translator/issues) · [Pull requests](https://github.com/eigenlux-ai/interline-translator/pulls) · [中文介绍](./README.zh-CN.md) · [日本語](./README.ja.md) · [한국어](./README.ko.md)

欢迎用中文、英文、日文或韩文提问、反馈问题和提出功能需求。无需先会写代码；清楚的使用场景和复现步骤同样有帮助。

## Start with a problem or an idea

Search [existing issues](https://github.com/eigenlux-ai/interline-translator/issues) first. If you find a matching report, add your example there.

- **Bug reports:** describe what you expected, what happened, reproduction steps, browser/OS, extension version and the engine used. A small public test page is particularly helpful.
- **Feature requests:** describe the task you want to accomplish and what gets in the way. You do not need to propose an implementation.
- **Pull requests:** keep each change focused and explain the resulting behavior. For a substantial feature or architectural change, opening an issue first can help agree on scope; small fixes and documentation improvements can go straight to a PR.

Do not include API keys, authorization headers, private page content or exported configuration files in public issues, logs or screenshots. Configuration exports contain credentials.

## Set up a development checkout

Use Node.js 22+ and pnpm 10.7.1, matching `package.json` and the Node 22 CI environment.

```sh
git clone https://github.com/eigenlux-ai/interline-translator.git
cd interline-translator
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm dev` runs WXT's Chrome development environment with HMR on port 3012. `test-pages/` contains sample articles, input fields and editor/host compatibility cases. For example, open `http://localhost:3012/test-pages/article-sample.html` while the dev server is running.

For a production build, run `pnpm build` and load `.output/chrome-mv3/` from `chrome://extensions`. Run `pnpm zip` to create a distributable archive. Firefox development/build targets are available through `pnpm dev:firefox` and `pnpm build:firefox`; verify browser-specific behavior before claiming compatibility.

A `.env` file is optional. The `WXT_EXTENSION_KEY` field in `.env.example` controls the manifest's public key for a stable extension ID; it is **not an AI API key or a private signing key**. Translation provider keys are configured in the extension's settings, not in build-time environment variables.

## Subtitle diagnostics

Reproduce a subtitle issue, then use **Video subtitles → Export subtitle diagnostics** in extension settings. The JSON contains recent source/parse/render/translation events, cache results, retry delays and anonymous context numbers (`0` is the background). It contains no caption text, URL, page title, provider credentials or raw exceptions. This is a best-effort in-memory history, not telemetry: at most 512 events survive in the background, batches are capped at 32 per frame per second, and restarting the background clears the history. Export soon after reproducing a problem. A missing event does not prove an operation never happened.

Retry delay tests inject deterministic random values. Production retries use bounded jitter; valid `Retry-After` values set a minimum even when longer than the local fallback cap. Switching videos or manually retrying must not bypass that minimum.

## Experimental Safari subtitle testing

On macOS with Xcode installed, run `pnpm build:safari:app`. This builds the Safari extension and generates a locally signed test app at `.output/safari-derived/Build/Products/Debug/Interline.app`. The generated Xcode project and app stay under ignored `.output/`; rerunning the command replaces this generated project. This is a local test build, not an App Store distribution package.

Open the app, enable Interline in Safari, and grant access to YouTube. Local signing may require Safari's Develop → Allow Unsigned Extensions setting. Configure a translation provider in Safari's own extension settings; settings and credentials are not copied from Chrome. Apple's [local testing guide](https://developer.apple.com/documentation/safariservices/running-your-safari-web-extension) describes the setup.

The subtitle output uses a removable TextTrack only during Safari's **system video fullscreen**. Normal webpage fullscreen continues to use the satellite. Native fullscreen uses Safari's subtitle styling; extension font, background and size controls apply to the satellite only. The display mode and original/translation order apply to both.

Before marking Safari support verified, test on the target Safari/device:

- Start a captioned YouTube video, enable Interline, and confirm translation inline before entering system video fullscreen. Check bilingual, original-only and translation-only modes.
- Seek forward/backward, pause/resume, and check subtitle gaps. Old text must disappear immediately on seek and must not persist after a media change.
- Exit and re-enter fullscreen three times; verify original native caption selection is restored and no duplicate Interline tracks accumulate.
- Disable translation, switch videos through YouTube SPA navigation, and repeat. Test live/DVR separately because native in-band caption availability can differ from recorded videos.

Desktop Safari native fullscreen and iOS are separate acceptance targets. Automated track-lifecycle tests and a successful Xcode build do not prove either. This experimental target adds a Safari-specific YouTube page bridge because Safari MV2 does not use `world: MAIN`; editor input injection and about:blank-frame behavior have not been validated for Safari. Do not infer general Safari compatibility from subtitle tests.

## Find the right part of the code

| Area | Location |
| --- | --- |
| Extension entry points, background and content-script mounting | `src/entrypoints/` |
| Settings, floating controls and selection UI | `src/react-app/` |
| Translation providers, prompts, glossary, cache and request handling | `src/services/translation/` |
| Streaming translation | `src/services/stream/` |
| Configuration validation, migration and storage | `src/services/config/` |
| Page traversal, translation insertion and input/editor integration | `src/dom/` |
| Document and Shadow DOM surfaces | `src/surface/` |
| Shared configuration and translation types | `src/data/models/` |
| UI translations | `messages/*.json` |
| Browser-rendered extension descriptions and menu labels | `public/_locales/*/messages.json` |
| Store listing text, screenshots and capture instructions | `assets/store/` |

The project uses WXT, React, Mantine and TypeScript, with [aie-wxt-mantine-surface-template](https://github.com/AIEPhoenix/aie-wxt-mantine-surface-template) as its foundation.

## Keep the page and translation layers separate

- Put floating extension UI in the existing Shadow DOM surface. Page translations intentionally sit beside source content in the host DOM; preserve links, formatting and interactions where supported, and check that turning translation off removes the extension's additions.
- Keep provider authentication, AI SDK calls and persistent translation cache operations in the background layer. Content scripts use the typed messaging and public configuration interfaces; credentials also appear in the authorized settings/configuration layer, but must not be exposed to host pages.
- Reuse the shared prompt, glossary and cache-key code across translation paths. Changes to request semantics may need matching cache invalidation changes.
- Use `PROJECT_PREFIX` from `prefix.cjs` for namespaced classes, elements, storage and CSS variables. Build checks verify the CSS prefix mirror.
- Model capabilities and endpoint compatibility are inferred by implementation rules, not guaranteed for every model. When changing adaptation logic, add a focused case that reproduces the protocol difference.

## Update copy and screenshots together

For interface strings, edit `messages/*.json`, then run:

```sh
pnpm i18n
```

Include the generated `src/paraglide/` changes. Avoid hardcoded UI copy in components. Use existing terms consistently across locales; the display language can differ from the translation target language.

Keep the English, Chinese, Japanese and Korean READMEs aligned when changing feature descriptions. Explain capabilities and their limits; avoid guarantees such as “every website,” “perfect translation,” or “all data stays on device” when translation uses a remote provider.

For store materials, see [the asset guide](./assets/store/README.md). Use the real built extension for screenshots. Keep summary text synchronized with the corresponding manifest locale, and update captures when the visible interface changes.

```sh
pnpm build
pnpm store:assets   # Isolated Chrome for Testing; live key-free translation
pnpm store:check    # Image dimensions, copy consistency and capture records
```

## Verify the change

Choose checks that exercise the behavior you changed. For documentation-only edits, review wording, relative links, commands and language consistency; there is no need to add implementation-mirroring tests. For UI changes, include a screenshot and check the relevant light/dark and language states.

For code changes, the complete CI sequence is:

```sh
pnpm compile
pnpm lint
pnpm test
pnpm build
pnpm audit:css
pnpm audit:ascii
pnpm audit:bundle
```

The audits check CSS variable scoping, ASCII build output and content-script gzip budgets. They do not replace behavior checks on a real page. Use the applicable cases in `test-pages/` for changes involving host styles, selections, input events or editor integration.

In a PR, state which checks ran and what remains unverified. Explain changes to browser permissions, data transmission, retention or provider behavior explicitly. Keep [the privacy policy](./PRIVACY.md) and listing copy consistent with those changes.

## License

Interline is [MIT licensed](./LICENSE). Contributions are made under the project's MIT license. Preserve applicable notices for any third-party code or assets you include.

## Build a store upload

Run `pnpm zip` to build the Chrome extension and create a versioned ZIP in `.output/`. The build and ZIP commands refresh `src/data/third-party-notices.json` from installed runtime dependencies and the WXT foundation. Commit any updated notices when dependencies change. Keep the vendored template and WXT licenses under `src/data/licenses/`.
