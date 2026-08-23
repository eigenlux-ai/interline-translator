import { describe, expect, it } from 'vitest';
import { createThinkStripper, stripThink } from './reasoning';

describe('stripThink', () => {
  it('drops a leading <think>…</think> block', () => {
    expect(stripThink('<think>reason here</think>\n你好')).toBe('你好');
  });
  it('leaves normal text untouched', () => {
    expect(stripThink('你好世界')).toBe('你好世界');
  });
  it('returns the text UNCHANGED when the think block never closes (literal content)', () => {
    // Real reasoning always closes before the answer; an unclosed <think> is
    // page content that legitimately starts with the tag — swallowing it
    // rendered a valid translation as a silent empty success.
    expect(stripThink('<think>still thinking…')).toBe('<think>still thinking…');
  });
  it('ignores a <think> that is not at the start', () => {
    expect(stripThink('hello <think>x</think>')).toBe('hello <think>x</think>');
  });
});

/** Feed `whole` to the streaming stripper in given-size chunks; return shown text. */
function streamStrip(whole: string, size: number): string {
  const strip = createThinkStripper();
  let out = '';
  for (let i = 0; i < whole.length; i += size) out += strip.push(whole.slice(i, i + size));
  return out + strip.flush();
}

describe('createThinkStripper', () => {
  const withThink = '<think>let me reason about this</think>翻译结果';

  it('suppresses the think block (single chunk)', () => {
    expect(streamStrip(withThink, withThink.length)).toBe('翻译结果');
  });

  it('suppresses even when the tags are split across tiny chunks', () => {
    expect(streamStrip(withThink, 1)).toBe('翻译结果');
    expect(streamStrip(withThink, 3)).toBe('翻译结果');
  });

  it('passes non-reasoning output straight through', () => {
    expect(streamStrip('plain translation', 2)).toBe('plain translation');
  });

  it('handles leading whitespace before <think>', () => {
    expect(streamStrip('\n  <think>x</think>结果', 2)).toBe('结果');
  });

  it('flush() recovers an unclosed <think> as literal content', () => {
    expect(streamStrip('<think> 是 DeepSeek 的推理标签', 4)).toBe('<think> 是 DeepSeek 的推理标签');
  });

  it('flush() recovers a partial sniff buffer (stream ended mid-tag)', () => {
    const strip = createThinkStripper();
    expect(strip.push('<thi')).toBe(''); // could still become <think> — withheld
    expect(strip.flush()).toBe('<thi'); // stream ended: it was literal text
  });

  it('flush() is empty after a normal pass-through stream', () => {
    const strip = createThinkStripper();
    strip.push('plain');
    expect(strip.flush()).toBe('');
  });
});
