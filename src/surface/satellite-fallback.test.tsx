import { MantineProvider, createTheme } from '@mantine/core';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SURFACE_ROOT_CLASS } from '@/constants';
import { SurfaceProvider } from '@/surface/context';
import type { SurfaceEnv } from '@/surface/defs';
import { createSatellite, SatelliteOutlet, type SatelliteHandle } from './satellite';

/**
 * Degraded-mode path for the shared styles: when constructable stylesheets are
 * unavailable (replaceSync exists but throws — restrictive environments), the
 * registry must fall back to per-root <style> clones and keep working.
 *
 * This lives in its OWN test file deliberately: the registry degrades
 * permanently per JS context (`useConstructableSheets` flips once), and vitest
 * gives each test file a fresh module instance — so the degraded singleton
 * cannot leak into satellite-styles.test.tsx (and vice versa).
 */

function makeShadowEnv(css = '.surface-root{color:red}'): { env: SurfaceEnv; styleEl: HTMLStyleElement } {
  const host = document.createElement('div');
  document.body.append(host);
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  shadowRoot.append(styleEl);
  const rootElement = document.createElement('div');
  rootElement.classList.add(SURFACE_ROOT_CLASS);
  shadowRoot.append(rootElement);
  const env: SurfaceEnv = {
    kind: 'shadow',
    rootElement,
    portalTarget: rootElement,
    scale: 1,
    colorSchemeStrategy: 'extension',
    shadowRoot,
  };
  return { env, styleEl };
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('satellite shared styles without constructable sheets', () => {
  it('falls back to per-root <style> clones when replaceSync throws', async () => {
    const failing = vi.spyOn(CSSStyleSheet.prototype, 'replaceSync').mockImplementation(() => {
      throw new Error('constructable sheets unavailable');
    });
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { env, styleEl } = makeShadowEnv();
    render(
      <SurfaceProvider env={env}>
        <MantineProvider theme={createTheme({ defaultRadius: 'sm' })}>
          <SatelliteOutlet />
        </MantineProvider>
      </SurfaceProvider>
    );
    const anchor = document.createElement('p');
    document.body.append(anchor);
    let handle!: SatelliteHandle;
    await act(async () => {
      handle = createSatellite(anchor, null);
    });

    expect(failing).toHaveBeenCalled(); // the constructable path WAS attempted
    expect(warn).toHaveBeenCalledWith(
      '[surface/satellite] constructable sheets unavailable, falling back',
      expect.any(Error)
    );
    const root = handle.hostElement.shadowRoot as ShadowRoot;
    expect(root.adoptedStyleSheets).toHaveLength(0);
    const clones = root.querySelectorAll('style[data-satellite-style]');
    expect(clones).toHaveLength(1);
    expect(clones[0].textContent).toBe(styleEl.textContent);

    await act(async () => {
      handle.destroy();
    });
  });
});
