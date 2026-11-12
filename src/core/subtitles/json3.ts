import { SUBTITLE_MAX_RESPONSE_CHARS } from './limits';
import { createCue, normalizeSubtitleText } from './text';
import type { SubtitleCue } from './types';

export { SUBTITLE_MAX_RESPONSE_CHARS } from './limits';
export const SUBTITLE_MAX_EVENTS = 30_000;
export const SUBTITLE_MAX_CUES = 50_000;
export const SUBTITLE_MAX_CUE_CHARS = 4000;

export class SubtitleParseError extends Error {
  constructor(readonly code: 'invalid-format' | 'response-too-large') {
    super(code);
    this.name = 'SubtitleParseError';
  }
}

interface TimedSnapshot {
  startMs: number;
  endMs: number;
  text: string;
  eventIndices: number[];
}

export interface ParsedSubtitleTrack {
  cues: SubtitleCue[];
  /** Mapping survives conservative coalescing, for diagnostics without storing raw responses. */
  originalEvents: Record<string, number[]>;
}

function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function milliseconds(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
}

function appendWithoutRollingDuplicate(previous: string, next: string): string {
  if (!previous) return next;
  if (!next) return previous;
  if (normalizeSubtitleText(previous) === normalizeSubtitleText(next)) return previous;
  // Only explicit append events use overlap removal. Ordinary timed repetitions are real cues.
  const oldWords = normalizeSubtitleText(previous).split(' ');
  const newWords = normalizeSubtitleText(next).split(' ');
  for (let count = Math.min(oldWords.length, newWords.length); count > 0; count -= 1) {
    if (oldWords.slice(-count).join(' ') === newWords.slice(0, count).join(' ')) {
      return `${previous.trimEnd()} ${newWords.slice(count).join(' ')}`.trimEnd();
    }
  }
  return previous + next;
}

/**
 * Parse JSON3 snapshots conservatively. Offset words become timed progressive snapshots,
 * rather than making future words visible at the first word's timestamp. No sentence
 * resegmentation crosses unrelated or overlapping windows.
 */
export function parseYouTubeJson3WithMapping(input: unknown): ParsedSubtitleTrack {
  let parsed: unknown = input;
  if (typeof input === 'string') {
    if (input.length > SUBTITLE_MAX_RESPONSE_CHARS) throw new SubtitleParseError('response-too-large');
    try {
      parsed = JSON.parse(input);
    } catch {
      throw new SubtitleParseError('invalid-format');
    }
  }
  const root = record(parsed);
  if (!root || !Array.isArray(root.events)) throw new SubtitleParseError('invalid-format');
  if (root.events.length > SUBTITLE_MAX_EVENTS) throw new SubtitleParseError('response-too-large');
  const windows = new Map<string, TimedSnapshot[]>();
  let cueCount = 0;
  let textChars = 0;
  let lastUnlabelledWindow = '';
  const ordered = root.events
    .map((value, index) => ({ event: record(value), index }))
    .filter((item): item is { event: Record<string, unknown>; index: number } => item.event !== null)
    .sort(
      (a, b) =>
        (milliseconds(a.event.tStartMs) ?? Infinity) - (milliseconds(b.event.tStartMs) ?? Infinity) || a.index - b.index
    );

  for (const { event, index } of ordered) {
    const startMs = milliseconds(event.tStartMs);
    if (startMs === null || !Array.isArray(event.segs)) continue;
    if (event.segs.length > SUBTITLE_MAX_CUES) throw new SubtitleParseError('response-too-large');
    const segments = event.segs
      .map((value) => record(value))
      .filter((seg): seg is Record<string, unknown> => seg !== null)
      .filter((seg) => typeof seg.utf8 === 'string');
    if (!segments.length) continue;
    if (segments.some((seg) => (seg.utf8 as string).length > SUBTITLE_MAX_CUE_CHARS))
      throw new SubtitleParseError('response-too-large');
    textChars += segments.reduce((count, seg) => count + (seg.utf8 as string).length, 0);
    if (textChars > SUBTITLE_MAX_RESPONSE_CHARS) throw new SubtitleParseError('response-too-large');
    const hasWindow = typeof event.wWinId === 'number' || typeof event.wWinId === 'string';
    if (!hasWindow) {
      const earlierSnapshots = windows.get(lastUnlabelledWindow) ?? [];
      let earlier: TimedSnapshot | undefined;
      for (let position = earlierSnapshots.length - 1; position >= 0; position -= 1) {
        if (earlierSnapshots[position].startMs <= startMs) {
          earlier = earlierSnapshots[position];
          break;
        }
      }
      const fullText = normalizeSubtitleText(segments.map((segment) => segment.utf8 as string).join(''));
      const continuation =
        earlier && earlier.endMs > startMs && (fullText.startsWith(earlier.text) || earlier.text.startsWith(fullText));
      if (event.aAppend !== 1 && !continuation) lastUnlabelledWindow = `event:${index}`;
    }
    const windowKey = hasWindow ? String(event.wWinId).slice(0, 100) : lastUnlabelledWindow;
    const snapshots = windows.get(windowKey) ?? [];
    windows.set(windowKey, snapshots);
    let previous: TimedSnapshot | undefined;
    for (let position = snapshots.length - 1; position >= 0; position -= 1) {
      if (snapshots[position].startMs <= startMs) {
        previous = snapshots[position];
        break;
      }
    }
    const duration = milliseconds(event.dDurationMs);
    const endMs = duration !== null ? startMs + duration : event.aAppend === 1 && previous ? previous.endMs : startMs;
    if (endMs <= startMs) continue;
    const append = event.aAppend === 1;
    let text = append && previous ? previous.text : '';
    // A newer snapshot replaces only the same window's overlapping future, preserving other speakers.
    while (snapshots.length && snapshots[snapshots.length - 1].startMs >= startMs) {
      snapshots.pop();
      cueCount -= 1;
    }
    const last = snapshots[snapshots.length - 1];
    if (last && last.endMs > startMs) last.endMs = startMs;
    let segmentText = '';
    let groupStart = startMs;
    const push = (atMs: number, untilMs: number) => {
      const normalized = normalizeSubtitleText(text);
      if (!normalized || untilMs <= atMs) return;
      if (normalized.length > SUBTITLE_MAX_CUE_CHARS) throw new SubtitleParseError('response-too-large');
      const prior = snapshots[snapshots.length - 1];
      if (prior?.text === normalized && prior.endMs === atMs) {
        prior.endMs = untilMs;
        if (!prior.eventIndices.includes(index)) prior.eventIndices.push(index);
        return;
      }
      snapshots.push({ startMs: atMs, endMs: untilMs, text: normalized, eventIndices: [index] });
      cueCount += 1;
      if (cueCount > SUBTITLE_MAX_CUES) throw new SubtitleParseError('response-too-large');
    };
    for (const segment of segments) {
      const offset = milliseconds(segment.tOffsetMs) ?? 0;
      const segmentStart = Math.min(endMs, Math.max(groupStart, startMs + offset));
      if (segmentStart > groupStart) {
        text = append ? appendWithoutRollingDuplicate(previous?.text ?? '', segmentText) : segmentText;
        push(groupStart, segmentStart);
        groupStart = segmentStart;
      }
      segmentText += segment.utf8 as string;
    }
    text = append ? appendWithoutRollingDuplicate(previous?.text ?? '', segmentText) : segmentText;
    push(groupStart, endMs);
  }
  const cues: SubtitleCue[] = [];
  const originalEvents: Record<string, number[]> = Object.create(null);
  for (const [windowKey, snapshots] of windows) {
    for (const snapshot of snapshots) {
      const cue = createCue(snapshot.startMs, snapshot.endMs, snapshot.text);
      if (!cue) continue;
      cue.id = `${windowKey}:${cue.id}`;
      cues.push(cue);
      originalEvents[cue.id] = snapshot.eventIndices;
    }
  }
  cues.sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs || a.id.localeCompare(b.id));
  return { cues, originalEvents };
}

export function parseYouTubeJson3(input: unknown): SubtitleCue[] {
  return parseYouTubeJson3WithMapping(input).cues;
}
