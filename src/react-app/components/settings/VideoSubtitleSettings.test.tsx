// @vitest-environment happy-dom
import { fakeBrowser } from 'wxt/testing/fake-browser';
import { MantineProvider } from '@mantine/core';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { m } from '@/paraglide/messages';
import { defaultConfig } from '@/services/config/schema';
import VideoSubtitleSettings from './VideoSubtitleSettings';

const gateway = vi.hoisted(() => ({
  patchVideoSubtitles: vi.fn(async () => {}),
  resetVideoSubtitles: vi.fn(async () => {}),
}));
vi.mock('@/services/config/public', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/services/config/public')>()),
  getConfigService: () => gateway,
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('video subtitle settings', () => {
  it('writes only the edited appearance field and resets only subtitle preferences', async () => {
    const view = render(
      <MantineProvider>
        <VideoSubtitleSettings config={defaultConfig()} />
      </MantineProvider>
    );
    await act(async () => {
      fireEvent.change(view.getByLabelText(m.video_subtitles_font()), { target: { value: '30' } });
    });
    expect(gateway.patchVideoSubtitles).toHaveBeenLastCalledWith({ appearance: { fontSize: 30 } });
    await act(async () => {
      fireEvent.click(view.getByRole('button', { name: m.video_subtitles_reset() }));
    });
    expect(gateway.resetVideoSubtitles).toHaveBeenCalledOnce();
  });
  it('reports cache clearing only after the targeted backend operation succeeds', async () => {
    const request = vi.spyOn(fakeBrowser.runtime, 'sendMessage').mockImplementation(async () => ({ ok: false }));
    const view = render(
      <MantineProvider>
        <VideoSubtitleSettings config={defaultConfig()} />
      </MantineProvider>
    );
    await act(async () => {
      fireEvent.click(view.getByRole('button', { name: m.video_subtitles_clear() }));
    });
    expect(request).toHaveBeenCalledWith({ type: 'subtitle:clear-cache', version: 1 });
    expect(view.getByRole('status').textContent).toBe(m.video_subtitles_operation_failed());
    request.mockImplementationOnce(async () => ({ ok: true }));
    await act(async () => {
      fireEvent.click(view.getByRole('button', { name: m.video_subtitles_clear() }));
    });
    expect(view.getByRole('status').textContent).toBe(m.video_subtitles_saved());
  });
});
