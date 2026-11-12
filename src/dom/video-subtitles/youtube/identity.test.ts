import { Window as HappyWindow } from 'happy-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { BRIDGE_RESPONSE } from './bridge-protocol';
import { observeYoutubeIdentity } from './identity';

let browser: HappyWindow;
let win: Window;
let identity: ReturnType<typeof observeYoutubeIdentity>;
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
  win.document.body.innerHTML = '<div id="movie_player"><video></video></div>';
  identity = observeYoutubeIdentity(win, changed);
  vi.advanceTimersByTime(250);
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
  const video = win.document.querySelector('video')!;
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

it('confirms Shorts reuse against route and player, ignoring preload media and late replies', () => {
  browser.location.href = 'https://www.youtube.com/shorts/video_123';
  win.document.body.innerHTML =
    '<ytd-reel-video-renderer><div class="html5-video-player"><video></video></div><a href="/shorts/video_123">short</a></ytd-reel-video-renderer><video id="preload"></video>';
  const player = win.document.querySelector<HTMLElement>('.html5-video-player')!;
  player.getBoundingClientRect = () =>
    ({ top: 0, bottom: 500, left: 0, right: 300, width: 300, height: 500 }) as DOMRect;
  vi.advanceTimersByTime(250);
  reply('video_123');
  expect(identity.videoId()).toBe('video_123');
  const calls = posted.mock.calls.length;
  win.document.querySelector('#preload')!.dispatchEvent(new browser.Event('loadedmetadata') as unknown as Event);
  expect(posted).toHaveBeenCalledTimes(calls);
  expect(identity.videoId()).toBe('video_123');
  vi.advanceTimersByTime(250);
  const oldRequest = posted.mock.lastCall![0].requestId;
  browser.location.href = 'https://www.youtube.com/shorts/video_456';
  win.document.querySelector('a')!.href = '/shorts/video_456';
  expect(identity.videoId()).toBeNull();
  reply('video_123', oldRequest);
  expect(identity.videoId()).toBeNull();
  vi.advanceTimersByTime(250);
  reply('video_123');
  expect(identity.videoId()).toBeNull();
  vi.advanceTimersByTime(250);
  reply('video_456');
  expect(identity.videoId()).toBe('video_456');
  vi.advanceTimersByTime(5000);
  expect(identity.videoId()).toBe('video_456'); // Background throttling does not discard a confirmed route.
  const video = player.querySelector('video')!;
  video.currentTime = 47;
  video.dispatchEvent(new browser.Event('timeupdate') as unknown as Event);
  video.currentTime = 0;
  video.dispatchEvent(new browser.Event('timeupdate') as unknown as Event);
  expect(identity.videoId()).toBe('video_456');
  browser.location.href = 'https://www.youtube.com/watch?v=video_789';
  expect(identity.videoId()).toBe('video_789');
});

it('discovers channel live landing pages and confirms explicit live video links', () => {
  browser.location.href = 'https://www.youtube.com/@channel/live';
  vi.advanceTimersByTime(250);
  reply('video_123');
  expect(identity.videoId()).toBe('video_123');
  browser.location.href = 'https://www.youtube.com/live/video_456';
  expect(identity.videoId()).toBeNull();
  vi.advanceTimersByTime(250);
  reply('video_123');
  expect(identity.videoId()).toBeNull();
  vi.advanceTimersByTime(250);
  reply('video_456');
  expect(identity.videoId()).toBe('video_456');
});
