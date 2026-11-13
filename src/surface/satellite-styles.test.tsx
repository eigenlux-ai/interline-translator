import { createTheme, MantineProvider } from '@mantine/core';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SurfaceProvider } from '@/surface/context';
import type { SurfaceEnv } from '@/surface/defs';
import { SURFACE_ROOT_CLASS } from '@/constants';
import { createSatellite, SatelliteOutlet, type SatelliteHandle } from './satellite';

/**
 * On-demand shared-style capture (the satellite CSS memory optimisation),
 * asserted through real observable behaviour:
 *
 * - the style text is copied/compiled ONLY when the first satellite exists
 *   (zero-satellite pages hold no copy, even across theme changes);
 * - consecutive refreshes dedupe on the style text — theme churn that leaves
 *   the CSS byte-identical must not rebuild the CSSOM (`replaceSync` count);
 * - with satellites alive, a theme change that DOES rewrite the style text
 *   re-captures and re-applies the sheets;
 * - the sheets are released with the last satellite (re-capture on return).
 *
 * Rebuilds are counted by spying on `CSSStyleSheet.prototype.replaceSync`.
 * happy-dom supports constructable sheets + adoptedStyleSheets (verified), so
 * the constructable path needs no mocking; the degraded <style>-clone fallback
 * is covered separately in satellite-fallback.test.tsx (fresh module instance,
 * since the registry degrades once per JS context).
 */

interface Fixture {
  env: SurfaceEnv;
  styleEl: HTMLStyleElement;
}

function makeShadowEnv(css = '.surface-root{color:red}'): Fixture {
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

// Distinct-but-equivalent theme identities: same tokens → byte-identical CSS.
const themeA = createTheme({ defaultRadius: 'sm' });
const themeB = createTheme({ defaultRadius: 'md' }); // visually different, but only writes <style> outside the source shadow root

function view(env: SurfaceEnv, theme = themeA) {
  return render(
    <SurfaceProvider env={env}>
      <MantineProvider theme={theme}>
        <SatelliteOutlet />
      </MantineProvider>
    </SurfaceProvider>
  );
}

// Flush MutationObserver callback → queued sweep microtask → DOM settle.
const sweep = () => new Promise((resolve) => setTimeout(resolve, 0));

let replaceSync: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  replaceSync = vi.spyOn(CSSStyleSheet.prototype, 'replaceSync');
});

afterEach(async () => {
  document.body.replaceChildren(); // removing anchors triggers the sweep to reap satellites
  await sweep();
  cleanup();
  vi.restoreAllMocks();
});

describe('satellite shared styles are captured on demand', () => {
  it('copies the styles only when the first satellite is created, and shares them without re-copying', async () => {
    const { env, styleEl } = makeShadowEnv();
    const out = view(env);
    await act(async () => {}); // flush mount effects

    // Zero satellites → zero captures (this used to run at outlet mount).
    expect(replaceSync).not.toHaveBeenCalled();

    // A theme change with zero satellites must not capture either.
    out.rerender(
      <SurfaceProvider env={env}>
        <MantineProvider theme={themeB}>
          <SatelliteOutlet />
        </MantineProvider>
      </SurfaceProvider>
    );
    await act(async () => {});
    expect(replaceSync).not.toHaveBeenCalled();

    // First satellite → the capture happens NOW (one rebuild per <style>).
    const anchor = document.createElement('p');
    const anchor2 = document.createElement('p');
    document.body.append(anchor, anchor2);
    let first!: SatelliteHandle;
    let second!: SatelliteHandle;
    await act(async () => {
      first = createSatellite(anchor, null);
      second = createSatellite(anchor2, null);
    });
    expect(replaceSync).toHaveBeenCalledTimes(1); // 1 source <style> → 1 rebuild, shared by both
    expect(replaceSync).toHaveBeenCalledWith(styleEl.textContent as string);

    const firstRoot = first.hostElement.shadowRoot as ShadowRoot;
    const secondRoot = second.hostElement.shadowRoot as ShadowRoot;
    expect(firstRoot.adoptedStyleSheets).toHaveLength(1);
    expect(secondRoot.adoptedStyleSheets).toHaveLength(1);
    expect(firstRoot.adoptedStyleSheets[0]).toBe(secondRoot.adoptedStyleSheets[0]); // shared, not cloned
  });

  it('skips the rebuild when a refresh finds byte-identical style text (theme churn)', async () => {
    const { env, styleEl } = makeShadowEnv();
    const out = view(env);
    const anchor = document.createElement('p');
    document.body.append(anchor);
    await act(async () => {
      createSatellite(anchor, null);
    });
    expect(replaceSync).toHaveBeenCalledTimes(1);

    // Theme identity changes but the emitted CSS does not → no rebuild.
    out.rerender(
      <SurfaceProvider env={env}>
        <MantineProvider theme={themeB}>
          <SatelliteOutlet />
        </MantineProvider>
      </SurfaceProvider>
    );
    await act(async () => {});
    expect(replaceSync).toHaveBeenCalledTimes(1);

    // …including a same-content rewrite of the style element itself.
    styleEl.textContent = `${styleEl.textContent}`;
    out.rerender(
      <SurfaceProvider env={env}>
        <MantineProvider theme={themeA}>
          <SatelliteOutlet />
        </MantineProvider>
      </SurfaceProvider>
    );
    await act(async () => {});
    expect(replaceSync).toHaveBeenCalledTimes(1);
  });

  it('re-captures and re-applies after a theme change rewrote the style text (satellites alive)', async () => {
    const { env, styleEl } = makeShadowEnv();
    const out = view(env);
    const anchor = document.createElement('p');
    document.body.append(anchor);
    let handle!: SatelliteHandle;
    await act(async () => {
      handle = createSatellite(anchor, null);
    });
    expect(replaceSync).toHaveBeenCalledTimes(1);

    // The in-tree Mantine variables <style> is rewritten in place on theme
    // updates — simulate by changing the text, then signal the theme change.
    const nextCss = '.surface-root{color:blue}';
    styleEl.textContent = nextCss;
    out.rerender(
      <SurfaceProvider env={env}>
        <MantineProvider theme={themeB}>
          <SatelliteOutlet />
        </MantineProvider>
      </SurfaceProvider>
    );
    await act(async () => {});

    expect(replaceSync).toHaveBeenCalledTimes(2);
    expect(replaceSync).toHaveBeenLastCalledWith(nextCss);
    const root = handle.hostElement.shadowRoot as ShadowRoot;
    expect(root.adoptedStyleSheets).toHaveLength(1);
    expect(root.adoptedStyleSheets[0].cssRules[0].cssText).toContain('blue');
  });

  it('releases the shared sheets with the last satellite and re-captures on return', async () => {
    const { env } = makeShadowEnv();
    const out = view(env);
    const anchor = document.createElement('p');
    document.body.append(anchor);
    let handle!: SatelliteHandle;
    await act(async () => {
      handle = createSatellite(anchor, null);
    });
    expect(replaceSync).toHaveBeenCalledTimes(1);

    await act(async () => {
      handle.destroy();
    });
    // Zero satellites again → theme changes capture nothing at all…
    out.rerender(
      <SurfaceProvider env={env}>
        <MantineProvider theme={themeB}>
          <SatelliteOutlet />
        </MantineProvider>
      </SurfaceProvider>
    );
    await act(async () => {});
    expect(replaceSync).toHaveBeenCalledTimes(1);

    // …and the next satellite re-captures (the one-time cost of the release).
    await act(async () => {
      createSatellite(anchor, null);
    });
    expect(replaceSync).toHaveBeenCalledTimes(2);
  });
});
