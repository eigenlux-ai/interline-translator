import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Config } from '@/data/models';
import { sharedAdmission, SharedAdmissionController } from '@/services/translation/admission';
import { makeTestConfig } from '@/test-utils/config';
import type { SubtitleExecution } from './execute';
import { SubtitleRequestManager } from './manager';
import type { SubtitleSubscription, SubtitleTranslationEvent, SubtitleWindow } from './protocol';

const cue = (id: string, priority: 'current' | 'prefetch' = 'prefetch'): SubtitleSubscription => ({
  subscriptionId: id,
  cueId: id,
  contentVersion: 'v1',
  text: id,
  context: 'stable',
  priority,
});
const windowOf = (subscriptions: SubtitleSubscription[], generation = 1): SubtitleWindow => ({
  generation,
  trackVersion: 'track',
  sourceLanguage: 'en',
  subscriptions,
});
let admission: SharedAdmissionController;
const settle = () => vi.advanceTimersByTimeAsync(0);
function harness(kind = 'google-mt', patch: Partial<Config['videoSubtitles']['requests']> = {}) {
  const config = makeTestConfig();
  config.videoSubtitles.requests = { ...config.videoSubtitles.requests, ...patch };
  config.providers[0].kind = kind as Config['providers'][number]['kind'];
  const calls: {
    input: SubtitleExecution;
    resolve: (value: Map<string, string>) => void;
    reject: (error: unknown) => void;
  }[] = [];
  const execute = vi.fn((input: SubtitleExecution) =>
    admission.run(
      { ...input.admission, providerId: input.provider.id, signal: input.signal },
      () =>
        new Promise<Map<string, string>>((resolve, reject) => {
          calls.push({ input, resolve, reject });
        })
    )
  );
  const writes = vi.fn(async () => {});
  const manager = new SubtitleRequestManager({
    prepare: async () => ({ config, provider: config.providers[0], target: 'zh-CN' }),
    key: async (_config, _provider, _target, _window, item) => item.text,
    cacheGet: async () => undefined,
    cacheWrite: writes,
    execute,
  });
  const events: SubtitleTranslationEvent[] = [];
  manager.open('one', '1:document', (e) => events.push(e));
  return { manager, calls, events, writes, execute, config };
}
beforeEach(() => {
  vi.useFakeTimers();
  admission = new SharedAdmissionController();
  vi.spyOn(sharedAdmission, 'notify').mockImplementation(() => admission.notify());
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});
describe('independent subtitle request manager', () => {
  it('deduplicates across sessions; closing one subscriber keeps the shared call alive', async () => {
    const h = harness();
    const other: SubtitleTranslationEvent[] = [];
    h.manager.open('two', '2:document', (e) => other.push(e));
    await h.manager.updateWindow('one', windowOf([cue('same', 'current')]));
    await settle();
    await h.manager.updateWindow('two', windowOf([cue('same', 'current')]));
    await settle();
    expect(h.calls).toHaveLength(1);
    h.manager.close('one');
    expect(h.calls[0].input.signal.aborted).toBe(false);
    h.calls[0].resolve(new Map([['same', 'translated']]));
    await settle();
    expect(h.events.map((e) => e.type)).toEqual(['cancelled']);
    expect(other.map((e) => e.type)).toEqual(['completed']);
    expect(h.manager.size).toBe(0);
  });
  it('removes one batch consumer without cancelling others and rejects late results after seek', async () => {
    const h = harness('openai');
    await h.manager.updateWindow('one', windowOf([cue('old'), cue('kept', 'current')]));
    await settle();
    expect(h.calls).toHaveLength(1);
    expect(h.calls[0].input.items).toHaveLength(2);
    await h.manager.updateWindow('one', windowOf([cue('kept', 'current')], 1));
    await settle();
    expect(h.calls[0].input.signal.aborted).toBe(false);
    h.calls[0].resolve(
      new Map([
        ['old', 'late'],
        ['kept', 'valid'],
      ])
    );
    await settle();
    expect(h.events.map((e) => [e.subscriptionId, e.type])).toEqual([
      ['old', 'invalidated'],
      ['kept', 'completed'],
    ]);
    expect(h.writes).toHaveBeenCalledTimes(2); // late semantic result may cache, never display
  });
  it('aborts the whole call only when its final consumer leaves; cancel is never completion', async () => {
    const h = harness('openai');
    await h.manager.updateWindow('one', windowOf([cue('a'), cue('b')]));
    await settle();
    h.manager.close('one');
    expect(h.calls[0].input.signal.aborted).toBe(true);
    h.calls[0].resolve(
      new Map([
        ['a', 'late'],
        ['b', 'late'],
      ])
    );
    await settle();
    expect(h.events.map((e) => e.type)).toEqual(['cancelled', 'cancelled']);
    expect(h.writes).not.toHaveBeenCalled();
  });
  it('separates actual request rate from concurrency and prioritizes current cues', async () => {
    const h = harness('google-mt', { maxConcurrent: 3, requestsPerSecond: 2 });
    await h.manager.updateWindow(
      'one',
      windowOf([cue('prefetch1'), cue('prefetch2'), cue('now', 'current'), cue('next', 'current')])
    );
    await settle();
    expect(h.calls[0].input.items[0].text).toBe('now');
    await vi.advanceTimersByTimeAsync(499);
    expect(h.calls).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(h.calls).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(500);
    expect(h.calls).toHaveLength(3);
    await vi.advanceTimersByTimeAsync(1000);
    expect(h.calls).toHaveLength(3);
    for (const call of [...h.calls]) call.resolve(new Map(call.input.items.map((i) => [i.key, 'ok'])));
    await settle();
    expect(h.calls).toHaveLength(4);
    h.calls[3].resolve(new Map([['prefetch2', 'ok']]));
    await settle();
    h.manager.close('one');
  });
  it('retries only missing batch items with bounded backoff, not already successful cues', async () => {
    const h = harness('openai');
    await h.manager.updateWindow('one', windowOf([cue('good'), cue('missing')]));
    await settle();
    h.calls[0].resolve(new Map([['good', 'done']]));
    await settle();
    expect(h.events.map((e) => e.subscriptionId)).toEqual(['good']);
    await vi.advanceTimersByTimeAsync(800);
    expect(h.calls).toHaveLength(2);
    expect(h.calls[1].input.items.map((i) => i.key)).toEqual(['missing']);
    h.calls[1].reject({ statusCode: 401 });
    await settle();
    expect(h.events.map((e) => e.type)).toEqual(['completed', 'failed']);
    expect(h.manager.size).toBe(0);
    h.manager.close('one');
  });
  it('does not resurrect a window whose asynchronous config preparation completed after close', async () => {
    let ready!: () => void;
    const events: SubtitleTranslationEvent[] = [];
    const config = makeTestConfig();
    const manager = new SubtitleRequestManager({
      prepare: async () => {
        await new Promise<void>((r) => {
          ready = r;
        });
        return { config, provider: config.providers[0], target: 'en' };
      },
    });
    manager.open('one', 'owner', (event) => events.push(event));
    const update = manager.updateWindow('one', windowOf([cue('old')]));
    manager.close('one');
    ready();
    await update;
    expect(manager.size).toBe(0);
    expect(events).toEqual([]);
  });
});

it('applies a reduced concurrency budget without aborting active requests or clearing results', async () => {
  const h = harness('google-mt', { maxConcurrent: 3, requestsPerSecond: 10 });
  const window = windowOf([
    cue('one', 'current'),
    cue('two', 'current'),
    cue('three', 'current'),
    cue('four', 'current'),
  ]);
  await h.manager.updateWindow('one', window);
  await vi.advanceTimersByTimeAsync(1000);
  expect(h.calls).toHaveLength(3);
  h.config.videoSubtitles.requests.maxConcurrent = 1;
  await h.manager.updateWindow('one', window);
  await settle();
  expect(h.calls.every((call) => !call.input.signal.aborted)).toBe(true);
  h.calls[0].resolve(new Map([['one', 'one-result']]));
  await settle();
  expect(h.calls).toHaveLength(3);
  h.calls[1].resolve(new Map([['two', 'two-result']]));
  await settle();
  expect(h.calls).toHaveLength(3);
  h.calls[2].resolve(new Map([['three', 'three-result']]));
  await settle();
  expect(h.calls).toHaveLength(4);
  h.calls[3].resolve(new Map([['four', 'four-result']]));
  await settle();
  expect(h.events.filter((e) => e.type === 'completed')).toHaveLength(4);
  h.manager.close('one');
});

it('invalidates changed-language subscriptions without cancelling another session sharing the old provider call', async () => {
  const config = makeTestConfig();
  config.videoSubtitles.requests.requestsPerSecond = 10;
  let target = 'zh-CN';
  const events: SubtitleTranslationEvent[] = [],
    other: SubtitleTranslationEvent[] = [];
  const calls: { input: SubtitleExecution; resolve: (value: Map<string, string>) => void }[] = [];
  const manager = new SubtitleRequestManager({
    prepare: async (_window, owner) => ({
      config,
      provider: config.providers[0],
      target: owner === 'one' ? target : 'zh-CN',
    }),
    key: async (_config, _provider, target, _window, cue) => `${target}:${cue.text}`,
    cacheGet: async () => undefined,
    cacheWrite: async () => {},
    execute: (input) =>
      new Promise((resolve) => {
        calls.push({ input, resolve });
      }),
  });
  manager.open('one', 'one', (event) => events.push(event));
  manager.open('two', 'two', (event) => other.push(event));
  const window = windowOf([cue('same', 'current')]);
  await manager.updateWindow('one', window);
  await settle();
  await manager.updateWindow('two', window);
  target = 'ja';
  await manager.updateWindow('one', window);
  await vi.advanceTimersByTimeAsync(100);
  expect(calls[0].input.signal.aborted).toBe(false);
  expect(calls).toHaveLength(2);
  calls[0].resolve(new Map([['zh-CN:same', 'old language']]));
  calls[1].resolve(new Map([['ja:same', 'new language']]));
  await settle();
  expect(events.map((event) => [event.type, event.text])).toEqual([
    ['invalidated', undefined],
    ['completed', 'new language'],
  ]);
  expect(other.map((event) => [event.type, event.text])).toEqual([['completed', 'old language']]);
  manager.close('one');
  manager.close('two');
});

it.each([1, 2])('admits a new current cue ahead of waiting prefetch with concurrency %i', async (maxConcurrent) => {
  const h = harness('google-mt', { maxConcurrent, requestsPerSecond: 10 });
  const releases: (() => void)[] = [];
  const pages = Array.from({ length: 6 }, () =>
    admission.run(
      { providerId: 'page-provider', kind: 'page' },
      () => new Promise<void>((resolve) => releases.push(resolve))
    )
  );
  await settle();
  const upcoming = [cue('future-one'), cue('future-two')];
  await h.manager.updateWindow('one', windowOf(upcoming));
  await settle();
  expect(admission.pendingCount).toBe(2);
  await h.manager.updateWindow('one', windowOf([...upcoming, cue('now', 'current')]));
  await settle();
  expect(admission.pendingCount).toBe(3);
  expect(h.calls).toHaveLength(0);
  releases[0]();
  await settle();
  expect(h.calls.map((call) => call.input.items[0].key)).toEqual(['now']);
  // A blocked subtitle budget does not reserve otherwise available global/provider capacity.
  releases[1]();
  await expect(
    admission.run({ providerId: 'independent-provider', kind: 'page' }, async () => 'independent')
  ).resolves.toBe('independent');
  await vi.advanceTimersByTimeAsync(99);
  expect(h.calls).toHaveLength(1);
  if (maxConcurrent === 1) {
    await vi.advanceTimersByTimeAsync(1);
    expect(h.calls).toHaveLength(1);
    h.calls[0].resolve(new Map([['now', 'translated']]));
    await settle();
  } else await vi.advanceTimersByTimeAsync(1);
  expect(h.calls[1].input.items[0].key).toBe('future-one');
  h.manager.close('one');
  h.calls.forEach((call) => call.resolve(new Map(call.input.items.map((item) => [item.key, 'done']))));
  releases.forEach((release) => release());
  await Promise.all(pages);
  await settle();
  expect(admission.pendingCount).toBe(0);
  expect(admission.activeCount).toBe(0);
});

it('charges rate only at actual starts after a long admission wait, and cache hits charge nothing', async () => {
  const h = harness('google-mt', { maxConcurrent: 3, requestsPerSecond: 2 });
  const releases: (() => void)[] = [];
  const pages = Array.from({ length: 6 }, () =>
    admission.run({ providerId: 'page', kind: 'page' }, () => new Promise<void>((resolve) => releases.push(resolve)))
  );
  await settle();
  await h.manager.updateWindow('one', windowOf([cue('first', 'current'), cue('second', 'current')]));
  await vi.advanceTimersByTimeAsync(5000);
  expect(h.calls).toHaveLength(0);
  releases.forEach((release) => release());
  await Promise.all(pages);
  await settle();
  expect(h.calls).toHaveLength(1);
  await vi.advanceTimersByTimeAsync(499);
  expect(h.calls).toHaveLength(1);
  await vi.advanceTimersByTimeAsync(1);
  expect(h.calls).toHaveLength(2);
  h.manager.close('one');
  h.calls.forEach((call) => call.resolve(new Map()));
  await settle();

  const config = makeTestConfig();
  const starts: number[] = [];
  const manager = new SubtitleRequestManager({
    prepare: async () => ({ config, provider: config.providers[0], target: 'zh-CN' }),
    key: async (_config, _provider, _target, _window, item) => item.text,
    cacheGet: async (key) => (key === 'cached' ? 'cached-result' : undefined),
    cacheWrite: async () => {},
    execute: (input) =>
      admission.run({ ...input.admission, providerId: input.provider.id, signal: input.signal }, async () => {
        starts.push(Date.now());
        return new Map(input.items.map((item) => [item.key, 'translated']));
      }),
  });
  // Use a fresh provider connection so earlier calls do not affect its rate clock.
  config.providers[0] = { ...config.providers[0], id: 'cache-rate-provider' };
  manager.open('cache', 'owner', () => {});
  const at = Date.now();
  await manager.updateWindow('cache', windowOf([cue('cached', 'current'), cue('miss', 'current')]));
  await settle();
  expect(starts).toEqual([at]);
  expect(admission.activeCount).toBe(0);
  manager.close('cache');
});

it('preserves a shared waiting cue until its last session leaves without consuming a provider slot', async () => {
  const h = harness('google-mt', { maxConcurrent: 1, requestsPerSecond: 10 });
  const releases: (() => void)[] = [];
  const pages = Array.from({ length: 6 }, () =>
    admission.run({ providerId: 'page', kind: 'page' }, () => new Promise<void>((resolve) => releases.push(resolve)))
  );
  await settle();
  h.manager.open('two', '2:document', () => {});
  const window = windowOf([cue('shared', 'current')]);
  await h.manager.updateWindow('one', window);
  await settle();
  await h.manager.updateWindow('two', window);
  await settle();
  expect(admission.pendingCount).toBe(1);
  h.manager.close('one');
  await settle();
  expect(admission.pendingCount).toBe(1);
  h.manager.close('two');
  await settle();
  expect(admission.pendingCount).toBe(0);
  expect(h.calls).toHaveLength(0);
  releases.forEach((release) => release());
  await Promise.all(pages);
  expect(admission.activeCount).toBe(0);
});

it('refreshes credentials on a queued stable-key task before its actual start', async () => {
  let config = makeTestConfig();
  config.videoSubtitles.requests.maxConcurrent = 1;
  config.videoSubtitles.requests.requestsPerSecond = 10;
  config.providers[0] = { ...config.providers[0], apiKeys: ['old'] };
  const calls: { key: string; resolve: (result: Map<string, string>) => void }[] = [];
  const credentials: string[] = [];
  const manager = new SubtitleRequestManager({
    prepare: async () => ({ config, provider: config.providers[0], target: 'zh-CN' }),
    key: async (_config, _provider, _target, _window, item) => item.text,
    cacheGet: async () => undefined,
    cacheWrite: async () => {},
    execute: (input) =>
      admission.run(
        { ...input.admission, providerId: input.provider.id, signal: input.signal },
        () =>
          new Promise((resolve) => {
            credentials.push(input.provider.apiKeys?.[0] ?? '');
            calls.push({ key: input.items[0].key, resolve });
          })
      ),
  });
  manager.open('one', 'owner', () => {});
  const window = windowOf([cue('first', 'current'), cue('second', 'current')]);
  await manager.updateWindow('one', window);
  await settle();
  config = { ...config, providers: [{ ...config.providers[0], apiKeys: ['updated'] }] };
  await manager.updateWindow('one', window);
  await vi.advanceTimersByTimeAsync(100);
  calls[0].resolve(new Map([['first', 'done']]));
  await settle();
  expect(credentials).toEqual(['old', 'updated']);
  calls[1].resolve(new Map([['second', 'done']]));
  await settle();
  manager.close('one');
  expect(admission.activeCount).toBe(0);
});

describe('configuration preparation admission guard', () => {
  function preparingHarness() {
    const config = makeTestConfig();
    const prepared = { config, provider: config.providers[0], target: 'zh-CN' };
    let prepare = async (_window: SubtitleWindow, _owner: string) => prepared;
    let key = async (item: SubtitleSubscription) => item.text;
    const starts: string[] = [];
    const events: SubtitleTranslationEvent[] = [];
    const manager = new SubtitleRequestManager({
      prepare: (window, owner) => prepare(window, owner),
      key: (_config, _provider, _target, _window, cue) => key(cue),
      cacheGet: async () => undefined,
      cacheWrite: async () => {},
      execute: (input) =>
        admission.run({ ...input.admission, providerId: input.provider.id, signal: input.signal }, async () => {
          starts.push(input.target);
          return new Map(input.items.map((item) => [item.key, 'translated']));
        }),
    });
    manager.open('one', 'one', (event) => events.push(event));
    return {
      manager,
      prepared,
      starts,
      events,
      setPrepare: (next: typeof prepare) => {
        prepare = next;
      },
      setKey: (next: typeof key) => {
        key = next;
      },
    };
  }
  async function blockCapacity() {
    const releases: (() => void)[] = [];
    const held = Array.from({ length: 6 }, () =>
      admission.run({ providerId: 'page', kind: 'page' }, () => new Promise<void>((resolve) => releases.push(resolve)))
    );
    await settle();
    return async () => {
      releases.forEach((release) => release());
      await Promise.all(held);
      await settle();
    };
  }

  it('does not start retained work while provider-disable preparation is pending', async () => {
    const release = await blockCapacity();
    const h = preparingHarness();
    const window = windowOf([cue('waiting', 'current')]);
    await h.manager.updateWindow('one', window);
    await settle();
    let reject!: (error: Error) => void;
    h.setPrepare(
      () =>
        new Promise((_resolve, fail) => {
          reject = fail;
        })
    );
    const update = h.manager.updateWindow('one', window);
    await release();
    expect(h.starts).toEqual([]);
    reject(new Error('Provider disabled'));
    await update;
    await settle();
    expect(h.starts).toEqual([]);
    expect(h.events.some((event) => event.type === 'failed' && event.error?.code === 'provider-unavailable')).toBe(
      true
    );
    expect(admission.pendingCount).toBe(0);
    h.manager.close('one');
  });

  it('keeps the guard through async key validation and detaches old work when hashing fails', async () => {
    const release = await blockCapacity();
    const h = preparingHarness();
    const window = windowOf([cue('waiting', 'current')]);
    await h.manager.updateWindow('one', window);
    await settle();
    let reject!: (error: Error) => void;
    h.setKey(
      () =>
        new Promise((_resolve, fail) => {
          reject = fail;
        })
    );
    const update = h.manager.updateWindow('one', window);
    await settle();
    await release();
    expect(h.starts).toEqual([]);
    const rejection = expect(update).rejects.toThrow('key failed');
    reject(new Error('key failed'));
    await rejection;
    await settle();
    expect(h.starts).toEqual([]);
    expect(h.manager.size).toBe(0);
    expect(admission.pendingCount).toBe(0);
    h.manager.close('one');
  });

  it('only releases the latest revision after overlapping preparations complete', async () => {
    const release = await blockCapacity();
    const h = preparingHarness();
    const window = windowOf([cue('waiting', 'current')]);
    await h.manager.updateWindow('one', window);
    await settle();
    const resolutions: ((value: typeof h.prepared) => void)[] = [];
    h.setPrepare(() => new Promise((resolve) => resolutions.push(resolve)));
    const older = h.manager.updateWindow('one', window);
    const latest = h.manager.updateWindow('one', window);
    await release();
    resolutions[0](h.prepared);
    await older;
    await settle();
    expect(h.starts).toEqual([]);
    resolutions[1](h.prepared);
    await latest;
    await settle();
    expect(h.starts).toEqual(['zh-CN']);
    expect(admission.activeCount).toBe(0);
    h.manager.close('one');
  });

  it.each(['failure', 'close'])('unblocks another shared consumer after a preparing session %s', async (mode) => {
    const release = await blockCapacity();
    const h = preparingHarness();
    const window = windowOf([cue('shared', 'current')]);
    h.manager.open('two', 'two', () => {});
    await h.manager.updateWindow('one', window);
    await h.manager.updateWindow('two', window);
    await settle();
    let reject!: (error: Error) => void;
    h.setPrepare((_window, owner) =>
      owner === 'one'
        ? new Promise((_resolve, fail) => {
            reject = fail;
          })
        : Promise.resolve(h.prepared)
    );
    const updating = h.manager.updateWindow('one', window);
    await release();
    expect(h.starts).toEqual([]);
    if (mode === 'close') h.manager.close('one');
    else reject(new Error('Provider unavailable for one session'));
    await settle();
    expect(h.starts).toEqual(['zh-CN']);
    expect(h.events.some((event) => event.type === 'completed')).toBe(false);
    if (mode === 'close') reject(new Error('closed'));
    await updating;
    h.manager.close('one');
    h.manager.close('two');
    expect(admission.pendingCount).toBe(0);
    expect(admission.activeCount).toBe(0);
  });

  it('marks every session before refresh can admit another session whose rate window just expired', async () => {
    const h = preparingHarness();
    await h.manager.updateWindow('one', windowOf([cue('prime', 'current')]));
    await settle();
    expect(h.starts).toEqual(['zh-CN']);
    h.manager.open('two', 'two', () => {});
    await h.manager.updateWindow('one', windowOf([cue('first-waiting', 'current')]));
    await h.manager.updateWindow('two', windowOf([cue('second-waiting', 'current')]));
    await settle();
    expect(admission.pendingCount).toBe(2);
    const rejectPreparations: ((error: Error) => void)[] = [];
    h.setPrepare(() => new Promise((_resolve, reject) => rejectPreparations.push(reject)));
    // Let the wall clock cross the rate deadline without firing its timer first.
    // refresh's first admission notification must already see both guards.
    vi.setSystemTime(Date.now() + 1000);
    h.manager.refresh();
    await settle();
    expect(rejectPreparations).toHaveLength(2);
    expect(h.starts).toEqual(['zh-CN']);
    rejectPreparations.forEach((reject) => reject(new Error('Provider disabled')));
    await settle();
    expect(h.starts).toEqual(['zh-CN']);
    expect(admission.pendingCount).toBe(0);
    expect(admission.activeCount).toBe(0);
    h.manager.close('one');
    h.manager.close('two');
  });
});
