/**
 * @module hooks/useExtStorage
 *
 * Reactive React binding for a WXT storage item — the generic version of the
 * pattern the VisualManager hand-rolls for color scheme. Read/write an
 * extension-storage value from any surface and have EVERY surface (popup,
 * sidepanel, options, in-page shadow UI) re-render live when it changes,
 * because `browser.storage.onChanged` fires across every extension context.
 *
 *   const note = storage.defineItem<string>('local:my:note', { fallback: '' });
 *   const [value, setValue] = useExtStorage(note);
 *
 * Why a custom store and not useState + useEffect: WXT's `getValue` is async
 * while `useSyncExternalStore` needs a SYNCHRONOUS snapshot. We bridge the gap
 * with a per-item snapshot cache — seeded by the first async read, kept fresh
 * by `watch`, and shared across all components observing the same item (so N
 * consumers trigger one read, not N). Until the first read resolves, the
 * snapshot is the item's `fallback`.
 *
 * Scope note: this is the business-agnostic primitive. Mantine's color scheme
 * keeps its own `MantineColorSchemeManager` (a different, library-mandated
 * shape) — see colorSchemeManager.ts.
 */

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Minimal shape of a WXT `storage.defineItem(...)` result that we depend on.
 *
 * `fallback` MUST be a stable reference (a primitive, or a module-level
 * constant for object/array values). It is the synchronous snapshot returned
 * before the first async read resolves; a fresh reference on every access would
 * trip `useSyncExternalStore`'s "getSnapshot should be cached" guard and risk a
 * re-render loop. WXT's `defineItem` fixes `fallback` at definition, so a real
 * storage item always satisfies this.
 */
export interface ReactiveStorageItem<T> {
  getValue: () => Promise<T>;
  setValue: (value: T) => Promise<void>;
  watch: (callback: (value: T) => void) => () => void;
  fallback: T;
}

interface SnapshotStore<T> {
  value: T;
  subscribe: (listener: () => void) => () => void;
}

const stores = new WeakMap<object, SnapshotStore<unknown>>();

function getStore<T>(item: ReactiveStorageItem<T>): SnapshotStore<T> {
  const existing = stores.get(item);
  if (existing) return existing as SnapshotStore<T>;
  const listeners = new Set<() => void>();
  let revision = 0;
  let unwatch: (() => void) | undefined;
  const publish = (value: T) => {
    store.value = value;
    for (const listener of listeners) listener();
  };
  const store: SnapshotStore<T> = {
    value: item.fallback,
    subscribe(listener) {
      listeners.add(listener);
      if (listeners.size === 1) {
        const readRevision = ++revision;
        // Subscribe before reading; one watcher/read per item, shared by all
        // consumers. A watch event or final unsubscribe invalidates the read.
        unwatch = item.watch((value) => {
          revision++;
          publish(value);
        });
        void item
          .getValue()
          .then((value) => {
            if (revision === readRevision) publish(value);
          })
          .catch((error) => {
            if (revision === readRevision) console.warn('[useExtStorage] failed to read value', error);
          });
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          revision++;
          unwatch?.();
          unwatch = undefined;
        }
      };
    },
  };
  stores.set(item, store as SnapshotStore<unknown>);
  return store;
}

export function useExtStorage<T>(item: ReactiveStorageItem<T>): readonly [T, (value: T) => void] {
  const store = getStore(item);
  const getSnapshot = useCallback(() => store.value, [store]);
  const value = useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);

  const setValue = useCallback(
    (next: T) => {
      // Persist; the value flows back to the UI via watch (no optimistic local
      // mutation). On failure the UI simply doesn't update — surface that
      // instead of swallowing it silently (cf. colorSchemeManager).
      item.setValue(next).catch((error) => {
        console.warn('[useExtStorage] failed to persist value', error);
      });
    },
    [item]
  );

  return [value, setValue] as const;
}
