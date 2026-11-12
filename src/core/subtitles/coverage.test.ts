import { expect, it } from 'vitest';
import { coversSubtitleInterval } from './coverage';
import { SubtitleTimeline } from './timeline';

it('merges overlapping target intervals but never suppresses an uncovered gap', () => {
  const cues = [
    [0, 1000],
    [900, 2000],
    [2500, 3000],
  ].map(([startMs, endMs], i) => ({ id: String(i), startMs, endMs, text: 'target' }));
  const timeline = new SubtitleTimeline(cues);
  expect(coversSubtitleInterval(timeline, 500, 2000)).toBe(true);
  expect(coversSubtitleInterval(timeline, 500, 2800)).toBe(false);
  expect(coversSubtitleInterval(timeline, 2000, 2500)).toBe(false);
});
