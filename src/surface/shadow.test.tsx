import { ContentScriptContext } from 'wxt/utils/content-script-context';
import { MantineProvider } from '@mantine/core';
import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SATELLITE_TAG, SURFACE_ROOT_CLASS } from '@/constants';
import { SurfaceProvider } from './context';
import type { SurfaceEnv } from './defs';
import { createSatellite, SatelliteOutlet } from './satellite';
import { createShadowSurfaceUi } from './shadow';

/**
 * Pins the shadow structure WXT 0.21 / @webext-core/isolated-element 3 produce
 * (style + div directly under the shadow root, no nested html/head/body) and
 * the surface lifecycle built on it. A dependency bump that changes either
 * fails here instead of silently shifting which selectors match.
 */

const CSS = ':root { --probe: 1px; } @property --aie-tw-probe { syntax: "*"; inherits: false; }';
const contexts: ContentScriptContext[] = [];

afterEach(() => {
  contexts.splice(0).forEach((ctx) => ctx.abort());
  document.head.replaceChildren();
  document.body.replaceChildren();
});

type MountFn = (container: HTMLElement, env: SurfaceEnv) => HTMLElement;

async function surface<T extends MountFn = ReturnType<typeof vi.fn<MountFn>>>(
  onMount: T = vi.fn<MountFn>((container) => container) as unknown as T
) {
  const ctx = new ContentScriptContext('shadow-test');
  contexts.push(ctx);
  const ui = await createShadowSurfaceUi(ctx, { name: 'aie-shadow-test', css: CSS, onMount });
  return { ui, onMount };
}

const hoisted = () => document.head.querySelectorAll('style[wxt-shadow-root-document-styles]');

const staticText = (sheet: CSSStyleSheet) => [...sheet.cssRules].map((rule) => rule.cssText).join('\n');

it('mounts style + div directly under the shadow root and adopts the static CSS as one sheet', async () => {
  const { ui, onMount } = await surface();
  ui.mount();

  const children = [...ui.shadow.children].map((el) => el.tagName);
  expect(children).toEqual(['STYLE', 'DIV']);
  expect(ui.shadow.querySelector('html, head, body')).toBeNull();

  // WXT's own <style> keeps only its :host reset; the static CSS is adopted.
  const wxtStyle = ui.shadow.querySelector('style')!.textContent!;
  expect(wxtStyle).toContain('all:initial');
  expect(wxtStyle).not.toContain('--probe');
  expect(ui.shadow.adoptedStyleSheets).toHaveLength(1);
  expect(staticText(ui.shadow.adoptedStyleSheets[0]!)).toContain('--probe');
  expect(staticText(ui.shadow.adoptedStyleSheets[0]!)).not.toContain(':root');

  const root = onMount.mock.calls[0]![0];
  expect(root.classList.contains(SURFACE_ROOT_CLASS)).toBe(true);
  expect(root.parentElement).toBe(ui.uiContainer);

  ui.remove();
  ui.mount();
  expect(ui.shadow.adoptedStyleSheets).toHaveLength(1);
});

it('adds nothing to the host <head>', async () => {
  const { ui } = await surface();
  ui.mount();
  expect(hoisted()).toHaveLength(0);
  expect(document.head.children).toHaveLength(0);
  ui.remove();
  expect(document.head.children).toHaveLength(0);
});

it('falls back to a <style> when the sheet cannot be adopted', async () => {
  const descriptor = Object.getOwnPropertyDescriptor(ShadowRoot.prototype, 'adoptedStyleSheets')!;
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', {
    ...descriptor,
    set() {
      throw new TypeError('realm mismatch');
    },
  });
  try {
    const { ui } = await surface();
    ui.mount();
    const styles = [...ui.shadow.querySelectorAll('style')];
    expect(styles).toHaveLength(2);
    expect(styles[1]!.textContent).toContain(':host { --probe: 1px; }');
    expect(styles[1]!.nextElementSibling).toBe(ui.uiContainer);
  } finally {
    Object.defineProperty(ShadowRoot.prototype, 'adoptedStyleSheets', descriptor);
    warn.mockRestore();
  }
});

it('shares the host surface sheet object with satellites across theme changes', async () => {
  let env: SurfaceEnv | undefined;
  const { ui } = await surface(
    vi.fn((container: HTMLElement, surfaceEnv: SurfaceEnv) => {
      env = surfaceEnv;
      return container;
    })
  );
  ui.mount();
  const anchor = document.createElement('p');
  document.body.append(anchor);
  const first = createSatellite(anchor, null);
  const second = createSatellite(anchor, null, { position: 'beforebegin' });
  const tree = (primaryColor: string) => (
    <SurfaceProvider env={env!}>
      <MantineProvider theme={{ primaryColor }} cssVariablesSelector={`.${SURFACE_ROOT_CLASS}`}>
        <SatelliteOutlet />
      </MantineProvider>
    </SurfaceProvider>
  );
  const view = render(tree('blue'), { container: env!.rootElement });
  const sheetsOf = (handle: typeof first) => handle.hostElement.shadowRoot!.adoptedStyleSheets;
  const hostSheet = ui.shadow.adoptedStyleSheets[0]!;
  const before = [...sheetsOf(first)];
  // Same cascade order as the host: its <style>s first, the adopted static sheet last.
  expect(before.at(-1)).toBe(hostSheet);
  expect(before.indexOf(hostSheet)).toBe(before.length - 1);
  expect([...sheetsOf(second)]).toEqual(before);
  // WXT's :host reset is captured too, so satellite hosts are reset as well.
  const reset = before.find((sheet) => /all:\s*initial/.test(staticText(sheet)));
  expect(reset).toBeDefined();

  view.rerender(tree('red'));
  await waitFor(() => expect([...sheetsOf(first)]).not.toEqual(before));
  // Only the changed theme-variables style was re-parsed; the rest are the same objects.
  expect(sheetsOf(first).at(-1)).toBe(hostSheet);
  expect(sheetsOf(first)).toContain(reset);
  expect([...sheetsOf(second)]).toEqual([...sheetsOf(first)]);
  view.unmount();
});

it('reuses the app when mount() is called again without remove()', async () => {
  const { ui, onMount } = await surface();
  ui.mount();
  ui.mount();
  expect(onMount).toHaveBeenCalledTimes(1);
  expect(ui.uiContainer.querySelectorAll(`.${SURFACE_ROOT_CLASS}`)).toHaveLength(1);

  ui.remove();
  ui.mount();
  expect(onMount).toHaveBeenCalledTimes(2);
  expect(ui.uiContainer.querySelectorAll(`.${SURFACE_ROOT_CLASS}`)).toHaveLength(1);
});

it('tears satellites down with the surface', async () => {
  const { ui } = await surface();
  ui.mount();
  const anchor = document.createElement('p');
  document.body.append(anchor);
  const satellite = createSatellite(anchor, null);
  expect(document.querySelectorAll(SATELLITE_TAG)).toHaveLength(1);

  ui.remove();
  expect(document.querySelectorAll(SATELLITE_TAG)).toHaveLength(0);
  expect(() => satellite.destroy()).not.toThrow();
});

it('keeps repeated host <style>s at their own cascade position in satellites', async () => {
  let env: SurfaceEnv | undefined;
  const { ui } = await surface(
    vi.fn((container: HTMLElement, surfaceEnv: SurfaceEnv) => {
      env = surfaceEnv;
      return container;
    })
  );
  ui.mount();
  // A → B → A, same specificity: the host resolves to A, so must satellites.
  const red = '.probe { color: red; }';
  const blue = '.probe { color: blue; }';
  for (const text of [red, blue, red]) {
    const style = document.createElement('style');
    style.textContent = text;
    ui.shadow.insertBefore(style, ui.uiContainer);
  }
  const anchor = document.createElement('p');
  document.body.append(anchor);
  const satellite = createSatellite(anchor, null);
  const tree = (primaryColor: string) => (
    <SurfaceProvider env={env!}>
      <MantineProvider theme={{ primaryColor }} cssVariablesSelector={`.${SURFACE_ROOT_CLASS}`}>
        <SatelliteOutlet />
      </MantineProvider>
    </SurfaceProvider>
  );
  const view = render(tree('blue'), { container: env!.rootElement });
  // cssText re-serializes rules, so compare the probe rules only (whitespace-insensitive).
  const normalize = (texts: string[]) => texts.map((text) => text.replace(/\s+/g, ''));
  const probes = () =>
    normalize([...satellite.hostElement.shadowRoot!.adoptedStyleSheets].map(staticText)).filter((text) =>
      text.startsWith('.probe')
    );
  await waitFor(() => expect(probes()).toEqual(normalize([red, blue, red])));
  // ...and they precede the adopted static sheet, as in the host.
  expect(satellite.hostElement.shadowRoot!.adoptedStyleSheets.at(-1)).toBe(ui.shadow.adoptedStyleSheets[0]);

  // A refresh reuses parsed sheets without collapsing the repeat.
  const before = [...satellite.hostElement.shadowRoot!.adoptedStyleSheets];
  view.rerender(tree('red'));
  await waitFor(() => expect([...satellite.hostElement.shadowRoot!.adoptedStyleSheets]).not.toEqual(before));
  expect(probes()).toEqual(normalize([red, blue, red]));
  const after = satellite.hostElement.shadowRoot!.adoptedStyleSheets;
  const probeSheets = after.filter((sheet) => staticText(sheet).replace(/\s+/g, '').startsWith('.probe'));
  expect(new Set(probeSheets).size).toBe(3);
  view.unmount();
});

it('does not mount when the context was invalidated during creation', async () => {
  const ctx = new ContentScriptContext('shadow-test');
  contexts.push(ctx);
  const onMount = vi.fn((container: HTMLElement) => container);
  const onRemove = vi.fn();
  const pending = createShadowSurfaceUi(ctx, { name: 'aie-shadow-test', css: CSS, onMount, onRemove });
  ctx.abort();
  const ui = await pending;
  ui.mount();
  expect(onMount).not.toHaveBeenCalled();
  expect(ui.shadowHost.isConnected).toBe(false);
});

describe('autoMount and context invalidation', () => {
  const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

  it('does not auto-mount when the context was invalidated during creation', async () => {
    const ctx = new ContentScriptContext('shadow-test');
    contexts.push(ctx);
    const onMount = vi.fn((container: HTMLElement) => container);
    const pending = createShadowSurfaceUi(ctx, { name: 'aie-shadow-test', anchor: '#auto-anchor', css: CSS, onMount });
    ctx.abort();
    const ui = await pending;
    ui.autoMount();
    const anchor = document.createElement('div');
    anchor.id = 'auto-anchor';
    document.body.append(anchor);
    await settle();
    expect(onMount).not.toHaveBeenCalled();
    expect(ui.shadowHost.isConnected).toBe(false);
  });

  it('stops auto-mounting once the context is invalidated', async () => {
    const ctx = new ContentScriptContext('shadow-test');
    contexts.push(ctx);
    const onMount = vi.fn((container: HTMLElement) => container);
    const onRemove = vi.fn();
    const anchor = document.createElement('div');
    anchor.id = 'auto-anchor';
    document.body.append(anchor);
    const ui = await createShadowSurfaceUi(ctx, {
      name: 'aie-shadow-test',
      anchor: '#auto-anchor',
      css: CSS,
      onMount,
      onRemove,
    });
    ui.autoMount();
    await settle();
    expect(onMount).toHaveBeenCalledTimes(1);

    ctx.abort();
    expect(ui.shadowHost.isConnected).toBe(false);
    expect(onRemove).toHaveBeenCalledTimes(1);

    anchor.remove();
    await settle();
    document.body.append(anchor);
    await settle();
    expect(onMount).toHaveBeenCalledTimes(1);
    expect(ui.shadowHost.isConnected).toBe(false);
  });
});

it('hands Tab to the document keydown listeners of this context while keeping it from the host', async () => {
  const { ui, onMount } = await surface();
  ui.mount();
  const onDocument = vi.fn();
  const onWindow = vi.fn();
  document.addEventListener('keydown', onDocument);
  window.addEventListener('keydown', onWindow);
  try {
    const root = onMount.mock.calls[0]![0];
    root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, composed: true }));
    expect(onDocument).toHaveBeenCalledTimes(1);
    expect(onWindow).not.toHaveBeenCalled();
  } finally {
    document.removeEventListener('keydown', onDocument);
    window.removeEventListener('keydown', onWindow);
  }
});
