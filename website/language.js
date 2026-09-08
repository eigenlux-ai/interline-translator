// Run in <head> before rendering so language selection happens before the page paints.
(() => {
  const siteRoot = new URL('./', document.currentScript.src);
  const storageKey = `interline:website-language:${siteRoot.pathname}`;
  const current = document.documentElement.lang === 'zh-CN' ? 'zh' : 'en';
  const url = new URL(window.location.href);
  const isSupported = (value) => value === 'zh' || value === 'en';
  const explicit = url.searchParams.get('lang');
  let preferred;

  if (isSupported(explicit)) {
    preferred = explicit;
    try {
      window.localStorage.setItem(storageKey, preferred);
    } catch {
      // The explicit URL still works when browser storage is unavailable.
    }
  } else {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (isSupported(saved)) preferred = saved;
    } catch {
      // Private browsing or storage restrictions must not prevent navigation.
    }
  }

  if (!preferred) {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    preferred = languages.map((language) => language?.toLowerCase().split('-')[0]).find(isSupported) || 'en';
  }

  if (preferred !== current) {
    const target = new URL(preferred === 'en' ? 'en/' : './', siteRoot);
    target.search = url.search;
    target.hash = url.hash;
    window.location.replace(target.href);
    return;
  }

  // Carry campaign parameters and the current section through a manual switch.
  document.addEventListener('DOMContentLoaded', () => {
    const link = document.querySelector('.language');
    if (!link) return;
    const updateLink = () => {
      const target = new URL(link.href);
      target.search = window.location.search;
      target.searchParams.set('lang', current === 'zh' ? 'en' : 'zh');
      target.hash = window.location.hash;
      link.href = target.href;
    };
    updateLink();
    window.addEventListener('hashchange', updateLink);
  });
})();
