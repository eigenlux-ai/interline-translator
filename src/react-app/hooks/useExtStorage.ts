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

// Last-known synchronous value per item, shared across all hook consumers.
// Keyed by the item object identity, so it lives exactly as long as the item.
const snapshots = new WeakMap<object, unknown>();

export function useExtStorage<T>(item: ReactiveStorageItem<T>): readonly [T, (value: T) => void] {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      // Seed the cache from storage; the first resolve re-renders with the
      // persisted value (the synchronous snapshot is `fallback` until then).
      // `superseded` guards a race: this read is issued at subscribe time and
      // may resolve AFTER a watch update (e.g. a setValue between subscribe and
      // resolution), in which case the now-stale read must NOT clobber the
      // newer value. Scoped per-subscribe so a remount always re-seeds fresh.
      let superseded = false;
      void item.getValue().then((value) => {
        if (superseded) return;
        snapshots.set(item, value);
        onStoreChange();
      });
      // onChanged fires in every context including this one, so a write here
      // flows back through watch — no optimistic local mutation needed.
      return item.watch((value) => {
        superseded = true;
        snapshots.set(item, value);
        onStoreChange();
      });
    },
    [item]
  );

  const getSnapshot = useCallback((): T => (snapshots.has(item) ? (snapshots.get(item) as T) : item.fallback), [item]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

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
