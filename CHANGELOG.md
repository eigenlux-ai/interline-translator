# Changelog

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
