import { StrictMode } from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { sendMessage } from '@/core/messaging';
import { defaultVideoSubtitles } from '@/services/config/video-subtitles';
import VideoSubtitleApp from './App';

const mocks = vi.hoisted(() => ({
  runtime: vi.fn(),
  dispose: vi.fn(),
  configure: vi.fn(),
  unwatch: vi.fn(),
  getConfig: vi.fn(),
  watch: vi.fn(),
}));
vi.mock('@/core/messaging', () => ({ sendMessage: vi.fn(async () => ({ hosts: ['www.youtube.com'] })) }));
vi.mock('@/dom/video-subtitles/runtime', () => ({ createYoutubeSubtitleRuntime: mocks.runtime }));
vi.mock('@/services/config/public', () => ({
  getPublicConfig: mocks.getConfig,
  watchPublicConfig: mocks.watch,
  getConfigService: vi.fn(),
}));
vi.mock('@/i18n', () => ({ syncUiLocaleFrom: vi.fn() }));
vi.mock('./renderer', () => ({ mountVideoSubtitleRenderer: vi.fn() }));
const originalUrl = location.href;
afterEach(() => {
  cleanup();
  window.location.href = originalUrl;
  vi.resetAllMocks();
});

it('owns one runtime under StrictMode and tears down both its subscription and runtime', async () => {
  window.location.href = 'https://www.youtube.com/watch?v=abcdefghi12';
  mocks.getConfig.mockResolvedValue({
    videoSubtitles: defaultVideoSubtitles(),
    translate: { target: 'zh-CN' },
    effectiveSubtitleProvider: { id: 'mt', kind: 'google-mt' },
    availableProviders: [],
    siteControl: { defaultMode: 'auto', rules: [] },
  });
  mocks.runtime.mockReturnValue({ dispose: mocks.dispose, configure: mocks.configure });
  mocks.watch.mockReturnValue(mocks.unwatch);
  const view = render(
    <StrictMode>
      <VideoSubtitleApp />
    </StrictMode>
  );
  await act(async () => {});
  expect(mocks.runtime).toHaveBeenCalledTimes(1);
  expect(mocks.watch).toHaveBeenCalledTimes(1);
  view.unmount();
  expect(mocks.dispose).toHaveBeenCalledTimes(1);
  expect(mocks.unwatch).toHaveBeenCalledTimes(1);
});

it('does not start subtitle services on unrelated sites', async () => {
  window.location.href = 'https://example.com/';
  render(<VideoSubtitleApp />);
  await act(async () => {});
  expect(mocks.getConfig).not.toHaveBeenCalled();
  expect(mocks.runtime).not.toHaveBeenCalled();
});

it('applies the embedding-site block to both machine and human subtitle paths and reacts to policy changes', async () => {
  window.location.href = 'https://www.youtube.com/embed/video_123';
  vi.mocked(sendMessage).mockResolvedValue({ hosts: ['example.com', 'www.youtube.com'] });
  const config = {
    videoSubtitles: defaultVideoSubtitles(),
    translate: { target: 'zh-CN' },
    effectiveSubtitleProvider: { id: 'mt', kind: 'google-mt' },
    availableProviders: [],
    siteControl: { defaultMode: 'auto', rules: [{ pattern: 'example.com', mode: 'never' }] },
  };
  mocks.getConfig.mockResolvedValue(config);
  mocks.runtime.mockReturnValue({ dispose: mocks.dispose, configure: mocks.configure });
  mocks.watch.mockReturnValue(mocks.unwatch);
  const view = render(<VideoSubtitleApp />);
  await act(async () => {});
  expect(mocks.runtime.mock.calls[0][1].allowed).toBe(false);
  await act(async () => mocks.watch.mock.calls[0][0]({ ...config, siteControl: { defaultMode: 'auto', rules: [] } }));
  expect(mocks.configure.mock.lastCall?.[0].allowed).toBe(true);
  view.unmount();
  expect(mocks.dispose).toHaveBeenCalledTimes(1);
});
