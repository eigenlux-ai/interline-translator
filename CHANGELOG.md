# Changelog

## 1.0.1 — 2026-09-07

- Fix page translation starting on content clipped by nested scroll containers. Use browser intersection updates for initial and dynamic content, retaining the 300px viewport preload margin.
- Limit page translation to two active batches. Defer unsent content when it leaves the viewport, and prioritize the current viewport when a slot becomes available.
- Recheck source identity and visibility after language detection; ignore callbacks from stopped translation sessions.
- Replace store artwork with captures of the actual extension in English, Chinese, Japanese and Korean. Refresh listing copy, READMEs, privacy details and contribution links; remove obsolete README SVGs.
- Localize the provider quick-add description across all 12 interface languages.

No new browser permissions. Existing settings remain compatible.
