import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { PROJECT_PREFIX } from '@/constants';
import { langOptions } from '@/data/models';
import { RTL_UI_LANGS } from '@/data/models/lang';
import type {
  VideoSubtitleRenderer,
  VideoSubtitleRuntimePorts,
  VideoSubtitleView,
} from '@/dom/video-subtitles/runtime';
import { getUiLocale } from '@/i18n';
import { m } from '@/paraglide/messages';

const LANGUAGES = langOptions();
const styles = `
:host{all:initial;position:absolute;inset:0;pointer-events:none;z-index:65;font:14px/1.45 system-ui,sans-serif;color:#fff}
*{box-sizing:border-box}button,select{font:inherit;color:inherit;min-height:34px;border:1px solid #ffffff40;border-radius:7px;background:#272b32;padding:6px 10px}
button{cursor:pointer}button:hover{background:#3c424c}select{width:100%;color-scheme:dark}button:focus-visible,select:focus-visible{outline:2px solid #99d8ed;outline-offset:3px}
.tools{position:absolute;inset-inline-end:16px;top:16px;pointer-events:auto;display:flex;gap:6px}.tools button{box-shadow:0 2px 12px #0004;background:#171b23d9}.tools button[aria-pressed=true]{border-color:#c77b5e;background:#753f2f}
.panel{position:absolute;inset-inline-end:16px;top:58px;width:min(320px,calc(100% - 32px));max-height:calc(100% - 76px);overflow:auto;overscroll-behavior:contain;padding:16px;background:#171b23f5;border:1px solid #ffffff30;border-radius:12px;box-shadow:0 8px 32px #0008;pointer-events:auto;display:grid;gap:12px}
.panel label{display:grid;gap:5px;font-size:13px}.heading,.actions{display:flex;align-items:center;justify-content:space-between;gap:8px}.heading strong{font-size:14px}.heading button{padding:2px 8px;min-height:28px}.actions{flex-wrap:wrap}.actions button{flex:1;white-space:normal}.subtle{font-size:12px;color:#c6cbd3;overflow-wrap:anywhere}.error{color:#ffb9a9}
.captions{position:absolute;left:5%;width:90%;text-align:center;white-space:pre-line;line-height:1.45;text-shadow:0 1px 3px #000}.line{display:table;margin:3px auto;padding:2px 8px;border-radius:4px;max-width:100%;overflow-wrap:anywhere}.status{font-size:12px;color:#e1e5eb}
@media(prefers-reduced-motion:no-preference){button{transition:background .12s}}
`;
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
    <div dir={RTL_UI_LANGS[getUiLocale()] ? 'rtl' : 'ltr'}>
      <div className="tools" onKeyDown={(event) => event.stopPropagation()}>
        <button
          type="button"
          aria-label={m.video_subtitles_toggle()}
          title={m.video_subtitles_toggle()}
          aria-pressed={view.enabled}
          onClick={actions.toggle}
        >
          CC
        </button>
        <button
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
        </button>
      </div>
      {open && (
        <div
          ref={panel}
          id="subtitle-settings"
          className="panel"
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
          <div className="heading">
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
            <span className="subtle">{m.video_subtitles_effective({ value: effectiveLanguage })}</span>
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
            <span className="subtle">
              {m.video_subtitles_effective({ value: effectiveProvider?.label ?? m.video_subtitles_unavailable() })}
            </span>
          </label>
          <div className="subtle">
            {m.video_subtitles_current_language()}: {view.sourceLanguage || '—'}
          </div>
          <div className="status" role="status">
            {statusText(view.status)}
          </div>
          {error && (
            <div role="alert" className="error">
              {m.video_subtitles_operation_failed()}
            </div>
          )}
          <div className="actions">
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
          className="captions"
          aria-live="off"
          style={{ bottom: `${appearance.positionPercent}%`, fontSize: `${appearance.fontSize}px` }}
        >
          {lines.map(
            (line, index) =>
              line && (
                <div key={index} className="line" style={{ background: `rgba(0,0,0,${appearance.backgroundOpacity})` }}>
                  {line}
                </div>
              )
          )}
          {view.status !== 'ready' && view.status !== 'dom' && (
            <div className="line status" role="status" style={{ background: 'rgba(0,0,0,.7)' }}>
              {statusText(view.status)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export function mountVideoSubtitleRenderer(player: HTMLElement, actions: Actions): VideoSubtitleRenderer {
  const host = document.createElement(`${PROJECT_PREFIX}-video-subtitles`);
  host.setAttribute('translate', 'no');
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = styles;
  const container = document.createElement('div');
  shadow.append(style, container);
  player.append(host);
  const root = createRoot(container, {
    // React commits asynchronously; runtime.render's synchronous guard cannot catch these failures.
    onUncaughtError: () => {
      queueMicrotask(actions.fail);
    },
  });
  return {
    render: (view) => root.render(<PlayerSubtitles view={view} actions={actions} />),
    dispose() {
      root.unmount();
      host.remove();
    },
  };
}
