# Changelog

## 1.0.8 — 2026-11-04

- Make the selection translation card draggable by its header. The new position lasts for the current card; a new selection re-anchors it.
- Leave API keys out of configuration exports by default. Exporting with keys is a separate action behind a plain-text warning.
- Label the Anthropic-compatible example Base URL as a third-party service. A blank Base URL still uses the official Anthropic endpoint.
- Reduce per-page memory: ship only the Mantine component styles the in-page UI uses (float-ui CSS 262 KB → 158 KB), load satellite styles only while satellites exist, cap the re-injection HTML cache, and clean up removed content inside shadow roots.
- Upgrade zod and @ai-sdk/provider-utils to fix GHSA-mrhx-c7xc-m3w5 and GHSA-866g-f22w-33x8.

Thanks to Rito-492 for the first external contribution. No new browser permissions. Existing settings and cached translations remain compatible.

## 1.0.7 — 2026-10-31

- Fix translation lifecycle, page traversal, placeholder handling and input replacement regressions.
- Prevent stale provider settings requests from overwriting newer configuration and tighten loopback URL validation.
- Correct Gemini model capability detection and thinking parameters.
- Ignore outdated asynchronous satellite stylesheet refreshes so newer styles remain applied.

No new browser permissions. Existing settings and cached translations remain compatible.

## 1.0.6 — 2026-10-22

- Snap the floating ball to the nearest edge when dragging is cancelled or pointer capture is lost, and use the latest pointer position when settling a drag.
- Widen the floating panel to 328px. Open beside the ball when neither above nor below has enough room, keep it within the viewport, and scroll internally when needed.
- Add panel expand/collapse animations that follow the ball position and respect reduced-motion preferences. Fix display-mode indicator alignment during and after these animations.
- Expand the settings layout to 1280px and remove the narrower inner section limit.
- Add a localized About section with version and project links, data/model source explanations, and open-source license notices, including the foundation template and WXT. Update the project copyright holder to Eigenlux.

No new browser permissions. Existing settings and cached translations remain compatible.

## 1.0.5 — 2026-10-21

- Restore immediate floating-ball dragging when the pointer moves while held, while retaining long-press dragging, edge snapping and saved placement.
- Clear the drag state when pointer capture is lost.

No new browser permissions. Existing settings and cached translations remain compatible.

## 1.0.3 — 2026-09-16

- Translate the whole sentence when a site wraps part of it in a custom element. Previously only the wrapped phrase was translated: the rest of the heading or paragraph stayed in its original language and the translation appeared in the middle of the sentence.
- Remove leftover placeholder braces from a translation when the engine mangles the formatting markers, so no stray `{{`/`}}` characters remain in the text.

No new browser permissions. Existing settings and cached translations remain compatible.

## 1.0.2 — 2026-09-08

- Revise localized interface and store copy, and translate previously hardcoded interface text.
- Keep input translation settings live in existing tabs, preserve edits made while translation is pending, and stop page translation when a site is disabled.
- Cancel stale selection, annotation and free machine translation requests; prevent translators from restarting after their extension context is invalidated.
- Prevent stale configuration reads and backup file reads from overwriting newer settings or selections. Report backup success only after saving completes.
- Refresh translations when inline source content changes, validate provider parameters as configured, and keep requests with different model or prompt settings separate.
- Split page discovery into short tasks and batch source checks and old-translation cleanup during dynamic updates to reduce repeated DOM work.

- Preserve page overviews and per-paragraph context across translation toggles so previously translated paragraphs reuse their cache when scrolling.
- Enforce cache expiry on reads, prevent cache-key collisions and cleanup races, preserve detected source languages on cache hits, and share settings snapshots safely across components.

No new browser permissions. Existing settings remain compatible. The cache-key format changes in this release, so existing translation entries are regenerated on first use.

## 1.0.1 — 2026-09-07

- Fix page translation starting on content clipped by nested scroll containers. Use browser intersection updates for initial and dynamic content, retaining the 300px viewport preload margin.
- Limit page translation to two active batches. Defer unsent content when it leaves the viewport, and prioritize the current viewport when a slot becomes available.
- Recheck source identity and visibility after language detection; ignore callbacks from stopped translation sessions.
- Replace store artwork with captures of the actual extension in English, Chinese, Japanese and Korean. Refresh listing copy, READMEs, privacy details and contribution links; remove obsolete README SVGs.
- Localize the provider quick-add description across all 12 interface languages.

No new browser permissions. Existing settings remain compatible.
