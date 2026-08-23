/**
 * @module core/uid
 *
 * `crypto.randomUUID` is a [SecureContext]-only API, and a content script
 * inherits the host page's context — on a plain-http page it simply doesn't
 * exist and throws. `crypto.getRandomValues` carries no such restriction, so
 * ids that must work in every frame derive from it instead.
 */

/** 128 random bits as a hex string — collision-safe wherever a UUID would be. */
export function randomId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
