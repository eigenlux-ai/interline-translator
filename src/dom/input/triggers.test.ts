import { describe, expect, it } from 'vitest';
import { parseInputCommand, SpaceTrigger } from './triggers';

describe('SpaceTrigger', () => {
  it('fires on the Nth consecutive space within the window', () => {
    const t = new SpaceTrigger({ count: 3, timeThresholdMs: 300 });
    expect(t.space(0)).toBe(false);
    expect(t.space(100)).toBe(false);
    expect(t.space(200)).toBe(true);
  });

  it('resets after the time threshold lapses', () => {
    const t = new SpaceTrigger({ count: 3, timeThresholdMs: 300 });
    t.space(0);
    t.space(100);
    expect(t.space(1000)).toBe(false); // gap > threshold → streak restarted
  });

  it('reset() clears the streak', () => {
    const t = new SpaceTrigger({ count: 2 });
    t.space(0);
    t.reset();
    expect(t.space(50)).toBe(false);
  });
});

describe('parseInputCommand', () => {
  it('strips trailing trigger spaces', () => {
    expect(parseInputCommand('hello world   ')).toEqual({ text: 'hello world' });
  });

  it('parses a /lang prefix', () => {
    expect(parseInputCommand('/ja hello world  ')).toEqual({ target: 'ja', text: 'hello world' });
  });

  it('parses a lang: prefix with aliases', () => {
    expect(parseInputCommand('jp: こんにちは ')).toEqual({ target: 'ja', text: 'こんにちは' });
    expect(parseInputCommand('cn: hello')).toEqual({ target: 'zh-CN', text: 'hello' });
  });

  it('leaves unknown prefixes as ordinary text', () => {
    expect(parseInputCommand('/xyz hello')).toEqual({ text: '/xyz hello' });
    expect(parseInputCommand('http://example.com')).toEqual({ text: 'http://example.com' });
  });

  it('colon form is lowercase-only — uppercase abbreviations are real text, not commands', () => {
    // "TW:" (content warning), "IT: ..." — eating these mistranslated real messages.
    expect(parseInputCommand('TW: spoilers ahead')).toEqual({ text: 'TW: spoilers ahead' });
    expect(parseInputCommand('IT: down again')).toEqual({ text: 'IT: down again' });
    // The slash form keeps case-insensitivity (a leading / is unambiguous intent).
    expect(parseInputCommand('/TW hello')).toEqual({ target: 'zh-TW', text: 'hello' });
  });

  it('the colon form refuses aliases that are ordinary English words', () => {
    // `it` is the Italian alias, and "it: broken again" is how people write a
    // sentence; lowercase `tw:` is a trigger warning, not 繁中.
    expect(parseInputCommand('it: broken again')).toEqual({ text: 'it: broken again' });
    expect(parseInputCommand('tw: food mention')).toEqual({ text: 'tw: food mention' });
    // The slash form is explicit intent, so it keeps both.
    expect(parseInputCommand('/it ciao')).toEqual({ target: 'it', text: 'ciao' });
  });

  it('unambiguous codes keep the colon form, and the refused ones keep a spelled-out route', () => {
    expect(parseInputCommand('ja: hello')).toEqual({ target: 'ja', text: 'hello' });
    expect(parseInputCommand('fr: hello')).toEqual({ target: 'fr', text: 'hello' });
    expect(parseInputCommand('italian: hello')).toEqual({ target: 'it', text: 'hello' });
    expect(parseInputCommand('zh-tw: hello')).toEqual({ target: 'zh-TW', text: 'hello' });
  });
});
