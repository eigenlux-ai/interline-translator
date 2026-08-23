/**
 * @module react-app/apps/floating-ball/use-tuck
 *
 * The seal's tuck-IN scheduler as a hook: give it the CURRENT hold reasons
 * (derived from render state each render) and it owns `tucked` — sliding the
 * seal in after TUCK_DELAY_MS (or whatever remains of the linger window) once
 * every hold clears. Float-OUT never happens on a timer: every reveal lives
 * in the event that causes it (pointer enter, focus, tucked press, state
 * change), via `reveal()` / `linger()` — which keeps setState out of effect
 * bodies. The timer races user input, so at fire time it re-checks the LATEST
 * holds through a ref mirrored after render instead of trusting its closure.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { shouldTuck, TUCK_DELAY_MS, TUCK_LINGER_MS, type HoldReason } from './geometry';

export interface TuckControls {
  tucked: boolean;
  /** Float the seal out (the caller's event IS the reason — a hold or a linger usually follows). */
  reveal(): void;
  /** Float out AND hold the linger window — for reveals with no hover to pin
   *  them (touch wake, translation-state toggle: 墨↔朱 must be seen). */
  linger(): void;
}

export function useTuck(holds: readonly HoldReason[]): TuckControls {
  // Born TUCKED: the seal belongs half-hidden in the page edge — appearing in
  // full only to retreat moments later reads as indecision.
  const [tucked, setTucked] = useState(true);
  const [lingerUntil, setLingerUntil] = useState(0);
  const live = useRef({ holds, lingerUntil });
  useEffect(() => {
    live.current = { holds, lingerUntil };
  });
  // Membership key: the holds ARRAY is rebuilt every render — rescheduling
  // must track its contents, not its identity.
  const key = holds.join('|');
  useEffect(() => {
    if (key !== '') return; // a non-time hold pins the seal out — nothing to schedule
    const wait = Math.max(TUCK_DELAY_MS, lingerUntil - Date.now());
    const t = setTimeout(() => {
      if (shouldTuck({ ...live.current, now: Date.now() })) setTucked(true);
    }, wait);
    return () => clearTimeout(t);
  }, [key, lingerUntil]);
  const reveal = useCallback(() => setTucked(false), []);
  const linger = useCallback(() => {
    setTucked(false);
    setLingerUntil(Date.now() + TUCK_LINGER_MS);
  }, []);
  return { tucked, reveal, linger };
}
