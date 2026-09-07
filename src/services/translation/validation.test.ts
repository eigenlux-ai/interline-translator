import { expect, it, vi } from 'vitest';
import type { ProviderConfig } from '@/data/models';
import { makeTestConfig } from '@/test-utils/config';
import type { TranslationService } from './contract';
import { executeTranslate } from './execute';
import { registerTranslationService } from './impl';

const { generate, resolveModel, captured } = vi.hoisted(() => ({
  generate: vi.fn(),
  resolveModel: vi.fn(async () => ({ modelId: 'stub' })),
  captured: { service: null as TranslationService | null },
}));
vi.mock('@webext-core/proxy-service', () => ({
  registerService: (_key: string, service: TranslationService) => {
    captured.service = service;
    return service;
  },
}));
vi.mock('ai', () => ({ generateText: generate }));
vi.mock('./provider/llm', () => ({ createLlmModel: resolveModel }));

it('validation must not approve parameters that real translation rejects', async () => {
  const provider: ProviderConfig = {
    id: 'review',
    kind: 'openai-compatible',
    enabled: true,
    model: 'custom',
    apiKeys: ['test'],
    params: { reasoning: true },
  };
  generate.mockImplementation(async (input: Record<string, unknown>) => {
    if (input.providerOptions) throw new Error('Unsupported parameter: reasoning_effort');
    return { text: 'ok', finishReason: 'stop' };
  });
  registerTranslationService();
  const validation = await captured.service!.validateProvider(provider);
  const config = makeTestConfig({
    providers: [provider],
    translate: { defaultProviderId: 'review', source: 'auto', target: 'zh-CN', skipLanguages: [] },
  });
  await expect(executeTranslate({ text: 'hello', source: 'auto', target: 'zh-CN' }, config)).rejects.toThrow(
    'Unsupported parameter'
  );
  expect(validation.ok).toBe(false);
});
