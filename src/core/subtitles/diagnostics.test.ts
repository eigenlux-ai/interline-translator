import { describe, expect, it } from 'vitest';
import { createDiagnosticBuffer, sanitizeDiagnostic } from './diagnostics';

describe('subtitle diagnostic retention and privacy', () => {
  it('uses an explicit allowlist, discarding secrets, arbitrary strings and invalid metrics', () => {
    const safe = sanitizeDiagnostic({
      event: 'source-error',
      code: 'rate-limited',
      generation: 7,
      count: Infinity,
      delayMs: -1,
      url: 'https://secret?pot=token',
      apiKey: 'secret',
      text: 'private transcript',
      stack: 'secret error',
    });
    expect(safe).toEqual({ event: 'source-error', code: 'rate-limited', generation: 7 });
    expect(sanitizeDiagnostic({ event: 'https://secret' })).toBeNull();
    expect(sanitizeDiagnostic({ event: 'source-error', code: 'secret' })).toEqual({ event: 'source-error' });
  });
  it('evicts old entries, keeps immutable snapshots, and bounds excessive requested capacity', () => {
    const buffer = createDiagnosticBuffer(100_000);
    for (let i = 0; i < 10_000; i++) buffer.add({ event: 'session-reset', generation: i });
    const snapshot = buffer.snapshot();
    expect(snapshot).toHaveLength(512);
    expect(snapshot[0].generation).toBe(9488);
    snapshot[0].generation = 0;
    expect(buffer.snapshot()[0].generation).toBe(9488);
    buffer.clear();
    expect(buffer.snapshot()).toEqual([]);
  });
});
