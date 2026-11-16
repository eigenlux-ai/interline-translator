import { describe, expect, it } from 'vitest';
import { effectiveHostname } from './index';

function frame(url: string, parent?: Window, ancestors?: string[]): Window {
  const value = { location: { hostname: new URL(url).hostname, ancestorOrigins: ancestors }, parent };
  const win = value as unknown as Window;
  value.parent ??= win;
  return win;
}

describe('effectiveHostname', () => {
  it('keeps an ordinary document scoped to its own host', () => {
    expect(effectiveHostname(frame('https://editor.example.test', frame('https://other.example.test')))).toBe(
      'editor.example.test'
    );
  });

  it.each(['about:blank', 'about:srcdoc'])('inherits an accessible parent for %s without ancestorOrigins', (url) => {
    const parent = frame('https://private.example.test/editor');
    expect(effectiveHostname(frame(url, parent))).toBe('private.example.test');
    expect(effectiveHostname(frame(url, frame('about:blank', parent)))).toBe('private.example.test');
  });

  it('uses the browser-provided origin when a parent cannot be read', () => {
    const parent = {
      get location() {
        throw new DOMException('Cross-origin frame', 'SecurityError');
      },
    } as unknown as Window;
    expect(effectiveHostname(frame('about:blank', parent, ['https://private.example.test']))).toBe(
      'private.example.test'
    );
    expect(effectiveHostname(frame('about:blank', parent))).toBe('');
    expect(effectiveHostname(frame('about:blank', parent, ['null']))).toBe('');
  });
});
