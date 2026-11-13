import { useState, type ReactNode } from 'react';
import { FocusTrap, MantineProvider, Menu, Modal, Popover } from '@mantine/core';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { SURFACE_ROOT_CLASS } from '@/constants';
import { SurfaceProvider } from './context';
import type { SurfaceEnv } from './defs';
import { bridgeFocus } from './focus-bridge';
import { createSatellite, SatelliteOutlet } from './satellite';

/**
 * Real Mantine components inside an isolating shadow root: the expectations
 * are Mantine's own behaviour on a normal page (use-focus-trap/scope-tab,
 * use-focus-return), which the bridge must reproduce without re-implementing
 * it.
 */

afterEach(() => {
  cleanup();
  document.body.replaceChildren();
});

function surfaceShadowRoot(isolate = true) {
  const host = document.createElement('div');
  document.body.append(host);
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const rootElement = document.createElement('div');
  rootElement.className = SURFACE_ROOT_CLASS;
  shadowRoot.append(rootElement);
  // As WXT / isolated-element applies it for the host surface.
  if (isolate) shadowRoot.addEventListener('keydown', (event) => event.stopPropagation());
  bridgeFocus(shadowRoot, { relayTab: isolate });
  return { shadowRoot, rootElement };
}

/** Press Tab on whatever holds focus in `shadowRoot`; returns the keydown. */
function tab(shadowRoot: ShadowRoot, shiftKey = false) {
  const target = shadowRoot.activeElement ?? shadowRoot.firstElementChild!;
  const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, composed: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
}

/** Let useFocusTrap's deferred initial focus run. */
const settle = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

async function mount(ui: ReactNode, { isolate = true } = {}) {
  const { shadowRoot, rootElement } = surfaceShadowRoot(isolate);
  const env: SurfaceEnv = {
    kind: 'shadow',
    shadowRoot,
    rootElement,
    portalTarget: rootElement,
    scale: 1,
    colorSchemeStrategy: 'extension',
  };
  render(
    <SurfaceProvider env={env}>
      <MantineProvider
        env="test"
        cssVariablesSelector={`.${SURFACE_ROOT_CLASS}`}
        getRootElement={() => rootElement}
        theme={{ components: { Portal: { defaultProps: { target: rootElement } } } }}
      >
        {ui}
        <SatelliteOutlet />
      </MantineProvider>
    </SurfaceProvider>,
    { container: rootElement }
  );
  await settle();
  const byId = (id: string) => shadowRoot.getElementById(id) as HTMLElement;
  return { shadowRoot, byId, tab: (shiftKey = false) => tab(shadowRoot, shiftKey) };
}

const modal = (trapFocus?: boolean) => (
  <>
    <button id="behind">behind</button>
    <Modal opened onClose={() => {}} withCloseButton={false} trapFocus={trapFocus}>
      <button id="first">first</button>
      <button disabled>disabled</button>
      <button id="last">last</button>
    </Modal>
  </>
);

it('wraps Tab and Shift+Tab at the ends of a Modal', async () => {
  const { shadowRoot, byId, tab } = await mount(modal());
  expect(shadowRoot.activeElement).toBe(byId('first'));
  expect(tab().defaultPrevented).toBe(false);

  byId('last').focus();
  expect(tab().defaultPrevented).toBe(true);
  expect(shadowRoot.activeElement).toBe(byId('first'));

  expect(tab(true).defaultPrevented).toBe(true);
  expect(shadowRoot.activeElement).toBe(byId('last'));
});

it('does not trap a Modal with trapFocus={false}', async () => {
  const { shadowRoot, byId, tab } = await mount(modal(false));
  byId('last').focus();
  expect(tab().defaultPrevented).toBe(false);
  expect(shadowRoot.activeElement).toBe(byId('last'));
});

it('does not pull focus back from behind the Modal (Mantine does not)', async () => {
  const { shadowRoot, byId, tab } = await mount(modal());
  byId('behind').focus();
  expect(tab().defaultPrevented).toBe(false);
  expect(shadowRoot.activeElement).toBe(byId('behind'));
});

const popover = (trapFocus: boolean, withinPortal = true) => (
  <Popover opened trapFocus={trapFocus} withinPortal={withinPortal}>
    <Popover.Target>
      <button id="target">target</button>
    </Popover.Target>
    <Popover.Dropdown>
      <input id="pop-a" />
      <input id="pop-b" />
    </Popover.Dropdown>
  </Popover>
);

it('traps a Popover only with trapFocus', async () => {
  const trapped = await mount(popover(true));
  expect(trapped.shadowRoot.activeElement).toBe(trapped.byId('pop-a'));
  trapped.byId('pop-b').focus();
  expect(trapped.tab().defaultPrevented).toBe(true);
  expect(trapped.shadowRoot.activeElement).toBe(trapped.byId('pop-a'));
  cleanup();

  const free = await mount(popover(false));
  free.byId('pop-b').focus();
  expect(free.tab().defaultPrevented).toBe(false);
  expect(free.shadowRoot.activeElement).toBe(free.byId('pop-b'));
});

it('keeps Tab inside an open Menu, as Mantine does (its items are not tabbable)', async () => {
  const { shadowRoot, tab } = await mount(
    <Menu opened>
      <Menu.Target>
        <button>menu</button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item id="item">item</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
  const focused = shadowRoot.activeElement;
  expect(focused?.closest('[role="menu"]')).not.toBeNull();
  expect(tab().defaultPrevented).toBe(true);
  expect(shadowRoot.activeElement).toBe(focused);
});

it('treats a radio in the final group as the final stop (scopeTab radio rule)', async () => {
  const { shadowRoot, byId, tab } = await mount(
    <FocusTrap>
      <div>
        <button id="first">first</button>
        <input type="radio" name="group" id="radio-a" />
        <input type="radio" name="group" id="radio-b" />
      </div>
    </FocusTrap>
  );
  byId('radio-a').focus();
  expect(tab().defaultPrevented).toBe(true);
  expect(shadowRoot.activeElement).toBe(byId('first'));
});

it('wraps inside a trapFocus Popover opened from a Modal, not inside the Modal', async () => {
  const { shadowRoot, byId, tab } = await mount(
    <Modal opened onClose={() => {}} withCloseButton={false}>
      <button id="first">first</button>
      {popover(true)}
    </Modal>
  );
  // Both traps are active and both listeners run, in Mantine's registration
  // order: the Popover's wraps first, so the Modal's no longer sees focus on
  // its own last tabbable (which is also `pop-b`). Reversed, focus would land
  // on `first`.
  byId('pop-b').focus();
  expect(tab().defaultPrevented).toBe(true);
  expect(shadowRoot.activeElement).toBe(byId('pop-a'));
  expect(tab(true).defaultPrevented).toBe(true);
  expect(shadowRoot.activeElement).toBe(byId('pop-b'));
});

it('follows traps as they activate and deactivate', async () => {
  let setOpened!: (opened: boolean) => void;
  function Toggle() {
    const [opened, set] = useState(false);
    setOpened = set;
    return (
      <Modal opened={opened} onClose={() => {}} withCloseButton={false} keepMounted>
        <button id="only">only</button>
      </Modal>
    );
  }
  const { byId, tab } = await mount(<Toggle />);
  act(() => setOpened(true));
  await settle();
  byId('only').focus();
  expect(tab().defaultPrevented).toBe(true);
  act(() => setOpened(false));
  await settle();
  expect(tab().defaultPrevented).toBe(false);
});

it('traps content rendered in a satellite', async () => {
  const anchor = document.createElement('p');
  document.body.append(anchor);
  const satellite = createSatellite(anchor, popover(true, false));
  try {
    await mount(null);
    const shadowRoot = satellite.hostElement.shadowRoot!;
    const last = shadowRoot.getElementById('pop-b')!;
    last.focus();
    expect(tab(shadowRoot).defaultPrevented).toBe(true);
    expect(shadowRoot.activeElement).toBe(shadowRoot.getElementById('pop-a'));
  } finally {
    satellite.destroy();
  }
});

it('relays only Tab, once, and lets nothing reach the host page', async () => {
  const onWindow = vi.fn();
  const onDocument = vi.fn();
  window.addEventListener('keydown', onWindow);
  const { byId, tab } = await mount(<button id="plain">plain</button>);
  document.addEventListener('keydown', onDocument);
  try {
    byId('plain').focus();
    tab();
    expect(onDocument).toHaveBeenCalledTimes(1);
    byId('plain').dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true, composed: true }));
    expect(onDocument).toHaveBeenCalledTimes(1);
    expect(onWindow).not.toHaveBeenCalled();

    document.removeEventListener('keydown', onDocument);
    tab();
    expect(onDocument).toHaveBeenCalledTimes(1);
  } finally {
    window.removeEventListener('keydown', onWindow);
    document.removeEventListener('keydown', onDocument);
  }
});

it('runs a once listener once across the relay and the document', async () => {
  const { byId, tab } = await mount(<button id="plain">plain</button>);
  const viaRelay = vi.fn();
  const viaDocument = vi.fn();
  document.addEventListener('keydown', viaRelay, { once: true });
  document.addEventListener('keydown', viaDocument, { once: true });
  byId('plain').focus();
  tab();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
  expect(viaRelay).toHaveBeenCalledTimes(1);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
  tab();
  expect(viaDocument).toHaveBeenCalledTimes(1);

  const removed = vi.fn();
  document.addEventListener('keydown', removed, { once: true });
  document.removeEventListener('keydown', removed);
  tab();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
  expect(removed).not.toHaveBeenCalled();
});

it('does not double-deliver where keydown is not isolated', async () => {
  const onDocument = vi.fn();
  // Wrap document.addEventListener first, as an isolating surface would have.
  surfaceShadowRoot();
  const { byId, tab } = await mount(<button id="plain">plain</button>, { isolate: false });
  document.addEventListener('keydown', onDocument);
  try {
    byId('plain').focus();
    tab();
    expect(onDocument).toHaveBeenCalledTimes(1);
  } finally {
    document.removeEventListener('keydown', onDocument);
  }
});

it('allows re-registering a once listener after an already-aborted signal', async () => {
  const { tab } = await mount(<button>plain</button>);
  const listener = vi.fn();
  const controller = new AbortController();
  controller.abort();
  document.addEventListener('keydown', listener, { once: true, signal: controller.signal });
  document.addEventListener('keydown', listener, { once: true });
  tab();
  expect(listener).toHaveBeenCalledTimes(1);
  document.removeEventListener('keydown', listener);
});

it.each([true, false])('keeps the first registration when once starts as %s', async (once) => {
  const { tab } = await mount(<button>plain</button>);
  const listener = vi.fn();
  document.addEventListener('keydown', listener, { once });
  document.addEventListener('keydown', listener, { once: !once });
  try {
    tab();
    expect(listener).toHaveBeenCalledTimes(1);
    tab();
    expect(listener).toHaveBeenCalledTimes(once ? 1 : 2);
  } finally {
    document.removeEventListener('keydown', listener);
  }
});

it('aborts both registrations and allows a fresh registration of the callback', async () => {
  const { tab } = await mount(<button>plain</button>);
  const listener = vi.fn(function (this: unknown) {
    expect(this).toBe(document);
  });
  const controller = new AbortController();
  document.addEventListener('keydown', listener, { signal: controller.signal });
  tab();
  controller.abort();
  tab();
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
  expect(listener).toHaveBeenCalledTimes(1);
  document.addEventListener('keydown', listener, { once: true });
  tab();
  expect(listener).toHaveBeenCalledTimes(2);
});

/** Past useFocusReturn's 10ms timer. */
const focusReturned = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 30)));

function modalWithTrigger(withinPortal = true) {
  const controls = { setOpened: (_opened: boolean) => {} };
  function Toggle() {
    const [opened, setOpened] = useState(false);
    controls.setOpened = setOpened;
    return (
      <>
        <button id="other">other</button>
        <button id="trigger">trigger</button>
        <Modal opened={opened} onClose={() => {}} withCloseButton={false} withinPortal={withinPortal}>
          <button id="inside">inside</button>
        </Modal>
      </>
    );
  }
  return { ui: <Toggle />, controls };
}

async function openAndClose(shadowRoot: ShadowRoot, controls: { setOpened: (opened: boolean) => void }) {
  const trigger = shadowRoot.getElementById('trigger')!;
  trigger.focus();
  act(() => controls.setOpened(true));
  await settle();
  expect(shadowRoot.activeElement).toBe(shadowRoot.getElementById('inside'));
  act(() => controls.setOpened(false));
  await focusReturned();
  return trigger;
}

it('returns focus to the trigger when a Modal closes', async () => {
  const { ui, controls } = modalWithTrigger();
  const { shadowRoot } = await mount(ui);
  const trigger = await openAndClose(shadowRoot, controls);
  expect(shadowRoot.activeElement).toBe(trigger);
  expect(document.activeElement).toBe(trigger);
});

it('returns focus to the trigger without keyboard isolation too', async () => {
  const { ui, controls } = modalWithTrigger();
  const { shadowRoot } = await mount(ui, { isolate: false });
  const trigger = await openAndClose(shadowRoot, controls);
  expect(shadowRoot.activeElement).toBe(trigger);
});

it('returns focus to the trigger inside a satellite', async () => {
  const anchor = document.createElement('p');
  document.body.append(anchor);
  const { ui, controls } = modalWithTrigger(false);
  const satellite = createSatellite(anchor, ui);
  try {
    await mount(null);
    const shadowRoot = satellite.hostElement.shadowRoot!;
    const trigger = await openAndClose(shadowRoot, controls);
    expect(shadowRoot.activeElement).toBe(trigger);
  } finally {
    satellite.destroy();
  }
});

it('resolves document.activeElement inside our shadow roots only', async () => {
  const { shadowRoot, byId } = await mount(<button id="plain">plain</button>);
  const inSurface = byId('plain');
  inSurface.focus();
  expect(document.activeElement).toBe(inSurface);

  // Nested, closed: the reference is ours even though `host.shadowRoot` is null.
  const nestedHost = document.createElement('div');
  shadowRoot.append(nestedHost);
  const nested = nestedHost.attachShadow({ mode: 'closed' });
  const inNested = nested.appendChild(document.createElement('button'));
  inNested.focus();
  expect(document.activeElement).toBe(nestedHost);
  bridgeFocus(nested);
  expect(document.activeElement).toBe(inNested);

  // A host-page component: its shadow root is never entered, in the light
  // DOM or inside our own tree.
  for (const parent of [document.body, shadowRoot]) {
    const pageHost = document.createElement('div');
    parent.append(pageHost);
    const inPage = pageHost.attachShadow({ mode: 'open' }).appendChild(document.createElement('button'));
    inPage.focus();
    expect(document.activeElement).toBe(pageHost);
  }
});

it('leaves document.activeElement native outside our shadow roots', async () => {
  const { shadowRoot } = await mount(<button id="plain">plain</button>);
  const input = document.body.appendChild(document.createElement('input'));
  input.focus();
  expect(document.activeElement).toBe(input);
  input.blur();
  expect(document.activeElement).toBe(document.body);
  // Our host itself focused, nothing focused inside: still the host.
  const host = shadowRoot.host as HTMLElement;
  host.tabIndex = 0;
  host.focus();
  expect(shadowRoot.activeElement).toBeNull();
  expect(document.activeElement).toBe(host);
});
