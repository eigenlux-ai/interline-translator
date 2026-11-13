import { createTheme, MantineProvider } from '@mantine/core';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { SurfaceProvider } from '@/surface/context';
import type { SurfaceEnv } from '@/surface/defs';
import { SURFACE_ROOT_CLASS } from '@/constants';
import { createSatellite, releaseSatellites, SatelliteOutlet, type SatelliteHandle } from './satellite';

/** Bundled CSS is shared directly; satellites never fetch host-page resources. */

const themeA = createTheme({ defaultRadius: 'sm' });
const themeB = createTheme({ defaultRadius: 'md' });

interface Fixture {
  env: SurfaceEnv;
  styleEl: HTMLStyleElement;
}

function makeShadowEnv(css = ':host{--test-theme:red}'): Fixture {
  const host = document.createElement('div');
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://example.test/dev.css';
  const rootElement = document.createElement('div');
  rootElement.classList.add(SURFACE_ROOT_CLASS);
  shadowRoot.append(styleEl, link, rootElement);
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

const cssOf = (root: ShadowRoot) =>
  root.adoptedStyleSheets.flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText)).join('\n');

// Flush MutationObserver callback → queued sweep microtask → DOM settle.
const sweep = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(() => Promise.reject(new Error('surface CSS must be bundled')))
  );
});

afterEach(async () => {
  document.body.replaceChildren(); // removing anchors triggers the sweep to reap satellites
  await sweep();
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function view(env: SurfaceEnv, theme = themeA) {
  return render(
    <SurfaceProvider env={env}>
      <MantineProvider theme={theme}>
        <SatelliteOutlet />
      </MantineProvider>
    </SurfaceProvider>
  );
}

it('shares the host static sheet, refreshes only dynamic styles, and never fetches links', async () => {
  const { env, styleEl } = makeShadowEnv();
  const staticSheet = new CSSStyleSheet();
  staticSheet.replaceSync('.static-sheet{color:green}');
  env.shadowRoot!.adoptedStyleSheets = [staticSheet];
  const replaceSync = vi.spyOn(CSSStyleSheet.prototype, 'replaceSync');
  const out = view(env);
  const anchor = document.createElement('p');
  document.body.append(anchor);
  let satellite!: SatelliteHandle;
  await act(async () => {
    satellite = createSatellite(anchor, null);
  });
  const root = satellite.hostElement.shadowRoot!;
  expect(root.adoptedStyleSheets[1]).toBe(staticSheet);
  expect(replaceSync).toHaveBeenCalledTimes(1);

  styleEl.textContent = ':host{--test-theme:blue}';
  out.rerender(
    <SurfaceProvider env={env}>
      <MantineProvider theme={themeB}>
        <SatelliteOutlet />
      </MantineProvider>
    </SurfaceProvider>
  );
  expect(cssOf(root)).toContain('--test-theme: blue');
  expect(root.adoptedStyleSheets[1]).toBe(staticSheet);
  expect(replaceSync).toHaveBeenCalledTimes(2);
  expect(fetch).not.toHaveBeenCalled();
});

it('does not retain a released surface when a later surface takes its place', async () => {
  const first = makeShadowEnv(':host{--old-source:red}');
  const out = view(first.env);
  const anchor = document.createElement('p');
  document.body.append(anchor);
  let previous!: SatelliteHandle;
  await act(async () => {
    previous = createSatellite(anchor, null);
  });
  await act(async () => releaseSatellites(first.env.shadowRoot!));
  expect(previous.hostElement.isConnected).toBe(false);
  const next = makeShadowEnv(':host{--new-source:blue}');
  out.rerender(
    <SurfaceProvider env={next.env}>
      <MantineProvider theme={themeB}>
        <SatelliteOutlet />
      </MantineProvider>
    </SurfaceProvider>
  );
  let current!: SatelliteHandle;
  await act(async () => {
    current = createSatellite(anchor, null);
  });
  const css = cssOf(current.hostElement.shadowRoot!);
  expect(css).toContain('--new-source: blue');
  expect(css).not.toContain('--old-source');
  expect(fetch).not.toHaveBeenCalled();
});
