// @vitest-environment happy-dom
import { MantineProvider } from '@mantine/core';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { storage } from '#imports';
import { afterEach, describe, expect, it, onTestFinished, vi } from 'vitest';
import { interlineTheme } from '@/react-app/managers/VisualManager/theme';
import { m } from '@/paraglide/messages.js';
import { defaultPublicConfig, PUBLIC_CONFIG_KEY } from '@/services/config/public';
import SelectionApp from './App';

/**
 * Selection UI lifecycle — pinned here because the live loop can't verify it:
 * scroll events ride the frame lifecycle, and an automation-driven Chrome
 * window often doesn't paint (rAF dead → no scroll events → false negative).
 */

vi.mock('@/services/stream/client', () => ({
  streamTranslate: vi.fn(async function* () {
    yield '译文';
  }),
  streamAnnotate: vi.fn(async function* () {
    yield '· 惯用语:字面是断腿,实义是祝好运';
  }),
}));

function mockSelection(text: string, rect: Partial<DOMRect>, focus?: { node: Node; offset: number }) {
  const range = {
    getBoundingClientRect: () => ({ left: 0, right: 0, top: 0, bottom: 0, width: 10, height: 10, ...rect }),
    cloneContents: () => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(text));
      return frag;
    },
  };
  vi.stubGlobal('getSelection', () => ({
    toString: () => text,
    rangeCount: 1,
    getRangeAt: () => range,
    removeAllRanges: () => {},
    focusNode: focus?.node ?? null,
    focusOffset: focus?.offset ?? 0,
  }));
  (window as unknown as { getSelection: unknown }).getSelection = globalThis.getSelection;
}

/**
 * happy-dom has no layout, so a real (caret) Range measures to all zeros and
 * caretRectAtFocus gives up. Pin the caret rect for one test; the selection's
 * own bounding box comes from the mock range and stays independent.
 */
function stubCaretRect(rect: Partial<DOMRect>) {
  const spy = vi
    .spyOn(Range.prototype, 'getBoundingClientRect')
    .mockReturnValue({ x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0, width: 1, height: 16, ...rect } as DOMRect);
  onTestFinished(() => spy.mockRestore());
}

const mouseUp = () => document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));
const keyUp = (key: string, mods: KeyboardEventInit = {}) =>
  document.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true, ...mods }));

function pill(container: HTMLElement): HTMLElement | null {
  // A stable testid, NOT the aria-label: the label is localized copy that may
  // be reworded or follow a different locale than the test env resolves to.
  return container.querySelector('[data-testid="omni-selection-pill"]');
}

/** The card's drag handle (the header) — present only while the card is open. */
function handle(container: HTMLElement): HTMLElement | null {
  return container.querySelector('[data-testid="omni-selection-drag-handle"]');
}

function cardBox(container: HTMLElement): HTMLElement {
  return container.querySelector('[data-omni-selection-ui]') as HTMLElement;
}

/**
 * One pointer stream for the drag contract: a single pointer id throughout
 * (one mouse, one finger) and client coordinates like a real gesture.
 */
function sendPointer(
  target: HTMLElement,
  type: 'pointerdown' | 'pointermove' | 'pointerup' | 'pointercancel' | 'lostpointercapture',
  x: number,
  y: number
) {
  fireEvent(
    target,
    new PointerEvent(type, { bubbles: true, composed: true, button: 0, pointerId: 1, clientX: x, clientY: y })
  );
}

/** Click 译 and wait for the streamed card — the handle only exists when open. */
async function openCard(baseElement: HTMLElement) {
  await act(async () => {
    pill(baseElement)!.click();
    await tick(40);
  });
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function mountWithSelection(rect: Partial<DOMRect> = { left: 100, bottom: 100 }) {
  const utils = render(
    <MantineProvider theme={interlineTheme}>
      <SelectionApp />
    </MantineProvider>
  );
  mockSelection('hello world selection', rect);
  await act(async () => {
    mouseUp();
    await tick();
  });
  return utils;
}

describe('SelectionApp', () => {
  it('shows the pill on selection and dismisses it on page scroll', async () => {
    const { baseElement } = await mountWithSelection();
    expect(pill(baseElement)).not.toBeNull();

    await act(async () => {
      document.dispatchEvent(new Event('scroll'));
      await tick();
    });
    // position:fixed doesn't follow the page — after a scroll it must go away.
    expect(pill(baseElement)).toBeNull();
  });

  it('does NOT dismiss on scrolls originating inside its own UI (card overflow)', async () => {
    const { baseElement } = await mountWithSelection();
    const own = pill(baseElement)!.closest('[data-omni-selection-ui]')!;
    await act(async () => {
      own.dispatchEvent(new Event('scroll', { bubbles: false }));
      await tick();
    });
    expect(pill(baseElement)).not.toBeNull();
  });

  it('excludes our own injected 译文 from the selection source (translated-page sweep)', async () => {
    // A translated paragraph: source text + an injected gloss INSIDE it. A
    // sweep selects both; the pill must translate only the source.
    const p = document.createElement('p');
    p.textContent = 'The original English sentence. ';
    const gloss = document.createElement('aie-omt-block');
    gloss.setAttribute('data-omni-translated', '');
    gloss.textContent = '中文译文不应回喂。';
    p.appendChild(gloss);
    // eslint-disable-next-line no-restricted-syntax -- this IS host-page content (what the user selects), not surface UI
    document.body.appendChild(p);

    const { baseElement } = render(
      <MantineProvider theme={interlineTheme}>
        <SelectionApp />
      </MantineProvider>
    );
    // Real Range over the real DOM — cloneContents must strip the gloss.
    // (happy-dom has no layout: stub the rect or the zero-size guard bails.)
    const range = document.createRange();
    range.selectNodeContents(p);
    range.getBoundingClientRect = () =>
      ({ left: 50, top: 40, right: 200, bottom: 60, width: 150, height: 20 }) as DOMRect;
    const winSel = {
      toString: () => p.textContent ?? '',
      rangeCount: 1,
      getRangeAt: () => range,
      removeAllRanges: () => {},
    };
    vi.stubGlobal('getSelection', () => winSel);
    (window as unknown as { getSelection: unknown }).getSelection = globalThis.getSelection;

    await act(async () => {
      mouseUp();
      await tick();
    });
    expect(pill(baseElement)).not.toBeNull();

    const { streamTranslate } = await import('@/services/stream/client');
    const spy = vi.mocked(streamTranslate);
    spy.mockClear();
    await act(async () => {
      pill(baseElement)!.click();
      await tick();
    });
    expect(spy).toHaveBeenCalledOnce();
    const sent = spy.mock.calls[0][0].text;
    expect(sent).toContain('The original English sentence.');
    expect(sent).not.toContain('中文译文'); // the gloss never rides along
  });

  it('dismisses on Escape', async () => {
    const { baseElement } = await mountWithSelection();
    await act(async () => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await tick();
    });
    expect(pill(baseElement)).toBeNull();
  });

  it('clamps the pill into the viewport for selections at the right/bottom edge', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    const { baseElement } = await mountWithSelection({ left: 990, bottom: 595 });
    const box = pill(baseElement)!.closest('[data-omni-selection-ui]') as HTMLElement;
    await waitFor(() => expect(box.style.left).not.toBe(''));
    expect(parseInt(box.style.left, 10)).toBeLessThanOrEqual(1000 - 36 - 8);
    expect(parseInt(box.style.top, 10)).toBeLessThanOrEqual(600 - 40);
  });

  it('注疏 affordance exists only for LLM engines; expanding streams the notes', async () => {
    // Seed the projection with an LLM default engine (real storage, no mock).
    await storage.setItem(PUBLIC_CONFIG_KEY, {
      ...defaultPublicConfig(),
      defaultProviderLabel: 'My OpenAI',
      defaultProviderKind: 'openai',
    });

    const { baseElement } = await mountWithSelection();
    await act(async () => {
      pill(baseElement)!.click();
      await tick(40);
    });

    const toggle = [...baseElement.querySelectorAll('button')].find((b) => b.textContent?.includes(m.sel_notes()));
    expect(toggle).toBeDefined(); // LLM engine → the affordance exists
    await act(async () => {
      toggle!.click();
      await tick(40);
    });
    expect(baseElement.textContent).toContain('惯用语'); // notes streamed in

    const { streamAnnotate } = await import('@/services/stream/client');
    expect(vi.mocked(streamAnnotate)).toHaveBeenCalledOnce();
  });

  it('a clean stream that yields NOTHING renders 重试, not an empty card', async () => {
    // ai-sdk swallows provider errors on textStream (they arrive via onError);
    // the server now re-throws, but a genuinely empty completion still ends
    // clean with zero deltas. Either way the card must not look finished-empty.
    const { streamTranslate } = await import('@/services/stream/client');
    vi.mocked(streamTranslate).mockImplementationOnce(async function* () {
      /* clean completion, no deltas */
    });

    const { baseElement } = await mountWithSelection();
    await act(async () => {
      pill(baseElement)!.click();
      await tick(40);
    });
    await waitFor(() => expect(baseElement.textContent).toContain('翻译失败'));
    expect([...baseElement.querySelectorAll('button')].some((b) => b.textContent === '重试')).toBe(true);
  });

  it('with the free MT as default engine the 注疏 affordance does not exist', async () => {
    const { baseElement } = await mountWithSelection(); // empty storage → google-mt defaults
    await act(async () => {
      pill(baseElement)!.click();
      await tick(40);
    });
    expect([...baseElement.querySelectorAll('button')].some((b) => b.textContent?.includes(m.sel_notes()))).toBe(false);
    expect(baseElement.textContent).toContain('译文'); // translation itself unaffected
  });

  // Keyboard selection (Shift+arrows, ⌘/Ctrl-A) must reach the same card the
  // mouse does — the pill was mouseup-only, so keyboard users saw nothing.
  describe('keyboard selection route', () => {
    async function mountForKeyboard() {
      window.innerWidth = 1024;
      window.innerHeight = 768;
      const utils = render(
        <MantineProvider theme={interlineTheme}>
          <SelectionApp />
        </MantineProvider>
      );
      // A real host text node to put the caret in, plus a caret rect far from
      // the selection's bounding box so the assertion can tell them apart.
      const host = document.createElement('p');
      host.textContent = 'keyboard selected sentence';
      // eslint-disable-next-line no-restricted-syntax -- host-page content (what the user selects), not surface UI
      document.body.appendChild(host);
      onTestFinished(() => host.remove());
      mockSelection('keyboard selected sentence', { left: 100, bottom: 100 }, { node: host.firstChild!, offset: 9 });
      stubCaretRect({ left: 340, bottom: 240 });
      return utils;
    }

    it('shows the pill after a Shift+arrow selection, anchored at the caret', async () => {
      const { baseElement } = await mountForKeyboard();
      await act(async () => {
        keyUp('ArrowRight', { shiftKey: true });
        await tick(240);
      });
      const shown = pill(baseElement);
      expect(shown).not.toBeNull();
      const box = shown!.closest('[data-omni-selection-ui]') as HTMLElement;
      // Caret rect, NOT the bounding box (left 100 / bottom 100) — the keyboard
      // route has no pointer position to fall back to.
      expect(parseInt(box.style.left, 10)).toBe(340);
      expect(parseInt(box.style.top, 10)).toBe(246);
    });

    it('⌘/Ctrl-A also settles a selection', async () => {
      const { baseElement } = await mountForKeyboard();
      await act(async () => {
        keyUp('a', { ctrlKey: true });
        await tick(240);
      });
      expect(pill(baseElement)).not.toBeNull();
    });

    it('waits for the gesture to settle: nothing appears mid-extension', async () => {
      const { baseElement } = await mountForKeyboard();
      // A burst of presses, none of them the end of the gesture.
      await act(async () => {
        keyUp('ArrowRight', { shiftKey: true });
        await tick(60);
        keyUp('ArrowRight', { shiftKey: true });
        await tick(60);
        keyUp('ArrowRight', { shiftKey: true });
        await tick(60);
      });
      expect(pill(baseElement)).toBeNull(); // still extending → no pill yet
      await act(async () => {
        await tick(240);
      });
      expect(pill(baseElement)).not.toBeNull(); // one settle, after the burst
    });

    it('a plain arrow collapses the selection and takes the pill with it', async () => {
      const { baseElement } = await mountForKeyboard();
      await act(async () => {
        keyUp('ArrowRight', { shiftKey: true });
        await tick(240);
      });
      expect(pill(baseElement)).not.toBeNull();

      mockSelection('', { left: 100, bottom: 100 }); // arrow key collapsed it
      await act(async () => {
        keyUp('ArrowRight');
        await tick(240);
      });
      // No stale pill left hovering over a caret the user walked away from.
      expect(pill(baseElement)).toBeNull();
    });

    it('Tab claims the keyboard-summoned pill, and the card is button-operable', async () => {
      const { baseElement } = await mountForKeyboard();
      await act(async () => {
        keyUp('ArrowRight', { shiftKey: true });
        await tick(240);
      });
      // Our surface is anchored to <body>: without this, reaching the pill
      // means tabbing through the whole rest of the page.
      await act(async () => {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
        await tick();
      });
      expect(document.activeElement).toBe(pill(baseElement));

      await act(async () => {
        pill(baseElement)!.click();
        await tick(40);
      });
      // Every affordance in the open card is a real <button type="button"> —
      // that (not a click handler on a div) is what makes Enter/Space work and
      // keeps them in the tab order. happy-dom does not synthesize the
      // Enter→click default action, so assert the property that grants it.
      const buttons = [...baseElement.querySelectorAll('[data-omni-selection-ui] button')];
      expect(buttons.length).toBeGreaterThan(0);
      for (const b of buttons) {
        expect(b.getAttribute('type')).toBe('button');
        expect(b.getAttribute('tabindex')).toBeNull(); // never removed from the tab order
      }
      expect(baseElement.textContent).toContain('译文');
    });

    it('Escape dismisses while focus is inside the surface (the shadow eats document keys)', async () => {
      const { baseElement } = await mountForKeyboard();
      await act(async () => {
        keyUp('ArrowRight', { shiftKey: true });
        await tick(240);
      });
      // Stand in for the shadow root's isolateEvents: a boundary ABOVE the
      // React root (baseElement is the render container's parent) that swallows
      // key events on their way to the document. In production that boundary is
      // what keeps our keystrokes out of host-page hotkeys — and what makes a
      // document-level Escape listener useless for anyone focused in the card.
      const isolate = (e: Event) => e.stopPropagation();
      baseElement.addEventListener('keydown', isolate);
      onTestFinished(() => baseElement.removeEventListener('keydown', isolate));

      const target = pill(baseElement)!;
      target.focus();
      await act(async () => {
        target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await tick();
      });
      expect(pill(baseElement)).toBeNull();
    });
  });
});

it('new selection can load notes after previous notes were interrupted', async () => {
  const { streamAnnotate } = await import('@/services/stream/client');
  vi.mocked(streamAnnotate).mockClear();
  let release!: () => void;
  vi.mocked(streamAnnotate).mockImplementationOnce(async function* () {
    await new Promise<void>((resolve) => {
      release = resolve;
    });
    yield 'old notes';
  });
  await storage.setItem(PUBLIC_CONFIG_KEY, { ...defaultPublicConfig(), defaultProviderKind: 'openai' });
  const { baseElement } = await mountWithSelection();
  await act(async () => {
    pill(baseElement)!.click();
    await tick(40);
  });
  const notesButton = () =>
    [...baseElement.querySelectorAll('button')].find((b) => b.textContent?.includes(m.sel_notes()))!;
  await act(async () => {
    notesButton().click();
    await tick();
  });
  expect(streamAnnotate).toHaveBeenCalledTimes(1);
  await act(async () => {
    mockSelection('a different selection', { left: 120, bottom: 100 });
    mouseUp();
    await tick();
  });
  await act(async () => {
    pill(baseElement)!.click();
    await tick(40);
  });
  await act(async () => {
    release();
    await tick();
    notesButton().click();
    await tick();
  });
  expect(streamAnnotate).toHaveBeenCalledTimes(2);
});
it('never sites do not offer selection translation', async () => {
  await storage.setItem(PUBLIC_CONFIG_KEY, {
    ...defaultPublicConfig(),
    siteControl: { defaultMode: 'never', rules: [] },
  });
  const { streamTranslate } = await import('@/services/stream/client');
  vi.mocked(streamTranslate).mockClear();
  const { baseElement } = await mountWithSelection();
  if (pill(baseElement))
    await act(async () => {
      pill(baseElement)!.click();
      await tick(40);
    });
  expect(streamTranslate).not.toHaveBeenCalled();
});

describe('dragging the card (manual position)', () => {
  it('dragging the header moves the card and leaves it there, still open', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    const { baseElement } = await mountWithSelection(); // anchor (100, 100) → top +6
    await openCard(baseElement);
    const box = cardBox(baseElement);
    expect(box.style.left).toBe('100px');
    expect(box.style.top).toBe('106px');

    const grip = handle(baseElement)!;
    expect(grip.style.cursor).toBe('grab');
    await act(async () => {
      sendPointer(grip, 'pointerdown', 110, 120);
      sendPointer(grip, 'pointermove', 210, 320);
      await tick();
    });
    expect(grip.style.cursor).toBe('grabbing');
    expect(box.style.left).toBe('200px'); // 210 − 10 grab offset
    expect(box.style.top).toBe('306px'); // 320 − 14

    await act(async () => {
      sendPointer(grip, 'pointerup', 210, 320);
      await tick();
    });
    expect(grip.style.cursor).toBe('grab');
    expect(box.style.left).toBe('200px'); // dropped here, not re-anchored
    expect(box.style.top).toBe('306px');
    expect(handle(baseElement)).not.toBeNull(); // card still open
    expect(baseElement.textContent).toContain('译文');
  });

  it('a press that travels inside the 5px threshold is a click, not a drag', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    const { baseElement } = await mountWithSelection();
    await openCard(baseElement);
    const box = cardBox(baseElement);
    const grip = handle(baseElement)!;
    await act(async () => {
      sendPointer(grip, 'pointerdown', 110, 120);
      sendPointer(grip, 'pointermove', 113, 123); // ~4.2px — under the threshold
      sendPointer(grip, 'pointerup', 113, 123);
      await tick();
    });
    expect(box.style.left).toBe('100px');
    expect(box.style.top).toBe('106px');
    expect(grip.style.cursor).toBe('grab'); // never entered drag mode
  });

  it('a drag never dismisses the card — its own events, or a scroll mid-gesture', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    const { baseElement } = await mountWithSelection();
    await openCard(baseElement);
    const grip = handle(baseElement)!;
    await act(async () => {
      sendPointer(grip, 'pointerdown', 110, 120);
      sendPointer(grip, 'pointermove', 210, 320);
      await tick();
    });
    // A page scroll landing mid-gesture must not yank the card out from under
    // the pointer (touch/kinetic scrolling while dragging).
    await act(async () => {
      document.dispatchEvent(new Event('scroll'));
      await tick();
    });
    expect(handle(baseElement)).not.toBeNull();
    expect(baseElement.textContent).toContain('译文');

    await act(async () => {
      sendPointer(grip, 'pointerup', 210, 320);
      // The captured release retargets onto our handle: a mouseup whose path
      // runs through our own UI must not read as "the user selected elsewhere".
      grip.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      await tick(30);
    });
    expect(handle(baseElement)).not.toBeNull();
    expect(baseElement.textContent).toContain('译文');

    // …and the guard dies with the drag: a REAL page scroll still dismisses.
    await act(async () => {
      document.dispatchEvent(new Event('scroll'));
      await tick();
    });
    expect(pill(baseElement)).toBeNull();
    expect(handle(baseElement)).toBeNull();
  });

  it('a NEW selection drops the manual position and re-anchors', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    const { baseElement } = await mountWithSelection();
    await openCard(baseElement);
    const box = cardBox(baseElement);
    const grip = handle(baseElement)!;
    await act(async () => {
      sendPointer(grip, 'pointerdown', 110, 120);
      sendPointer(grip, 'pointermove', 210, 320);
      sendPointer(grip, 'pointerup', 210, 320);
      await tick();
    });
    expect(box.style.left).toBe('200px');

    // The user selects something else on the host page (mouseup OUTSIDE our UI).
    await act(async () => {
      mockSelection('another passage', { left: 300, bottom: 150 });
      mouseUp();
      await tick(30);
    });
    expect(box.style.left).toBe('300px'); // back to the anchor…
    expect(box.style.top).toBe('156px'); // …not the dragged spot (200, 306)
  });

  it('a pinned card KEEPS its dragged spot across selections', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    const { baseElement } = await mountWithSelection();
    await openCard(baseElement);
    await act(async () => {
      const pin = [...baseElement.querySelectorAll('button')].find((b) => b.getAttribute('aria-label') === m.sel_pin());
      pin!.click();
      await tick();
    });
    const box = cardBox(baseElement);
    const grip = handle(baseElement)!;
    await act(async () => {
      sendPointer(grip, 'pointerdown', 110, 120);
      sendPointer(grip, 'pointermove', 210, 320);
      sendPointer(grip, 'pointerup', 210, 320);
      await tick();
    });
    expect(box.style.left).toBe('200px');

    await act(async () => {
      mockSelection('another passage', { left: 300, bottom: 150 });
      mouseUp();
      await tick(30);
    });
    // Pinning froze the anchor already; the dragged spot must survive with it.
    expect(box.style.left).toBe('200px');
    expect(box.style.top).toBe('306px');
  });

  it('dragging past the viewport edges clamps into the 8px margin', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    const { baseElement } = await mountWithSelection();
    await openCard(baseElement);
    const box = cardBox(baseElement);
    const grip = handle(baseElement)!;
    await act(async () => {
      sendPointer(grip, 'pointerdown', 110, 120);
      sendPointer(grip, 'pointermove', 5000, 5000);
      await tick();
    });
    expect(box.style.left).toBe('644px'); // 1000 − 348 (card width) − 8
    expect(box.style.top).toBe('352px'); // 600 − 240 (card max height) − 8
    await act(async () => {
      sendPointer(grip, 'pointerup', 5000, 5000);
      sendPointer(grip, 'pointerdown', 650, 360);
      sendPointer(grip, 'pointermove', -5000, -5000);
      await tick();
    });
    expect(box.style.left).toBe('8px');
    expect(box.style.top).toBe('8px');
    await act(async () => {
      sendPointer(grip, 'pointerup', -5000, -5000);
      await tick();
    });
  });

  it('a window resize re-clamps a dragged spot back on screen', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    const { baseElement } = await mountWithSelection();
    await openCard(baseElement);
    const box = cardBox(baseElement);
    const grip = handle(baseElement)!;
    await act(async () => {
      sendPointer(grip, 'pointerdown', 110, 120);
      sendPointer(grip, 'pointermove', 5000, 5000);
      sendPointer(grip, 'pointerup', 5000, 5000);
      await tick();
    });
    expect(box.style.left).toBe('644px'); // parked at the old right edge

    window.innerWidth = 500;
    window.innerHeight = 400;
    await act(async () => {
      window.dispatchEvent(new Event('resize'));
      await tick();
    });
    expect(box.style.left).toBe('144px'); // 500 − 348 − 8
    expect(box.style.top).toBe('232px'); // 400 − 160 (max height) − 8
  });

  it('a visualViewport resize re-clamps too', async () => {
    window.innerWidth = 1000;
    window.innerHeight = 600;
    // An EventTarget stands in for the (happy-dom-less) visual viewport; the
    // stub must be in place BEFORE mount so the listener subscribes to it.
    const vv = new EventTarget();
    const had = Object.getOwnPropertyDescriptor(window, 'visualViewport');
    Object.defineProperty(window, 'visualViewport', { value: vv, configurable: true, writable: true });
    onTestFinished(() => {
      if (had) Object.defineProperty(window, 'visualViewport', had);
      else delete (window as unknown as { visualViewport?: unknown }).visualViewport;
    });

    const { baseElement } = await mountWithSelection();
    await openCard(baseElement);
    const box = cardBox(baseElement);
    const grip = handle(baseElement)!;
    await act(async () => {
      sendPointer(grip, 'pointerdown', 110, 120);
      sendPointer(grip, 'pointermove', 5000, 5000);
      sendPointer(grip, 'pointerup', 5000, 5000);
      await tick();
    });
    expect(box.style.left).toBe('644px');

    window.innerWidth = 500;
    window.innerHeight = 400;
    await act(async () => {
      vv.dispatchEvent(new Event('resize'));
      await tick();
    });
    expect(box.style.left).toBe('144px');
    expect(box.style.top).toBe('232px');
  });

  for (const ending of ['pointercancel', 'lostpointercapture'] as const) {
    it(`an interrupted drag settles on ${ending} and keeps its spot`, async () => {
      window.innerWidth = 1000;
      window.innerHeight = 600;
      const { baseElement } = await mountWithSelection();
      await openCard(baseElement);
      const box = cardBox(baseElement);
      const grip = handle(baseElement)!;
      await act(async () => {
        sendPointer(grip, 'pointerdown', 110, 120);
        sendPointer(grip, 'pointermove', 210, 320);
        await tick();
      });
      expect(grip.style.cursor).toBe('grabbing');
      await act(async () => {
        sendPointer(grip, ending, 210, 320);
        sendPointer(grip, 'pointermove', 400, 400); // press is gone — dead traffic
        await tick();
      });
      expect(grip.style.cursor).toBe('grab');
      expect(box.style.left).toBe('200px'); // interrupted drag keeps its spot
      expect(box.style.top).toBe('306px');
    });
  }
});
