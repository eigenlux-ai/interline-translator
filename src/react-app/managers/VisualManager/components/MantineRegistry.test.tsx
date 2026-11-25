// @vitest-environment happy-dom
/* eslint-disable no-restricted-syntax --
   This test PLAYS THE HOST PAGE (repaints body, inspects head/html) to assert
   the exact discipline the lint rule enforces: the surface must not touch the
   host document. The assertions need direct host access to prove that. */
import { generateColorsMap } from '@mantine/colors-generator';
import { useDirection, useMantineTheme, type MantineTheme } from '@mantine/core';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createColorSchemeSource } from '@/surface/color-scheme';
import { SurfaceProvider } from '@/surface/context';
import type { SurfaceEnv } from '@/surface/defs';
import { SURFACE_ROOT_CLASS, Z_INDEX } from '@/constants';
import { hostColorSchemeSource } from '@/dom/host-scheme';
import { syncUiLocale } from '@/i18n';
import { useVisual } from '../context';
import VisualManagerRegistry from '../registry';
import { visualColorSchemeStorage, visualPrimaryColorStorage } from '../storages';
import MantineRegistry from './MantineRegistry';

/**
 * follow-host: a HOST theme switch must re-skin the mounted surface LIVE, and
 * the re-pin must stay inside our own root. The second half is the project's
 * host-isolation red line — Mantine reacting to a forceColorScheme change may
 * only write our rootElement's data attribute, never touch the host's <head>
 * or <html>. Pinned as a test so a Mantine upgrade can't silently regress it.
 */

function makeShadowEnv(): SurfaceEnv {
  const rootElement = document.createElement('div');
  rootElement.className = SURFACE_ROOT_CLASS;
  document.body.appendChild(rootElement);
  return {
    kind: 'shadow',
    rootElement,
    portalTarget: rootElement,
    scale: 1,
    colorSchemeStrategy: hostColorSchemeSource,
  };
}

const settle = async () => {
  await Promise.resolve();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  document.body.style.backgroundColor = '';
  document.documentElement.removeAttribute('dir');
  document.querySelectorAll(`.${SURFACE_ROOT_CLASS}`).forEach((el) => el.remove());
  syncUiLocale('zh', 'zh-CN'); // module-level locale: don't leak into the next test
});

describe('MantineRegistry follow-host', () => {
  it('re-pins the scheme when the host flips its theme, without touching the host document', async () => {
    document.body.style.backgroundColor = 'rgb(250, 246, 238)'; // host starts light
    const env = makeShadowEnv();
    render(
      <SurfaceProvider env={env}>
        <MantineRegistry colorScheme="light" primaryColor="cinnabar">
          <span>ui</span>
        </MantineRegistry>
      </SurfaceProvider>
    );
    await waitFor(() => expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('light'));

    // Snapshot the HOST document after mount — the flip below must not add,
    // remove, or rewrite anything here (html attributes, head children).
    const htmlAttrs = document.documentElement.outerHTML.slice(0, document.documentElement.outerHTML.indexOf('>') + 1);
    const headBefore = document.head.innerHTML;

    // The host flips its own theme switch (style-attribute repaint on body).
    await act(async () => {
      document.body.style.backgroundColor = 'rgb(18, 18, 18)';
      await settle();
    });

    await waitFor(() => expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('dark'));
    expect(document.head.innerHTML).toBe(headBefore);
    expect(document.documentElement.outerHTML.slice(0, document.documentElement.outerHTML.indexOf('>') + 1)).toBe(
      htmlAttrs
    );
  });
});

/**
 * Text direction is a property of the UI LOCALE, not a stored preference: the
 * Arabic interface must render rtl, and must follow a runtime locale switch
 * (the locale tracks `translate.target`). The host document must stay clean —
 * Mantine's own DirectionProvider would seed from, and write to, the host's
 * <html dir>, which is why this surface provides the context itself.
 */
describe('MantineRegistry direction', () => {
  function DirProbe() {
    return <span data-testid="dir">{useDirection().dir}</span>;
  }

  const mount = (env: SurfaceEnv) =>
    render(
      <SurfaceProvider env={env}>
        <MantineRegistry colorScheme="light" primaryColor="cinnabar">
          <DirProbe />
        </MantineRegistry>
      </SurfaceProvider>
    );

  it('resolves rtl for an Arabic UI locale and ltr for the others', async () => {
    syncUiLocale('ar', 'ar');
    const env = makeShadowEnv();
    const { getByTestId } = mount(env);
    await waitFor(() => expect(env.rootElement.getAttribute('dir')).toBe('rtl'));
    expect(getByTestId('dir').textContent).toBe('rtl');

    for (const locale of ['zh', 'en'] as const) {
      cleanup();
      syncUiLocale(locale, locale);
      const ltrEnv = makeShadowEnv();
      const ltr = mount(ltrEnv);
      await waitFor(() => expect(ltrEnv.rootElement.getAttribute('dir')).toBe('ltr'));
      expect(ltr.getByTestId('dir').textContent).toBe('ltr');
    }
  });

  it('follows a runtime locale switch, and leaves the host document alone', async () => {
    syncUiLocale('en', 'en');
    const env = makeShadowEnv();
    const { getByTestId } = mount(env);
    await waitFor(() => expect(env.rootElement.getAttribute('dir')).toBe('ltr'));

    // The user pins Arabic (or retargets translation to it) while mounted.
    await act(async () => {
      syncUiLocale('ar', 'en');
      await settle();
    });

    await waitFor(() => expect(getByTestId('dir').textContent).toBe('rtl'));
    expect(env.rootElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.hasAttribute('dir')).toBe(false);
  });
});

/**
 * Custom HEX primary: an explicit user customization displaces the brand cinnabar
 * with a generated palette. Since the generation moved to the LAZY
 * ../color-generation path (dynamic import keeps chroma-js out of the resident
 * bundle), the palette is not there on the first frame — the brand default
 * shows instead — and the merged theme must carry EXACTLY the
 * `generateColorsMap` values once it resolves. (The value pin itself lives in
 * ../color-generation.test.ts; this covers the wiring + fallback semantics.)
 */
describe('MantineRegistry custom primary color', () => {
  let probeTheme: MantineTheme | undefined;
  function ThemeProbe() {
    probeTheme = useMantineTheme();
    return null;
  }

  it('falls back to the brand default for one frame, then displaces it with the generated palette', async () => {
    const hex = '#C2402A';
    const expected = generateColorsMap(hex);
    const env = makeShadowEnv();
    render(
      <SurfaceProvider env={env}>
        <MantineRegistry colorScheme="light" primaryColor={hex}>
          <ThemeProbe />
        </MantineRegistry>
      </SurfaceProvider>
    );

    // Synchronous first frame: the custom ramp is still generating.
    expect(probeTheme?.primaryColor).toBe('cinnabar'); // brand fallback, not the raw hex
    expect(probeTheme?.colors.primary).toBeUndefined();

    // …then the generated palette takes over, byte-identical to the generator.
    await waitFor(() => expect(probeTheme?.primaryColor).toBe('primary'));
    expect(probeTheme?.colors.primary).toEqual(expected.colors.map((color) => color.hex()));
    expect(probeTheme?.primaryShade).toBe(expected.baseColorIndex);
  });
});

it('updates external schemes and cleans up when the source changes or unmounts', () => {
  const env = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' as const };
  const first = createColorSchemeSource('light');
  const second = createColorSchemeSource('dark');
  const off = vi.fn();
  const subscribe = first.subscribe;
  first.subscribe = vi.fn((listener) => {
    const stop = subscribe(listener);
    return () => {
      off();
      stop();
    };
  });
  const app = (strategy: SurfaceEnv['colorSchemeStrategy']) => (
    <SurfaceProvider env={{ ...env, colorSchemeStrategy: strategy }}>
      <MantineRegistry colorScheme="auto" primaryColor="blue" />
    </SurfaceProvider>
  );
  const view = render(app(first), { container: env.rootElement });
  expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('light');
  act(() => first.set('dark'));
  expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('dark');
  view.rerender(app(second));
  expect(off).toHaveBeenCalledTimes(1);
  act(() => first.set('light'));
  expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('dark');
  view.rerender(app('force-light'));
  act(() => second.set('light'));
  act(() => second.set('dark'));
  expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('light');
  view.rerender(app(first));
  view.unmount();
  expect(off).toHaveBeenCalledTimes(2);
});

it.each([
  ['force-dark', 'dark'],
  ['external source', 'light'],
] as const)('persists the color scheme preference while the surface is %s', async (_mode, visible) => {
  const env = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' as const };
  const strategy = _mode === 'force-dark' ? 'force-dark' : createColorSchemeSource('light');
  await visualColorSchemeStorage.setValue('light');
  function SchemeButton() {
    const visual = useVisual();
    return <button onClick={() => visual.setColorScheme('dark')}>dark preference</button>;
  }
  const view = render(
    <SurfaceProvider env={{ ...env, colorSchemeStrategy: strategy }}>
      <VisualManagerRegistry persistentState={{ colorScheme: 'light', primaryColor: 'blue' }}>
        <SchemeButton />
      </VisualManagerRegistry>
    </SurfaceProvider>,
    { container: env.rootElement }
  );
  fireEvent.click(view.getByText('dark preference'));
  await waitFor(async () => expect(await visualColorSchemeStorage.getValue()).toBe('dark'));
  // The surface keeps showing its forced/external scheme.
  expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe(visible);
});

it('catches up on preferences changed between the initial read and mount', async () => {
  const env = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' as const };
  // bootstrap read light/ltr/blue; another surface then changed all three.
  await visualColorSchemeStorage.setValue('dark');
  await visualPrimaryColorStorage.setValue('red');
  function Probe() {
    const visual = useVisual();
    return <span data-testid="primary">{visual.primaryColor}</span>;
  }
  const view = render(
    <SurfaceProvider env={env}>
      <VisualManagerRegistry persistentState={{ colorScheme: 'light', primaryColor: 'blue' }}>
        <Probe />
      </VisualManagerRegistry>
    </SurfaceProvider>,
    { container: env.rootElement }
  );
  await waitFor(() => expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('dark'));
  expect(view.getByTestId('primary').textContent).toBe('red');
});

it('a local change during the catch-up read wins over the read', async () => {
  const env = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' as const };
  let finish: (value: 'blue') => void = () => {};
  const read = vi
    .spyOn(visualPrimaryColorStorage, 'getValue')
    .mockImplementationOnce(() => new Promise((resolve) => (finish = resolve)));
  function Toggle() {
    const visual = useVisual();
    return <button onClick={() => visual.setPrimaryColor('red')}>{visual.primaryColor}</button>;
  }
  const view = render(
    <SurfaceProvider env={env}>
      <VisualManagerRegistry persistentState={{ colorScheme: 'light', primaryColor: 'blue' }}>
        <Toggle />
      </VisualManagerRegistry>
    </SurfaceProvider>,
    { container: env.rootElement }
  );
  fireEvent.click(view.getByText('blue'));
  await act(async () => finish('blue'));
  expect(view.getByRole('button').textContent).toBe('red');
  read.mockRestore();
});

it('configures shadow isolation defaults on ModalRoot, DrawerRoot, Affix, and FloatingWindow', () => {
  const env = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' as const };
  let theme!: ReturnType<typeof useMantineTheme>;
  function Probe() {
    theme = useMantineTheme();
    return null;
  }
  render(
    <SurfaceProvider env={env}>
      <MantineRegistry colorScheme="light" primaryColor="blue">
        <Probe />
      </MantineRegistry>
    </SurfaceProvider>,
    { container: env.rootElement }
  );
  expect(theme.components.ModalRoot?.defaultProps).toMatchObject({ zIndex: Z_INDEX.modal, lockScroll: false });
  expect(theme.components.DrawerRoot?.defaultProps).toMatchObject({ zIndex: Z_INDEX.modal, lockScroll: false });
  expect(theme.components.Affix?.defaultProps).toMatchObject({ zIndex: Z_INDEX.modal });
  expect(theme.components.FloatingWindow?.defaultProps).toMatchObject({ zIndex: Z_INDEX.popover });
});

it('writes color scheme preference to storage once per change in extension mode', async () => {
  const env = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' as const };
  const write = vi.spyOn(visualColorSchemeStorage, 'setValue');
  function SchemeButton() {
    const visual = useVisual();
    return <button onClick={() => visual.setColorScheme('dark')}>dark</button>;
  }
  const view = render(
    <SurfaceProvider env={env}>
      <VisualManagerRegistry persistentState={{ colorScheme: 'light', primaryColor: 'blue' }}>
        <SchemeButton />
      </VisualManagerRegistry>
    </SurfaceProvider>,
    { container: env.rootElement }
  );
  try {
    fireEvent.click(view.getByText('dark'));
    await waitFor(() => expect(write).toHaveBeenCalledTimes(1));
    expect(write).toHaveBeenCalledWith('dark');
  } finally {
    write.mockRestore();
  }
});

it('updates visual.setColorScheme when strategy changes from forced to extension without visual diff', () => {
  const env = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' as const };
  function SchemeButton() {
    const visual = useVisual();
    return <button onClick={() => visual.setColorScheme('dark')}>dark</button>;
  }
  const app = (strategy: SurfaceEnv['colorSchemeStrategy']) => (
    <SurfaceProvider env={{ ...env, colorSchemeStrategy: strategy }}>
      <VisualManagerRegistry persistentState={{ colorScheme: 'light', primaryColor: 'blue' }}>
        <SchemeButton />
      </VisualManagerRegistry>
    </SurfaceProvider>
  );
  const view = render(app('force-light'), { container: env.rootElement });
  expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('light');

  // Active scheme remains 'light' across the strategy switch, so VisualContextProvider
  // must refresh when setColorScheme changes from direct persistence to Mantine's setter.
  view.rerender(app('extension'));
  fireEvent.click(view.getByText('dark'));
  expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('dark');
});

it('falls back safely when a stored primaryColor is invalid, missing, or inherited', () => {
  const env: SurfaceEnv = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' };
  function Probe() {
    return (
      <output>
        {useVisual().primaryColor} {useMantineTheme().primaryColor}
      </output>
    );
  }
  const invalidValues = ['#', '#xyz', '#12', 'legacyBrand', '', 'constructor', 42, null];
  for (const value of invalidValues) {
    const view = render(
      <SurfaceProvider env={env}>
        <VisualManagerRegistry persistentState={{ colorScheme: 'light', primaryColor: value as string }}>
          <Probe />
        </VisualManagerRegistry>
      </SurfaceProvider>
    );
    expect(view.getByRole('status').textContent).toBe('cinnabar cinnabar');
    view.unmount();
  }
});

it('persists the displayed fallback when a new primary color is invalid', async () => {
  const env: SurfaceEnv = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' };
  await visualPrimaryColorStorage.setValue('red');
  function Probe() {
    const visual = useVisual();
    return <button onClick={() => visual.setPrimaryColor('removedPalette')}>{visual.primaryColor}</button>;
  }
  const view = render(
    <SurfaceProvider env={env}>
      <VisualManagerRegistry persistentState={{ colorScheme: 'light', primaryColor: 'red' }}>
        <Probe />
      </VisualManagerRegistry>
    </SurfaceProvider>
  );
  fireEvent.click(view.getByRole('button', { name: 'red' }));
  expect(view.getByRole('button').textContent).toBe('cinnabar');
  await waitFor(async () => expect(await visualPrimaryColorStorage.getValue()).toBe('cinnabar'));
});

it.each(['force-dark', 'external source'] as const)(
  'toggles the saved preference independently of %s',
  async (strategy) => {
    const env: SurfaceEnv = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' };
    env.colorSchemeStrategy = strategy === 'force-dark' ? strategy : createColorSchemeSource('dark');
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const matchMedia = vi
      .spyOn(window, 'matchMedia')
      .mockReturnValue({ ...media, matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    function Toggle() {
      const visual = useVisual();
      return <button onClick={visual.toggleColorScheme}>{visual.colorScheme}</button>;
    }
    try {
      const view = render(
        <SurfaceProvider env={env}>
          <VisualManagerRegistry persistentState={{ colorScheme: 'auto', primaryColor: 'blue' }}>
            <Toggle />
          </VisualManagerRegistry>
        </SurfaceProvider>,
        { container: env.rootElement }
      );
      for (const [previous, next] of [
        ['auto', 'dark'],
        ['dark', 'light'],
        ['light', 'dark'],
      ] as const) {
        fireEvent.click(view.getByText(previous));
        await waitFor(async () => expect(await visualColorSchemeStorage.getValue()).toBe(next));
        expect(view.getByText(next)).toBeTruthy();
        expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('dark');
      }
    } finally {
      matchMedia.mockRestore();
    }
  }
);

it('keeps the latest local preference during and after delayed storage notifications', async () => {
  function control<T>(
    item: {
      watch: (cb: (next: T) => void) => () => void;
      getValue: () => Promise<T>;
      setValue: (next: T) => Promise<void>;
    },
    initial: T
  ) {
    let stored = initial;
    const callbacks = new Set<(next: T) => void>();
    const writes: (() => void)[] = [];
    vi.spyOn(item, 'watch').mockImplementation((cb) => {
      callbacks.add(cb);
      return () => {
        callbacks.delete(cb);
      };
    });
    vi.spyOn(item, 'getValue').mockImplementation(async () => stored);
    vi.spyOn(item, 'setValue').mockImplementation(
      (next) =>
        new Promise<void>((resolve) => {
          writes.push(() => {
            stored = next;
            resolve();
          });
        })
    );
    return {
      writes,
      notify: (next: T) => callbacks.forEach((cb) => cb(next)),
      remote: (next: T) => {
        stored = next;
        callbacks.forEach((cb) => cb(next));
      },
    };
  }
  const scheme = control(visualColorSchemeStorage, 'light');
  const primary = control(visualPrimaryColorStorage, 'blue');
  const env: SurfaceEnv = { ...makeShadowEnv(), colorSchemeStrategy: 'extension' };
  let visual!: ReturnType<typeof useVisual>;
  function Preferences() {
    visual = useVisual();
    return <output>{[visual.primaryColor, visual.colorScheme, visual.activeColorScheme].join(' ')}</output>;
  }
  try {
    const view = render(
      <SurfaceProvider env={env}>
        <VisualManagerRegistry persistentState={{ colorScheme: 'light', primaryColor: 'blue' }}>
          <Preferences />
        </VisualManagerRegistry>
      </SurfaceProvider>,
      { container: env.rootElement }
    );
    await act(async () => {});
    act(() => {
      visual.setPrimaryColor('red');
      visual.setColorScheme('dark');
    });
    act(() => {
      visual.setPrimaryColor('grape');
      visual.setColorScheme('light');
    });
    const notifyFirst = () => {
      scheme.notify('dark');
      primary.notify('red');
    };
    for (let write = 0; write < 2; write++) {
      await act(async () => {
        scheme.writes[write]!();
        primary.writes[write]!();
      });
      await act(async () => notifyFirst());
      expect(view.getByRole('status').textContent).toBe('grape light light');
    }
    await act(async () => {
      scheme.remote('dark');
      primary.remote('teal');
    });
    expect(view.getByRole('status').textContent).toBe('teal dark dark');
  } finally {
    cleanup();
    vi.restoreAllMocks();
  }
});
