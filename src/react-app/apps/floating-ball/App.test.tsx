// @vitest-environment happy-dom
import { MantineProvider } from '@mantine/core';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { m } from '@/paraglide/messages.js';
import { emitPageTranslationState, onSetPageTranslation } from '@/core/page-translation-bridge';
import { interlineTheme } from '@/react-app/managers/VisualManager/theme';
import FloatingBallApp from './App';

/**
 * The seal's interaction contract: main seal = direct translate toggle (over
 * the in-page bridge), 押脚 sub seal = panel entry, tuck = idle half-hide with
 * press-to-reveal. Drag/snap geometry and the tuck DECISION are covered by
 * geometry.test; the carved visuals need a real browser. What can break
 * silently here is the wiring — pinned below.
 */

// The panel's writes go through the background gateway — stub the proxy so the
// patch promise is ours to hold open (the live-apply ordering case below).
const { patch } = vi.hoisted(() => ({ patch: vi.fn<(p: object) => Promise<void>>(async () => {}) }));
vi.mock('@/services/config/public', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/config/public')>()),
  getConfigService: () => ({ patch }),
}));

// happy-dom has no pointer-capture implementation; the ball's drag handling
// calls setPointerCapture on pointerdown, so give it a no-op.
beforeEach(() => {
  const proto = Element.prototype as unknown as Record<string, unknown>;
  proto.setPointerCapture ??= () => {};
  proto.releasePointerCapture ??= () => {};
  patch.mockClear(); // call counts must not depend on test order
});

afterEach(() => {
  cleanup();
});

function mountBall() {
  return render(
    <MantineProvider theme={interlineTheme}>
      <FloatingBallApp />
    </MantineProvider>
  );
}

const pointer = (type: string) => new PointerEvent(type, { bubbles: true, composed: true });
const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

const mainSeal = (c: HTMLElement) =>
  c.querySelector<HTMLElement>(`[aria-label="${m.ball_action_translate()}"], [aria-label="${m.ball_action_restore()}"]`)!;
const subSeal = (c: HTMLElement) => c.querySelector<HTMLElement>(`[aria-label="${m.ball_open_panel()}"]`);
const interleaveToggle = (c: HTMLElement) => {
  const label = [...c.querySelectorAll('*')].find((el) => el.textContent === m.interleave_label())!;
  return label.parentElement!.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
};

/** The seal is BORN tucked — a first press only reveals it. */
function reveal(c: HTMLElement) {
  clickMain(c);
}

/** A click (no drag): pointerdown + pointerup on the main seal. */
function clickMain(c: HTMLElement) {
  const seal = mainSeal(c);
  act(() => {
    seal.dispatchEvent(pointer('pointerdown'));
    seal.dispatchEvent(pointer('pointerup'));
  });
}

/** Collect requestSetPageTranslation calls for the duration of `fn`. */
async function withRequests(fn: (requests: boolean[]) => Promise<void> | void) {
  const requests: boolean[] = [];
  const off = onSetPageTranslation((enabled) => requests.push(enabled));
  try {
    await fn(requests);
  } finally {
    off();
  }
}

describe('main seal — the direct translate toggle', () => {
  it('a click requests translation over the bridge and does NOT open the panel', async () => {
    await withRequests(async (requests) => {
      const { baseElement } = mountBall();
      await act(() => tick());
      reveal(baseElement); // born tucked — the first press only reveals
      expect(requests).toEqual([]);
      clickMain(baseElement);
      expect(requests).toEqual([true]);
      expect(baseElement.textContent).not.toContain(m.ball_style()); // no panel
    });
  });

  it('reflects the owner state: aria flips to restore + aria-pressed, next click turns OFF', async () => {
    await withRequests(async (requests) => {
      const { baseElement } = mountBall();
      await act(() => tick());
      act(() => emitPageTranslationState(true)); // owner: page is translated
      const seal = mainSeal(baseElement);
      expect(seal.getAttribute('aria-label')).toBe(m.ball_action_restore());
      expect(seal.getAttribute('aria-pressed')).toBe('true');
      clickMain(baseElement);
      expect(requests).toEqual([false]); // restore
    });
  });
});

describe('main seal — keyboard activation', () => {
  it('Enter/Space (synthetic click, detail 0) works: first press reveals, second toggles', async () => {
    await withRequests(async (requests) => {
      const { baseElement } = mountBall();
      await act(() => tick());
      // Keyboard activation fires a click with detail 0 and NO pointer events.
      const kbClick = () =>
        act(() => {
          mainSeal(baseElement).dispatchEvent(new MouseEvent('click', { detail: 0, bubbles: true }));
        });
      kbClick(); // born tucked → reveal only
      expect(requests).toEqual([]);
      kbClick(); // revealed → toggles translation
      expect(requests).toEqual([true]);
    });
  });
});

describe('押脚 sub seal — the panel entry', () => {
  it('opens the panel; outside pointerdown and Escape both dismiss it', async () => {
    const { baseElement } = mountBall();
    await act(() => tick());
    reveal(baseElement); // sub seal is unclickable while tucked
    act(() => subSeal(baseElement)!.click());
    await act(() => tick());
    expect(baseElement.textContent).toContain(m.ball_style()); // panel open
    expect(subSeal(baseElement)).toBeNull(); // entry unmounts while panel occupies its spot

    // Inside the panel: stays open.
    const panelLabel = [...baseElement.querySelectorAll('*')].find(
      (el) => el.textContent === m.ball_style()
    ) as HTMLElement;
    act(() => {
      panelLabel.dispatchEvent(pointer('pointerdown'));
    });
    expect(baseElement.textContent).toContain(m.ball_style());

    // Outside (host page): closes.
    act(() => {
      // eslint-disable-next-line no-restricted-syntax -- body IS the host page here (the outside being clicked), not a mount point
      document.body.dispatchEvent(pointer('pointerdown'));
    });
    expect(baseElement.textContent).not.toContain(m.ball_style());

    // Escape: closes too.
    act(() => subSeal(baseElement)!.click());
    await act(() => tick());
    expect(baseElement.textContent).toContain(m.ball_style());
    act(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    expect(baseElement.textContent).not.toContain(m.ball_style());
  });
});

describe('tuck — born half-hidden, press to reveal', () => {
  it('mounts tucked; the first press reveals without acting, the next click acts', async () => {
    await withRequests(async (requests) => {
      const { baseElement } = mountBall();
      await act(() => tick());
      expect(mainSeal(baseElement).style.transform).toContain('translateX'); // born at the edge
      expect(subSeal(baseElement)!.getAttribute('tabindex')).toBe('-1'); // hidden entry untabbable

      clickMain(baseElement); // tucked press = reveal only
      expect(requests).toEqual([]);
      expect(mainSeal(baseElement).style.transform || '').not.toContain('translateX');
      // the 押脚 arrives by 落印 — the stamp-down entrance rides the reveal
      expect(subSeal(baseElement)!.style.animation).toContain('sub-stamp');

      clickMain(baseElement); // now revealed: the click acts
      expect(requests).toEqual([true]);
    });
  });

  it('the invisible hit strip only exists while tucked — a visible seal covers no host page', async () => {
    await withRequests(async () => {
      const { baseElement } = mountBall();
      await act(() => tick());
      // Tucked: the strip is the only way to catch a seal that is mostly past
      // the viewport edge.
      expect(baseElement.querySelector('[data-omni-hit-strip]')).not.toBeNull();

      clickMain(baseElement); // reveal
      await act(() => tick());
      // Revealed and unhovered: a 34px seal needs no 12px apron over the page.
      expect(baseElement.querySelector('[data-omni-hit-strip]')).toBeNull();
    });
  });
});

/**
 * Live-apply ordering: 译入/样式 changes re-translate the page, and the re-run
 * must wait for the config write — the owner re-READS the config, so a re-run
 * that starts first silently repeats the previous language.
 */
describe('live-apply — a setting change re-translates only after the write lands', () => {
  it('holds the re-translate request until getConfigService().patch resolves', async () => {
    let land!: () => void;
    patch.mockImplementationOnce(() => new Promise<void>((resolve) => (land = resolve)));
    await withRequests(async (requests) => {
      const { baseElement } = mountBall();
      await act(() => tick());
      reveal(baseElement); // born tucked — the sub seal is unclickable until revealed
      act(() => emitPageTranslationState(true)); // owner: the page IS translated
      act(() => subSeal(baseElement)!.click());
      await act(() => tick());

      // The hover rides in the SAME batch as the toggle on purpose: React only
      // evaluates a setState updater eagerly while the fiber has no pending
      // update, so a pointer landing on the seal (setHover + reveal) is what
      // pushes the config updater into the render phase — the window where a
      // write issued from inside it escapes the promise we return.
      act(() => {
        baseElement
          .querySelector('[data-omni-selection-ui]')!
          .dispatchEvent(new PointerEvent('pointerover', { bubbles: true, composed: true }));
        interleaveToggle(baseElement).click();
      });
      expect(patch).toHaveBeenCalledTimes(1); // exactly one RPC per click
      expect(Object.keys(patch.mock.calls[0][0])).toEqual(['appearance']); // only the changed section
      await act(() => tick());
      expect(requests).toEqual([]); // the write is still in flight — nothing may re-run yet

      act(() => land());
      await act(() => tick());
      expect(requests).toEqual([true]); // now the owner re-translates, on the new config
    });
  });
});
