/**
 * @module dom/listen
 *
 * Detect SPA navigations from a content script. History monkey-patching does
 * NOT work here (the page's pushState runs in a different JS world), so we rely
 * on world-crossing signals: the Navigation API `navigate` event (Chrome 102+,
 * fires for same-document SPA nav), `popstate`/`hashchange`, and a 1s location
 * poll as a catch-all. Fires `cb` only when the URL actually changes.
 */

interface NavigationLike {
  addEventListener: (type: string, h: () => void) => void;
  removeEventListener: (type: string, h: () => void) => void;
}

export function onUrlChange(cb: (url: string) => void): () => void {
  let last = location.href;
  const fire = () => {
    const cur = location.href;
    if (cur !== last) {
      last = cur;
      cb(cur);
    }
  };

  const cleanups: Array<() => void> = [];

  const nav = (window as unknown as { navigation?: NavigationLike }).navigation;
  if (nav?.addEventListener) {
    const handler = () => queueMicrotask(fire);
    nav.addEventListener('navigate', handler);
    cleanups.push(() => nav.removeEventListener('navigate', handler));
  }

  const onPop = () => fire();
  window.addEventListener('popstate', onPop);
  window.addEventListener('hashchange', onPop);
  cleanups.push(() => {
    window.removeEventListener('popstate', onPop);
    window.removeEventListener('hashchange', onPop);
  });

  const poll = setInterval(fire, 1000);
  cleanups.push(() => clearInterval(poll));

  return () => cleanups.forEach((c) => c());
}
