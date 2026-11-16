import { fakeBrowser } from 'wxt/testing/fake-browser';
import { afterEach, describe, expect, it, vi } from 'vitest';
import background from '@/entrypoints/background';

vi.mock('@/core/messaging', () => ({ onMessage: vi.fn() }));
vi.mock('@/core/rpc/provider-models', () => ({ registerModelsService: vi.fn() }));
vi.mock('@/services', () => ({ registerAllServices: vi.fn() }));
vi.mock('@/services/config/gateway', () => ({ registerConfigGateway: vi.fn() }));
vi.mock('@/services/keep-alive', () => ({ registerKeepAlive: vi.fn() }));
vi.mock('@/services/menus', () => ({ registerMenusAndCommands: vi.fn() }));
vi.mock('@/services/page-session', () => ({ registerPageSession: vi.fn() }));
vi.mock('@/services/stream/server', () => ({ registerStreamServer: vi.fn() }));
vi.mock('@/services/subtitles/server', () => ({ registerSubtitleServer: vi.fn() }));
vi.mock('@/services/translation/cache/cleanup', () => ({ registerCacheCleanup: vi.fn() }));

afterEach(() => vi.restoreAllMocks());

describe('toolbar settings entry point', () => {
  it('opens settings with the MV3 action API', async () => {
    const addListener = vi.fn();
    const otherListener = vi.fn();
    const openOptions = vi.spyOn(fakeBrowser.runtime, 'openOptionsPage').mockResolvedValue();
    const originalAction = fakeBrowser.action;
    const originalBrowserAction = fakeBrowser.browserAction;
    Object.assign(fakeBrowser, {
      action: { onClicked: { addListener } },
      browserAction: { onClicked: { addListener: otherListener } },
    });
    try {
      background.main();
      expect(addListener).toHaveBeenCalledOnce();
      expect(otherListener).not.toHaveBeenCalled();
      await addListener.mock.calls[0][0]();
      expect(openOptions).toHaveBeenCalledOnce();
    } finally {
      Object.assign(fakeBrowser, { action: originalAction, browserAction: originalBrowserAction });
    }
  });
});
