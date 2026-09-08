// @vitest-environment happy-dom
import { expect, it, vi } from 'vitest';
import definition from '@/entrypoints/page-translate.content';

const state = vi.hoisted(() => ({
  watchers: [] as Array<(config: unknown) => void>,
  started: vi.fn(),
  stopped: vi.fn(),
  pageStarted: vi.fn(),
  pageStopped: vi.fn(),
  config: {
    inputTranslation: { enabled: true, target: 'en', triggerCount: 3 },
    translate: { source: 'auto', target: 'zh-CN' },
    appearance: { displayMode: 'bilingual' },
    siteControl: { defaultMode: 'auto', rules: [] },
  },
}));
vi.mock('#imports', () => ({ defineContentScript: (value: unknown) => value }));
vi.mock('@/services/config/public', () => ({
  getPublicConfig: async () => state.config,
  watchPublicConfig: (cb: (config: unknown) => void) => {
    state.watchers.push(cb);
    return () => {};
  },
}));
vi.mock('@/dom/input', () => ({
  effectiveHostname: () => location.hostname,
  InputTranslator: class {
    start() {
      state.started();
    }
    stop() {
      state.stopped();
    }
  },
}));
vi.mock('@/dom/page-translation', () => ({
  PageTranslator: class {
    start() {
      state.pageStarted();
    }
    stop() {
      state.pageStopped();
    }
    setDisplayMode() {}
  },
}));
vi.mock('@/core/messaging', () => ({ onMessage: vi.fn(), sendMessage: async () => null }));
vi.mock('@/i18n', () => ({ syncUiLocaleFrom: vi.fn() }));
vi.mock('@/react-app/error-copy', () => ({ humanizeError: (s: string) => s }));
it('disabling input translation updates an already-open page', async () => {
  const cleanup: Array<() => void> = [];
  try {
    await (definition as unknown as { main: (ctx: unknown) => Promise<void> }).main({
      onInvalidated: (cb: () => void) => cleanup.push(cb),
    });
    expect(state.started).toHaveBeenCalledOnce();
    const next = { ...state.config, inputTranslation: { ...state.config.inputTranslation, enabled: false } };
    state.watchers.forEach((cb) => cb(next));
    expect(state.stopped).toHaveBeenCalledOnce();
  } finally {
    cleanup.forEach((cb) => cb());
  }
});

it('stops an active page translator when site policy changes to never', async () => {
  state.watchers.length = 0;
  state.pageStarted.mockClear();
  state.pageStopped.mockClear();
  state.config.siteControl.defaultMode = 'always';
  const cleanup: Array<() => void> = [];
  try {
    await (definition as unknown as { main: (ctx: unknown) => Promise<void> }).main({
      onInvalidated: (cb: () => void) => cleanup.push(cb),
    });
    expect(state.pageStarted).toHaveBeenCalledOnce();
    state.watchers.forEach((cb) => cb({ ...state.config, siteControl: { defaultMode: 'never', rules: [] } }));
    expect(state.pageStopped).toHaveBeenCalledOnce();
  } finally {
    cleanup.forEach((cb) => cb());
    state.config.siteControl.defaultMode = 'auto';
  }
});
