/**
 * @module react-app/hooks/usePublicConfig
 *
 * Reactive access to the content-safe PublicConfig projection from
 * content-surface React roots (floating ball, selection card) — the
 * projection-side sibling of `useConfig`. Reads once, watches the background's
 * mirror for cross-context changes, and exposes the setter so a surface can
 * reflect its own optimistic patches (the gateway echo then reconciles through
 * the watch).
 */

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { getPublicConfig, watchPublicConfig, type PublicConfig } from '@/services/config/public';

export function usePublicConfig(): [PublicConfig | null, Dispatch<SetStateAction<PublicConfig | null>>] {
  const [config, setConfig] = useState<PublicConfig | null>(null);
  useEffect(() => {
    let alive = true;
    // Fill-only read: a watch event (or a local optimistic patch) may land
    // first — the slower initial read must not roll state back to its older
    // snapshot.
    void getPublicConfig().then((c) => alive && setConfig((cur) => cur ?? c));
    const unwatch = watchPublicConfig((c) => setConfig(c));
    return () => {
      alive = false;
      unwatch();
    };
  }, []);
  return [config, setConfig];
}
