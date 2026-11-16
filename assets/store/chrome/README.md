# Chrome Web Store assets

This directory also provides the shared baseline for other browsers. See the [store asset index](../README.md) for Firefox, Edge and Safari overrides, and [CHROMEWEBSTORE.md](./CHROMEWEBSTORE.md) for Chrome submission details.

Captured for Interline **1.1.0** on 2026-11-12 using **Ego Lite**. Each of the Chinese, English, Japanese and Korean sets contains four real feature screenshots, one explicitly labeled subtitle illustration, two promotional images and listing copy.

[View the four-language overview](./preview.png)

## Upload files

| Directory | Store language                         |
| --------- | -------------------------------------- |
| `global/` | English (default/international assets) |
| `zh_CN/`  | Simplified Chinese                     |
| `ja/`     | Japanese                               |
| `ko/`     | Korean                                 |

Upload the five screenshots from each directory in this order:

1. `screenshot-1-bilingual.png`: real paragraph-by-paragraph translation of an original article.
2. `screenshot-2-selection.png`: the real selection card opened for a sentence, including copy and read-aloud controls.
3. `screenshot-3-settings.png`: reading appearance in general settings, including real style previews and navigation.
4. `screenshot-4-input-translation.png`: the real English result after pressing Space three times, with Undo and the original sample draft on the right.
5. `screenshot-5-subtitles.png`: original AI-generated library/lake scenery with illustrative bilingual subtitles using built-in product sample text. It does not represent actual video playback or a live translation capture.

All five feature images are **1280 × 800, RGB PNG, without transparency**. Each directory also contains:

- `promo-small.png`: a 440 × 280 brand promotional tile.
- `promo-marquee.png`: a 1400 × 560 banner with a proportionally scaled real bilingual-reading capture.
- `summary.txt`: the short description matching the corresponding manifest locale.
- `listing.txt`: the full description, covering subtitle support, licensing, service costs and data handling.

`preview.png` is an internal review overview, not an upload screenshot. Upload promotional images to the small/marquee fields; they do not count toward the five screenshots. Submit the extension ZIP separately from these assets.

## Provenance and validation

- Extension: the Chrome production build of version 1.1.0 at capture time.
- Browser: Ego Lite, with a 1120 × 600 source viewport and deviceScaleFactor=1.
- Original articles and input fields: `scripts/store/fixtures.mjs`, served locally. The English reading capture translates French into English; the other sets translate English into their respective languages. Input translation always targets English.
- Subtitle artwork: an original fictional library/mountain-lake scene generated with the built-in image_gen tool, without third-party people, videos or brands. The original image and full prompt are in `source/subtitle-scene.png` and `source/generation.json`. These are production sources, not store uploads.
- Page, selection and input translations were returned by the built-in free Google Translate engine. The fifth image is explicitly labeled promotional artwork: captions come from the product's built-in preview, with code-based composition for accurate multilingual text. The CC/settings controls are statically rendered real Mantine ActionIcons, matching product sizing, spacing and the gear icon. The illustration is not interactive and does not indicate playback or a service connection.
- The subtitle illustration uses two lines for original and translated text, 26px type and a translucent background based on product subtitle styling. It is neither a settings-page capture nor a real video screenshot.
- Temporary language, appearance and translation settings were restored after capture. Personal provider credentials were not exported or used for the demonstration.
- Unrelated extension overlays were removed from task pages during capture and composition. The first four product screenshots are unretouched; the fifth is the original illustration described above. Canvas headings, version labels, borders and shadows are composed outside the product captures.

`capture-manifest.json` records source and output SHA-256 hashes, source URLs and versions. Raw captures are kept in the Git-ignored `.cache/store-capture/raw/` directory. Inspect the actual images during review; dimension checks do not replace visual acceptance.

## Updating assets with Ego Lite

Read the local browser automation rules and the `ego-browser` skill first. Use one TaskSpace throughout capture. Do not use or close the user's existing tabs.

```sh
pnpm build
node scripts/store/ego-server.mjs
```

The server listens only on `127.0.0.1:9341` and does not launch another browser. In Ego Lite:

1. Load or reload the production extension. Record non-secret settings that will be changed temporarily so they can be restored; do not export full configuration or personal API keys.
2. Use the built-in free engine and switch through `global / zh_CN / ja / ko`. The sample page is `/?locale=global`; append `&mode=input` for the input example.
3. Operate the real controls at 1120 × 600 and capture the first four screenshots after translations, fonts and animations finish. Save them as `.cache/store-capture/raw/<locale>-<screenshot-name>.png`. For settings, scroll to reading appearance. Render the fifth image at `/subtitle-illustration?locale=<locale>` and save it in the same directory as `<locale>-screenshot-5-subtitles.png`.
4. Keep provenance records. On the promotional canvas page in the same TaskSpace, compose all four language sets:

```js
const { composeStoreAssets } = await import('/absolute/repo/scripts/store/compose-ego.mjs');
await composeStoreAssets(page, '/absolute/repo');
```

`copy.mjs` holds localized promotional copy; `artwork.mjs` defines the canvas. Composition removes unrelated extension overlays only from the canvas page, without changing the product UI inside the captures.

5. Update the provenance manifest and overview. Check long headings, edge clipping, subtitle placement and small promotional tiles. Restore temporary settings, end the TaskSpace and stop the local server.
6. Run `pnpm store:check`, then package the four locale directories with this README and the provenance manifest.

The legacy `pnpm store:assets` command runs a Chrome for Testing capture workflow using the older engine/dark-settings arrangement. **Do not use it to overwrite the 1.1.0 Ego Lite assets.**

## Store links

- Project: https://github.com/eigenlux-ai/interline-translator
- Support and requests: https://github.com/eigenlux-ai/interline-translator/issues
- Contributions: https://github.com/eigenlux-ai/interline-translator/pulls
- Privacy: https://github.com/eigenlux-ai/interline-translator/blob/main/PRIVACY.md

Validation covers the four-language layouts and demonstration flows described above. It does not establish compatibility with every website, paid provider or browser.
