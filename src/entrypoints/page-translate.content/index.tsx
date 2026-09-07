/**
 * Host-page translation content script. Unlike the template's shadow-UI demo,
 * this injects 译文 into the HOST DOM (next to each source block), so it runs
 * with `cssInjectionMode: 'manual'` — the translation styles come via
 * adoptedStyleSheets (see dom/inject/styles), not a shadow surface. In-page
 * React UI (划词 popover + 悬浮球) lives in the separate `float-ui.content` entrypoint.
 */

import { defineContentScript } from '#imports';
import { onMessage, sendMessage } from '@/core/messaging';
import {
  emitPageTranslationState,
  onPageTranslationStateQuery,
  onSetPageTranslation,
} from '@/core/page-translation-bridge';
import { humanizeError } from '@/react-app/error-copy';
import { SHADOW_ATTACH_SIGNAL } from '@/constants';
import { effectiveHostname, InputTranslator } from '@/dom/input';
import { PageTranslator } from '@/dom/page-translation';
import { syncUiLocaleFrom } from '@/i18n';
import { getPublicConfig, watchPublicConfig } from '@/services/config/public';
import { isSiteEnabled, shouldAutoTranslate } from '@/services/config/site-control';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  // Input translation must reach fields INSIDE frames (TinyMCE's default
  // iframe mode, embedded comment widgets) — keydown listeners are per-document.
  // matchAboutBlank covers editor-spawned about:blank/srcdoc frames.
  allFrames: true,
  matchAboutBlank: true,
  cssInjectionMode: 'manual',
  async main(ctx) {
    // Keep input policy and gesture settings live in every frame.
    let inputTranslator: InputTranslator | null = null;
    let inputSignature = '';
    const applyInputConfig = (config: Awaited<ReturnType<typeof getPublicConfig>>) => {
      syncUiLocaleFrom(config);
      const enabled = config.inputTranslation.enabled && isSiteEnabled(config.siteControl, effectiveHostname());
      const signature = JSON.stringify([
        enabled,
        config.translate.source,
        config.inputTranslation.target,
        config.inputTranslation.triggerCount,
      ]);
      if (signature === inputSignature) return;
      inputSignature = signature;
      inputTranslator?.stop();
      inputTranslator = enabled
        ? new InputTranslator({
            source: config.translate.source,
            defaultTarget: config.inputTranslation.target,
            count: config.inputTranslation.triggerCount,
          })
        : null;
      inputTranslator?.start();
    };
    ctx.onInvalidated(watchPublicConfig(applyInputConfig));
    ctx.onInvalidated(() => inputTranslator?.stop());
    if (window.self !== window.top) {
      const config = await getPublicConfig();
      if (!inputSignature) applyInputConfig(config);
      return;
    }
    let translator: PageTranslator | null = null;
    // Monotonic intent counter. `start()` reads config asynchronously, so two
    // near-simultaneous triggers (e.g. the ball's 翻译此页 + a command toggle)
    // could both pass the `if (translator)` guard before either assigns, each
    // `new PageTranslator()`, and the later write would ORPHAN the earlier
    // instance (a live, unstoppable MutationObserver). Every start/stop bumps
    // the generation; a start that finds its generation superseded after the
    // await bails — so only the latest intent ever materialises a translator.
    let generation = 0;

    /** Begin whole-page translation. Returns whether it is now active. */
    const start = async (): Promise<boolean> => {
      if (translator) return true;
      const gen = ++generation;
      const config = await getPublicConfig();
      if (gen !== generation) return translator !== null; // superseded mid-await
      // `never` blocks even MANUAL triggers (the documented site-control
      // contract). Gating here — the single start() chokepoint — covers every
      // path into translation: popup, command, and the floating ball alike.
      if (!isSiteEnabled(config.siteControl, location.hostname)) return false;
      translator = new PageTranslator(document.body, {
        source: config.translate.source,
        target: config.translate.target,
        displayMode: config.appearance.displayMode,
        skipLanguages: config.translate.skipLanguages,
        pageContext: config.translate.pageContext,
        richText: config.translate.richText,
        bilingualStyle: config.appearance.bilingualStyle,
        translationFont: config.appearance.translationFont,
        paragraphInterleave: config.appearance.paragraphInterleave,
        // Failure copy is resolved HERE, at the layer that owns i18n — and per
        // call, because the interface language follows translate.target and can
        // change while a page is translated.
        errorText: humanizeError,
      });
      translator.start();
      emitPageTranslationState(true); // keep the floating ball in sync
      // Remember this tab is translating (origin-scoped) so a full navigation
      // (forum pagination) restores it — see services/page-session.
      void sendMessage('setTabPageTranslation', { enabled: true, origin: location.origin });
      return true;
    };

    const stop = () => {
      generation++; // supersede any in-flight start()
      translator?.stop();
      translator = null;
      emitPageTranslationState(false);
      void sendMessage('setTabPageTranslation', { enabled: false, origin: location.origin });
    };

    // In-page floating ball ⇆ owner. Registered synchronously (before any await)
    // so the ball's mount-time state query is never missed. The ball is the only
    // other content script that talks to us; popup/command still use messaging.
    // The unsubscribe fns are torn down on context invalidation so a re-injected
    // owner (extension update / dev HMR without a page reload) can't leave a
    // stale handler on the shared bus responding alongside the fresh one.
    const offSet = onSetPageTranslation((enabled) => {
      // `true` always RE-applies (stop→start) so the ball's 翻译此页 re-translates
      // with the latest target/style the panel just persisted.
      stop();
      if (enabled) void start();
    });
    const offQuery = onPageTranslationStateQuery(() => emitPageTranslationState(translator !== null));
    // Injection order between the ball's script and this owner follows
    // entrypoint NAMES (WXT sorts content_scripts alphabetically) — a ball
    // that ran first may already have fired its mount-time QUERY into a bus
    // with no listener. One broadcast right after registering converges that
    // early bird; when we run first it's a harmless no-listener dispatch.
    emitPageTranslationState(translator !== null);

    onMessage('togglePageTranslation', ({ data }) => (data ? start() : (stop(), false)));
    onMessage('flipPageTranslation', () => (translator ? (stop(), false) : start()));
    onMessage('getPageTranslationState', () => translator !== null);

    // The three-state view (双语/仅译文/仅原文) switches LIVE on an active
    // translation — one attribute write via setDisplayMode, never a
    // re-translate. (The ball/options edit appearance.displayMode; the
    // gateway's mirror echoes it here.)
    ctx.onInvalidated(watchPublicConfig((c) => translator?.setDisplayMode(c.appearance.displayMode ?? 'bilingual')));

    // MAIN-world attachShadow signal (editor-injector.content/shadow-registry):
    // a root attached after its host was walked is invisible to the observers —
    // nudge the translator's debounced rescan. Same-window + same-origin + our
    // marker only; everything else is page noise.
    const onShadowSignal = (e: MessageEvent) => {
      if (e.source !== window || e.origin !== location.origin) return;
      if ((e.data as { source?: string } | null)?.source !== SHADOW_ATTACH_SIGNAL) return;
      translator?.notifyShadowAttached();
    };
    window.addEventListener('message', onShadowSignal);
    ctx.onInvalidated(() => window.removeEventListener('message', onShadowSignal));

    const config = await getPublicConfig();

    if (!inputSignature) applyInputConfig(config);

    // Whole-page translation auto-starts only on sites the user marked "always".
    if (shouldAutoTranslate(config.siteControl, location.hostname)) void start();

    // Restore a per-tab session translation across a FULL navigation (e.g. forum
    // pagination loads a new document with a fresh content script): if this tab
    // had translation on for THIS origin, re-apply it. `start()` still gates on
    // isSiteEnabled, so a `never` site won't be restored.
    if (!translator) {
      const remembered = await sendMessage('getTabPageTranslation', undefined).catch(() => null);
      if (remembered?.enabled && remembered.origin === location.origin) void start();
    }

    ctx.onInvalidated(() => {
      offSet();
      offQuery();
      stop();
    });
  },
});
