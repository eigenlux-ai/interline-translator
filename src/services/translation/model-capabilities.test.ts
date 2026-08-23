import { describe, expect, it } from 'vitest';
import {
  cleanModelName,
  inferModelCapabilities,
  isAnthropicThinkingModel,
  isFixedTemperatureModel,
  isGoogleThinkingModel,
  isMandatoryReasoningModel,
  isParameterRejectionError,
} from './model-capabilities';

const USER_OPENAI_MODELS = [
  'gpt-5.6-luna-pro',
  'gpt-5.6-luna-pro:batch',
  'gpt-5.6-luna',
  'gpt-5.6-luna:batch',
  'gpt-5.6-terra-pro',
  'gpt-5.6-terra-pro:batch',
  'gpt-5.6-terra',
  'gpt-5.6-terra:batch',
  'gpt-5.6-sol-pro',
  'gpt-5.6-sol-pro:batch',
  'gpt-5.6-sol',
  'gpt-5.6-sol:batch',
  'gpt-chat-latest',
  'gpt-5.5-pro',
  'gpt-5.5-pro:batch',
  'gpt-5.5',
  'gpt-5.5:batch',
  'gpt-5.4-image-2',
  'gpt-5.4-nano',
  'gpt-5.4-nano:batch',
  'gpt-5.4-mini',
  'gpt-5.4-mini:batch',
  'gpt-5.4-pro',
  'gpt-5.4-pro:batch',
  'gpt-5.4',
  'gpt-5.4:batch',
  'gpt-5.3-codex',
  'gpt-audio',
  'gpt-audio-mini',
  'gpt-5.2-codex',
  'gpt-5.2-chat',
  'gpt-5.2-pro',
  'gpt-5.2-pro:batch',
  'gpt-5.2',
  'gpt-5.2:batch',
  'gpt-5.1-codex-max',
  'gpt-5.1',
  'gpt-5.1:batch',
  'gpt-5.1-codex',
  'gpt-5.1-codex-mini',
  'gpt-oss-safeguard-20b',
  'gpt-5-image-mini',
  'gpt-5-image',
  'gpt-5-pro',
  'gpt-5-pro:batch',
  'gpt-5-codex:batch',
  'gpt-5',
  'gpt-5:batch',
  'gpt-5-mini',
  'gpt-5-mini:batch',
  'gpt-5-nano',
  'gpt-5-nano:batch',
  'gpt-oss-120b',
  'gpt-oss-20b',
  'gpt-oss-20b:free',
  'o3-pro',
  'o3-pro:batch',
  'o4-mini-high',
  'o4-mini-high:batch',
  'o3',
  'o3:batch',
  'o4-mini',
  'o4-mini:batch',
  'gpt-4.1',
  'gpt-4.1:batch',
  'gpt-4.1-mini',
  'gpt-4.1-mini:batch',
  'gpt-4.1-nano',
  'gpt-4.1-nano:batch',
  'o1-pro',
  'o1-pro:batch',
  'o3-mini-high',
  'o3-mini-high:batch',
  'o3-mini',
  'o3-mini:batch',
  'o1',
  'o1:batch',
  'gpt-4o-2024-11-20',
  'gpt-4o-2024-08-06',
  'gpt-4o-mini',
  'gpt-4o-mini-2024-07-18',
  'gpt-4o-mini:batch',
  'gpt-4o',
  'gpt-4o-2024-05-13',
  'gpt-4o:batch',
  'gpt-4-turbo',
  'gpt-4-turbo:batch',
  'gpt-3.5-turbo-0613',
  'gpt-4-turbo-preview',
  'gpt-3.5-turbo-instruct',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo:batch',
  'gpt-4',
];

const USER_ANTHROPIC_MODELS = [
  'claude-opus-5-fast',
  'claude-opus-5',
  'claude-opus-5:batch',
  'claude-sonnet-5',
  'claude-sonnet-5:batch',
  'claude-fable-5',
  'claude-fable-5:batch',
  'claude-opus-4.8-fast',
  'claude-opus-4.8',
  'claude-opus-4.8:batch',
  'claude-opus-4.7-fast',
  'claude-opus-4.7',
  'claude-opus-4.7:batch',
  'claude-sonnet-4.6',
  'claude-sonnet-4.6:batch',
  'claude-opus-4.6',
  'claude-opus-4.6:batch',
  'claude-opus-4.5',
  'claude-opus-4.5:batch',
  'claude-haiku-4.5',
  'claude-haiku-4.5:batch',
  'claude-sonnet-4.5',
  'claude-sonnet-4.5:batch',
  'claude-opus-4.1',
  'claude-opus-4.1:batch',
  'claude-opus-4',
  'claude-sonnet-4',
  'claude-3-haiku',
];

const USER_GOOGLE_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.7-flash:batch',
  'gemini-3.6-flash',
  'gemini-3.6-flash:batch',
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash-lite:batch',
  'gemini-3.1-flash-lite-image',
  'gemini-3.1-flash-image',
  'gemini-3-pro-image',
  'gemini-3.5-flash',
  'gemini-3.5-flash:batch',
  'gemini-3.1-flash-lite',
  'gemini-3.1-flash-lite:batch',
  'gemma-4-26b-a4b-it',
  'gemma-4-26b-a4b-it:free',
  'gemma-4-31b-it',
  'gemma-4-31b-it:free',
  'lyria-3-pro-preview',
  'lyria-3-clip-preview',
  'gemini-3.1-flash-lite-preview',
  'gemini-3.1-flash-image-preview',
  'gemini-3.1-pro-preview-customtools',
  'gemini-3.1-pro-preview',
  'gemini-3.1-pro-preview:batch',
  'gemini-3-flash-preview',
  'gemini-3-flash-preview:batch',
  'gemini-3-pro-image-preview',
  'gemini-2.5-flash-image',
  'gemini-2.5-flash-lite',
  'gemini-2.5-flash-lite:batch',
  'gemini-2.5-flash',
  'gemini-2.5-flash:batch',
  'gemini-2.5-pro',
  'gemini-2.5-pro:batch',
  'gemini-2.5-pro-preview',
  'gemma-3n-e4b-it',
  'gemini-2.5-pro-preview-05-06',
  'gemma-3-4b-it',
  'gemma-3-12b-it',
  'gemma-3-27b-it',
  'gemma-2-27b-it',
];

describe('cleanModelName', () => {
  it('strips provider prefixes and tag suffixes', () => {
    expect(cleanModelName('openai/gpt-5.4-pro:batch')).toBe('gpt-5.4-pro');
    expect(cleanModelName('anthropic/claude-opus-5:batch')).toBe('claude-opus-5');
    expect(cleanModelName('google/gemini-3.7-flash:batch')).toBe('gemini-3.7-flash');
    expect(cleanModelName('gemma-4-31b-it:free')).toBe('gemma-4-31b-it');
    expect(cleanModelName('gemini-3.1-pro-preview-customtools')).toBe('gemini-3.1-pro-preview-customtools');
  });
});

describe('User OpenAI model roster validation', () => {
  const oSeriesModels = [
    'o3-pro',
    'o3-pro:batch',
    'o4-mini-high',
    'o4-mini-high:batch',
    'o3',
    'o3:batch',
    'o4-mini',
    'o4-mini:batch',
    'o1-pro',
    'o1-pro:batch',
    'o3-mini-high',
    'o3-mini-high:batch',
    'o3-mini',
    'o3-mini:batch',
    'o1',
    'o1:batch',
  ];

  it('correctly identifies all o-series models as mandatory reasoning & fixed temperature', () => {
    for (const model of oSeriesModels) {
      expect(isMandatoryReasoningModel(model)).toBe(true);
      expect(isFixedTemperatureModel(model)).toBe(true);
      const caps = inferModelCapabilities('openai', model);
      expect(caps.reasoning).toBe('mandatory');
      expect(caps.fixedTemperature).toBe(true);
    }
  });

  it('correctly handles all GPT standard models (allows temperature, no forced o-series lock)', () => {
    const nonOSeries = USER_OPENAI_MODELS.filter((m) => !oSeriesModels.includes(m));
    for (const model of nonOSeries) {
      expect(isFixedTemperatureModel(model)).toBe(false);
      const caps = inferModelCapabilities('openai', model);
      expect(caps.fixedTemperature).toBe(false);
    }
  });
});

describe('User Anthropic model roster validation', () => {
  it('correctly classifies thinking capability for all modern Claude 4/4.x/5 models', () => {
    const thinkingCapableClaude = USER_ANTHROPIC_MODELS.filter((m) => m !== 'claude-3-haiku');
    for (const model of thinkingCapableClaude) {
      expect(isAnthropicThinkingModel(model)).toBe(true);
      const caps = inferModelCapabilities('anthropic', model);
      expect(caps.reasoning).toBe('optional');
      expect(caps.requiresThinkingBudget).toBe(true);
    }
  });

  it('identifies claude-3-haiku as legacy non-thinking model', () => {
    expect(isAnthropicThinkingModel('claude-3-haiku')).toBe(false);
    const caps = inferModelCapabilities('anthropic', 'claude-3-haiku');
    expect(caps.reasoning).toBe('none');
    expect(caps.requiresThinkingBudget).toBe(false);
  });
});

describe('User Google model roster validation', () => {
  it('correctly classifies thinking capability for all Gemini 2.5/3.x models', () => {
    const geminiThinking = USER_GOOGLE_MODELS.filter((m) => m.startsWith('gemini-'));
    for (const model of geminiThinking) {
      expect(isGoogleThinkingModel(model)).toBe(true);
      const caps = inferModelCapabilities('google', model);
      expect(caps.reasoning).toBe('optional');
    }
  });
});

describe('Parameter error detection', () => {
  it('identifies upstream parameter rejection error strings', () => {
    expect(isParameterRejectionError('Reasoning is mandatory for this endpoint and cannot be disabled.')).toBe(true);
    expect(isParameterRejectionError("Unsupported value: 'temperature' does not support 0.7 with this model.")).toBe(true);
    expect(isParameterRejectionError('temperature cannot be set when thinking is enabled')).toBe(true);
    expect(isParameterRejectionError('Extra inputs are not permitted: thinking')).toBe(true);
    expect(isParameterRejectionError('Invalid API key')).toBe(false);
    expect(isParameterRejectionError('Rate limit exceeded')).toBe(false);
  });
});
