import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { ActionIcon, Button, CloseButton, Group, NativeSelect, Paper, Stack, Text } from '@mantine/core';
import { createSatellite } from '@/surface/satellite';
import { langOptions } from '@/data/models';
import { RTL_UI_LANGS } from '@/data/models/lang';
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
    'translation-failed': m.video_subtitles_translation_failed(),
    loading: m.video_subtitles_loading(),
    unavailable: m.video_subtitles_unavailable(),
    dom: m.video_subtitles_dom(),
  })[status];
type Actions = Parameters<VideoSubtitleRuntimePorts['render']>[1];
export function PlayerSubtitles({ view, actions }: { view: VideoSubtitleView; actions: Actions }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const settingsButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const firstControl = useRef<HTMLSelectElement>(null);
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
    firstControl.current?.focus();
    const dismiss = (event: PointerEvent) => {
      const path = event.composedPath();
      if (!path.includes(panel.current!) && !path.includes(settingsButton.current!)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss, true);
    return () => document.removeEventListener('pointerdown', dismiss, true);
  }, [open]);
  const save = (patch: Parameters<Actions['patch']>[0]) => {
    setError(false);
    void actions.patch(patch).catch(() => setError(true));
  };
  // While a translation is pending or failed the current original stays useful.
  const original = (appearance.displayMode !== 'translation' || !view.translation) && view.original;
  const translated = appearance.displayMode !== 'original' && view.translation;
  const lines = appearance.translationPosition === 'above' ? [translated, original] : [original, translated];
  const retryable = ['fetch-failed', 'translation-failed', 'unavailable'].includes(view.status);
  return (
    <div className={classes.root} dir={RTL_UI_LANGS[getUiLocale()] ? 'rtl' : 'ltr'}>
      <div className={classes.tools} onKeyDown={(event) => event.stopPropagation()}>
        <Button
          variant={view.enabled ? 'filled' : 'default'}
          size="compact-sm"
          type="button"
          aria-label={m.video_subtitles_toggle()}
          title={m.video_subtitles_toggle()}
          aria-pressed={view.enabled}
          onClick={actions.toggle}
        >
          CC
        </Button>
        <ActionIcon
          variant="default"
          size={34}
          ref={settingsButton}
          type="button"
          aria-label={m.video_subtitles_title()}
          title={m.video_subtitles_title()}
          aria-expanded={open}
          aria-controls="subtitle-settings"
          onClick={() => (open ? close() : setOpen(true))}
        >
          <svg
            viewBox="0 0 20 20"
            width="16"
            height="16"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M3 5h14M3 10h14M3 15h14" />
            <circle cx="7" cy="5" r="2" fill="var(--mantine-color-body)" />
            <circle cx="13" cy="10" r="2" fill="var(--mantine-color-body)" />
            <circle cx="8" cy="15" r="2" fill="var(--mantine-color-body)" />
          </svg>
        </ActionIcon>
      </div>
      {open && (
        <Paper
          withBorder
          shadow="md"
          p="md"
          ref={panel}
          id="subtitle-settings"
          className={classes.panel}
          role="dialog"
          aria-label={m.video_subtitles_title()}
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === 'Escape') {
              event.preventDefault();
              close();
            }
          }}
        >
          <Stack gap="sm">
            <Group justify="space-between" wrap="nowrap">
              <Text fw={600} size="sm">
                {m.video_subtitles_title()}
              </Text>
              <CloseButton size="sm" aria-label={m.common_close()} title={m.common_close()} onClick={close} />
            </Group>
            <NativeSelect
              ref={firstControl}
              label={m.display_label()}
              value={appearance.displayMode}
              data={[
                { value: 'bilingual', label: m.display_bilingual() },
                { value: 'translation', label: m.display_translation() },
                { value: 'original', label: m.display_original() },
              ]}
              onChange={(event) =>
                save({ appearance: { displayMode: event.target.value as typeof appearance.displayMode } })
              }
            />
            <NativeSelect
              label={m.settings_target_label()}
              description={m.video_subtitles_effective({ value: effectiveLanguage })}
              inputWrapperOrder={['label', 'input', 'description', 'error']}
              value={targetSelection.mode === 'inherit' ? '' : targetSelection.language}
              data={[{ value: '', label: m.video_subtitles_inherit() }, ...LANGUAGES]}
              onChange={(event) =>
                save({
                  translation: {
                    target: event.target.value ? { mode: 'fixed', language: event.target.value } : { mode: 'inherit' },
                  },
                })
              }
            />
            <NativeSelect
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
              onChange={(event) =>
                save({
                  translation: {
                    provider: event.target.value
                      ? { mode: 'fixed', providerId: event.target.value }
                      : { mode: 'inherit' },
                  },
                })
              }
            />
            <Text size="xs" c="dimmed">
              {m.video_subtitles_current_language()}: {view.sourceLanguage || '—'}
            </Text>
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
            <Group grow wrap="wrap">
              {retryable && (
                <Button variant="default" onClick={actions.retry}>
                  {m.common_retry()}
                </Button>
              )}
              <Button variant="default" onClick={actions.more} styles={{ label: { whiteSpace: 'normal' } }}>
                {m.video_subtitles_more()}
              </Button>
            </Group>
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
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    queueMicrotask(this.props.fail);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function mountVideoSubtitleRenderer(player: HTMLElement, actions: Actions): VideoSubtitleRenderer {
  const satellite = createSatellite(player, null, { position: 'beforeend' });
  const host = satellite.hostElement;
  host.setAttribute('translate', 'no');
  host.dataset.videoSubtitles = '';
  return {
    isConnected: () => host.isConnected && host.parentElement === player,
    render: (view) =>
      satellite.update(
        <SubtitleBoundary fail={actions.fail}>
          <PlayerSubtitles view={view} actions={actions} />
        </SubtitleBoundary>
      ),
    dispose: () => satellite.destroy(),
  };
}
