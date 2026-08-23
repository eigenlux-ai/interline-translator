// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { withViewportAnchor } from './viewport-anchor';

describe('withViewportAnchor', () => {
  it('runs the mutation and returns its value', () => {
    const fn = vi.fn(() => 42);
    expect(withViewportAnchor(fn, window)).toBe(42);
    expect(fn).toHaveBeenCalledOnce();
  });

  it('is a no-op wrapper when there is no window (still runs fn)', () => {
    const fn = vi.fn(() => 'ok');
    expect(withViewportAnchor(fn, null)).toBe('ok');
    expect(fn).toHaveBeenCalledOnce();
  });

  it('does not throw when no anchor can be found (no layout engine)', () => {
    expect(() => withViewportAnchor(() => undefined, window)).not.toThrow();
  });
});
