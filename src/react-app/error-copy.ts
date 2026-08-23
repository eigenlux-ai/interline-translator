/**
 * @module react-app/error-copy
 *
 * One voice for failure. Raw engine/transport errors (English, jargon, status
 * codes) never face the user alone: every surface shows a plain-language first
 * line — in the interface language — and keeps the raw message as small print.
 * Import-safe everywhere (pure string logic + compiled messages).
 */

import { m } from '@/paraglide/messages.js';

/** A plain-language first line for a raw error message. */
export function humanizeError(raw: string): string {
  const s = raw.toLowerCase();
  if (s.includes('api key') || s.includes('unauthorized') || s.includes('401')) {
    return m.error_no_key();
  }
  if (s.includes('timed out') || s.includes('timeout')) {
    return m.error_timeout();
  }
  if (s.includes('disconnected')) {
    return m.error_interrupted();
  }
  if (s.includes('failed to fetch') || s.includes('network') || s.includes('econn')) {
    return m.error_network();
  }
  if (s.includes('429') || s.includes('rate')) {
    return m.error_rate_limited();
  }
  return m.error_unavailable();
}
