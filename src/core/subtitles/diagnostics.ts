/** Content-safe, allowlisted metadata only. Never pass text, URLs, IDs or exceptions. */
export const DIAGNOSTIC_EVENTS = [
  'session-reset',
  'source-track',
  'source-dom',
  'source-error',
  'parse-failed',
  'render-ready',
  'render-empty',
  'render-failed',
  'translation-completed',
  'translation-failed',
  'translation-stale',
  'cache-hit',
  'cache-miss',
  'retry-scheduled',
  'source-cache',
  'source-fetch',
  'source-live',
] as const;
export type DiagnosticEvent = (typeof DIAGNOSTIC_EVENTS)[number];
export interface SubtitleDiagnostic {
  event: DiagnosticEvent;
  generation?: number;
  context?: number;
  code?:
    | 'no-captions'
    | 'fetch-failed'
    | 'rate-limited'
    | 'provider-unavailable'
    | 'translation-failed'
    | 'capacity'
    | 'timeout';
  count?: number;
  durationMs?: number;
  delayMs?: number;
  attempt?: number;
}
export function sanitizeDiagnostic(raw: unknown): SubtitleDiagnostic | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Record<string, unknown>;
  if (!DIAGNOSTIC_EVENTS.includes(value.event as DiagnosticEvent)) return null;
  const result: SubtitleDiagnostic = { event: value.event as DiagnosticEvent };
  if (
    [
      'no-captions',
      'fetch-failed',
      'rate-limited',
      'provider-unavailable',
      'translation-failed',
      'capacity',
      'timeout',
    ].includes(value.code as string)
  )
    result.code = value.code as SubtitleDiagnostic['code'];
  for (const key of ['context', 'generation', 'count', 'durationMs', 'delayMs', 'attempt'] as const) {
    const n = value[key];
    if (typeof n === 'number' && Number.isFinite(n) && n >= 0)
      result[key] = Math.min(Number.MAX_SAFE_INTEGER, Math.round(n));
  }
  return result;
}
export function createDiagnosticBuffer(capacity = 256) {
  const limit = Math.max(1, Math.min(512, Math.floor(capacity) || 256));
  const entries: (SubtitleDiagnostic & { time: number })[] = [];
  return {
    add(raw: unknown) {
      const value = sanitizeDiagnostic(raw);
      if (!value) return;
      entries.push({ ...value, time: Date.now() });
      if (entries.length > limit) entries.splice(0, entries.length - limit);
    },
    snapshot: () => entries.map((entry) => ({ ...entry })),
    clear: () => {
      entries.length = 0;
    },
  };
}
const listeners = new Set<(event: SubtitleDiagnostic) => void>();
export const subtitleDiagnostics = createDiagnosticBuffer();
export function recordSubtitleDiagnostic(value: SubtitleDiagnostic) {
  const safe = sanitizeDiagnostic(value);
  if (!safe) return;
  subtitleDiagnostics.add(safe);
  for (const listener of listeners) {
    try {
      listener(safe);
    } catch {
      /* Diagnostics cannot break playback. */
    }
  }
}
export function observeSubtitleDiagnostics(listener: (event: SubtitleDiagnostic) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
