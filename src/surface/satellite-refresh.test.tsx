import { MantineProvider, createTheme } from '@mantine/core';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { SURFACE_ROOT_CLASS } from '@/constants';
import { SurfaceProvider } from '@/surface/context';
import type { SurfaceEnv } from '@/surface/defs';
import { createSatellite, SatelliteOutlet, type SatelliteHandle } from './satellite';

/**
 * Stale dev-mode stylesheet fetches (port of upstream 00e7406, adapted to the
 * on-demand capture): when the surface styles arrive through `<link>` (dev
 * only — the build inlines them), two refreshes can race and the OLDER fetch
 * can finish last. It must not overwrite the newer sheets, or theme changes
 * would silently revert. The registry keeps a refresh token and drops any
 * capture that is no longer the latest.
 *
 * Difference from upstream's version: capture is deferred until the first
 * satellite exists (the memory optimisation), so the race is reproduced with
 * the satellite alive rather than at outlet mount.
 */

const themeA = createTheme({ defaultRadius: 'sm' });
const themeB = createTheme({ defaultRadius: 'md' });

interface Fixture {
  env: SurfaceEnv;
  styleEl: HTMLStyleElement;
}

function makeShadowEnv(css = ':host{--test-theme:red}'): Fixture {
  // Deliberately DETACHED from the document: happy-dom auto-loads stylesheet
  // links of attached trees with its own fetch (real network), which would
  // bypass the stubbed fetch this test needs to control.
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

let pending: Array<(response: Response) => void> = [];
let replaceSync: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  pending = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(() => new Promise<Response>((resolve) => pending.push(resolve)))
  );
  replaceSync = vi.spyOn(CSSStyleSheet.prototype, 'replaceSync');
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

it('drops an older dev stylesheet fetch that finishes after a newer refresh', async () => {
  const { env, styleEl } = makeShadowEnv();
  const out = view(env);
  await act(async () => {}); // flush mount effects

  // On-demand: zero satellites → no capture and no fetch at mount.
  expect(pending).toHaveLength(0);

  const anchor = document.createElement('p');
  document.body.append(anchor);
  let satellite!: SatelliteHandle;
  await act(async () => {
    satellite = createSatellite(anchor, null);
  });
  // First satellite → refresh #1 is waiting on the dev <link> fetch.
  expect(pending).toHaveLength(1);
  const older = pending.splice(0);

  // A theme change rewrites the variables style and starts refresh #2.
  const nextCss = ':host{--test-theme:blue}';
  styleEl.textContent = nextCss;
  out.rerender(
    <SurfaceProvider env={env}>
      <MantineProvider theme={themeB}>
        <SatelliteOutlet />
      </MantineProvider>
    </SurfaceProvider>
  );
  await act(async () => {});
  expect(pending).toHaveLength(1);

  // The NEWER fetch completes first and publishes.
  await act(async () => pending.shift()!(new Response('.new-sheet{color:blue}')));
  const root = satellite.hostElement.shadowRoot as ShadowRoot;
  expect(cssOf(root)).toContain('--test-theme: blue');
  expect(cssOf(root)).toContain('.new-sheet');

  // The OLDER fetch lands late — it must be ignored, not overwrite.
  await act(async () => {
    for (const resolve of older) resolve(new Response('.old-sheet{color:red}'));
  });
  expect(cssOf(root)).toContain('--test-theme: blue');
  expect(cssOf(root)).not.toContain('.old-sheet');

  // The cached sheets stay current for satellites created later.
  const nextAnchor = document.createElement('p');
  document.body.append(nextAnchor);
  let later!: SatelliteHandle;
  await act(async () => {
    later = createSatellite(nextAnchor, null);
  });
  expect(cssOf(later.hostElement.shadowRoot as ShadowRoot)).toContain('--test-theme: blue');
});

it('does not publish an in-flight capture after the last satellite left', async () => {
  const { env, styleEl } = makeShadowEnv();
  view(env);
  const anchor = document.createElement('p');
  document.body.append(anchor);
  let satellite!: SatelliteHandle;
  await act(async () => {
    satellite = createSatellite(anchor, null);
  });
  expect(pending).toHaveLength(1);
  expect(replaceSync).not.toHaveBeenCalled(); // publishing waits on the fetch

  // Destroying the last satellite releases the sheets while the fetch is still
  // in flight — the late result must not rebuild (and re-hold) the CSSOM.
  await act(async () => satellite.destroy());
  styleEl.textContent = ':host{--test-theme:blue}';
  await act(async () => {
    for (const resolve of pending.splice(0)) resolve(new Response('.late-sheet{color:blue}'));
  });
  expect(replaceSync).not.toHaveBeenCalled();

  // A returning satellite captures fresh (one-time cost of the release) —
  // still subject to the dev <link> fetch.
  await act(async () => {
    createSatellite(anchor, null);
  });
  expect(pending).toHaveLength(1);
  await act(async () => {
    for (const resolve of pending.splice(0)) resolve(new Response('.fresh-sheet{color:blue}'));
  });
  // One sheet per source: the inline <style> + the inlined dev <link>.
  expect(replaceSync).toHaveBeenCalledTimes(2);
});
