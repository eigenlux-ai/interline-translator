/** Add bounded jitter without retrying before the server's minimum. */
export function retryDelay(baseMs: number, capMs: number, minimumMs = 0, random = Math.random): number {
  const base = Math.max(0, Math.min(capMs, baseMs));
  const sample = random();
  const fraction = Number.isFinite(sample) ? Math.max(0, Math.min(1, sample)) : 0;
  const floor = Math.min(base, capMs * 0.8);
  const ceiling = Math.min(capMs, base * 1.25);
  return Math.ceil(Math.max(minimumMs, floor) + (ceiling - floor) * fraction);
}
