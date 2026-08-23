import { describe, expect, it } from 'vitest';
import { paramsSummary, patchParams, readNumberInput, readReasoning } from './ProviderSettings';

describe('readNumberInput', () => {
  it('keeps an explicit 0 — the falsy value a naive truthiness check would eat', () => {
    expect(readNumberInput(0)).toBe(0);
    expect(readNumberInput('0')).toBe(0);
  });

  it('reads a cleared or half-typed field as "unset" rather than NaN', () => {
    expect(readNumberInput('')).toBeUndefined();
    expect(readNumberInput('   ')).toBeUndefined();
    expect(readNumberInput('abc')).toBeUndefined();
    expect(readNumberInput('-')).toBeUndefined();
  });
});

describe('readReasoning', () => {
  it('maps the three Select values, with anything else meaning "model decides"', () => {
    expect(readReasoning('on')).toBe(true);
    expect(readReasoning('off')).toBe(false);
    expect(readReasoning('')).toBeUndefined();
    expect(readReasoning(null)).toBeUndefined();
  });
});

describe('patchParams', () => {
  it('sets a knob on a provider that had none', () => {
    expect(patchParams(undefined, 'temperature', 0.7)).toEqual({ temperature: 0.7 });
  });

  it('stores reasoning false — an explicit "off", not an absence', () => {
    expect(patchParams(undefined, 'reasoning', false)).toEqual({ reasoning: false });
  });

  it('clearing a field drops that key, and the LAST key drops the whole object', () => {
    const two = patchParams({ temperature: 0.7 }, 'maxOutputTokens', 2048);
    expect(two).toEqual({ temperature: 0.7, maxOutputTokens: 2048 });
    expect(patchParams(two, 'maxOutputTokens', undefined)).toEqual({ temperature: 0.7 });
    // undefined, not {} — an untouched engine must not carry an empty params
    // object into backups (and into the cache-key fingerprint).
    expect(patchParams({ temperature: 0.7 }, 'temperature', undefined)).toBeUndefined();
    expect(patchParams({ reasoning: false }, 'reasoning', undefined)).toBeUndefined();
  });

  it('leaves the other knobs alone', () => {
    const all = { temperature: 0.7, maxOutputTokens: 2048, reasoning: true };
    expect(patchParams(all, 'maxOutputTokens', 4096)).toEqual({
      temperature: 0.7,
      maxOutputTokens: 4096,
      reasoning: true,
    });
  });
});

describe('paramsSummary', () => {
  it('is empty when nothing is set (this is what folds the block away)', () => {
    expect(paramsSummary(undefined)).toBe('');
    expect(paramsSummary({})).toBe('');
  });

  it('lists only the knobs actually set, including the falsy ones', () => {
    expect(paramsSummary({ temperature: 0 })).toBe('T 0');
    expect(paramsSummary({ temperature: 0.3, maxOutputTokens: 2048 })).toBe('T 0.3 · 2048 tok');
    // reasoning: false must still show up — it is a choice, not a default
    expect(paramsSummary({ reasoning: false }, '推理 关闭')).toBe('推理 关闭');
  });
});
