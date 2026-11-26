import { useMemo, useSyncExternalStore } from 'react';
import type { ColorSchemeSource, ColorSchemeStrategy, SurfaceColorScheme } from './defs';

const systemQuery = '(prefers-color-scheme: dark)';
const noopSubscribe = () => () => {};

export function getSystemColorScheme(): SurfaceColorScheme {
  return window.matchMedia(systemQuery).matches ? 'dark' : 'light';
}

/** Subscribe only to the source that currently controls this surface. */
export function useSurfaceColorScheme(
  preference: SurfaceColorScheme | 'auto',
  strategy: ColorSchemeStrategy = 'extension'
) {
  const selection = strategy === 'extension' ? preference : strategy;
  const source = useMemo((): ColorSchemeSource | undefined => {
    if (typeof selection === 'object') return selection;
    if (selection !== 'auto') return undefined;
    const media = window.matchMedia(systemQuery);
    return {
      getSnapshot: () => (media.matches ? 'dark' : 'light'),
      subscribe(listener) {
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
      },
    };
  }, [selection]);
  const fixed = (): SurfaceColorScheme => (selection === 'dark' || selection === 'force-dark' ? 'dark' : 'light');
  return useSyncExternalStore(source?.subscribe ?? noopSubscribe, source?.getSnapshot ?? fixed);
}
