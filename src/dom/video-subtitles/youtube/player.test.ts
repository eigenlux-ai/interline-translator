import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createYoutubeAdapter } from './adapter';
import { youtubePlayer } from './player';

const originalUrl = location.href;
beforeEach(() => {
  window.location.href = 'https://www.youtube.com/shorts/video_123';
  document.body.innerHTML = '<div id="movie_player"><video></video></div>';
});
afterEach(() => {
  document.body.innerHTML = '';
  window.location.href = originalUrl;
  vi.restoreAllMocks();
  Reflect.deleteProperty(document, 'fullscreenElement');
});
function reel(id: string, top = 0) {
  const element = document.createElement('ytd-reel-video-renderer');
  element.innerHTML = `<div id="player-container"><div class="html5-video-player" id="shorts-player"><video></video></div></div><a href="/shorts/${id}">video</a>`;
  document.body.append(element);
  const player = element.querySelector<HTMLElement>('.html5-video-player')!;
  vi.spyOn(player, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom: top + 500,
    left: 0,
    right: 300,
    width: 300,
    height: 500,
  } as DOMRect);
  return { element, player, video: player.querySelector('video')! };
}
it('selects the current visible paused Short instead of watch or preloaded players', () => {
  reel('video_456', -600);
  const active = reel('video_123');
  reel('video_789', 1000);
  expect(active.video.paused).toBe(true);
  expect(youtubePlayer(window)).toBe(active.player);
  const adapter = createYoutubeAdapter(window)!;
  expect(adapter.mount()).toBe(active.player.parentElement);
  const restore = adapter.hideNativeCaptions();
  expect(active.player.querySelector('style')?.textContent).toContain('subtitle-custody');
  expect(document.querySelector('#movie_player style')).toBeNull();
  restore();
  expect(active.player.querySelector('style')).toBeNull();
  adapter.dispose();
});
it('invalidates a reused player immediately when the route and reel identity disagree', () => {
  const active = reel('video_123');
  const adapter = createYoutubeAdapter(window)!;
  window.location.href = 'https://www.youtube.com/shorts/video_456';
  expect(youtubePlayer(window)).toBeNull();
  expect(adapter.matches()).toBe(false);
  active.element.querySelector('a')!.href = '/shorts/video_456';
  expect(youtubePlayer(window)).toBe(active.player);
  expect(adapter.matches()).toBe(false);
  adapter.dispose();
});
it('does not select hidden, offscreen or ambiguous duplicate reels', () => {
  const active = reel('video_123');
  active.element.hidden = true;
  expect(youtubePlayer(window)).toBeNull();
  active.element.hidden = false;
  const duplicate = reel('video_123');
  expect(youtubePlayer(window)).toBeNull();
  duplicate.element.remove();
  expect(youtubePlayer(window)).toBe(active.player);
  active.player.getBoundingClientRect = () =>
    ({ top: -600, bottom: -100, left: 0, right: 300, width: 300, height: 500 }) as DOMRect;
  expect(youtubePlayer(window)).toBeNull();
});
it('returns to the ordinary watch player after leaving Shorts', () => {
  reel('video_123');
  window.location.href = 'https://www.youtube.com/watch?v=video_456';
  expect(youtubePlayer(window)).toBe(document.querySelector('#movie_player'));
});

it('keeps video bounds in document fullscreen and remounts for player-only fullscreen', () => {
  const active = reel('video_123');
  const adapter = createYoutubeAdapter(window)!;
  const fullscreen = vi.fn();
  Object.defineProperty(document, 'fullscreenElement', { configurable: true, get: fullscreen });
  fullscreen.mockReturnValue(document.documentElement);
  expect(adapter.matches()).toBe(true);
  expect(adapter.mount()).toBe(active.player.parentElement);
  fullscreen.mockReturnValue(active.player);
  expect(adapter.matches()).toBe(false);
  const replacement = createYoutubeAdapter(window)!;
  expect(replacement.mount()).toBe(active.player);
  replacement.dispose();
  adapter.dispose();
});
