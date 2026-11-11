/** Three-way field merge: a stale settings snapshot changes only its edited leaves. */
export function mergeConfigEdits(current: unknown, next: unknown, base: unknown): unknown {
  if (JSON.stringify(next) === JSON.stringify(base)) return current;
  if (
    next &&
    base &&
    current &&
    typeof next === 'object' &&
    typeof base === 'object' &&
    typeof current === 'object' &&
    !Array.isArray(next) &&
    !Array.isArray(base) &&
    !Array.isArray(current)
  ) {
    const result: Record<string, unknown> = { ...(current as Record<string, unknown>) };
    const incoming = next as Record<string, unknown>;
    const before = base as Record<string, unknown>;
    for (const key of new Set([...Object.keys(incoming), ...Object.keys(before)])) {
      if (!(key in incoming)) {
        if (key in before) delete result[key];
      } else result[key] = mergeConfigEdits(result[key], incoming[key], before[key]);
    }
    return result;
  }
  return next;
}
