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
