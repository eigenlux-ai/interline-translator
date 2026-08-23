import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { makeWatchdog, shortStopError, withStreamSlot } from './limiter';

describe('withStreamSlot', () => {
  it('never exceeds the cap, releases on failure, and wakes waiters newest-first', async () => {
    let active = 0;
    let peak = 0;
    const order: number[] = [];

    const job = (i: number, fail = false) =>
      withStreamSlot(async () => {
        active++;
        peak = Math.max(peak, active);
        order.push(i);
        await new Promise((r) => setTimeout(r, 5));
        active--;
        if (fail) throw new Error(`job ${i} failed`);
        return i;
      });

    // 10 jobs against a cap of 4; two of them fail (slots must still free up).
    const results = await Promise.allSettled(
      Array.from({ length: 10 }, (_, i) => job(i, i === 2 || i === 6))
    );

    expect(peak).toBeLessThanOrEqual(4);
    expect(order).toHaveLength(10); // every job eventually ran
    expect(results.filter((r) => r.status === 'rejected')).toHaveLength(2);
    expect(order.slice(0, 4)).toEqual([0, 1, 2, 3]); // first wave in submission order
    // Waiters wake LIFO — the newest batch is the one nearest the user's
    // current viewport (see withStreamSlot). Each first-wave release pops the
    // youngest waiter, so the backlog drains from the tail.
    expect(order.slice(4)).toEqual([9, 8, 7, 6, 5, 4]);

    // The semaphore is fully released: one more job runs immediately.
    await expect(withStreamSlot(async () => 'after')).resolves.toBe('after');
  });
});

describe('makeWatchdog', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires on SILENCE, not on duration — a slow but live stream keeps going', () => {
    const wd = makeWatchdog(new AbortController().signal, 40, 10_000);
    // Six beats across 120ms: three times the idle ceiling in elapsed terms,
    // but never 40ms without progress. A local model grinding a long batch.
    for (let i = 0; i < 6; i++) {
      vi.advanceTimersByTime(20);
      wd.beat();
    }
    expect(wd.timedOut()).toBe(false);
    expect(wd.signal.aborted).toBe(false);

    vi.advanceTimersByTime(41); // now it goes quiet
    expect(wd.timedOut()).toBe(true);
    expect(wd.signal.aborted).toBe(true);
    wd.done();
  });

  it('still backstops a stream that dribbles forever', () => {
    const wd = makeWatchdog(new AbortController().signal, 10_000, 40);
    for (let i = 0; i < 4; i++) {
      vi.advanceTimersByTime(20);
      wd.beat();
    }
    expect(wd.timedOut()).toBe(true); // the absolute ceiling is not resettable
    wd.done();
  });

  it('keeps the caller\u2019s cancel distinguishable from a timeout', () => {
    const ac = new AbortController();
    const wd = makeWatchdog(ac.signal, 10_000, 10_000);
    ac.abort();
    expect(wd.signal.aborted).toBe(true);
    expect(wd.timedOut()).toBe(false); // user cancel — stay silent, do not error
    wd.done();
  });

  it('done() disarms both timers — an armed one keeps the service worker alive', () => {
    const wd = makeWatchdog(new AbortController().signal, 40, 80);
    wd.done();
    vi.advanceTimersByTime(1000);
    expect(wd.timedOut()).toBe(false);
    expect(wd.signal.aborted).toBe(false);
  });
});

describe('shortStopError', () => {
  it('names the cap and the filter, and passes a real finish through', () => {
    expect(shortStopError('length')?.message).toMatch(/output token limit/);
    expect(shortStopError('content-filter')?.message).toMatch(/content filter/);
    expect(shortStopError('stop')).toBeNull();
    expect(shortStopError('tool-calls')).toBeNull();
    // A mock/provider that reports nothing must not be read as a failure.
    expect(shortStopError(undefined)).toBeNull();
  });
});
