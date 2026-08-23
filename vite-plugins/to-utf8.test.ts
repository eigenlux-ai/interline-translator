import { describe, expect, it } from 'vitest';
import { escapeNonAscii } from './to-utf8';

// Guards the load-bearing escape used by the to-utf8 plugin: if this regresses,
// a built extension carrying non-ASCII silently fails Chrome's load check
// ("It isn't UTF-8 encoded"). Inputs use String.fromCharCode so this test file
// stays pure ASCII.
describe('escapeNonAscii', () => {
  it('escapes CJK to \\uXXXX', () => {
    expect(escapeNonAscii(String.fromCharCode(0x4f60, 0x597d))).toBe('\\u4f60\\u597d');
  });

  it('escapes an emoji as its two surrogate code units', () => {
    expect(escapeNonAscii(String.fromCharCode(0xd83d, 0xde00))).toBe('\\ud83d\\ude00');
  });

  it('escapes the U+FFFF non-character (the katex sentinel behind wxt#353)', () => {
    expect(escapeNonAscii(String.fromCharCode(0xffff))).toBe('\\uffff');
  });

  it('leaves pure ASCII (including newlines and tabs) untouched', () => {
    const ascii = 'const x = 1;\n\tconst y = 2;';
    expect(escapeNonAscii(ascii)).toBe(ascii);
  });

  it('is idempotent: a second pass over already-escaped output is a no-op', () => {
    const mixed = 'a' + String.fromCharCode(0x4f60, 0xd83d, 0xde00, 0xffff) + 'z';
    const once = escapeNonAscii(mixed);
    expect(escapeNonAscii(once)).toBe(once);
  });
});
