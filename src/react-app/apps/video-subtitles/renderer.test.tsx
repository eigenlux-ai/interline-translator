// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { VideoSubtitleView } from '@/dom/video-subtitles/runtime';
import { m } from '@/paraglide/messages';
import { defaultVideoSubtitles } from '@/services/config/video-subtitles';
import { PlayerSubtitles } from './renderer';

afterEach(cleanup);
function fixture(): VideoSubtitleView {
  return {
    enabled: true,
    original: 'Hello',
    translation: '你好',
    status: 'ready',
    sourceLanguage: 'en',
    settings: {
      config: defaultVideoSubtitles(),
      allowed: true,
      targetLanguage: 'zh-CN',
      providerId: 'mt',
      providerKind: 'google-mt',
      providers: [{ id: 'mt', label: 'Free', kind: 'google-mt' }],
    },
  };
}
const actions = () => ({ toggle: vi.fn(), fail: vi.fn(), retry: vi.fn(), more: vi.fn(), patch: vi.fn(async () => {}) });

describe('player subtitle controls', () => {
  it('saves target inheritance semantics and restores focus on Escape without changing the playback toggle', async () => {
    const commands = actions();
    const view = render(<PlayerSubtitles view={fixture()} actions={commands} />);
    const trigger = view.getByRole('button', { name: m.video_subtitles_title() });
    fireEvent.click(trigger);
    const target = view.getByLabelText(m.settings_target_label(), { exact: false });
    await act(async () => {
      fireEvent.change(target, { target: { value: 'ja' } });
    });
    expect(commands.patch).toHaveBeenLastCalledWith({ translation: { target: { mode: 'fixed', language: 'ja' } } });
    await act(async () => {
      fireEvent.change(target, { target: { value: '' } });
    });
    expect(commands.patch).toHaveBeenLastCalledWith({ translation: { target: { mode: 'inherit' } } });
    fireEvent.keyDown(target, { key: 'Escape' });
    expect(view.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(commands.toggle).not.toHaveBeenCalled();
  });
  it('keeps a deleted fixed service selected, shows its error, and preserves the original on failed translation', () => {
    const data = fixture();
    data.settings.config.translation.provider = { mode: 'fixed', providerId: 'deleted' };
    data.settings.providerId = undefined;
    data.settings.config.appearance.displayMode = 'translation';
    data.translation = '';
    data.status = 'translation-failed';
    const view = render(<PlayerSubtitles view={data} actions={actions()} />);
    expect(view.getByText('Hello')).toBeTruthy();
    fireEvent.click(view.getByRole('button', { name: m.video_subtitles_title() }));
    expect((view.getByLabelText(m.settings_default_provider(), { exact: false }) as HTMLSelectElement).value).toBe(
      'deleted'
    );
    expect(view.getByRole('button', { name: m.common_retry() })).toBeTruthy();
  });
  it('shows an actionable error when a preference write fails', async () => {
    const commands = actions();
    commands.patch.mockRejectedValueOnce(new Error('disconnected'));
    const view = render(<PlayerSubtitles view={fixture()} actions={commands} />);
    fireEvent.click(view.getByRole('button', { name: m.video_subtitles_title() }));
    await act(async () => {
      fireEvent.change(view.getByLabelText(m.display_label()), { target: { value: 'original' } });
    });
    expect(view.getByRole('alert').textContent).toBe(m.video_subtitles_operation_failed());
  });
});
