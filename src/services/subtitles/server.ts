/** Background-only, sender-validated subtitle transport. Never exposed to the MAIN world. */
import { isSiteEnabled } from '@/services/config/site-control';
import { getConfig, watchConfig } from '@/services/config/storage';
import { resolveSubtitleProvider } from '@/services/config/video-subtitles';
import { clearSubtitleCache } from './cache';
import { SubtitleRequestManager } from './manager';
import { isSubtitleWindow, SUBTITLE_PORT_NAME, type SubtitleClientMessage } from './protocol';

export function registerSubtitleServer(): void {
  const manager = new SubtitleRequestManager({
    async prepare(_window, owner) {
      const config = await getConfig();
      const provider = resolveSubtitleProvider(config);
      if (
        !config.videoSubtitles.enabled ||
        !config.videoSubtitles.platforms.youtube.enabled ||
        !isSiteEnabled(config.siteControl, owner.split(':').at(-1) ?? 'www.youtube.com') ||
        !provider
      )
        throw new Error('Subtitle provider unavailable');
      const target = config.videoSubtitles.translation.target;
      return { config, provider, target: target.mode === 'fixed' ? target.language : config.translate.target };
    },
  });
  watchConfig(() => manager.refresh());
  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== SUBTITLE_PORT_NAME) return;
    const sender = port.sender;
    let url: URL;
    try {
      url = new URL(sender?.url ?? '');
    } catch {
      port.disconnect();
      return;
    }
    if (
      sender?.id !== browser.runtime.id ||
      !sender.tab?.id ||
      sender.frameId !== 0 ||
      url.protocol !== 'https:' ||
      !['www.youtube.com', 'youtube.com'].includes(url.hostname)
    ) {
      port.disconnect();
      return;
    }
    const id = crypto.randomUUID();
    const owner = `${sender.tab.id}:${sender.documentId ?? sender.url}:${url.hostname}`;
    let lastWindow = 0;
    let pendingWindow: import('./protocol').SubtitleWindow | undefined;
    let updateTimer: ReturnType<typeof setTimeout> | undefined;
    let closed = false;
    const close = () => {
      if (!closed) {
        closed = true;
        if (updateTimer) clearTimeout(updateTimer);
        manager.close(id);
      }
    };
    if (
      !manager.open(id, owner, (event) => {
        try {
          port.postMessage(event);
        } catch {
          close();
        }
      })
    ) {
      port.disconnect();
      return;
    }
    port.onMessage.addListener((raw: unknown) => {
      if (closed || !raw || typeof raw !== 'object') return;
      const message = raw as SubtitleClientMessage;
      if (message.version !== 1) return;
      if (message.type === 'close') {
        close();
        port.disconnect();
        return;
      }
      if (message.type !== 'window' || !isSubtitleWindow(message.window)) return;
      // Bound malformed or hostile content-side floods. Normal planning coalesces updates.
      const now = Date.now();
      pendingWindow = message.window;
      const flush = () => {
        updateTimer = undefined;
        lastWindow = Date.now();
        if (pendingWindow) void manager.updateWindow(id, pendingWindow).catch(() => close());
        pendingWindow = undefined;
      };
      if (now - lastWindow >= 40) {
        if (updateTimer) clearTimeout(updateTimer);
        flush();
      } else updateTimer ??= setTimeout(flush, 40 - (now - lastWindow));
    });
    port.onDisconnect.addListener(close);
  });
  browser.runtime.onMessage.addListener((message, sender) => {
    if (message?.type !== 'subtitle:clear-cache' || message.version !== 1) return;
    const extensionOrigin = browser.runtime.getURL('');
    if (
      sender.id !== browser.runtime.id ||
      sender.tab?.url?.startsWith('https:') ||
      !sender.url?.startsWith(extensionOrigin)
    )
      return;
    return clearSubtitleCache().then(() => ({ ok: true }));
  });
}
