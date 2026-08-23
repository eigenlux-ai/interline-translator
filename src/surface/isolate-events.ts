/**
 * @module surface/isolate-events
 *
 * Pure resolution of a satellite's `isolateEvents` option to a concrete event
 * list. Kept dependency-free (no React/Mantine/DOM) so it is unit-testable in
 * isolation and reusable by any shadow boundary. See satellite.tsx for how the
 * resolved list is attached (bubble-phase stopPropagation on the shadow root).
 */

// Default events isolated at each satellite's shadow boundary — identical to
// @webext-core/isolated-element's default (the one WXT uses for the host
// surface), so satellite UI never trips host-page keyboard shortcuts.
export const DEFAULT_ISOLATED_EVENTS = ['keydown', 'keyup', 'keypress'];

/**
 * `false` → no isolation; an array → exactly those event types; `true` or
 * `undefined` → the keyboard default.
 */
export function resolveIsolatedEvents(opt: boolean | string[] | undefined): string[] {
  if (opt === false) return [];
  if (Array.isArray(opt)) return opt;
  return DEFAULT_ISOLATED_EVENTS; // true | undefined
}
