/**
 * @module VisualManager/color-generation
 *
 * Lazy, cached ramp generation for USER-CHOSEN custom primary colours.
 *
 * Why lazy: `@mantine/colors-generator` statically pulls chroma-js (~41KB
 * minified) into whatever bundle imports it. The brand ramps are a fixed
 * design decision and live precomputed in `./color-ramps` — but a custom HEX
 * primary can be anything, so it still needs the real generator. Loading it
 * through a DYNAMIC import keeps chroma out of the resident bundle graphs
 * (float-ui/options); it is fetched and evaluated only the first time the user
 * actually picks a custom colour, and every result is cached per hex so a
 * re-pick or a re-mount never regenerates (or re-loads) anything.
 *
 * Behaviour contract (mirrors the old synchronous `generateColorsMap` call):
 * - named colours never touch this module (the caller resolves them from the
 *   merged theme, preserving the brand virtualColor + primaryShade);
 * - a custom HEX resolves to exactly `generateColorsMap(hex)` values;
 * - while the FIRST ramp for a hex is generating (microtask + chunk fetch) the
 *   hook returns `undefined` and the caller falls back to the brand default —
 *   a single-frame fallback on first use only (cached hexes resolve
 *   synchronously on render).
 */

import { useEffect, useState } from 'react';
import type { MantineColorShade, MantineColorsTuple } from '@mantine/core';

/** A fully generated ramp (both fields always present). */
export interface GeneratedPrimaryRamp {
  colors: MantineColorsTuple;
  baseColorIndex: MantineColorShade;
}

/** What the caller needs at render time: the generated ramp for the CURRENT
 * primary colour, or `undefined` (→ fall back to the brand default). */
export interface GeneratedPrimaryRampState {
  colors: MantineColorsTuple | undefined;
  baseColorIndex: MantineColorShade | undefined;
}

/** The no-ramp result (named colours, or a custom ramp still generating). */
const NO_RAMP: GeneratedPrimaryRampState = { colors: undefined, baseColorIndex: undefined };

/** A custom primary is an explicit HEX; named colours resolve from the theme. */
export function isCustomPrimaryColor(primaryColor: string): boolean {
  return primaryColor.startsWith('#');
}

const cache = new Map<string, GeneratedPrimaryRamp>();
const inFlight = new Map<string, Promise<GeneratedPrimaryRamp>>();

/**
 * Generate the 10-shade ramp for a custom hex through a dynamic import
 * (`import('@mantine/colors-generator')`) — the ONLY place that may load
 * chroma-js. Cached per (lower-cased) hex; concurrent calls for the same hex
 * share one in-flight load. Rejections clear the in-flight entry so a later
 * call can retry, and are surfaced to the caller (never unhandled here).
 */
export function loadGeneratedPrimaryRamp(hex: string): Promise<GeneratedPrimaryRamp> {
  const key = hex.toLowerCase();
  const cached = cache.get(key);
  if (cached) return Promise.resolve(cached);
  const pending = inFlight.get(key);
  if (pending) return pending;

  const load = import('@mantine/colors-generator')
    .then(({ generateColorsMap }): GeneratedPrimaryRamp => {
      const result = generateColorsMap(key);
      const ramp: GeneratedPrimaryRamp = {
        colors: result.colors.map((color) => color.hex()) as unknown as MantineColorsTuple,
        baseColorIndex: result.baseColorIndex as MantineColorShade,
      };
      cache.set(key, ramp);
      inFlight.delete(key);
      return ramp;
    })
    .catch((error: unknown) => {
      inFlight.delete(key); // allow a retry on the next request
      throw error;
    });
  inFlight.set(key, load);
  return load;
}

/**
 * React access to `loadGeneratedPrimaryRamp`, with unmount safety (a late
 * resolution never sets state on an unmounted tree) and per-hex staleness
 * safety (a late resolution for a PREVIOUS colour is ignored — state is keyed
 * by hex and the render only accepts the current key's ramp).
 */
export function useGeneratedPrimaryRamp(primaryColor: string): GeneratedPrimaryRampState {
  const key = isCustomPrimaryColor(primaryColor) ? primaryColor.toLowerCase() : '';
  const [loaded, setLoaded] = useState<{ key: string; ramp: GeneratedPrimaryRamp } | null>(null);

  // The only setState is inside async resolution callbacks (external system =
  // the lazily-imported generator): nothing to reset on key changes, because
  // the render below derives from `key` and the cache, dropping stale entries.
  useEffect(() => {
    if (!key || cache.has(key)) return; // render already resolves from cache
    let alive = true;
    loadGeneratedPrimaryRamp(key).then(
      (ramp) => {
        if (alive) setLoaded({ key, ramp });
      },
      () => {
        /* load failed: stay on the brand default (no state on failure) */
      }
    );
    return () => {
      alive = false;
    };
  }, [key]);

  // Cache hits resolve synchronously on render (no fallback frame on re-picks);
  // a pending/failed generation resolves to NO_RAMP → brand default for the
  // (first) frame until the async resolution re-renders.
  const cached = key ? cache.get(key) : undefined;
  if (cached) return cached;
  return loaded && loaded.key === key ? loaded.ramp : NO_RAMP;
}
