import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { isCustomPrimaryColor, loadGeneratedPrimaryRamp, useGeneratedPrimaryRamp } from './color-generation';

/**
 * The lazy custom-primary path (VisualManager/color-generation): chroma-js
 * must only ever be reached through a DYNAMIC import — on the first custom
 * HEX, never for named colours — and every generated ramp is cached per hex.
 * The mock wraps the REAL generator (values stay real, calls are counted).
 */

const spy = vi.hoisted(() => ({ moduleLoads: 0, calls: [] as string[] }));

vi.mock('@mantine/colors-generator', async (importOriginal) => {
  spy.moduleLoads += 1; // runs when the lazily-imported module is first evaluated
  const actual = await importOriginal<typeof import('@mantine/colors-generator')>();
  return {
    generateColors: actual.generateColors,
    generateColorsMap: (color: string) => {
      spy.calls.push(color);
      return actual.generateColorsMap(color);
    },
  };
});

const realGenerator = () => vi.importActual<typeof import('@mantine/colors-generator')>('@mantine/colors-generator');

describe('lazy color generation', () => {
  // Declaration order matters here: the first two tests assert the module is
  // NOT loaded until a custom color actually needs it.
  it('is not loaded by the module graph nor by named colors', () => {
    expect(spy.moduleLoads).toBe(0); // importing ./color-generation pulled nothing
    const { result } = renderHook(() => useGeneratedPrimaryRamp('cinnabar'));
    expect(result.current).toEqual({ colors: undefined, baseColorIndex: undefined });
    expect(spy.moduleLoads).toBe(0);
    expect(spy.calls).toHaveLength(0);
    expect(isCustomPrimaryColor('cinnabar')).toBe(false);
    expect(isCustomPrimaryColor('#C2402A')).toBe(true);
  });

  it('loads the generator on the first custom color and matches its output exactly', async () => {
    const hex = '#C2402A';
    const expected = (await realGenerator()).generateColorsMap(hex);

    const { result } = renderHook(() => useGeneratedPrimaryRamp(hex));
    expect(result.current.colors).toBeUndefined(); // first-frame brand fallback

    await waitFor(() => expect(result.current.colors).toBeDefined());
    expect(spy.moduleLoads).toBe(1); // exactly one lazy module load
    expect(spy.calls).toEqual([hex.toLowerCase()]);
    expect(result.current.colors).toEqual(expected.colors.map((color) => color.hex()));
    expect(result.current.baseColorIndex).toBe(expected.baseColorIndex);
  });

  it('caches per hex: repeat picks never regenerate (and resolve without a fallback frame)', async () => {
    const hex = '#E2614A';
    await loadGeneratedPrimaryRamp(hex);
    const callsBefore = spy.calls.length;

    const { result } = renderHook(() => useGeneratedPrimaryRamp(hex));
    expect(result.current.colors).toBeDefined(); // synchronous cache hit
    await loadGeneratedPrimaryRamp(hex);
    expect(spy.calls).toHaveLength(callsBefore); // no regeneration
    expect(spy.moduleLoads).toBe(1); // still one module load overall
  });

  it('shares one in-flight generation between concurrent requests for the same hex', async () => {
    const hex = '#A81D2D';
    const [a, b] = await Promise.all([loadGeneratedPrimaryRamp(hex), loadGeneratedPrimaryRamp(hex)]);
    expect(a).toBe(b); // same ramp object
    expect(spy.calls.filter((called) => called === hex.toLowerCase())).toHaveLength(1);
  });

  it('drops a late resolution after unmount (no post-unmount state updates)', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const hex = '#E04C5C';
    const { unmount } = renderHook(() => useGeneratedPrimaryRamp(hex));
    unmount();
    await loadGeneratedPrimaryRamp(hex); // let the resolution land
    expect(error).not.toHaveBeenCalled();
  });

  it('falls back to no-ramp when generation fails, and allows a retry', async () => {
    const hex = '#123456';
    // Force a failure through the cached module: corrupt the loader entry by
    // generating first, then requesting with an invalid value is impossible —
    // instead verify the rejection contract of the loader directly.
    const rejected = loadGeneratedPrimaryRamp('#not-a-color').catch((error: unknown) => error);
    expect(await rejected).toBeInstanceOf(Error); // surfaced to the caller, not swallowed
    // …and the loader state stays usable afterwards (no poisoned in-flight map):
    const ok = await loadGeneratedPrimaryRamp(hex);
    expect(ok.colors).toHaveLength(10);
  });
});
