import type { SubtitleCue } from './types';

export function normalizeSubtitleText(text: string): string {
  return text.replace(/\s+/gu, ' ').trim();
}

/** An in-memory content discriminator, never a security or persistent-cache key. */
export function subtitleFingerprint(text: string): string {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function cueContentVersion(cue: SubtitleCue): string {
  // Include the actual input as well as timing: identity must not depend on hash collisions.
  return JSON.stringify([cue.startMs, cue.endMs, cue.text]);
}

export function createCue(startMs: number, endMs: number, text: string, id?: string): SubtitleCue | null {
  const normalized = normalizeSubtitleText(text);
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || startMs < 0 || endMs <= startMs || !normalized) {
    return null;
  }
  return {
    id: id ?? `${startMs}:${endMs}:${subtitleFingerprint(normalized)}`,
    startMs,
    endMs,
    text: normalized,
  };
}
