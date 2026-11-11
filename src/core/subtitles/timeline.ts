import { createCue } from './text';
import type { PlaybackState, SubtitleCue } from './types';

export class SubtitleTimeline {
  readonly cues: readonly SubtitleCue[];
  private readonly prefixEnd: number[] = [];
  private readonly positions = new Map<string, number>();

  constructor(cues: readonly SubtitleCue[]) {
    this.cues = cues
      .map((cue) => createCue(cue.startMs, cue.endMs, cue.text, cue.id))
      .filter((cue): cue is SubtitleCue => cue !== null)
      .sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs || a.id.localeCompare(b.id));
    let end = 0;
    this.cues.forEach((cue, index) => {
      end = Math.max(end, cue.endMs);
      this.prefixEnd.push(end);
      this.positions.set(cue.id, index);
    });
  }

  private upperBound(timeMs: number): number {
    let low = 0;
    let high = this.cues.length;
    while (low < high) {
      const middle = (low + high) >>> 1;
      if (this.cues[middle].startMs <= timeMs) low = middle + 1;
      else high = middle;
    }
    return low;
  }

  at(timeMs: number): SubtitleCue[] {
    if (!Number.isFinite(timeMs) || timeMs < 0) return [];
    const result: SubtitleCue[] = [];
    for (let index = this.upperBound(timeMs) - 1; index >= 0 && this.prefixEnd[index] > timeMs; index -= 1) {
      const cue = this.cues[index];
      if (cue.endMs > timeMs) result.push(cue);
    }
    return result.reverse();
  }

  window(timeMs: number, aheadMs: number, maxCues = 100): SubtitleCue[] {
    if (!Number.isFinite(timeMs) || !Number.isFinite(aheadMs) || aheadMs < 0) return [];
    const limit = Math.max(0, Math.min(500, Math.floor(maxCues)));
    const result = this.at(timeMs).slice(0, limit);
    for (let index = this.upperBound(timeMs); index < this.cues.length && result.length < limit; index += 1) {
      const cue = this.cues[index];
      if (cue.startMs > timeMs + aheadMs) break;
      result.push(cue);
    }
    return result;
  }

  /** Neighbours depend only on stable track position, never playback or batching. */
  context(cueId: string, budgetChars = 600): string {
    const index = this.positions.get(cueId);
    if (index === undefined) return '';
    const budget = Math.max(0, Math.min(2000, Math.floor(budgetChars)));
    return this.cues
      .slice(Math.max(0, index - 1), index + 2)
      .map((cue) => cue.text)
      .join('\n')
      .slice(0, budget);
  }
}

export interface SubtitleWindowOptions {
  prefetchMs: number;
  maxPrefetchMs?: number;
  maxCues?: number;
}

export function planSubtitleWindow(
  timeline: SubtitleTimeline,
  playback: PlaybackState,
  options: SubtitleWindowOptions
): { current: SubtitleCue[]; upcoming: SubtitleCue[] } {
  if (playback.adPlaying || playback.seeking) return { current: [], upcoming: [] };
  const rate = Number.isFinite(playback.playbackRate) ? Math.max(0.25, playback.playbackRate) : 1;
  const ahead = Math.min(options.maxPrefetchMs ?? 120_000, Math.max(0, options.prefetchMs) * rate);
  const current = timeline.at(playback.timeMs);
  const currentIds = new Set(current.map((cue) => cue.id));
  return {
    current,
    upcoming: timeline.window(playback.timeMs, ahead, options.maxCues ?? 100).filter((cue) => !currentIds.has(cue.id)),
  };
}
