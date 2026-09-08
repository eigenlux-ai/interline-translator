// @vitest-environment happy-dom
import { expect, it, vi } from 'vitest';
import definition from '@/entrypoints/page-translate.content';
// Integration fixture for the content entrypoint, not a content-script dependency.
// eslint-disable-next-line no-restricted-imports
import { defaultPublicConfig } from '@/services/config/public';

const state = vi.hoisted(() => ({ read: vi.fn(), started: vi.fn(), pageStarted: vi.fn() }));
vi.mock('#imports', () => ({ defineContentScript: (x: unknown) => x }));
vi.mock('@/services/config/public', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  getPublicConfig: state.read,
  watchPublicConfig: () => () => {},
}));
vi.mock('@/dom/input', () => ({
  effectiveHostname: () => location.hostname,
  InputTranslator: class {
    start() {
      state.started();
    }
    stop() {}
  },
}));
vi.mock('@/dom/page-translation', () => ({
  PageTranslator: class {
    start() {
      state.pageStarted();
    }
    stop() {}
    setDisplayMode() {}
  },
}));
vi.mock('@/core/messaging', () => ({ onMessage: vi.fn(), sendMessage: async () => null }));
vi.mock('@/i18n', () => ({ syncUiLocaleFrom: vi.fn() }));
vi.mock('@/react-app/error-copy', () => ({ humanizeError: (x: string) => x }));
it('does not start translators when context was invalidated during config loading', async () => {
  let finish!: (c: unknown) => void;
  const config = defaultPublicConfig();
  config.siteControl.defaultMode = 'always';
  state.read
    .mockImplementationOnce(
      () =>
        new Promise((r) => {
          finish = r;
        })
    )
    .mockResolvedValue(config);
  const cleanup: Array<() => void> = [];
  const running = (definition as unknown as { main: (ctx: unknown) => Promise<void> }).main({
    onInvalidated: (cb: () => void) => cleanup.push(cb),
  });
  cleanup.forEach((cb) => cb());
  finish(config);
  await running;
  await Promise.resolve();
  try {
    expect(state.started).not.toHaveBeenCalled();
    expect(state.pageStarted).not.toHaveBeenCalled();
  } finally {
    cleanup.forEach((cb) => cb());
  }
});
