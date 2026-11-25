// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { detectHostColorScheme, getHostColorScheme, subscribeHostColorScheme } from './host-scheme';

describe('detectHostColorScheme', () => {
  beforeEach(() => {
    document.documentElement.style.backgroundColor = '';
    document.body.style.backgroundColor = '';
  });

  it('defaults to light (browser canvas is white when nothing paints)', () => {
    expect(detectHostColorScheme()).toBe('light');
  });

  it('reads a dark body as dark', () => {
    document.body.style.backgroundColor = 'rgb(18, 18, 18)';
    expect(detectHostColorScheme()).toBe('dark');
  });

  it('composites a transparent body over a dark html', () => {
    document.documentElement.style.backgroundColor = 'rgb(22, 19, 14)';
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0)'; // fully transparent — html shows through
    expect(detectHostColorScheme()).toBe('dark');
  });

  it('reads a light tinted page as light', () => {
    document.body.style.backgroundColor = 'rgb(250, 246, 238)';
    expect(detectHostColorScheme()).toBe('light');
  });

  it('a translucent dark wash over white stays light until it actually reads dark', () => {
    document.body.style.backgroundColor = 'rgba(0, 0, 0, 0.2)'; // pale gray composite
    expect(detectHostColorScheme()).toBe('light');
  });

  // Pages that paint NOTHING themselves and rely on `color-scheme` for a
  // UA-dark canvas (computed backgroundColor stays transparent throughout).
  describe('transparent page, canvas driven by color-scheme', () => {
    afterEach(() => {
      document.documentElement.style.colorScheme = '';
      document.querySelector('meta[name="color-scheme"]')?.remove();
    });

    it('root color-scheme: dark reads dark', () => {
      document.documentElement.style.colorScheme = 'dark';
      expect(detectHostColorScheme()).toBe('dark');
    });

    it('root color-scheme: light dark stays light while the OS is light', () => {
      // happy-dom's matchMedia never matches prefers-color-scheme: dark.
      document.documentElement.style.colorScheme = 'light dark';
      expect(detectHostColorScheme()).toBe('light');
    });

    it('meta color-scheme dark reads dark when the root declares nothing', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'color-scheme');
      meta.setAttribute('content', 'dark');
      document.head.appendChild(meta);
      expect(detectHostColorScheme()).toBe('dark');
    });

    it('real paint composites OVER the dark canvas and wins', () => {
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = 'rgb(250, 246, 238)';
      expect(detectHostColorScheme()).toBe('light');
    });

    it('a translucent wash now composites onto the DARK canvas', () => {
      document.documentElement.style.colorScheme = 'dark';
      document.body.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'; // still dark composite
      expect(detectHostColorScheme()).toBe('dark');
    });

    it('resets canvas fillStyle so an invalid color cannot inherit a prior dark sample', async () => {
      let currentFill = '#000000';
      const fakeCtx = {
        clearRect() {},
        fillRect() {},
        get fillStyle() {
          return currentFill;
        },
        set fillStyle(val: string) {
          if (val === 'rgba(0, 0, 0, 0)') currentFill = 'transparent';
          else if (val === 'oklch(0.2 0 0)') currentFill = 'dark';
          // Invalid color strings (like 'not-a-color') are silently ignored by Canvas 2D.
        },
        getImageData() {
          if (currentFill === 'dark') return { data: new Uint8ClampedArray([15, 15, 15, 255]) };
          return { data: new Uint8ClampedArray([0, 0, 0, 0]) };
        },
      };
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = (() => fakeCtx) as unknown as typeof origGetContext;
      let bodyColor = 'oklch(0.2 0 0)';
      const computedSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((el) => {
        if (el === document.body) {
          return { backgroundColor: bodyColor, colorScheme: 'normal' } as CSSStyleDeclaration;
        }
        return { backgroundColor: '', colorScheme: 'normal' } as CSSStyleDeclaration;
      });
      try {
        // Isolate module-level colorCtx/colorCache so other tests are not polluted.
        vi.resetModules();
        const { detectHostColorScheme: detectIsolated } = await import('./host-scheme');
        expect(detectIsolated()).toBe('dark');

        bodyColor = 'not-a-color';
        expect(detectIsolated()).toBe('light');
      } finally {
        computedSpy.mockRestore();
        HTMLCanvasElement.prototype.getContext = origGetContext;
        vi.resetModules();
      }
    });
  });
});

/**
 * Watcher PIPELINE tests: mutation → coalesced recheck → change-only
 * notification → refcounted teardown. The luminance threshold itself is
 * pinned by the detect suite above; real-browser behaviour (transitions,
 * media-query flips) stays a manual test — happy-dom can't drive those.
 */
describe('subscribeHostColorScheme', () => {
  // A style-attribute write is both the trigger (MutationObserver on body
  // attributes) and the repaint (detect reads the inline background).
  const paintBody = (color: string) => {
    document.body.style.backgroundColor = color;
  };
  // Mutation records deliver as a microtask, which schedules the rAF recheck;
  // two frames make the ordering race-free regardless of registration order.
  const settle = async () => {
    await Promise.resolve();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  };

  let unsubs: Array<() => void> = [];
  const subscribe = (listener: (scheme: 'light' | 'dark') => void) => {
    const unsub = subscribeHostColorScheme(listener);
    unsubs.push(unsub);
    return unsub;
  };

  beforeEach(() => {
    document.documentElement.style.backgroundColor = '';
    document.body.style.backgroundColor = '';
  });

  afterEach(() => {
    unsubs.forEach((u) => u());
    unsubs = [];
  });

  it('notifies when a body mutation flips the painted scheme', async () => {
    const seen = vi.fn();
    subscribe(seen);
    paintBody('rgb(18, 18, 18)');
    await settle();
    expect(seen).toHaveBeenCalledTimes(1);
    expect(seen).toHaveBeenCalledWith('dark');
    expect(getHostColorScheme()).toBe('dark');
  });

  it('stays quiet when a repaint keeps the same scheme', async () => {
    const seen = vi.fn();
    subscribe(seen);
    paintBody('rgb(250, 246, 238)'); // light → still light
    await settle();
    expect(seen).not.toHaveBeenCalled();
  });

  it('coalesces a burst of mutations into one notification', async () => {
    const seen = vi.fn();
    subscribe(seen);
    paintBody('rgb(30, 30, 30)');
    paintBody('rgb(20, 20, 20)');
    paintBody('rgb(10, 10, 10)');
    await settle();
    expect(seen).toHaveBeenCalledTimes(1);
    expect(seen).toHaveBeenCalledWith('dark');
  });

  it('bounds continuous repaint sampling and follows the next transition with a fresh budget', () => {
    let gray = 255;
    const frames: FrameRequestCallback[] = [];
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => frames.push(cb));
    const style = vi
      .spyOn(window, 'getComputedStyle')
      .mockImplementation(
        () => ({ backgroundColor: `rgb(${gray}, ${gray}, ${gray})`, colorScheme: 'light' }) as CSSStyleDeclaration
      );
    const unsub = subscribe(() => {});
    try {
      document.body.dispatchEvent(new Event('transitionend', { bubbles: true }));
      for (let i = 0; i < 121; i++) {
        gray--;
        expect(frames).toHaveLength(1);
        frames.shift()!(i);
      }
      expect(frames).toHaveLength(0);
      document.body.dispatchEvent(new Event('transitionend', { bubbles: true }));
      // The external signal can precede the first visibly changed frame.
      frames.shift()!(122);
      expect(frames).toHaveLength(1);
      gray = 255;
      frames.shift()!(123);
      expect(getHostColorScheme()).toBe('light');
      frames.shift()!(124);
      expect(frames).toHaveLength(0);
    } finally {
      unsub();
      style.mockRestore();
      raf.mockRestore();
    }
  });

  it('observes html after subscribing before the document root exists', () => {
    const observe = vi.spyOn(MutationObserver.prototype, 'observe');
    const html = vi.spyOn(document, 'documentElement', 'get').mockReturnValue(null!);
    const body = vi.spyOn(document, 'body', 'get').mockReturnValue(null!);
    vi.spyOn(document, 'readyState', 'get').mockReturnValue('loading');
    try {
      subscribe(() => {});
      expect(observe).not.toHaveBeenCalled();
      html.mockRestore();
      body.mockRestore();
      document.dispatchEvent(new Event('DOMContentLoaded'));
      expect(observe).toHaveBeenCalledWith(document.documentElement, { attributes: true });
      expect(observe).toHaveBeenCalledWith(document.body, { attributes: true });
    } finally {
      vi.restoreAllMocks();
    }
  });

  it('serves getHostColorScheme from the live cache while subscribed', async () => {
    subscribe(() => {});
    paintBody('rgb(18, 18, 18)');
    // Before the coalesced recheck lands, the cache still says light — the
    // point: reads are O(1) frame-stable values, not per-call style recalcs.
    expect(getHostColorScheme()).toBe('light');
    await settle();
    expect(getHostColorScheme()).toBe('dark');
  });

  it('unsubscribe stops notifications and is idempotent', async () => {
    const seen = vi.fn();
    const unsub = subscribe(seen);
    unsub();
    unsub(); // double-call must be a no-op
    paintBody('rgb(18, 18, 18)');
    await settle();
    expect(seen).not.toHaveBeenCalled();
    // Watcher fully torn down → cold reads fall back to a fresh sample.
    expect(getHostColorScheme()).toBe('dark');
  });

  it('keeps a second subscriber alive when the first leaves', async () => {
    const first = vi.fn();
    const second = vi.fn();
    const unsubFirst = subscribe(first);
    subscribe(second);
    unsubFirst();
    paintBody('rgb(18, 18, 18)');
    await settle();
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('dark');
  });
});
