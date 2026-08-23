import { describe, expect, it } from 'vitest';
import { buildBatchPrompt, createBatchParser, decodeNewlineTokens, type SegEvent } from './protocol';
import { sweepNewlineTokensForDisplay } from './nl-token';
import type { PromptConfig } from '@/data/models';

const CFG: PromptConfig = { styles: [], siteRules: [] };

const SALT = 'a1b2c3';
const mk = (n: number) => `[[${SALT}#${n}]]`;

/** Drive the parser with a given chunking and return finished segments (trimmed). */
function run(chunks: string[]): Map<number, string> {
  const p = createBatchParser(SALT);
  const acc = new Map<number, string>();
  const apply = (events: SegEvent[]) => {
    for (const e of events) {
      acc.set(e.index, (acc.get(e.index) ?? '') + e.delta);
    }
  };
  for (const c of chunks) apply(p.push(c));
  apply(p.flush());
  return new Map([...acc].map(([k, v]) => [k, v.trim()]));
}

describe('buildBatchPrompt', () => {
  it('marks each segment with the salted 1-based marker and injects target/salt', () => {
    const { system, prompt, salt } = buildBatchPrompt(['hello', 'world'], 'auto', 'zh-CN', CFG, undefined, SALT);
    expect(salt).toBe(SALT);
    expect(prompt).toContain(`${mk(1)}hello`);
    expect(prompt).toContain(`${mk(2)}world`);
    expect(system).toContain('Simplified Chinese');
    expect(system).toContain(SALT); // {salt} placeholder resolved
  });
});

describe('createBatchParser', () => {
  const whole = `${mk(1)}你好世界\n${mk(2)}第二段\n${mk(3)}third`;

  it('parses a single push', () => {
    expect(run([whole])).toEqual(
      new Map([
        [1, '你好世界'],
        [2, '第二段'],
        [3, 'third'],
      ])
    );
  });

  it('is robust to arbitrary chunk boundaries (incl. markers split mid-token)', () => {
    // split every 1 char — the worst case for marker boundary handling
    const chunks = [...whole];
    expect(run(chunks)).toEqual(
      new Map([
        [1, '你好世界'],
        [2, '第二段'],
        [3, 'third'],
      ])
    );
  });

  it('handles a marker straddling exactly two chunks', () => {
    const i = whole.indexOf(mk(2)) + 3; // cut inside the second marker
    expect(run([whole.slice(0, i), whole.slice(i)])).toEqual(
      new Map([
        [1, '你好世界'],
        [2, '第二段'],
        [3, 'third'],
      ])
    );
  });

  it('discards preamble before the first marker', () => {
    expect(run([`Sure! here you go:\n${mk(1)}译文`])).toEqual(new Map([[1, '译文']]));
  });

  it('marks each segment done exactly once', () => {
    const p = createBatchParser(SALT);
    const events = [...p.push(whole), ...p.flush()];
    const dones = events.filter((e) => e.done).map((e) => e.index);
    expect(dones).toEqual([1, 2, 3]);
  });

  it('leaves a content fragment that merely looks like a marker prefix intact', () => {
    // "[[" in content must not be swallowed when it can't become our salted marker
    expect(run([`${mk(1)}see [[ref]] here`])).toEqual(new Map([[1, 'see [[ref]] here']]));
  });
});

describe('createBatchParser — repeated markers (model self-correction)', () => {
  it('a re-emitted marker for a DONE segment is dropped, not concatenated', () => {
    const p = createBatchParser(SALT);
    const events = [...p.push(`[[${SALT}#1]]初版[[${SALT}#2]]乙[[${SALT}#1]]重打的垃圾`), ...p.flush()];
    const seg1 = events.filter((e) => e.index === 1);
    expect(seg1.map((e) => e.delta).join('')).toBe('初版');
    expect(seg1.filter((e) => e.done)).toHaveLength(1); // segDone must not re-fire
    // and the retake text lands nowhere
    expect(events.filter((e) => e.index !== 1 && e.index !== 2)).toHaveLength(0);
  });

  it('a repeat split across chunk boundaries is also dropped', () => {
    const p = createBatchParser(SALT);
    const whole = `[[${SALT}#1]]一[[${SALT}#2]]二[[${SALT}#1]]retake`;
    const events = [];
    for (const ch of whole) events.push(...p.push(ch));
    events.push(...p.flush());
    expect(events.filter((e) => e.index === 1).map((e) => e.delta).join('')).toBe('一');
    expect(events.filter((e) => e.index === 2).map((e) => e.delta).join('')).toBe('二');
  });
});

describe('newline tokens — in-item paragraph breaks survive the batch protocol', () => {
  it('encodes item newlines as salted tokens (no literal \\n inside items)', () => {
    const { prompt, salt } = buildBatchPrompt(['one\n\ntwo', 'three'], 'auto', 'zh-CN', CFG);
    const [firstItem] = prompt.split(`[[${salt}#2]]`);
    expect(firstItem).not.toContain('\n\n'); // encoded away
    expect(firstItem).toContain(`[[${salt}~n]][[${salt}~n]]`);
  });

  it('decodeNewlineTokens restores exact tokens and sweeps mangled debris', () => {
    expect(decodeNewlineTokens('a[[abc123~n]]b', 'abc123')).toBe('a\nb');
    // Model mangled the salt casing — lenient sweep still yields a newline.
    expect(decodeNewlineTokens('a[[ABC123~n]]b', 'abc123')).toBe('a\nb');
    // Unrelated bracket syntax is untouched.
    expect(decodeNewlineTokens('keep [[this]] intact', 'abc123')).toBe('keep [[this]] intact');
  });

  it('sweepNewlineTokensForDisplay: whole tokens break, a trailing half-token hides', () => {
    expect(sweepNewlineTokensForDisplay('a[[ab12cd~n]]b')).toBe('a\nb');
    // The parser's hold-back releases `[[salt~…` as ordinary delta text —
    // every truncation point after the `~` must vanish from the display.
    expect(sweepNewlineTokensForDisplay('b[[ab12cd~')).toBe('b');
    expect(sweepNewlineTokensForDisplay('b[[ab12cd~n')).toBe('b');
    expect(sweepNewlineTokensForDisplay('b[[ab12cd~n]')).toBe('b');
    // Without the `~` it could be legitimate text (or a held marker) — keep it.
    expect(sweepNewlineTokensForDisplay('wiki [[link')).toBe('wiki [[link');
    expect(sweepNewlineTokensForDisplay('ends in hex cafe')).toBe('ends in hex cafe');
  });
});

describe('expert batch template — the ~n protocol rule rides along', () => {
  it('appends the token rule to an expert template that lacks it', () => {
    const cfgWithExpert = {
      ...CFG,
      expert: { batch: { system: 'Translate to {target}. Markers look like [[{salt}#N]]. Do it.' } },
    } as typeof CFG;
    const { system, salt } = buildBatchPrompt(['a\nb'], 'auto', 'zh-CN', cfgWithExpert);
    expect(system).toContain(`[[${salt}~n]]`);
    expect(system).toContain('paragraph break');
  });
});
