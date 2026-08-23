/**
 * @module react-app/hooks/useConfig
 *
 * Reactive access to the persisted Config from any surface. Reads once,
 * watches for cross-context changes (so editing in Options updates the popup
 * live), and persists patches. Writes go through setConfig (zod-validated).
 *
 * Write protocol (the settings forms save on every keystroke, so this must
 * survive bursts):
 *  - `local` ref mirrors the latest local truth — patches merge against IT,
 *    never against a render-time closure (two same-tick patches must stack,
 *    not clobber each other).
 *  - storage writes are CHAINED so they land in order (last writer wins with
 *    the final local state, not an interleaving).
 *  - storage.onChanged fires in the writing context too. While any local
 *    write is in flight that watch event is our own ECHO — applying it would
 *    roll the input back to a stale value mid-burst (drop/flicker keystrokes).
 *    Watch events are ignored while `pending > 0`; the trade-off (an external
 *    edit landing during a local burst is dropped) is last-writer-wins anyway.
 *  - when the write chain fully SETTLES (pending back to 0), we re-read
 *    storage once and adopt it: any external write whose watch event was
 *    dropped during our burst (or whose echo raced past the chain) re-syncs
 *    here, so the NEXT local write merges against cross-context truth instead
 *    of resurrecting our stale snapshot. The clobber window shrinks to writes
 *    that are truly concurrent within one chain.
 *  - the initial read only fills EMPTY state, so it can't override a watch
 *    event or an optimistic write that beat it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Config } from '@/data/models';
import { getConfig, setConfig, watchConfig } from '@/services/config/storage';

export interface UseConfig {
  config: Config | null;
  /** Replace the whole config (validated + persisted). */
  save: (next: Config) => Promise<void>;
  /** Shallow-merge a patch into the current config and persist. */
  patch: (partial: Partial<Config>) => Promise<void>;
}

export function useConfig(): UseConfig {
  const [config, setConfigState] = useState<Config | null>(null);
  /** Latest local truth (state mirror readable outside render). */
  const local = useRef<Config | null>(null);
  /** Local writes in flight — watch events during this window are echoes. */
  const pending = useRef(0);
  /** Serializes storage writes so they land in submission order. */
  const writeChain = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    let alive = true;
    const unwatch = watchConfig((c) => {
      if (!alive || pending.current > 0) return;
      local.current = c;
      setConfigState(c);
    });
    void getConfig().then((c) => {
      if (!alive || pending.current > 0) return;
      // Fill only if nothing newer (a watch event / optimistic write) got here first.
      if (local.current === null) {
        local.current = c;
        setConfigState(c);
      }
    });
    return () => {
      alive = false;
      unwatch();
    };
  }, []);

  const persist = useCallback((next: Config): Promise<void> => {
    local.current = next;
    setConfigState(next); // optimistic
    pending.current++;
    const write = writeChain.current.then(() => setConfig(next));
    writeChain.current = write.catch(() => {}); // a failed write must not jam the chain
    return write.finally(() => {
      pending.current--;
      if (pending.current === 0) {
        // Chain settled — reconcile with storage truth (see module docstring).
        void getConfig().then((c) => {
          if (pending.current === 0) {
            local.current = c;
            setConfigState(c);
          }
        });
      }
    });
  }, []);

  const save = useCallback((next: Config) => persist(next), [persist]);

  const patch = useCallback(
    async (partial: Partial<Config>) => {
      if (!local.current) return;
      await persist({ ...local.current, ...partial });
    },
    [persist]
  );

  return { config, save, patch };
}
