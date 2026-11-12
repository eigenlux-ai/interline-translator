import { Window as HappyWindow } from 'happy-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { BRIDGE_RESPONSE } from './bridge-protocol';
import { observeEmbedIdentity } from './embed-identity';

let browser: HappyWindow;
let win: Window;
let identity: ReturnType<typeof observeEmbedIdentity>;
let posted: ReturnType<typeof vi.fn<(message: { requestId: string }) => void>>;
let changed: ReturnType<typeof vi.fn<() => void>>;
beforeEach(() => {
  vi.useFakeTimers();
  browser = new HappyWindow({ url: 'https://www.youtube.com/embed/video_123' });
  win = browser as unknown as Window;
  win.setInterval = globalThis.setInterval.bind(globalThis);
  win.clearInterval = globalThis.clearInterval.bind(globalThis);
  posted = vi.fn();
  win.postMessage = posted;
  changed = vi.fn();
  identity = observeEmbedIdentity(win, changed);
});
afterEach(() => {
  identity.dispose();
  browser.happyDOM.abort();
  vi.useRealTimers();
});
function reply(videoId: string, requestId = posted.mock.lastCall![0].requestId, source: unknown = browser) {
  win.dispatchEvent(
    new browser.MessageEvent('message', {
      origin: win.location.origin,
      source: source as unknown as typeof browser,
      data: {
        type: BRIDGE_RESPONSE,
        version: 1,
        requestId,
        snapshot: { videoId, title: '', ad: false, hasTracks: false, track: null },
      },
    }) as unknown as MessageEvent
  );
}
it('discovers reused-player transitions without enabling captions and rejects stale/foreign replies', () => {
  expect(posted.mock.lastCall![0]).toMatchObject({ action: 'identify' });
  reply('video_123');
  expect(identity.videoId()).toBe('video_123');
  vi.advanceTimersByTime(250);
  const stale = posted.mock.lastCall![0].requestId;
  vi.advanceTimersByTime(250);
  reply('video_456');
  reply('video_123', stale);
  expect(identity.videoId()).toBe('video_456');
  vi.advanceTimersByTime(250);
  reply('video_789', undefined, null);
  expect(identity.videoId()).toBe('video_456');
});
it('drops identity on media reuse, missing bridge, and pagehide; resumes after pageshow', () => {
  reply('video_123');
  const video = win.document.createElement('video');
  win.document.body.append(video);
  video.dispatchEvent(new browser.Event('emptied') as unknown as Event);
  expect(identity.videoId()).toBeNull();
  reply('video_456');
  vi.advanceTimersByTime(1750);
  expect(identity.videoId()).toBeNull();
  reply('video_456');
  win.dispatchEvent(new browser.Event('pagehide') as unknown as Event);
  expect(identity.videoId()).toBeNull();
  const calls = posted.mock.calls.length;
  vi.advanceTimersByTime(1000);
  expect(posted).toHaveBeenCalledTimes(calls);
  win.dispatchEvent(new browser.Event('pageshow') as unknown as Event);
  reply('video_789');
  expect(identity.videoId()).toBe('video_789');
  identity.dispose();
  vi.advanceTimersByTime(1000);
  expect(posted).toHaveBeenCalledTimes(calls + 1);
});
