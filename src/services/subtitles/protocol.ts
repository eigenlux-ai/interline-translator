/** Content-safe subtitle Port protocol. No provider secrets or execution imports. */
export const SUBTITLE_PORT_NAME = 'interline:subtitles:v1';
export const SUBTITLE_PROTOCOL_VERSION = 1;
export const SUBTITLE_LIMITS = {
  maxSubscriptions: 100,
  maxTextCharacters: 4000,
  maxContextCharacters: 4000,
  maxWindowCharacters: 100_000,
  maxSessions: 32,
  maxTasks: 512,
  maxRetries: 2,
  retryBaseMs: 800,
  totalExecutionMs: 180_000,
  idleExecutionMs: 60_000,
  maxResponseCharacters: 32_000,
  maxOutputTokens: 8192,
  defaultOutputTokens: 4096,
} as const;
export interface SubtitleSubscription {
  subscriptionId: string;
  cueId: string;
  contentVersion: string;
  text: string;
  /** Stable, bounded neighbor context, supplied independently of the batch window. */
  context?: string;
  priority: 'current' | 'prefetch';
  distanceMs?: number;
}
export interface SubtitleWindow {
  generation: number;
  trackVersion: string;
  sourceLanguage: string;
  title?: string;
  subscriptions: SubtitleSubscription[];
}
export type SubtitleClientMessage =
  | { version: 1; type: 'window'; window: SubtitleWindow }
  | { version: 1; type: 'close' }
  | { version: 1; type: 'ping' };
export interface SubtitleTranslationEvent {
  version: 1;
  type: 'completed' | 'failed' | 'cancelled' | 'invalidated';
  generation: number;
  trackVersion: string;
  subscriptionId: string;
  cueId: string;
  contentVersion: string;
  text?: string;
  error?: { code: 'provider-unavailable' | 'translation-failed' | 'capacity' | 'timeout'; retryable: boolean };
}
function boundedString(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.length > 0 && value.length <= max;
}
export function isSubtitleWindow(value: unknown): value is SubtitleWindow {
  if (!value || typeof value !== 'object') return false;
  const w = value as SubtitleWindow;
  if (
    !Number.isSafeInteger(w.generation) ||
    w.generation < 0 ||
    !boundedString(w.trackVersion, 200) ||
    !boundedString(w.sourceLanguage, 40) ||
    (w.title !== undefined && (typeof w.title !== 'string' || w.title.length > 500)) ||
    !Array.isArray(w.subscriptions) ||
    w.subscriptions.length > SUBTITLE_LIMITS.maxSubscriptions
  )
    return false;
  const ids = new Set<string>();
  let characters = 0;
  for (const s of w.subscriptions) {
    if (
      !s ||
      !boundedString(s.subscriptionId, 200) ||
      ids.has(s.subscriptionId) ||
      !boundedString(s.cueId, 200) ||
      !boundedString(s.contentVersion, 200) ||
      !boundedString(s.text, SUBTITLE_LIMITS.maxTextCharacters) ||
      (s.context !== undefined &&
        (typeof s.context !== 'string' || s.context.length > SUBTITLE_LIMITS.maxContextCharacters)) ||
      !['current', 'prefetch'].includes(s.priority) ||
      (s.distanceMs !== undefined && (!Number.isFinite(s.distanceMs) || s.distanceMs < 0))
    )
      return false;
    ids.add(s.subscriptionId);
    characters += s.text.length + (s.context?.length ?? 0);
  }
  return characters <= SUBTITLE_LIMITS.maxWindowCharacters;
}
export function isSubtitleTranslationEvent(value: unknown): value is SubtitleTranslationEvent {
  if (!value || typeof value !== 'object') return false;
  const e = value as SubtitleTranslationEvent;
  return (
    e.version === 1 &&
    ['completed', 'failed', 'cancelled', 'invalidated'].includes(e.type) &&
    Number.isSafeInteger(e.generation) &&
    e.generation >= 0 &&
    boundedString(e.trackVersion, 200) &&
    boundedString(e.subscriptionId, 200) &&
    boundedString(e.cueId, 200) &&
    boundedString(e.contentVersion, 200) &&
    (e.text === undefined || (typeof e.text === 'string' && e.text.length <= SUBTITLE_LIMITS.maxResponseCharacters)) &&
    (e.type !== 'completed' || (typeof e.text === 'string' && e.text.length > 0)) &&
    (e.type !== 'failed' ||
      (!!e.error &&
        ['provider-unavailable', 'translation-failed', 'capacity', 'timeout'].includes(e.error.code) &&
        typeof e.error.retryable === 'boolean'))
  );
}
