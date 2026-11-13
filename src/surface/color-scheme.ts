import type { ColorSchemeSource, SurfaceColorScheme } from './defs';

/** Optional controlled source. Own one per independently controlled surface. */
export function createColorSchemeSource(initial: SurfaceColorScheme): ColorSchemeSource & {
  set: (value: SurfaceColorScheme) => void;
} {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => value,
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    set(next) {
      if (value === next) return;
      value = next;
      for (const listener of [...listeners]) listener();
    },
  };
}
