import { describe, expect, it } from 'vitest';
import { retryDelay } from './retry';

describe('bounded positive retry jitter', () => {
  it('spreads simultaneous retries while preserving the base and cap', () => {
    expect(retryDelay(800, 30_000, 0, () => 0)).toBe(800);
    expect(retryDelay(800, 30_000, 0, () => 1)).toBe(1000);
    expect(retryDelay(29_000, 30_000, 0, () => 1)).toBe(30_000);
    expect(retryDelay(60_000, 30_000, 0, () => 0.5)).toBe(27_000);
  });
  it('never truncates Retry-After to the fallback cap', () => {
    expect(retryDelay(30_000, 300_000, 600_000, () => 0)).toBe(600_000);
    expect(retryDelay(30_000, 300_000, 600_000, () => 1)).toBe(607_500);
    expect(retryDelay(30_000, 300_000, 20_000, () => 0.5)).toBe(33_750);
  });
  it('bounds injected random values and returns integer milliseconds', () => {
    expect(retryDelay(1, 10, 0, () => 0.1)).toBe(2);
    expect(retryDelay(800, 30_000, 0, () => NaN)).toBe(800);
    expect(retryDelay(800, 30_000, 0, () => -1)).toBe(800);
    expect(retryDelay(800, 30_000, 0, () => 9)).toBe(1000);
  });
});
