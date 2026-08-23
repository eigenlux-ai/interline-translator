import { describe, expect, it } from 'vitest';
import { parseSingle } from './mt';

describe('parseSingle', () => {
  it('concatenates sentence segments', () => {
    const resp = [
      [
        ['你好', 'Hello', null, null],
        ['世界', ' world', null, null],
      ],
      null,
      'en',
    ];
    expect(parseSingle(resp)).toEqual({ text: '你好世界', detectedSource: 'en' });
  });

  it('handles a single segment', () => {
    expect(parseSingle([[['译文', 'src']], null, 'fr'])).toEqual({ text: '译文', detectedSource: 'fr' });
  });

  it('returns undefined detectedSource when absent', () => {
    expect(parseSingle([[['x', 'y']]])).toEqual({ text: 'x', detectedSource: undefined });
  });

  it('throws on a malformed response', () => {
    expect(() => parseSingle({})).toThrow(/unexpected response shape/);
    expect(() => parseSingle(['not-an-array'])).toThrow(/missing translation segments/);
  });
});
