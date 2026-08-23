import { describe, expect, it, vi } from 'vitest';
import { RequestQueue } from './request-queue';

const tick = () => new Promise((r) => setTimeout(r, 0));

describe('RequestQueue', () => {
  it('dedups identical in-flight keys to a single run', async () => {
    const q = new RequestQueue();
    const run = vi.fn(async () => {
      await tick();
      return 42;
    });
    const [a, b] = await Promise.all([q.enqueue('k', run), q.enqueue('k', run)]);
    expect(a).toBe(42);
    expect(b).toBe(42);
    expect(run).toHaveBeenCalledOnce();
  });

  it('re-runs a key once it has settled (dedup is for concurrency, not memoization)', async () => {
    const q = new RequestQueue();
    const run = vi.fn(async () => 'x');
    await q.enqueue('k', run);
    await q.enqueue('k', run);
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('respects the concurrency cap', async () => {
    const q = new RequestQueue({ maxConcurrent: 2 });
    let active = 0;
    let peak = 0;
    const make = (k: string) =>
      q.enqueue(k, async () => {
        active++;
        peak = Math.max(peak, active);
        await tick();
        active--;
        return k;
      });
    await Promise.all(['a', 'b', 'c', 'd', 'e'].map(make));
    expect(peak).toBeLessThanOrEqual(2);
  });

  it('retries with backoff then succeeds', async () => {
    vi.useFakeTimers();
    const q = new RequestQueue({ maxRetries: 2, baseBackoffMs: 100 });
    let n = 0;
    const run = vi.fn(async () => {
      if (++n < 3) throw new Error('transient');
      return 'ok';
    });
    const p = q.enqueue('k', run);
    await vi.runAllTimersAsync();
    expect(await p).toBe('ok');
    expect(run).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });

  it('rejects after exhausting retries', async () => {
    vi.useFakeTimers();
    const q = new RequestQueue({ maxRetries: 1, baseBackoffMs: 10 });
    const run = vi.fn(async () => {
      throw new Error('boom');
    });
    const p = q.enqueue('k', run);
    const assertion = expect(p).rejects.toThrow('boom');
    await vi.runAllTimersAsync();
    await assertion;
    expect(run).toHaveBeenCalledTimes(2); // initial + 1 retry
    vi.useRealTimers();
  });

  it('does NOT retry a permanent failure (401 invalid key) — fails fast', async () => {
    const q = new RequestQueue({ maxRetries: 2, baseBackoffMs: 10 });
    const run = vi.fn(async () => {
      throw Object.assign(new Error('Unauthorized'), { statusCode: 401 });
    });
    await expect(q.enqueue('k', run)).rejects.toThrow('Unauthorized');
    expect(run).toHaveBeenCalledOnce(); // no backoff ladder for a doomed call
  });

  it('still retries transient failures (429, 5xx) and honors an explicit isRetryable', async () => {
    vi.useFakeTimers();
    const q = new RequestQueue({ maxRetries: 2, baseBackoffMs: 10 });
    let n = 0;
    const run = vi.fn(async () => {
      n++;
      if (n === 1) throw Object.assign(new Error('rate limited'), { statusCode: 429 });
      if (n === 2) throw Object.assign(new Error('server'), { statusCode: 503 });
      return 'ok';
    });
    const p = q.enqueue('k', run);
    await vi.runAllTimersAsync();
    expect(await p).toBe('ok');
    expect(run).toHaveBeenCalledTimes(3);
    vi.useRealTimers();

    // ai-sdk's APICallError carries an explicit flag — it wins over the status.
    const q2 = new RequestQueue({ maxRetries: 2, baseBackoffMs: 10 });
    const flagged = vi.fn(async () => {
      throw Object.assign(new Error('says stop'), { statusCode: 500, isRetryable: false });
    });
    await expect(q2.enqueue('k', flagged)).rejects.toThrow('says stop');
    expect(flagged).toHaveBeenCalledOnce();
  });

  it('runs higher priority first when tasks queue behind a busy slot', async () => {
    const order: string[] = [];
    const q = new RequestQueue({ maxConcurrent: 1 });
    let release!: () => void;
    const gate = new Promise<void>((r) => {
      release = r;
    });
    const p0 = q.enqueue('block', async () => {
      await gate;
      order.push('block');
    });
    const p1 = q.enqueue('low', async () => void order.push('low'), 1);
    const p2 = q.enqueue('high', async () => void order.push('high'), 5);
    release();
    await Promise.all([p0, p1, p2]);
    expect(order).toEqual(['block', 'high', 'low']);
  });
});
