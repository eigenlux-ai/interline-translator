import { describe, expect, it } from 'vitest';
import { parseYouTubeTimedText } from './parser';

describe('YouTube XML boundary parser', () => {
  it('retains srv3 word offsets without showing the whole future paragraph early', () => {
    expect(
      parseYouTubeTimedText(
        '<timedtext><body><p t="100" d="1000"><s t="0">one</s><s t="500"> two</s></p></body></timedtext>'
      ).map((cue) => [cue.startMs, cue.endMs, cue.text])
    ).toEqual([
      [100, 600, 'one'],
      [600, 1100, 'one two'],
    ]);
  });
  it('parses second-based text nodes and decodes entities and formatting safely', () => {
    expect(
      parseYouTubeTimedText(
        '<transcript><text start="1.25" dur="2">Hello &amp; &lt;world&gt;<br/>again <b>now</b></text></transcript>'
      )
    ).toMatchObject([{ startMs: 1250, endMs: 3250, text: 'Hello & <world> again now' }]);
  });

  it('parses srv3 millisecond paragraphs and preserves overlap and gaps', () => {
    const cues = parseYouTubeTimedText(
      '<timedtext><body><p t="100" d="2000"><s>one</s><s> two</s></p><p t="1000" d="1000">other</p><p t="4000" d="100">last</p><p t="-1" d="200">bad</p></body></timedtext>'
    );
    expect(cues.map((cue) => [cue.startMs, cue.endMs, cue.text])).toEqual([
      [100, 2100, 'one two'],
      [1000, 2000, 'other'],
      [4000, 4100, 'last'],
    ]);
  });

  it('distinguishes empty captions from malformed or unsafe XML', () => {
    expect(parseYouTubeTimedText('<transcript/>')).toEqual([]);
    expect(parseYouTubeTimedText('')).toEqual([]);
    expect(() => parseYouTubeTimedText('<not-captions/>')).toThrow('invalid-format');
    expect(() =>
      parseYouTubeTimedText('<!DOCTYPE transcript [<!ENTITY x SYSTEM "file:///etc/passwd">]><transcript/>')
    ).toThrow('invalid-format');
  });

  it('accepts JSON3 without a DOM parsing branch', () => {
    expect(
      parseYouTubeTimedText('{"events":[{"tStartMs":0,"dDurationMs":1000,"segs":[{"utf8":"hello"}]}]}')[0].text
    ).toBe('hello');
  });
});
