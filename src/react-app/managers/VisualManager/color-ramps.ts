/**
 * @module VisualManager/color-ramps
 *
 * GENERATED FILE — do not edit by hand. It is a build-time constant table of
 * the brand/danger ramps that `theme.ts` needs at module load.
 *
 * Why generated: `@mantine/colors-generator` statically pulls in chroma-js
 * (~41KB minified) and these four ramps are a FIXED design decision (finite
 * set of hex constants), so computing them at runtime bought nothing and kept
 * chroma resident in every bundle that renders the theme. The values are
 * pinned to the generator's output by a snapshot + equality test
 * (color-ramps.test.ts) so a manual regeneration can never drift silently.
 *
 * To regenerate: run a throwaway node script against
 * `generateColors(hex)` from '@mantine/colors-generator' for each source hex
 * below (the script is deliberately not committed), then re-run the tests.
 *
 * Sources: cinnabarLight #C2402A · cinnabarDark #E2614A ·
 * dangerLight #A81D2D · dangerDark #E04C5C
 */

import type { MantineColorsTuple } from '@mantine/core';

/** light 朱 — generated from #C2402A with @mantine/colors-generator. */
export const cinnabarLight: MantineColorsTuple = [
  '#ffeeea',
  '#f9dcd7',
  '#edb7ad',
  '#e28f81',
  '#d96d5b', // midpoint
  '#d45843',
  '#d24d36',
  '#c2402a',
  '#a73522',
  '#932a1a',
];

/** dark 朱 (brighter/warmer, pops on dark) — generated from #E2614A with @mantine/colors-generator. */
export const cinnabarDark: MantineColorsTuple = [
  '#ffece7',
  '#fedad3',
  '#f4b3a8',
  '#eb8a79',
  '#e2614a', // midpoint
  '#df5138',
  '#de452a',
  '#c5361e',
  '#b02e18',
  '#9b2311',
];

/** error/danger (light, cool deep red) — generated from #A81D2D with @mantine/colors-generator. */
export const dangerLight: MantineColorsTuple = [
  '#ffecee',
  '#f8d7da',
  '#eeabb3',
  '#e57d89',
  '#de5765', // midpoint
  '#da3f4e',
  '#d83243',
  '#c02535',
  '#a81d2d',
  '#971226',
];

/** error/danger (dark, brightened cool red) — generated from #E04C5C with @mantine/colors-generator. */
export const dangerDark: MantineColorsTuple = [
  '#ffeaed',
  '#fed5d9',
  '#f3a9b1',
  '#e97b87',
  '#e04c5c', // midpoint
  '#dd3a4c',
  '#dc2c40',
  '#c31e32',
  '#af162b',
  '#9a0823',
];
