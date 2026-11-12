import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { ActionIcon, Button } from '@mantine/core';
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
          variant="default"
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
          className={classes.settingsButton}
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
            <circle cx="7" cy="5" r="2" fill="#272b32" />
            <circle cx="13" cy="10" r="2" fill="#272b32" />
            <circle cx="8" cy="15" r="2" fill="#272b32" />
          </svg>
        </ActionIcon>
      </div>
      {open && (
        <div
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
          <div className={classes.heading}>
            <strong>{m.video_subtitles_title()}</strong>
            <button type="button" aria-label={m.common_close()} onClick={close}>
              ×
            </button>
          </div>
          <label>
            {m.display_label()}
            <select
              ref={firstControl}
              value={appearance.displayMode}
              onChange={(event) =>
                save({ appearance: { displayMode: event.target.value as typeof appearance.displayMode } })
              }
            >
              <option value="bilingual">{m.display_bilingual()}</option>
              <option value="translation">{m.display_translation()}</option>
              <option value="original">{m.display_original()}</option>
            </select>
          </label>
          <label>
            {m.settings_target_label()}
            <select
              value={targetSelection.mode === 'inherit' ? '' : targetSelection.language}
              onChange={(event) =>
                save({
                  translation: {
                    target: event.target.value ? { mode: 'fixed', language: event.target.value } : { mode: 'inherit' },
                  },
                })
              }
            >
              <option value="">{m.video_subtitles_inherit()}</option>
              {LANGUAGES.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </select>
            <span className={classes.subtle}>{m.video_subtitles_effective({ value: effectiveLanguage })}</span>
          </label>
          <label>
            {m.settings_default_provider()}
            <select
              value={providerSelection.mode === 'inherit' ? '' : providerSelection.providerId}
              onChange={(event) =>
                save({
                  translation: {
                    provider: event.target.value
                      ? { mode: 'fixed', providerId: event.target.value }
                      : { mode: 'inherit' },
                  },
                })
              }
            >
              <option value="">{m.video_subtitles_inherit()}</option>
              {view.settings.providers.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.label}
                </option>
              ))}
              {providerMissing && providerSelection.mode === 'fixed' && (
                <option value={providerSelection.providerId}>{m.video_subtitles_unavailable()}</option>
              )}
            </select>
            <span className={classes.subtle}>
              {m.video_subtitles_effective({ value: effectiveProvider?.label ?? m.video_subtitles_unavailable() })}
            </span>
          </label>
          <div className={classes.subtle}>
            {m.video_subtitles_current_language()}: {view.sourceLanguage || '—'}
          </div>
          <div className={classes.status} role="status">
            {statusText(view.status)}
          </div>
          {error && (
            <div role="alert" className={classes.error}>
              {m.video_subtitles_operation_failed()}
            </div>
          )}
          <div className={classes.actions}>
            {retryable && (
              <button type="button" onClick={actions.retry}>
                {m.common_retry()}
              </button>
            )}
            <button type="button" onClick={actions.more}>
              {m.video_subtitles_more()}
            </button>
          </div>
        </div>
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
