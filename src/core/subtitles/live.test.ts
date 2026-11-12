import { expect, it } from 'vitest';
import { LIVE_MAX_CHARS, LIVE_MAX_CUES, LIVE_WINDOW_MS, LiveSubtitleBuffer } from './live';
import { SubtitleSessionState } from './session';
import { createCue } from './text';
import type { SubtitleTrack } from './types';

const cue = (start: number, text = 'hello', end = start + 1000) => createCue(start, end, text, `event:0:${start}`)!;
const track = (cues: SubtitleTrack['cues']): SubtitleTrack => ({
  videoId: 'live-video',
  id: 'en',
  language: 'en',
  kind: 'auto',
  contentVersion: 'stream:1',
  cues,
});

it('merges disjoint packets, replaces corrections and clips superseded overlapping text', () => {
  const buffer = new LiveSubtitleBuffer();
  buffer.merge([cue(1000, 'early', 3000)], 1500);
  buffer.merge([cue(2000, 'later')], 2500);
  expect(buffer.cues.map((c) => [c.startMs, c.endMs, c.text])).toEqual([
    [1000, 2000, 'early'],
    [2000, 3000, 'later'],
  ]);
  const id = buffer.cues[1].id;
  buffer.merge([cue(2000, 'corrected', 2800)], 2500);
  expect(buffer.cues[1]).toMatchObject({ id, text: 'corrected', endMs: 2800 });
  expect(buffer.merge([cue(2000, 'corrected', 2800)], 2500)).toBe(false);
  buffer.merge([cue(6000)], 6500);
  expect(buffer.cues).toHaveLength(3);
});

it('bounds history by media window, seekable floor, cue count and characters', () => {
  const buffer = new LiveSubtitleBuffer();
  const many = Array.from({ length: 3000 }, (_, i) => cue(i * 100, 'x'.repeat(200)));
  buffer.merge(many, 150000);
  expect(buffer.cues.length).toBeLessThanOrEqual(LIVE_MAX_CUES);
  expect(buffer.cues.reduce((sum, c) => sum + c.text.length, 0)).toBeLessThanOrEqual(LIVE_MAX_CHARS);
  buffer.merge([], 200000, 180000);
  expect(buffer.cues.every((c) => c.endMs > 180000)).toBe(true);
  buffer.merge([], LIVE_WINDOW_MS * 3);
  expect(buffer.cues).toEqual([]);
  buffer.merge([cue(1000)], 1500); // DVR can repopulate earlier media time after a seek.
  expect(buffer.cues).toHaveLength(1);
  buffer.clear();
  expect(buffer.cues).toEqual([]);
});

it('preserves simultaneous cues and rejects invalid or unrelated clock data', () => {
  const buffer = new LiveSubtitleBuffer();
  buffer.merge([cue(1000, 'speaker one'), cue(1000, 'speaker two')], 1500);
  expect(buffer.cues).toHaveLength(2);
  expect(new Set(buffer.cues.map((c) => c.id)).size).toBe(2);
  expect(buffer.merge([cue(1000)], NaN)).toBe(false);
  buffer.merge([cue(10 ** 12), cue(0, 'unbounded duration', 10 ** 12)], 1500);
  expect(buffer.cues).toHaveLength(2);
});

it('keeps unchanged live translations and in-flight ownership while rejecting revisions and evictions', () => {
  const state = new SubtitleSessionState();
  const first = cue(0),
    second = cue(2000);
  state.replaceTrack(track([first, second]));
  const stable = state.token(first)!;
  const revised = state.token(second)!;
  state.acceptResult(stable, '保留');
  state.updateLiveTrack(track([first, { ...second, text: 'corrected' }, cue(4000)]));
  expect(state.translation(first)).toBe('保留');
  expect(state.acceptResult(stable, '仍有效')).toBe(true);
  expect(state.acceptResult(revised, '过期')).toBe(false);
  state.updateLiveTrack(track([cue(4000)]));
  expect(state.acceptResult(stable, '已淘汰')).toBe(false);
  state.updateLiveTrack({ ...track([first]), contentVersion: 'stream:2' });
  expect(state.acceptResult(stable, '旧直播')).toBe(false);
});

it('stays bounded through six hours of additions and repopulates a distant DVR window', () => {
  const buffer = new LiveSubtitleBuffer();
  for (let time = 0; time < 6 * 60 * 60_000; time += 10_000) {
    buffer.merge([cue(time, 'live line')], time);
    expect(buffer.cues.length).toBeLessThanOrEqual(LIVE_MAX_CUES);
  }
  expect(buffer.cues[0].startMs).toBeGreaterThan(4 * 60 * 60_000);
  buffer.merge([cue(10_000, 'DVR line')], 10_000);
  expect(buffer.cues.map((c) => c.text)).toEqual(['DVR line']);
});
