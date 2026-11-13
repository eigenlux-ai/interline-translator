# Chrome Web Store — Interline · 行间

Last updated: 2026-11-13

## Release

Version **1.1.1**, tag **v1.1.1**. Build the Chrome upload with `pnpm zip`; the upload file is `.output/interline-1.1.1-chrome.zip`. This records a prepared release, not a submission or approval in the store dashboard.

See [CHANGELOG.md](./CHANGELOG.md) for release history. This update adds subtitle lag prompts and optional translation buffering, preserves buffering through retries and fullscreen transitions, improves localized copy, and incorporates the upstream surface template update. No browser permissions are added.

## Listing and assets

- Name: **Interline · 行间**, matching the manifest.
- Single purpose: bilingual reading and translation of web content, including available YouTube captions and user-triggered input translation.
- Suggested category: Productivity. Existing dashboard distribution, language and publisher settings are retained; they are not managed by this release script.
- Short and detailed descriptions: [English](./assets/store/global/listing.txt), [Chinese](./assets/store/zh_CN/listing.txt), [Japanese](./assets/store/ja/listing.txt), [Korean](./assets/store/ko/listing.txt). Each directory's `summary.txt` matches its manifest description.
- Store icon: [128×128 PNG](./public/icon/128.png).
- Screenshots and promotional images: [asset guide](./assets/store/README.md). The four language sets contain five 1280×800 screenshots/illustrations, a 440×280 tile and a 1400×560 marquee each.
- Existing images retain their 1.1.0 capture provenance; they do not demonstrate the new buffering prompt. The subtitle illustration is explicitly labeled as an illustration.

## Permissions justification

| Permission | Purpose |
| --- | --- |
| `storage` | Save language preferences, engine configuration and credentials locally. |
| `contextMenus` | Offer page and selection translation from the right-click menu. |
| `alarms` | Schedule periodic cleanup of the local translation cache. |
| `<all_urls>` host access | Translate supported pages, including automatic site rules, and contact the user's selected translation endpoint across origins. Browser-restricted pages remain inaccessible. |

## Privacy and data use

The [privacy policy](https://github.com/eigenlux-ai/interline-translator/blob/main/PRIVACY.md) describes the data processed by each feature. Online translation sends the required text and language information directly to the selected provider; selected-text AI features may include page title and nearby context. Optional whole-page context is off by default. Credentials are stored locally and sent to the configured service for authenticated requests. Text may contain personal information supplied by the page or user.

The project operates no translation relay or analytics service, does not sell this data, and does not use it for advertising, unrelated purposes or creditworthiness decisions. Translation results are cached locally. Subtitle diagnostics are local and omit caption text, URLs and credentials. Buffering prepares upcoming captions through the same selected provider; it does not introduce a new recipient or audio transcription.

Dashboard disclosures must reflect website content and authentication information sent to selected providers. Existing account/contact details and disclosure selections are not verified or changed by packaging.

## Developer and support

- Project: [eigenlux-ai/interline-translator](https://github.com/eigenlux-ai/interline-translator)
- Support: [GitHub Issues](https://github.com/eigenlux-ai/interline-translator/issues)
- Publisher contact email and distribution regions: retain the existing developer dashboard values.

## Version history

| Version | Date | Changes | Status |
| --- | --- | --- | --- |
| 1.1.1 | 2026-11-13 | Subtitle buffering, recovery, localization and surface fixes | Prepared for upload |

## Review notes

Subtitle translation requires available YouTube captions; automatic activation is off by default. For ordinary videos, lag prompts offer an explicit pause to prepare upcoming translations, followed by a manual resume action. Live streams offer engine advice instead. Throughput depends on the selected engine. The Chrome ZIP does not include the experimental Safari application.

Run `pnpm store:check` to validate existing asset dimensions, hashes and description consistency. Run the build audits against the Chrome output and inspect the ZIP's manifest version, referenced files and contents before uploading. Store assets and this document are not part of the extension ZIP.
