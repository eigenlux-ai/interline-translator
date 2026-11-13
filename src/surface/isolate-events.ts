/**
 * @module surface/isolate-events
 *
 * Pure resolution of an `isolateEvents` option (shadow surface or satellite)
 * to a concrete event list. Kept dependency-free (no React/Mantine/DOM) so it
 * is unit-testable in isolation and reusable by any shadow boundary. See
 * shadow.ts and satellite.tsx for how the resolved list is used (bubble-phase
 * stopPropagation on the shadow root, and the focus bridge's Tab relay).
 */

// Default events isolated at each satellite's shadow boundary — identical to
// @webext-core/isolated-element's default (the one WXT uses for the host
// surface), so satellite UI never trips host-page keyboard shortcuts.
export const DEFAULT_ISOLATED_EVENTS = ['keydown', 'keyup', 'keypress'] as const;

/**
 * `false` → no isolation; an array → exactly those event types; `true` or
 * `undefined` → the keyboard default.
 */
export function resolveIsolatedEvents(opt: boolean | readonly string[] | undefined): readonly string[] {
  if (opt === false) return [];
  if (Array.isArray(opt)) return opt;
  return DEFAULT_ISOLATED_EVENTS; // true | undefined
}
