import { act, cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { SurfaceProvider } from './context';
import type { SurfaceEnv } from './defs';
import { createSatellite, SatelliteOutlet } from './satellite';

const state = vi.hoisted(() => ({ theme: {} }));
vi.mock('@mantine/core', () => ({
  useComputedColorScheme: () => 'light',
  useDirection: () => ({ dir: 'ltr' }),
  useMantineTheme: () => state.theme,
}));

afterEach(async () => {
  cleanup();
  document.body.replaceChildren();
  await new Promise((resolve) => setTimeout(resolve, 0));
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it.each(['adopted sheets', 'style fallback'] as const)(
  'keeps the latest refresh when an older stylesheet fetch finishes last (%s)',
  async (mode) => {
    if (mode === 'style fallback') {
      vi.spyOn(CSSStyleSheet.prototype, 'replaceSync').mockImplementation(() => {
        throw new Error('constructable stylesheets unavailable');
      });
      vi.spyOn(console, 'warn').mockImplementation(() => {});
    }
    const pending: Array<(response: Response) => void> = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise<Response>((resolve) => pending.push(resolve)))
    );
    const host = document.createElement('div');
    const anchor = document.createElement('p');
    document.body.append(anchor);
    // Keep the source detached so happy-dom does not load the link itself;
    // only the registry's explicitly mocked fetch should read the stylesheet.
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = ':host { --test-theme: red; }';
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://example.test/dev.css';
    const rootElement = document.createElement('div');
    shadowRoot.append(style, link, rootElement);
    const env: SurfaceEnv = {
      kind: 'shadow',
      shadowRoot,
      rootElement,
      portalTarget: rootElement,
      scale: 1,
      colorSchemeStrategy: 'extension',
    };
    const app = () => (
      <SurfaceProvider env={env}>
        <SatelliteOutlet />
      </SurfaceProvider>
    );
    const view = render(app());
    // Mount starts refreshes via both the source and theme effects. Hold all
    // of them while a newer theme refresh completes first.
    const older = pending.splice(0);
    expect(older.length).toBeGreaterThan(0);
    style.textContent = ':host { --test-theme: blue; }';
    state.theme = {};
    view.rerender(app());
    expect(pending).toHaveLength(1);
    await act(async () => pending.shift()!(new Response('.new-sheet { color: blue; }')));

    let satellite!: ReturnType<typeof createSatellite>;
    act(() => {
      satellite = createSatellite(anchor, null);
    });
    const css = (root: ShadowRoot) =>
      mode === 'adopted sheets'
        ? root.adoptedStyleSheets.flatMap((sheet) => [...sheet.cssRules].map((rule) => rule.cssText)).join('\n')
        : [...root.querySelectorAll('style[data-satellite-style]')].map((el) => el.textContent).join('\n');
    expect(css(satellite.hostElement.shadowRoot!)).toContain('--test-theme: blue');
    await act(async () => {
      for (const resolve of older) resolve(new Response('.old-sheet { color: red; }'));
    });
    expect(css(satellite.hostElement.shadowRoot!)).toContain('--test-theme: blue');
    expect(css(satellite.hostElement.shadowRoot!)).not.toContain('.old-sheet');
    // The cached sheets must also remain current for satellites created later.
    const nextAnchor = document.createElement('p');
    document.body.append(nextAnchor);
    act(() => {
      satellite = createSatellite(nextAnchor, null);
    });
    expect(css(satellite.hostElement.shadowRoot!)).toContain('--test-theme: blue');
  }
);
