import { describe, expect, it } from 'vitest';
import {
  BRIDGE_REQUEST,
  BRIDGE_RESPONSE,
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
      'https://www.youtube.com/shorts/video_123',
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
