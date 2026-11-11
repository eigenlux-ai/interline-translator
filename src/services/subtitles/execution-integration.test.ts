import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { sharedAdmission } from '@/services/translation/admission';
import { makeTestConfig } from '@/test-utils/config';
import { clearSubtitleCache } from './cache';
import { SubtitleRequestManager } from './manager';
import type { SubtitleTranslationEvent, SubtitleWindow } from './protocol';

const mocks = vi.hoisted(() => ({ stream: vi.fn(), model: vi.fn() }));
vi.mock('ai', () => ({ streamText: mocks.stream }));
vi.mock('@/services/translation/provider/llm', () => ({ createLlmModel: mocks.model }));

const window: SubtitleWindow = {
  generation: 1,
  trackVersion: 'track',
  sourceLanguage: 'en',
  title: 'stable title',
  subscriptions: [
    {
      subscriptionId: 'one',
      cueId: 'one',
      contentVersion: 'one-v1',
      text: 'Hello',
      context: 'first context',
      priority: 'current',
    },
    {
      subscriptionId: 'two',
      cueId: 'two',
      contentVersion: 'two-v1',
      text: 'World',
      context: 'second context',
      priority: 'prefetch',
    },
  ],
};
function setup() {
  const config = makeTestConfig();
  config.providers[0] = { ...config.providers[0], kind: 'openai', apiKeys: ['fake-key'], model: 'mock' };
  config.prompt.styles = [{ id: 'spoken', name: 'Spoken', directives: 'Use conversational register.' }];
  config.prompt.activeStyleId = 'spoken';
  config.videoSubtitles.requests.requestsPerSecond = 10;
  const events: SubtitleTranslationEvent[] = [];
  const manager = new SubtitleRequestManager({
    prepare: async () => ({ config, provider: config.providers[0], target: 'zh-CN' }),
  });
  manager.open('session', '1:document:www.youtube.com', (event) => events.push(event));
  return { manager, events, config };
}
beforeEach(async () => {
  await clearSubtitleCache();
  mocks.stream.mockReset();
  mocks.model.mockReset().mockResolvedValue({});
  mocks.stream.mockImplementation((options) => {
    expect(options.system).toContain('Use conversational register.');
    const salt = options.prompt.match(/\[\[([a-f0-9]+)#1\]\]/)[1];
    return {
      finishReason: Promise.resolve('stop'),
      textStream: (async function* () {
        yield `[[${salt}#1]]你好[[${salt}#2]]世界`;
      })(),
    };
  });
});
afterEach(() => clearSubtitleCache());
describe('subtitle manager to actual provider execution', () => {
  it('batches independent cue identities, emits complete results, and serves the persistent subtitle cache', async () => {
    const first = setup();
    await first.manager.updateWindow('session', window);
    await vi.waitFor(() => expect(first.events.filter((e) => e.type === 'completed')).toHaveLength(2));
    expect(mocks.stream).toHaveBeenCalledOnce();
    expect(first.events.map((e) => [e.subscriptionId, e.contentVersion, e.text])).toEqual([
      ['one', 'one-v1', '你好'],
      ['two', 'two-v1', '世界'],
    ]);
    first.manager.close('session');
    const second = setup();
    await second.manager.updateWindow('session', { ...window, generation: 9 });
    await vi.waitFor(() => expect(second.events.filter((e) => e.type === 'completed')).toHaveLength(2));
    expect(mocks.stream).toHaveBeenCalledOnce();
    expect(second.events.every((e) => e.generation === 9)).toBe(true);
    second.manager.close('session');
    expect(sharedAdmission.activeCount).toBe(0);
  });
  it('puts the actual current subtitle provider call ahead of an already waiting ordinary page call without nested slots', async () => {
    const releases: (() => void)[] = [];
    const order: string[] = [];
    const held = Array.from({ length: 6 }, () =>
      sharedAdmission.run(
        { providerId: 'google-free', kind: 'page' },
        () => new Promise<void>((resolve) => releases.push(resolve))
      )
    );
    await vi.waitFor(() => expect(releases).toHaveLength(6));
    const page = sharedAdmission.run({ providerId: 'google-free', kind: 'page' }, async () => {
      order.push('page');
    });
    const original = mocks.stream.getMockImplementation()!;
    mocks.stream.mockImplementation((options) => {
      order.push('subtitle');
      expect(sharedAdmission.activeCount).toBe(6);
      return original(options);
    });
    const h = setup();
    await h.manager.updateWindow('session', window);
    await vi.waitFor(() => expect(sharedAdmission.pendingCount).toBe(2));
    releases[0]();
    await vi.waitFor(() => expect(h.events.filter((e) => e.type === 'completed')).toHaveLength(2));
    expect(order[0]).toBe('subtitle');
    releases.slice(1).forEach((resolve) => resolve());
    await Promise.all([...held, page]);
    h.manager.close('session');
    expect(sharedAdmission.activeCount).toBe(0);
    expect(sharedAdmission.pendingCount).toBe(0);
  });
});

it('delivers and caches a closed cue before the stream ends, then retries only the truncated remaining cue', async () => {
  let endFirst!: () => void;
  const release = new Promise<void>((resolve) => {
    endFirst = resolve;
  });
  let count = 0;
  mocks.stream.mockImplementation((options) => {
    expect(options.system).toContain('Use conversational register.');
    const salt = options.prompt.match(/\[\[([a-f0-9]+)#1\]\]/)[1];
    count++;
    if (count === 1)
      return {
        finishReason: Promise.resolve('length'),
        textStream: (async function* () {
          yield `[[${salt}#1]]你好[[${salt}#2]]unfinished`;
          await release;
        })(),
      };
    expect(options.prompt).not.toContain('Hello');
    expect(options.prompt).toContain('World');
    return {
      finishReason: Promise.resolve('stop'),
      textStream: (async function* () {
        yield `[[${salt}#1]]世界`;
      })(),
    };
  });
  const h = setup();
  await h.manager.updateWindow('session', window);
  await vi.waitFor(() => expect(h.events).toHaveLength(1));
  expect(h.events[0]).toMatchObject({ type: 'completed', subscriptionId: 'one', text: '你好' });
  expect(sharedAdmission.activeCount).toBe(1);
  expect(h.manager.size).toBe(1);
  endFirst();
  await vi.waitFor(() => expect(h.events).toHaveLength(2), { timeout: 2000 });
  expect(h.events[1]).toMatchObject({ type: 'completed', subscriptionId: 'two', text: '世界' });
  expect(mocks.stream).toHaveBeenCalledTimes(2);
  h.manager.close('session');
});

it('uses refreshed credentials for a batch waiting at actual admission even after its first cue leaves', async () => {
  const releases: (() => void)[] = [];
  const pages = Array.from({ length: 6 }, () =>
    sharedAdmission.run(
      { providerId: 'held', kind: 'page' },
      () => new Promise<void>((resolve) => releases.push(resolve))
    )
  );
  await vi.waitFor(() => expect(releases).toHaveLength(6));
  const h = setup();
  await h.manager.updateWindow('session', window);
  await vi.waitFor(() => expect(sharedAdmission.pendingCount).toBe(1));
  expect(mocks.model).not.toHaveBeenCalled();
  const surviving = { ...window, subscriptions: [window.subscriptions[1]] };
  await h.manager.updateWindow('session', surviving);
  h.config.providers[0] = { ...h.config.providers[0], apiKeys: ['replacement-key'] };
  h.config.videoSubtitles.requests.maxConcurrent = 1;
  await h.manager.updateWindow('session', surviving);
  releases[0]();
  await vi.waitFor(() =>
    expect(h.events.some((event) => event.type === 'completed' && event.subscriptionId === 'two')).toBe(true)
  );
  expect(mocks.model).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({ apiKeys: ['replacement-key'] }),
    'replacement-key'
  );
  expect(h.events.some((event) => event.type === 'completed' && event.subscriptionId === 'one')).toBe(false);
  releases.forEach((release) => release());
  await Promise.all(pages);
  h.manager.close('session');
  expect(sharedAdmission.activeCount).toBe(0);
  expect(sharedAdmission.pendingCount).toBe(0);
});
