import { createCue, cueContentVersion } from './text';
import type { SubtitleCue } from './types';

export const LIVE_MAX_CUES = 2000;
export const LIVE_MAX_CHARS = 256_000;
export const LIVE_WINDOW_MS = 30 * 60_000;

/** Bounded, media-clock cue history. Incoming intervals replace revised snapshots. */
export class LiveSubtitleBuffer {
  private items: SubtitleCue[] = [];

  get cues(): readonly SubtitleCue[] {
    return this.items;
  }

  merge(incoming: readonly SubtitleCue[], timeMs: number, seekableStartMs = 0): boolean {
    if (!Number.isFinite(timeMs) || timeMs < 0) return false;
    const floor = Math.max(0, Number.isFinite(seekableStartMs) ? seekableStartMs : 0, timeMs - LIVE_WINDOW_MS);
    const ceiling = timeMs + LIVE_WINDOW_MS;
    const slots = new Map<string, number>();
    const next = incoming
      .map((cue) => {
        const key = `${cue.startMs}:${cue.id.split(':')[0]}`;
        const slot = slots.get(key) ?? 0;
        slots.set(key, slot + 1);
        return createCue(cue.startMs, cue.endMs, cue.text, `live:${key}:${slot}`);
      })
      .filter(
        (cue): cue is SubtitleCue =>
          !!cue &&
          cue.text.length <= 4000 &&
          cue.endMs - cue.startMs <= 60_000 &&
          cue.endMs > floor &&
          cue.startMs <= ceiling
      );
    // A response is authoritative only inside its supplied interval. Disjoint DVR
    // packets preserve already observed history, never inventing missing captions.
    const start = next.length ? Math.min(...next.map((cue) => cue.startMs)) : Infinity;
    const end = next.length ? Math.max(...next.map((cue) => cue.endMs)) : -Infinity;
    const merged = this.items
      .filter((cue) => cue.endMs > floor && cue.startMs <= ceiling && !(cue.startMs >= start && cue.startMs < end))
      .map((cue) => (cue.startMs < start && cue.endMs > start ? { ...cue, endMs: start } : cue));
    merged.push(...next);
    merged.sort((a, b) => Math.abs(a.startMs - timeMs) - Math.abs(b.startMs - timeMs));
    let chars = 0;
    const unique = new Map<string, SubtitleCue>();
    for (const cue of merged) {
      if (unique.has(cue.id) || unique.size >= LIVE_MAX_CUES || chars + cue.text.length > LIVE_MAX_CHARS) continue;
      unique.set(cue.id, cue);
      chars += cue.text.length;
    }
    const bounded = [...unique.values()].sort((a, b) => a.startMs - b.startMs || a.id.localeCompare(b.id));
    if (
      bounded.length === this.items.length &&
      bounded.every(
        (cue, i) => cue.id === this.items[i].id && cueContentVersion(cue) === cueContentVersion(this.items[i])
      )
    )
      return false;
    this.items = bounded;
    return true;
  }

  clear(): void {
    this.items = [];
  }
}
