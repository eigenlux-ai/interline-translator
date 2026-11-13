import { Window as HappyWindow } from 'happy-dom';
import { expect, it } from 'vitest';
import { createYoutubeAdapter } from './adapter';

it('owns embed video identity, media, frame and fullscreen mount independently', () => {
  const browsers = [
    new HappyWindow({ url: 'https://www.youtube.com/embed/video_123' }),
    new HappyWindow({ url: 'https://www.youtube-nocookie.com/embed/video_456' }),
  ];
  const windows = browsers.map((browser) => browser as unknown as Window);
  for (const win of windows)
    win.document.body.innerHTML =
      '<div id="player"><div id="movie_player"><video></video></div></div><div id="player-controls"></div>';
  let id = 'video_123';
  const first = createYoutubeAdapter(windows[0], () => id)!;
  const second = createYoutubeAdapter(windows[1], () => 'video_456')!;
  expect(first.mount()).toBe(windows[0].document.body);
  expect(second.mount()).toBe(windows[1].document.body);
  id = 'video_789';
  expect(first.matches()).toBe(false);
  expect(second.matches()).toBe(true);
  id = 'video_123';
  const fullscreen = windows[0].document.querySelector<HTMLElement>('#player')!;
  Object.defineProperty(windows[0].document, 'fullscreenElement', { configurable: true, value: fullscreen });
  expect(first.matches()).toBe(true);
  expect(first.mount()).toBe(fullscreen);
  Object.defineProperty(windows[0].document, 'fullscreenElement', { configurable: true, value: null });
  expect(first.matches()).toBe(true);
  expect(first.mount()).toBe(windows[0].document.body);
  windows[0].document.querySelector('video')!.replaceWith(windows[0].document.createElement('video'));
  expect(first.matches()).toBe(false);
  expect(second.matches()).toBe(true);
  for (const adapter of [first, second]) adapter.dispose();
  for (const browser of browsers) void browser.happyDOM.abort();
});
