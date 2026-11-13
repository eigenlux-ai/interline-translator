import { Component, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ActionIcon, Button, CloseButton, Group, Paper, Select, Stack, Switch, Text } from '@mantine/core';
import { createSatellite } from '@/surface/satellite';
import { isYoutubeEmbed, isYoutubeShorts } from '@/core/subtitles/youtube-url';
import { GearIcon } from '@/react-app/components/icons';
import { langOptions } from '@/data/models';
import { RTL_UI_LANGS } from '@/data/models/lang';
import { createNativeSubtitleRenderer } from '@/dom/video-subtitles/native-renderer';
import type {
  VideoSubtitleRenderer,
  VideoSubtitleRuntimePorts,
  VideoSubtitleView,
} from '@/dom/video-subtitles/runtime';
import { getUiLocale } from '@/i18n';
import { m } from '@/paraglide/messages';
import classes from './renderer.module.css';

const LANGUAGES = langOptions();
const statusText = (status: VideoSubtitleView['status']) =>
  ({
    ready: '',
    fetching: m.video_subtitles_fetching(),
    'no-captions': m.video_subtitles_no_captions(),
    'fetch-failed': m.video_subtitles_fetch_failed(),
    'rate-limited': m.error_rate_limited(),
    'translation-failed': m.video_subtitles_translation_failed(),
    loading: m.video_subtitles_loading(),
    unavailable: m.video_subtitles_unavailable(),
    dom: m.video_subtitles_dom(),
  })[status];
type Actions = Parameters<VideoSubtitleRuntimePorts['render']>[1];
export function PlayerSubtitles({ view, actions }: { view: VideoSubtitleView; actions: Actions }) {
  const [open, updateOpen] = useState(actions.uiState?.open ?? false);
  const saveUiState = actions.saveUiState;
  const setOpen = useCallback(
    (value: boolean) => {
      saveUiState?.({ open: value, ...(!value ? { focusControl: undefined } : {}) });
      updateOpen(value);
    },
    [saveUiState]
  );
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null);
  const restoredFocus = useRef(actions.uiState?.focusControl);
  const [dropdownHeight, setDropdownHeight] = useState(200);
  const [error, setError] = useState(false);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef(false);
  const firstControl = useRef<HTMLInputElement>(null);
  const providerControl = useRef<HTMLInputElement>(null);
  const focusProvider = useRef(false);
  useEffect(() => {
    const element = boundary;
    if (!element) return;
    const resize = () => setDropdownHeight(Math.max(60, Math.min(200, element.clientHeight / 2)));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [boundary]);
  useEffect(() => {
    const index = restoredFocus.current;
    if (index !== undefined)
      panel.current?.querySelectorAll<HTMLElement>('input:not([type="hidden"]), button')[index]?.focus();
  }, []);
  const appearance = view.settings.config.appearance;
  const providerSelection = view.settings.config.translation.provider;
  const targetSelection = view.settings.config.translation.target;
  const effectiveProvider = view.settings.providers.find((p) => p.id === view.settings.providerId);
  const effectiveLanguage =
    LANGUAGES.find((l) => l.value === view.settings.targetLanguage)?.label ?? view.settings.targetLanguage;
  const providerMissing =
    providerSelection.mode === 'fixed' && !view.settings.providers.some((p) => p.id === providerSelection.providerId);
  const close = () => {
    setOpen(false);
    settingsButton.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    if (focusProvider.current) {
      providerControl.current?.focus();
      focusProvider.current = false;
    } else if (focusOnOpen.current) firstControl.current?.focus();
    const dismiss = (event: PointerEvent) => {
      const path = event.composedPath();
      if (!path.includes(panel.current!) && !path.includes(settingsButton.current!)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss, true);
    return () => document.removeEventListener('pointerdown', dismiss, true);
  }, [open, setOpen]);
  const selectProps = {
    allowDeselect: false,
    maxDropdownHeight: dropdownHeight,
    size: 'xs' as const,
    classNames: { label: classes.label, description: classes.description },
    // Keep menus inside the player's satellite, including in fullscreen.
    comboboxProps: {
      withinPortal: false,
      floatingStrategy: 'fixed' as const,
      middlewares: {
        flip: { boundary: boundary ?? undefined, padding: 8 },
        shift: { boundary: boundary ?? undefined, crossAxis: true, padding: 8 },
      },
    },
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      // First Escape dismisses the dropdown; a second closes the settings panel.
      if (event.key === 'Escape' && event.currentTarget.getAttribute('aria-expanded') === 'true')
        event.stopPropagation();
    },
  };
  const save = (patch: Parameters<Actions['patch']>[0]) => {
    setError(false);
    void actions.patch(patch).catch(() => setError(true));
  };
  // While a translation is pending or failed the current original stays useful.
  const original = (appearance.displayMode !== 'translation' || !view.translation) && view.original;
  const translated = appearance.displayMode !== 'original' && view.translation;
  const lines = appearance.translationPosition === 'above' ? [translated, original] : [original, translated];
  const retryable = ['fetch-failed', 'rate-limited', 'translation-failed', 'unavailable'].includes(view.status);
  const assistance = view.enabled ? view.assistance : undefined;
  const assistanceText = !assistance
    ? ''
    : assistance.kind === 'slow'
      ? assistance.canBuffer
        ? m.video_subtitles_slow()
        : m.video_subtitles_slow_live()
      : assistance.kind === 'buffer-ready'
        ? m.video_subtitles_buffer_ready()
        : assistance.kind === 'buffer-stalled'
          ? m.video_subtitles_buffer_stalled()
          : m.video_subtitles_buffering();
  return (
    <div ref={setBoundary} className={classes.root} dir={RTL_UI_LANGS[getUiLocale()] ? 'rtl' : 'ltr'}>
      <div className={classes.tools} onKeyDown={(event) => event.stopPropagation()}>
        <ActionIcon
          variant={view.enabled ? 'filled' : 'default'}
          size={34}
          radius="md"
          type="button"
          aria-label={m.video_subtitles_toggle()}
          title={m.video_subtitles_toggle()}
          aria-pressed={view.enabled}
          onClick={actions.toggle}
        >
          <Text component="span" size="xs" fw={600}>
            CC
          </Text>
        </ActionIcon>
        <ActionIcon
          variant={open ? 'light' : 'default'}
          size={34}
          radius="md"
          ref={settingsButton}
          type="button"
          aria-label={m.video_subtitles_title()}
          title={m.video_subtitles_title()}
          aria-expanded={open}
          aria-controls="subtitle-settings"
          onClick={(event) => {
            focusOnOpen.current = event.detail === 0;
            if (open) close();
            else setOpen(true);
          }}
        >
          <GearIcon width={16} height={16} />
        </ActionIcon>
      </div>
      {!open && (
        <div className={classes.assistance} hidden={!assistance} onKeyDown={(event) => event.stopPropagation()}>
          <Text size="sm" role="status">
            {assistanceText}
          </Text>
          {assistance && (
            <>
              {assistance.kind !== 'slow' && (
                <label className={classes.bufferProgress}>
                  <span>
                    {m.video_subtitles_buffer_progress({ completed: assistance.completed, total: assistance.total })}
                  </span>
                  <progress max={Math.max(1, assistance.total)} value={assistance.completed} />
                </label>
              )}
              <Group gap="xs" mt="xs">
                {assistance.kind === 'slow' && assistance.canBuffer && (
                  <Button size="xs" onClick={actions.buffer}>
                    {m.video_subtitles_buffer_action()}
                  </Button>
                )}
                {assistance.kind !== 'slow' && (
                  <Button
                    size="xs"
                    onClick={() => {
                      setError(false);
                      void actions.resume?.().catch(() => setError(true));
                    }}
                  >
                    {m.video_subtitles_resume()}
                  </Button>
                )}
                <Button
                  size="xs"
                  variant="default"
                  onClick={() => {
                    focusProvider.current = true;
                    setOpen(true);
                  }}
                >
                  {m.video_subtitles_change_engine()}
                </Button>
                {assistance.kind === 'slow' && (
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => {
                      actions.dismissAssistance?.();
                      settingsButton.current?.focus();
                    }}
                  >
                    {m.video_subtitles_dismiss_slow()}
                  </Button>
                )}
                {assistance.kind === 'buffer-stalled' && (
                  <Button size="xs" variant="subtle" onClick={actions.retry}>
                    {m.common_retry()}
                  </Button>
                )}
              </Group>
              {error && (
                <Text size="xs" c="red" role="alert">
                  {m.video_subtitles_operation_failed()}
                </Text>
              )}
            </>
          )}
        </div>
      )}
      {open && (
        <Paper
          withBorder
          shadow="lg"
          ref={panel}
          id="subtitle-settings"
          className={classes.panel}
          role="dialog"
          onFocusCapture={(event) => {
            saveUiState?.({
              focusControl: Array.from(
                panel.current?.querySelectorAll('input:not([type="hidden"]), button') ?? []
              ).indexOf(event.nativeEvent.composedPath()[0] as Element),
            });
          }}
          onBlurCapture={(event) => {
            if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node))
              saveUiState?.({ focusControl: undefined });
          }}
          aria-label={m.video_subtitles_title()}
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === 'Escape') {
              event.preventDefault();
              close();
            }
          }}
        >
          <Stack gap={0}>
            <Group justify="space-between" wrap="nowrap" className={classes.header}>
              <Text fw={600} fz={18}>
                {m.video_subtitles_title()}
              </Text>
              <CloseButton size="sm" aria-label={m.common_close()} title={m.common_close()} onClick={close} />
            </Group>
            <Stack gap={16} className={classes.fields}>
              <Select
                {...selectProps}
                ref={firstControl}
                label={m.display_label()}
                value={appearance.displayMode}
                data={[
                  { value: 'bilingual', label: m.display_bilingual() },
                  { value: 'translation', label: m.display_translation() },
                  { value: 'original', label: m.display_original() },
                ]}
                onChange={(value) => {
                  if (value) save({ appearance: { displayMode: value as typeof appearance.displayMode } });
                }}
              />
              <Select
                {...selectProps}
                label={m.settings_target_label()}
                description={m.video_subtitles_effective({ value: effectiveLanguage })}
                inputWrapperOrder={['label', 'input', 'description', 'error']}
                value={targetSelection.mode === 'inherit' ? '' : targetSelection.language}
                data={[{ value: '', label: m.video_subtitles_inherit() }, ...LANGUAGES]}
                onChange={(value) =>
                  save({
                    translation: {
                      target: value ? { mode: 'fixed', language: value } : { mode: 'inherit' },
                    },
                  })
                }
              />
              <Select
                {...selectProps}
                ref={providerControl}
                label={m.settings_default_provider()}
                description={m.video_subtitles_effective({
                  value: effectiveProvider?.label ?? m.video_subtitles_unavailable(),
                })}
                inputWrapperOrder={['label', 'input', 'description', 'error']}
                value={providerSelection.mode === 'inherit' ? '' : providerSelection.providerId}
                data={[
                  { value: '', label: m.video_subtitles_inherit() },
                  ...view.settings.providers.map((provider) => ({ value: provider.id, label: provider.label })),
                  ...(providerMissing && providerSelection.mode === 'fixed'
                    ? [{ value: providerSelection.providerId, label: m.video_subtitles_unavailable() }]
                    : []),
                ]}
                onChange={(value) =>
                  save({
                    translation: {
                      provider: value ? { mode: 'fixed', providerId: value } : { mode: 'inherit' },
                    },
                  })
                }
              />
              <Switch
                size="xs"
                label={m.video_subtitles_prefer_human()}
                checked={view.settings.config.translation.preferHumanCaptions}
                onChange={(event) => save({ translation: { preferHumanCaptions: event.currentTarget.checked } })}
              />
            </Stack>
            <Stack gap={10} className={classes.footer}>
              <Group justify="space-between" gap="xs">
                <Text size="xs" c="dimmed">
                  {m.video_subtitles_current_language()}
                </Text>
                <Text size="xs" ff="monospace">
                  {view.sourceLanguage || '—'}
                </Text>
              </Group>
              {statusText(view.status) && (
                <Text size="xs" c="dimmed" role="status">
                  {statusText(view.status)}
                </Text>
              )}
              {error && (
                <Text size="xs" c="red" role="alert">
                  {m.video_subtitles_operation_failed()}
                </Text>
              )}
              <Group justify="flex-end" gap="xs" wrap="wrap">
                {retryable && (
                  <Button size="xs" variant="light" onClick={actions.retry}>
                    {m.common_retry()}
                  </Button>
                )}
                <Button
                  size="xs"
                  variant="subtle"
                  leftSection={<GearIcon width={14} height={14} />}
                  onClick={actions.more}
                  styles={{ label: { whiteSpace: 'normal' } }}
                >
                  {m.video_subtitles_more()}
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Paper>
      )}
      {view.enabled && (
        <div
          className={classes.captions}
          aria-live="off"
          style={{ bottom: `${appearance.positionPercent}%`, fontSize: `${appearance.fontSize}px` }}
        >
          {lines.map(
            (line, index) =>
              line && (
                <div
                  key={index}
                  className={classes.line}
                  style={{ background: `rgba(0,0,0,${appearance.backgroundOpacity})` }}
                >
                  {line}
                </div>
              )
          )}
          {view.status !== 'ready' && view.status !== 'dom' && (
            <div
              className={[classes.line, classes.status].join(' ')}
              role="status"
              style={{ background: 'rgba(0,0,0,.7)' }}
            >
              {statusText(view.status)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
/** A satellite failure must not unmount the shared host surface. */
class SubtitleBoundary extends Component<{ children: ReactNode; fail(): void }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch() {
    queueMicrotask(this.props.fail);
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function mountVideoSubtitleRenderer(
  player: HTMLElement,
  actions: Actions,
  media?: HTMLVideoElement
): VideoSubtitleRenderer {
  const native = media ? createNativeSubtitleRenderer(media) : null;
  const satellite = createSatellite(player, null, { position: 'beforeend' });
  const host = satellite.hostElement;
  host.setAttribute('translate', 'no');
  host.dataset.videoSubtitles = '';
  if (isYoutubeEmbed(player.ownerDocument.location.href) || isYoutubeShorts(player.ownerDocument.location.href))
    host.dataset.videoSubtitlesTopControls = '';
  return {
    isConnected: () => host.isConnected && host.parentElement === player,
    render: (view) => {
      native?.render(view);
      satellite.update(
        <SubtitleBoundary fail={actions.fail}>
          <PlayerSubtitles view={view} actions={actions} />
        </SubtitleBoundary>
      );
    },
    dispose: () => {
      native?.dispose();
      satellite.destroy();
    },
  };
}
