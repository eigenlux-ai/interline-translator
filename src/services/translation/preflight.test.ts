import { describe, expect, it } from 'vitest';
import type { Config, ProviderConfig } from '@/data/models';
import { makeTestConfig } from '@/test-utils/config';
import { llmCallOptions, requireApiKey, resolveCallEnv } from './preflight';

const llm: ProviderConfig = { id: 'oai', kind: 'openai', apiKeys: ['sk-1'], model: 'gpt-x', enabled: true };
const mt: ProviderConfig = { id: 'google-free', kind: 'google-mt', apiKeys: [], model: '', enabled: true };

function cfg(providers: ProviderConfig[], defaultProviderId?: string): Config {
  return makeTestConfig({
    providers,
    translate: { defaultProviderId, source: 'auto', target: 'zh-CN', skipLanguages: [] },
  });
}

describe('resolveCallEnv', () => {
  it('falls back target on EMPTY STRING (||) and source on undefined (??)', () => {
    const env = resolveCallEnv(cfg([llm], 'oai'), { target: '', source: undefined });
    expect(env.target).toBe('zh-CN');
    expect(env.source).toBe('auto');
    expect(env.useMt).toBe(false);
  });

  it('explicit values win over config', () => {
    const env = resolveCallEnv(cfg([llm], 'oai'), { target: 'ja', source: 'en' });
    expect(env.target).toBe('ja');
    expect(env.source).toBe('en');
  });

  it('useMt when the provider is google-mt OR the mode forces mt', () => {
    expect(resolveCallEnv(cfg([mt], 'google-free'), {}).useMt).toBe(true);
    expect(resolveCallEnv(cfg([llm], 'oai'), { mode: 'mt' }).useMt).toBe(true);
    expect(resolveCallEnv(cfg([llm], 'oai'), {}).useMt).toBe(false);
  });
});

describe('requireApiKey', () => {
  it('returns the first key', () => {
    expect(requireApiKey(llm)).toBe('sk-1');
  });
  it('throws the ONE canonical error when missing', () => {
    expect(() => requireApiKey({ ...llm, apiKeys: [] })).toThrow(/provider "oai" has no API key/);
  });
  it('keyless run-exempt kinds get "" instead of the error (matches validateProvider)', () => {
    expect(requireApiKey({ ...llm, id: 'ollama', kind: 'openai-compatible', apiKeys: [] })).toBe('');
    expect(requireApiKey({ ...llm, id: 'ccr', kind: 'anthropic-compatible', apiKeys: [] })).toBe('');
  });
});

describe('llmCallOptions', () => {
  it('spreads providerOptions only when present', () => {
    expect(llmCallOptions(llm)).toEqual({});
    const withOpts = { ...llm, providerOptions: { openai: { reasoningEffort: 'low' } } };
    expect(llmCallOptions(withOpts)).toEqual({ providerOptions: { openai: { reasoningEffort: 'low' } } });
  });

  it('OMITS an unset knob rather than sending undefined (models with a forced temperature reject it)', () => {
    expect(llmCallOptions({ ...llm, params: {} })).toEqual({});
    const only = llmCallOptions({ ...llm, params: { temperature: 0.2 } });
    expect(only).toEqual({ temperature: 0.2 });
    expect(Object.keys(only)).not.toContain('maxOutputTokens');
  });

  it('passes temperature 0 through — falsy, but an explicit choice', () => {
    expect(llmCallOptions({ ...llm, params: { temperature: 0 } })).toEqual({ temperature: 0 });
  });

  it('carries params and providerOptions together', () => {
    const both = {
      ...llm,
      providerOptions: { openai: { reasoningEffort: 'low' } },
      params: { maxOutputTokens: 2048, temperature: 0.9 },
    };
    expect(llmCallOptions(both)).toEqual({
      providerOptions: { openai: { reasoningEffort: 'low' } },
      temperature: 0.9,
      maxOutputTokens: 2048,
    });
  });
});

describe('llmCallOptions — the reasoning toggle fans out per vendor & model capability', () => {
  const withReasoning = (kind: ProviderConfig['kind'], reasoning: boolean, model = 'gpt-x') =>
    llmCallOptions({ ...llm, kind, model, params: { reasoning } }).providerOptions as unknown as Record<string, unknown>;

  it('leaves providerOptions untouched while the toggle is unset', () => {
    expect(llmCallOptions({ ...llm, params: { temperature: 0.5 } }).providerOptions).toBeUndefined();
  });

  it('openai / openai-compatible → reasoningEffort, under their own namespaces', () => {
    expect(withReasoning('openai', false)).toEqual({ openai: { reasoningEffort: 'none' } });
    expect(withReasoning('openai', true)).toEqual({ openai: { reasoningEffort: 'medium' } });
    expect(withReasoning('openai-compatible', false)).toEqual({ openaiCompatible: { reasoningEffort: 'none' } });
  });

  it('openai o1/o3 models → omit custom temperature and map reasoning:false to low effort', () => {
    const o3 = llmCallOptions({ ...llm, kind: 'openai', model: 'o3-mini', params: { temperature: 0.7, reasoning: false } });
    expect(o3.temperature).toBeUndefined();
    expect(o3.providerOptions).toEqual({ openai: { reasoningEffort: 'low' } });
  });

  it('anthropic claude-3.7 vs claude-3.5 capability adaptation', () => {
    expect(withReasoning('anthropic', false, 'claude-3-7-sonnet-20250219')).toEqual({
      anthropic: { thinking: { type: 'disabled' } },
    });
    expect(withReasoning('anthropic-compatible', true, 'claude-3-7-sonnet')).toEqual({
      anthropic: { thinking: { type: 'enabled', budgetTokens: 1024 } },
    });
    // Claude 3.5 omits thinking parameter when off
    expect(withReasoning('anthropic', false, 'claude-3-5-sonnet-20241022')).toBeUndefined();
  });

  it('google Gemini level thinking', () => {
    expect(withReasoning('google', false, 'gemini-2.0-flash')).toEqual({ google: { thinkingConfig: { thinkingLevel: 'low' } } });
    expect(withReasoning('google', true, 'gemini-2.5-pro')).toEqual({ google: { thinkingConfig: { thinkingLevel: 'high' } } });
  });

  it('openrouter takes vendor-aware reasoning: Gemini & R1 map to effort low/high, Claude to max_tokens', () => {
    // Gemini models on OpenRouter map to effort low (when off) and high (when on):
    expect(withReasoning('openrouter', false, 'google/gemini-3.7-flash')).toEqual({
      openrouter: { reasoning: { effort: 'low' } },
    });
    expect(withReasoning('openrouter', true, 'google/gemini-3.7-flash')).toEqual({
      openrouter: { reasoning: { effort: 'high' } },
    });

    // Mandatory thinking models (R1, :thinking, o1/o3):
    expect(withReasoning('openrouter', false, 'deepseek/deepseek-r1')).toEqual({
      openrouter: { reasoning: { effort: 'low' } },
    });
    expect(withReasoning('openrouter', true, 'deepseek/deepseek-r1')).toEqual({
      openrouter: { reasoning: { effort: 'high' } },
    });

    // Claude on OpenRouter:
    expect(withReasoning('openrouter', false, 'anthropic/claude-3.7-sonnet')).toEqual({
      openrouter: { reasoning: { max_tokens: 0 } },
    });
    expect(withReasoning('openrouter', true, 'anthropic/claude-3.7-sonnet')).toEqual({
      openrouter: { reasoning: { max_tokens: 1024 } },
    });
  });

  it('hand-written providerOptions outrank the toggle, merged WITHIN the namespace', () => {
    const opts = llmCallOptions({
      ...llm,
      kind: 'openai',
      providerOptions: { openai: { reasoningEffort: 'high', user: 'u1' }, other: { keep: 1 } },
      params: { reasoning: false },
    });
    expect(opts.providerOptions).toEqual({
      openai: { reasoningEffort: 'high', user: 'u1' },
      other: { keep: 1 },
    });
  });
});
