import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sharedAdmission } from '@/services/translation/admission';
import { makeTestConfig } from '@/test-utils/config';
import { executeSubtitleBatch, type SubtitleExecution } from './execute';

const mocks = vi.hoisted(() => ({ stream: vi.fn(), mt: vi.fn() }));
vi.mock('ai', () => ({ streamText: mocks.stream }));
vi.mock('@/services/translation/provider/mt', () => ({ googleFreeTranslate: mocks.mt }));
vi.mock('@/services/translation/provider/llm', () => ({ createLlmModel: async () => ({}) }));

const input = (kind = 'openai'): SubtitleExecution => {
  const config = makeTestConfig();
  config.providers[0] = {
    ...config.providers[0],
    kind: kind as (typeof config.providers)[0]['kind'],
    apiKeys: ['secret'],
  };
  return {
    config,
    provider: config.providers[0],
    source: 'en',
    target: 'zh-CN',
    signal: new AbortController().signal,
    admission: { kind: 'subtitle-current' },
    items: [
      { key: 'one', text: 'Hello', context: 'explicit first' },
      { key: 'two', text: 'World', context: 'explicit second' },
    ],
  };
};
beforeEach(() => {
  mocks.stream.mockReset();
  mocks.mt.mockReset();
});
describe('subtitle actual execution', () => {
  it('uses the existing marker parser, keeps explicit per-cue context, and returns only completed outputs', async () => {
    mocks.stream.mockImplementation((options) => {
      const salt = options.prompt.match(/\[\[([a-f0-9]+)#1\]\]/)[1];
      expect(options.maxRetries).toBe(0);
      expect(options.system).toContain('explicit first');
      expect(options.system).toContain('explicit second');
      return {
        finishReason: Promise.resolve('stop'),
        textStream: (async function* () {
          yield `[[${salt}#1]]你好`;
        })(),
      };
    });
    expect(await executeSubtitleBatch(input())).toEqual(new Map([['one', '你好']]));
    expect(sharedAdmission.activeCount).toBe(0);
  });
  it('rejects partial output from a failed or capped upstream instead of returning success', async () => {
    mocks.stream.mockImplementation((_options) => ({
      finishReason: Promise.resolve('length'),
      textStream: (async function* () {
        yield 'partial';
      })(),
    }));
    await expect(executeSubtitleBatch(input())).rejects.toThrow(/token limit/);
    mocks.stream.mockImplementation((options) => {
      options.onError({ error: new Error('upstream failed') });
      return { finishReason: Promise.resolve('error'), textStream: (async function* () {})() };
    });
    await expect(executeSubtitleBatch(input())).rejects.toThrow('upstream failed');
    expect(sharedAdmission.activeCount).toBe(0);
  });
  it('admits MT fanout per actual request, never as a parent batch holding a slot', async () => {
    let active = 0,
      peak = 0;
    mocks.mt.mockImplementation(async (text: string) => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, 1));
      active--;
      return { text: `translated:${text}` };
    });
    const value = input('google-mt');
    value.items = Array.from({ length: 12 }, (_, index) => ({ key: String(index), text: String(index), context: '' }));
    const results = await executeSubtitleBatch(value);
    expect(results.size).toBe(12);
    expect(peak).toBeLessThanOrEqual(6);
    expect(sharedAdmission.activeCount).toBe(0);
    expect(sharedAdmission.pendingCount).toBe(0);
  });
});
