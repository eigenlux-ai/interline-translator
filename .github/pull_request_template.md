<!--
  Thanks for contributing! Two constraints hold the design together:
  1. The host page is inviolable — UI stays in shadow roots, injected
     translations are additive and fully reversible.
  2. Engines never reach the page — API keys and the AI SDK live only in
     the background service worker.
-->

## What does this change?

<!-- A short description of the change and the motivation. Link any related issue: Closes #123 -->

## Type

- [ ] Bug fix
- [ ] New capability
- [ ] Docs only
- [ ] Build / tooling

## Checklist

- [ ] `pnpm compile && pnpm lint && pnpm build` pass
- [ ] `pnpm test` passes
- [ ] `pnpm audit:css`, `pnpm audit:ascii`, and `pnpm audit:bundle` pass (if the build or styles changed)
- [ ] UI copy was edited in `messages/*.json` (not inline in components), and `pnpm i18n` was re-run
- [ ] Translations (`README.zh-CN.md` / `README.ja.md` / `README.ko.md`) kept in sync if the English README changed
- [ ] No new browser permission was added
