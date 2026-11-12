// @vitest-environment happy-dom
import type { ReactElement } from 'react';
import { MantineProvider } from '@mantine/core';
import { act, cleanup, fireEvent, render as renderTree } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SurfaceProvider } from '@/surface/context';
import { SatelliteOutlet } from '@/surface/satellite';
import { SATELLITE_TAG } from '@/constants';
import type { VideoSubtitleView } from '@/dom/video-subtitles/runtime';
import { m } from '@/paraglide/messages';
import { defaultVideoSubtitles } from '@/services/config/video-subtitles';
import { mountVideoSubtitleRenderer, PlayerSubtitles } from './renderer';

const render = (node: ReactElement) => renderTree(<MantineProvider env="test">{node}</MantineProvider>);
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
  it('only moves focus into the panel when opened from the keyboard', () => {
    const view = render(<PlayerSubtitles view={fixture()} actions={actions()} />);
    const trigger = view.getByRole('button', { name: m.video_subtitles_title() });
    trigger.focus();
    fireEvent.click(trigger, { detail: 1 });
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger, { detail: 1 });
    fireEvent.click(trigger, { detail: 0 });
    expect(document.activeElement).toBe(
      view.getByLabelText(m.display_label(), { selector: 'input:not([type="hidden"])' })
    );
  });
  it('restores the open panel and focused control after a satellite remount', () => {
    const uiState = { open: false, focusControl: undefined as number | undefined };
    const commands = {
      ...actions(),
      uiState,
      saveUiState: (patch: Partial<typeof uiState>) => Object.assign(uiState, patch),
    };
    const first = render(<PlayerSubtitles view={fixture()} actions={commands} />);
    fireEvent.click(first.getByRole('button', { name: m.video_subtitles_title() }), { detail: 1 });
    const target = first.getByLabelText(m.settings_target_label(), {
      exact: false,
      selector: 'input:not([type="hidden"])',
    });
    act(() => target.focus());
    expect(uiState.open).toBe(true);
    first.unmount();
    const second = render(<PlayerSubtitles view={fixture()} actions={commands} />);
    expect(second.getByRole('dialog')).toBeTruthy();
    expect(document.activeElement).toBe(
      second.getByLabelText(m.settings_target_label(), { exact: false, selector: 'input:not([type="hidden"])' })
    );
  });
  it('saves target inheritance semantics and restores focus on Escape without changing the playback toggle', async () => {
    const commands = actions();
    const data = fixture();
    const view = render(<PlayerSubtitles view={data} actions={commands} />);
    const trigger = view.getByRole('button', { name: m.video_subtitles_title() });
    fireEvent.click(trigger);
    const target = view.getByLabelText(m.settings_target_label(), {
      exact: false,
      selector: 'input:not([type="hidden"])',
    });
    fireEvent.click(target);
    await act(async () => {
      fireEvent.click(view.getByRole('option', { name: '日本語' }));
    });
    expect(commands.patch).toHaveBeenLastCalledWith({ translation: { target: { mode: 'fixed', language: 'ja' } } });
    data.settings.config.translation.target = { mode: 'fixed', language: 'ja' };
    view.rerender(
      <MantineProvider env="test">
        <PlayerSubtitles view={data} actions={commands} />
      </MantineProvider>
    );
    fireEvent.click(target);
    await act(async () => {
      fireEvent.click(view.getByRole('option', { name: m.video_subtitles_inherit() }));
    });
    expect(commands.patch).toHaveBeenLastCalledWith({ translation: { target: { mode: 'inherit' } } });
    fireEvent.click(target);
    expect(target.getAttribute('aria-expanded')).toBe('true');
    fireEvent.keyDown(target, { key: 'Escape' });
    expect(target.getAttribute('aria-expanded')).toBe('false');
    expect(view.queryByRole('dialog')).not.toBeNull();
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
    expect(
      (
        view.getByLabelText(m.settings_default_provider(), {
          exact: false,
          selector: 'input:not([type="hidden"])',
        }) as HTMLInputElement
      ).value
    ).toBe(m.video_subtitles_unavailable());
    expect(view.getByRole('button', { name: m.common_retry() })).toBeTruthy();
  });
  it('shows an actionable error when a preference write fails', async () => {
    const commands = actions();
    commands.patch.mockRejectedValueOnce(new Error('disconnected'));
    const view = render(<PlayerSubtitles view={fixture()} actions={commands} />);
    fireEvent.click(view.getByRole('button', { name: m.video_subtitles_title() }));
    fireEvent.click(view.getByLabelText(m.display_label(), { selector: 'input:not([type="hidden"])' }));
    await act(async () => {
      fireEvent.click(view.getByRole('option', { name: m.display_original() }));
    });
    expect(view.getByRole('alert').textContent).toBe(m.video_subtitles_operation_failed());
  });
});

it('mounts through the host outlet, shares styles/theme, preserves controls across updates and isolates keys', async () => {
  const host = document.createElement('div');
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = '.test-shared { color: red; }';
  const rootElement = document.createElement('div');
  shadowRoot.append(style, rootElement);
  const view = render(
    <SurfaceProvider
      env={{
        kind: 'shadow',
        rootElement,
        portalTarget: rootElement,
        shadowRoot,
        scale: 1,
        colorSchemeStrategy: 'extension',
      }}
    >
      <MantineProvider forceColorScheme="dark">
        <SatelliteOutlet />
        <div data-testid="player" />
      </MantineProvider>
    </SurfaceProvider>
  );
  const player = view.getByTestId('player');
  const uiState = { open: false, focusControl: undefined as number | undefined };
  const commands = {
    ...actions(),
    uiState,
    saveUiState: (patch: Partial<typeof uiState>) => Object.assign(uiState, patch),
  };
  let renderer = mountVideoSubtitleRenderer(player, commands);
  await act(async () => renderer.render(fixture()));
  const satellite = player.querySelector(SATELLITE_TAG)!;
  const shadow = satellite.shadowRoot!;
  expect(renderer.isConnected?.()).toBe(true);
  expect(shadow.querySelector('[data-mantine-color-scheme="dark"]')).toBeTruthy();
  expect(shadow.adoptedStyleSheets.length).toBeGreaterThan(0);
  expect(shadow.textContent).toContain('你好');
  const settings = shadow.querySelector<HTMLButtonElement>(`button[aria-label="${m.video_subtitles_title()}"]`)!;
  await act(async () => fireEvent.click(settings));
  expect(shadow.querySelector('[role="dialog"]')).toBeTruthy();
  await act(async () => renderer.render({ ...fixture(), translation: 'Updated' }));
  expect(shadow.querySelector('[role="dialog"]')).toBeTruthy();
  expect(shadow.textContent).toContain('Updated');
  const key = vi.fn();
  player.addEventListener('keydown', key);
  shadow
    .querySelector('input[role=combobox]')!
    .dispatchEvent(new KeyboardEvent('keydown', { key: 'k', bubbles: true, composed: true }));
  expect(key).not.toHaveBeenCalled();
  await act(async () => shadow.querySelectorAll<HTMLInputElement>('input:not([type="hidden"])')[1].focus());
  expect(uiState.focusControl).toBeGreaterThanOrEqual(0);
  await act(async () => renderer.dispose());
  renderer = mountVideoSubtitleRenderer(player, commands);
  await act(async () => renderer.render(fixture()));
  const replacement = player.querySelector(SATELLITE_TAG)!.shadowRoot!;
  expect(replacement.querySelector('[role="dialog"]')).toBeTruthy();
  expect(replacement.activeElement).toBe(replacement.querySelectorAll('input:not([type="hidden"])')[1]);

  await act(async () => renderer.dispose());
  expect(player.querySelector(SATELLITE_TAG)).toBeNull();
  expect(renderer.isConnected?.()).toBe(false);
});
