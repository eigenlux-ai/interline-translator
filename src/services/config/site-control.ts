/**
 * @module services/config/site-control
 *
 * Pure predicates for per-site enablement. No DOM, no storage — takes the
 * resolved config + a hostname and decides. Lives in `services/config` so both
 * background (deciding whether to auto-translate) and UI (showing the site
 * toggle state) share one implementation. Unit-tested (a pure function).
 *
 * M0: signatures + a straightforward glob matcher; richer pattern semantics
 * (paths, regex escapes) harden in M4.
 */

import type { SiteControlConfig, SiteMode } from '@/data/models';

/**
 * Match a hostname against a glob pattern. Supports `*` (any run of label
 * chars) — e.g. `*.example.com` matches `a.b.example.com`. Case-insensitive.
 */
export function matchDomainPattern(hostname: string, pattern: string): boolean {
  const host = hostname.toLowerCase();
  const pat = pattern.toLowerCase().trim();
  if (!pat) return false;
  if (pat === host) return true;
  const re = new RegExp('^' + pat.split('*').map(escapeRegExp).join('.*') + '$');
  return re.test(host);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Resolve the effective mode for a hostname: the most specific matching rule
 * wins (longest pattern), else the config default.
 */
export function resolveSiteMode(config: SiteControlConfig, hostname: string): SiteMode {
  return mostSpecificMatch(config.rules, hostname)?.mode ?? config.defaultMode;
}

/**
 * The most specific rule matching `hostname` — SPECIFICITY IS DEFINED HERE,
 * once, for every per-site rule table in the product (site modes, prompt
 * style rules): longest matching pattern wins. `usable` lets callers skip
 * rules that resolve to nothing (e.g. a style rule whose style was deleted).
 * When the specificity proxy is ever upgraded (exact > glob, label count…),
 * this is the ONLY place to change.
 */
export function mostSpecificMatch<T extends { pattern: string }>(
  rules: readonly T[],
  hostname: string,
  usable: (rule: T) => boolean = () => true
): T | undefined {
  return rules
    .filter((r) => matchDomainPattern(hostname, r.pattern))
    .sort((a, b) => b.pattern.length - a.pattern.length)
    .find(usable);
}

/** Auto-translate on page load? Only `always` does; `auto` waits for a manual trigger. */
export function shouldAutoTranslate(config: SiteControlConfig, hostname: string): boolean {
  return resolveSiteMode(config, hostname) === 'always';
}

/** Is translation allowed at all on this site? (`never` blocks even manual triggers.) */
export function isSiteEnabled(config: SiteControlConfig, hostname: string): boolean {
  return resolveSiteMode(config, hostname) !== 'never';
}

/**
 * Set an EXACT-hostname rule (no glob) for `hostname`, or clear it (`mode: null`
 * → the host falls back to `defaultMode`). Returns a new config; the input is
 * untouched. Used by the ball's 「总是翻译此站」 toggle to flip a site between
 * `always` and the default without touching the user's glob rules.
 */
export function setSiteMode(config: SiteControlConfig, hostname: string, mode: SiteMode | null): SiteControlConfig {
  const host = hostname.toLowerCase();
  // Drop any prior exact rule for this host; keep glob rules and other hosts.
  const rules = config.rules.filter((r) => r.pattern.toLowerCase().trim() !== host);
  if (mode) rules.push({ pattern: host, mode });
  return { ...config, rules };
}
