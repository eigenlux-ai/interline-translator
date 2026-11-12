import type { SubtitleTimeline } from './timeline';

/** Conservative interval coverage; partial target cues must not suppress gap fallback. */
export function coversSubtitleInterval(timeline: SubtitleTimeline, startMs: number, endMs: number): boolean {
  if (!timeline.cues.length || !(endMs > startMs)) return false;
  let coveredUntil = startMs;
  for (const cue of timeline.window(startMs, endMs - startMs, 500)) {
    if (cue.startMs > coveredUntil) return false;
    coveredUntil = Math.max(coveredUntil, cue.endMs);
    if (coveredUntil >= endMs) return true;
  }
  return false;
}
