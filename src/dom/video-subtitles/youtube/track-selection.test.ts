import { expect, it } from 'vitest';
import { audioCaptionIndex } from './track-selection';

it('handles absolute and audio-local defaults without accepting invalid indices', () => {
  expect(audioCaptionIndex({ captionTrackIndices: [2, 4], defaultCaptionTrackIndex: 4 }, 5)).toBe(4);
  expect(audioCaptionIndex({ captionTrackIndices: [2, 4], defaultCaptionTrackIndex: 1 }, 5)).toBe(4);
  for (const index of [-1, 0.5, NaN, Infinity, 7])
    expect(audioCaptionIndex({ defaultCaptionTrackIndex: index }, 5)).toBeUndefined();
  expect(audioCaptionIndex(undefined, 5)).toBeUndefined();
});
