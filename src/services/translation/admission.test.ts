import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SharedAdmissionController } from './admission';

const tick = async () => {
  for (let i = 0; i < 8; i++) await Promise.resolve();
};
function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((r) => {
    resolve = r;
  });
  return { promise, resolve };
}
beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());
describe('shared actual-request admission', () => {
  it('puts a newly current subtitle ahead of an existing page backlog and promotes in place', async () => {
    const gate = new SharedAdmissionController(1, 1);
    const held = deferred();
    const order: string[] = [];
    const first = gate.run({ providerId: 'p' }, () => held.promise);
    let current = false;
    const page = gate.run({ providerId: 'p', kind: 'page' }, async () => {
      order.push('page');
    });
    const subtitle = gate.run(
      { providerId: 'p', currentKind: () => (current ? 'subtitle-current' : 'subtitle-prefetch') },
      async () => {
        order.push('subtitle');
      }
    );
    current = true;
    gate.notify();
    held.resolve();
    await Promise.all([first, page, subtitle]);
    expect(order).toEqual(['subtitle', 'page']);
  });
  it('cancels a waiter without invoking it or consuming a slot', async () => {
    const gate = new SharedAdmissionController(1, 1);
    const held = deferred();
    const run = vi.fn(async () => {});
    const first = gate.run({ providerId: 'p' }, () => held.promise);
    const abort = new AbortController();
    const cancelled = gate.run({ providerId: 'p', signal: abort.signal }, run).catch((e) => e.name);
    abort.abort();
    expect(await cancelled).toBe('AbortError');
    held.resolve();
    await first;
    await gate.run({ providerId: 'p' }, run);
    expect(run).toHaveBeenCalledOnce();
  });
  it('reserves progress for page calls while prefetch has backlog', async () => {
    const gate = new SharedAdmissionController(2, 2);
    const one = deferred(),
      two = deferred();
    const order: string[] = [];
    const first = gate.run({ providerId: 'p', kind: 'subtitle-prefetch' }, () => one.promise);
    const second = gate.run({ providerId: 'p', kind: 'subtitle-prefetch' }, async () => {
      order.push('prefetch');
      await two.promise;
    });
    const page = gate.run({ providerId: 'p', kind: 'page' }, async () => {
      order.push('page');
    });
    await tick();
    expect(order).toEqual(['page']);
    one.resolve();
    two.resolve();
    await Promise.all([first, second, page]);
    expect(order).toEqual(['page', 'prefetch']);
  });
  it('ages page work ahead of prefetch on a single lane', async () => {
    const gate = new SharedAdmissionController(1, 1);
    const held = deferred();
    const order: string[] = [];
    const first = gate.run({ providerId: 'p' }, () => held.promise);
    const page = gate.run({ providerId: 'p', kind: 'page' }, async () => {
      order.push('page');
    });
    await vi.advanceTimersByTimeAsync(20_000);
    const prefetch = gate.run({ providerId: 'p', kind: 'subtitle-prefetch' }, async () => {
      order.push('prefetch');
    });
    held.resolve();
    await Promise.all([first, page, prefetch]);
    expect(order[0]).toBe('page');
  });
  it('counts each actual call, allows other providers during a 429 cooldown, and bounds waiting', async () => {
    const gate = new SharedAdmissionController(2, 1, 1);
    const held = deferred();
    const first = gate.run({ providerId: 'a' }, () => held.promise);
    const waiting = gate.run({ providerId: 'a' }, async () => 'after');
    await expect(gate.run({ providerId: 'a' }, async () => 'overflow')).rejects.toThrow(/capacity/);
    held.resolve();
    await first;
    await waiting;
    await expect(
      gate.run({ providerId: 'a' }, async () => {
        throw { statusCode: 429 };
      })
    ).rejects.toEqual({ statusCode: 429 });
    const retry = vi.fn(async () => 'retried');
    const next = gate.run({ providerId: 'a' }, retry);
    await expect(gate.run({ providerId: 'b' }, async () => 'independent')).resolves.toBe('independent');
    expect(retry).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2000);
    expect(await next).toBe('retried');
  });
});

it('spaces actual provider starts even when business tasks waited behind another lane', async () => {
  const gate = new SharedAdmissionController(1, 1);
  const held = deferred();
  const first = gate.run({ providerId: 'p' }, () => held.promise);
  const starts: number[] = [];
  const jobs = Array.from({ length: 3 }, () =>
    gate.run(
      { providerId: 'p', kind: 'subtitle-current', rateLimit: { key: 'subtitle:p', intervalMs: 500 } },
      async () => {
        starts.push(Date.now());
      }
    )
  );
  await vi.advanceTimersByTimeAsync(5000);
  held.resolve();
  await tick();
  expect(starts).toHaveLength(1);
  await vi.advanceTimersByTimeAsync(499);
  expect(starts).toHaveLength(1);
  await vi.advanceTimersByTimeAsync(501);
  await Promise.all([first, ...jobs]);
  expect(starts[1] - starts[0]).toBe(500);
  expect(starts[2] - starts[1]).toBe(500);
});

it('gives page work a turn after two prefetch starts even with an old saturated prefetch backlog', async () => {
  const gate = new SharedAdmissionController(1, 1);
  const held = deferred();
  const order: string[] = [];
  const first = gate.run({ providerId: 'p' }, () => held.promise);
  const jobs = Array.from({ length: 6 }, (_, index) =>
    gate.run({ providerId: 'p', kind: 'subtitle-prefetch' }, async () => {
      order.push(`prefetch${index}`);
    })
  );
  await vi.advanceTimersByTimeAsync(100_000);
  const page = gate.run({ providerId: 'p', kind: 'page' }, async () => {
    order.push('page');
  });
  held.resolve();
  await Promise.all([first, page, ...jobs]);
  expect(order.indexOf('page')).toBeLessThanOrEqual(2);
});

it('reserves page progress in multiple lanes even while current subtitle work keeps arriving', async () => {
  const gate = new SharedAdmissionController(2, 2);
  const first = deferred(),
    second = deferred();
  const order: string[] = [];
  const held = [
    gate.run({ providerId: 'p', kind: 'subtitle-current' }, () => first.promise),
    gate.run({ providerId: 'p', kind: 'subtitle-current' }, () => second.promise),
  ];
  const currents = Array.from({ length: 20 }, () =>
    gate.run({ providerId: 'p', kind: 'subtitle-current' }, async () => {
      order.push('current');
    })
  );
  const page = gate.run({ providerId: 'p', kind: 'page' }, async () => {
    order.push('page');
  });
  first.resolve();
  await tick();
  expect(order[0]).toBe('page');
  second.resolve();
  await Promise.all([...held, ...currents, page]);
});

it('reserves business concurrency only on actual admission and releases on error or post-admission cancellation', async () => {
  const gate = new SharedAdmissionController(1, 1);
  const held = deferred();
  const first = gate.run({ providerId: 'page' }, () => held.promise);
  let businessActive = 0;
  const onStart = vi.fn(() => {
    businessActive += 1;
  });
  const onFinish = vi.fn(() => {
    businessActive -= 1;
  });
  const waitingAbort = new AbortController();
  const waiting = gate
    .run({ providerId: 'subtitle', signal: waitingAbort.signal, onStart, onFinish }, async () => {})
    .catch((error) => error.name);
  expect(businessActive).toBe(0);
  waitingAbort.abort();
  expect(await waiting).toBe('AbortError');
  expect(onStart).not.toHaveBeenCalled();
  expect(onFinish).not.toHaveBeenCalled();
  held.resolve();
  await first;
  await expect(
    gate.run({ providerId: 'subtitle', onStart, onFinish }, () => {
      throw new Error('synchronous execution error');
    })
  ).rejects.toThrow('synchronous execution error');
  expect(businessActive).toBe(0);
  const abort = new AbortController();
  const invoke = vi.fn(async () => {});
  await expect(
    gate.run(
      {
        providerId: 'subtitle',
        signal: abort.signal,
        onStart: () => {
          onStart();
          abort.abort();
        },
        onFinish,
      },
      invoke
    )
  ).rejects.toMatchObject({ name: 'AbortError' });
  expect(invoke).not.toHaveBeenCalled();
  expect(onStart).toHaveBeenCalledTimes(2);
  expect(onFinish).toHaveBeenCalledTimes(2);
  expect(businessActive).toBe(0);
  expect(gate.activeCount).toBe(0);
  expect(gate.pendingCount).toBe(0);
});
