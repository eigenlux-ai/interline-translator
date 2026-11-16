# Chrome Web Store — Interline · 行间

Last updated: 2026-11-16

## Pending fixes

The next build excludes API keys and all custom headers from default configuration exports. The separate credential export retains its confirmation. It also fixes inherited site policy for blank editor frames, subtitle buffering with partial human captions, premature selection annotations, older-Chrome editor handshakes and localized provider-validation errors. No browser permissions are added. These changes have not been packaged as a new release.

## Release

Version **1.1.1**, tag **v1.1.1**. Build the Chrome upload with `pnpm zip`; the upload file is `.output/interline-1.1.1-chrome.zip`. This records a prepared release, not a submission or approval in the store dashboard.

See [CHANGELOG.md](../../../CHANGELOG.md) for release history. This update adds subtitle lag prompts and optional translation buffering, preserves buffering through retries and fullscreen transitions, improves localized copy, and incorporates the upstream surface template update. No browser permissions are added.

## Listing and assets

- Name: **Interline · 行间**, matching the manifest.
- Default listing locale for the next build: English (`manifest.default_locale: en`). On first use, the translation target is initialized from the browser UI language and the interface follows that target. Input translation targets English and starts disabled for English browsers. Saved preferences are preserved. Rebuild upload archives to include this metadata change.
- Single purpose: bilingual reading and translation of web content, including available YouTube captions and user-triggered input translation.
- Suggested category: Productivity. Existing dashboard distribution, language and publisher settings are retained; they are not managed by this release script.
- Short and detailed descriptions: [English](./global/listing.txt), [Chinese](./zh_CN/listing.txt), [Japanese](./ja/listing.txt), [Korean](./ko/listing.txt). Each directory's `summary.txt` matches its manifest description.
- Store icon: [128×128 PNG](../../../public/icon/128.png).
- Screenshots and promotional images: [asset guide](./README.md). The four language sets contain five 1280×800 screenshots/illustrations, a 440×280 tile and a 1400×560 marquee each.
- Existing images retain their 1.1.0 capture provenance; they do not demonstrate the new buffering prompt. The subtitle illustration is explicitly labeled as an illustration.

## Permissions justification

| Permission               | Purpose                                                                                                                                                                       |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage`                | Save language preferences, engine configuration and credentials locally.                                                                                                      |
| `contextMenus`           | Offer page and selection translation from the right-click menu.                                                                                                               |
| `alarms`                 | Schedule periodic cache cleanup and retry saving initial preferences after a temporary storage failure.                                                                                                                     |
| `<all_urls>` host access | Translate supported pages, including automatic site rules, and contact the user's selected translation endpoint across origins. Browser-restricted pages remain inaccessible. |

## Privacy and data use

The [privacy policy](https://github.com/eigenlux-ai/interline-translator/blob/main/PRIVACY.md) describes the data processed by each feature. Online translation sends the required text and language information directly to the selected provider; selected-text AI features may include page title and nearby context. Optional whole-page context is off by default. Credentials are stored locally and sent to the configured service for authenticated requests. Text may contain personal information supplied by the page or user.

The project operates no translation relay or analytics service, does not sell this data, and does not use it for advertising, unrelated purposes or creditworthiness decisions. Translation results are cached locally. Subtitle diagnostics are local and omit caption text, URLs and credentials. Buffering prepares upcoming captions through the same selected provider; it does not introduce a new recipient or audio transcription.

Default configuration exports omit API keys and all custom headers. A separate confirmed credential export includes them in plain text. Other configuration values may still contain private information.

Dashboard disclosures must reflect website content and authentication information sent to selected providers. Existing account/contact details and disclosure selections are not verified or changed by packaging.

## Developer and support

- Project: [eigenlux-ai/interline-translator](https://github.com/eigenlux-ai/interline-translator)
- Support: [GitHub Issues](https://github.com/eigenlux-ai/interline-translator/issues)
- Publisher contact email and distribution regions: retain the existing developer dashboard values.

## Version history

| Version | Date       | Changes                                                      | Status              |
| ------- | ---------- | ------------------------------------------------------------ | ------------------- |
| 1.1.1   | 2026-11-13 | Subtitle buffering, recovery, localization and surface fixes | Prepared for upload |

## Review notes

Subtitle translation requires available YouTube captions; automatic activation is off by default. For ordinary videos, lag prompts offer an explicit pause to prepare upcoming translations, followed by a manual resume action. Live streams offer engine advice instead. Throughput depends on the selected engine. The Chrome ZIP does not include the experimental Safari application.

Run `pnpm store:check` to validate existing asset dimensions, hashes and description consistency. Run the build audits against the Chrome output and inspect the ZIP's manifest version, referenced files and contents before uploading. Store assets and this document are not part of the extension ZIP.
