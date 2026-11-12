import { describe, expect, it } from 'vitest';
import {
  BRIDGE_REQUEST,
  BRIDGE_RESPONSE,
  isYoutubeEmbed,
  isYoutubeShorts,
  MAX_SUBTITLE_BYTES,
  safeTimedTextUrl,
  validBridgeRequest,
  validBridgeResponse,
  youtubeVideoId,
} from './bridge-protocol';

const snapshot = {
  videoId: 'video_123',
  title: '',
  ad: false,
  hasTracks: true,
  track: { id: '.en', language: 'en', kind: 'manual' },
};

describe('YouTube bridge protocol boundary', () => {
  it('limits watch URLs and timedtext requests to HTTPS YouTube and the exact video', () => {
    expect(youtubeVideoId('https://www.youtube.com/watch?v=video_123')).toBe('video_123');
    for (const url of [
      'https://youtube.com.evil.test/watch?v=video_123',
      'http://youtube.com/watch?v=video_123',
      'https://user@youtube.com/watch?v=video_123',
      'https://youtube.com:444/watch?v=video_123',
    ])
      expect(youtubeVideoId(url)).toBeNull();
    expect(
      safeTimedTextUrl('https://www.youtube.com/api/timedtext?v=video_123&pot=private', 'video_123')
    ).toBeInstanceOf(URL);
    for (const url of [
      'https://www.youtube.com/api/timedtext?v=other_123',
      'https://youtube.com.evil.test/api/timedtext?v=video_123',
      'https://www.youtube.com/api/timedtext/extra?v=video_123',
    ])
      expect(safeTimedTextUrl(url, 'video_123')).toBeNull();
  });

  it('recognizes supported HTTPS embed paths and bounds privacy-enhanced timedtext', () => {
    for (const host of ['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com'])
      expect(isYoutubeEmbed(`https://${host}/embed/video_123?enablejsapi=1`)).toBe(true);
    for (const url of [
      'https://youtube.com.evil.test/embed/video_123',
      'https://youtube-nocookie.com/watch?v=video_123',
      'https://youtube.com/embed/video_123/extra',
      'http://youtube.com/embed/video_123',
    ])
      expect(isYoutubeEmbed(url)).toBe(false);
    expect(safeTimedTextUrl('https://youtube-nocookie.com/api/timedtext?v=video_123', 'video_123')).toBeInstanceOf(URL);
  });

  it('accepts exact Shorts paths only on HTTPS YouTube, excluding lookalikes and privacy watch pages', () => {
    expect(youtubeVideoId('https://www.youtube.com/shorts/video_123?feature=share')).toBe('video_123');
    for (const value of [
      'https://youtube.com/shorts/',
      'https://youtube.com/shorts/video_123/extra',
      'https://youtube-nocookie.com/shorts/video_123',
      'https://youtube.com.evil.test/shorts/video_123',
      'http://youtube.com/shorts/video_123',
    ]) {
      expect(youtubeVideoId(value)).toBeNull();
      expect(isYoutubeShorts(value)).toBe(false);
    }
  });

  it('validates actions, identity, track metadata and response budgets at runtime', () => {
    expect(
      validBridgeRequest({
        type: BRIDGE_REQUEST,
        version: 1,
        requestId: 'read',
        action: 'read',
        enableCaptions: true,
        knownTrackId: '',
      })
    ).toBe(true);
    expect(
      validBridgeRequest({
        type: BRIDGE_REQUEST,
        version: 1,
        requestId: 'retry',
        action: 'read',
        enableCaptions: true,
        resetRetry: true,
      })
    ).toBe(true);
    expect(
      validBridgeRequest({
        type: BRIDGE_REQUEST,
        version: 1,
        requestId: 'retry',
        action: 'read',
        enableCaptions: true,
        resetRetry: 'yes',
      })
    ).toBe(false);
    expect(validBridgeRequest({ type: BRIDGE_REQUEST, version: 1, requestId: 'stop', action: 'stop' })).toBe(true);
    expect(validBridgeRequest({ type: BRIDGE_REQUEST, version: 1, requestId: 'read', action: 'read' })).toBe(false);
    expect(validBridgeRequest({ type: BRIDGE_REQUEST, version: 1, requestId: '', action: 'stop' })).toBe(false);
    const response = { type: BRIDGE_RESPONSE, version: 1, requestId: 'a', snapshot, text: 'caption' };
    expect(validBridgeResponse(response)).toBe(true);
    expect(validBridgeResponse({ ...response, snapshot: { ...snapshot, domLanguage: 'fr' } })).toBe(true);
    expect(validBridgeResponse({ ...response, snapshot: { ...snapshot, domLanguage: 42 } })).toBe(false);
    expect(validBridgeResponse({ ...response, snapshot: { ...snapshot, domLanguage: 'x'.repeat(51) } })).toBe(false);
    expect(validBridgeResponse({ ...response, version: 2 })).toBe(false);
    expect(validBridgeResponse({ ...response, error: 'unknown' })).toBe(false);
    expect(validBridgeResponse({ ...response, snapshot: { ...snapshot, videoId: 'bad' } })).toBe(false);
    expect(validBridgeResponse({ ...response, snapshot: { ...snapshot, hasTracks: false } })).toBe(false);
    expect(validBridgeResponse({ ...response, snapshot: { ...snapshot, track: { ...snapshot.track, id: '' } } })).toBe(
      false
    );
    expect(validBridgeResponse({ ...response, text: '字'.repeat(Math.floor(MAX_SUBTITLE_BYTES / 3) + 1) })).toBe(false);
  });
});
