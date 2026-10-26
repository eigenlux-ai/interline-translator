import { generateColors } from '@mantine/colors-generator';
import { describe, expect, it } from 'vitest';
import { cinnabarDark, cinnabarLight, dangerDark, dangerLight } from './color-ramps';

/**
 * The pin for the GENERATED ramp table (color-ramps.ts): the values must stay
 * bit-for-bit what `@mantine/colors-generator` produces for the four source
 * hexes, so the "precompute at build time, drop chroma-js from the resident
 * bundle" trade can never silently drift from the live generator. Two layers:
 *
 * 1. equality against a live `generateColors()` call per source hex;
 * 2. a snapshot of the table itself — regenerating must be a deliberate act
 *    (delete the snapshot to re-pin).
 */
describe('generated color ramps (VisualManager/color-ramps)', () => {
  it('exactly match @mantine/colors-generator output for their source hexes', () => {
    expect(cinnabarLight).toEqual(generateColors('#C2402A'));
    expect(cinnabarDark).toEqual(generateColors('#E2614A'));
    expect(dangerLight).toEqual(generateColors('#A81D2D'));
    expect(dangerDark).toEqual(generateColors('#E04C5C'));
  });

  it('are 10-shade tuples, pinned by snapshot', () => {
    for (const ramp of [cinnabarLight, cinnabarDark, dangerLight, dangerDark]) {
      expect(ramp).toHaveLength(10);
    }
    expect({ cinnabarLight, cinnabarDark, dangerLight, dangerDark }).toMatchSnapshot();
  });
});
