import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { content } from './content.mjs';

const root = new URL('../', import.meta.url);
const output = new URL('./dist/', import.meta.url);
const repo = 'https://github.com/eigenlux-ai/interline-translator';
const install = 'https://chromewebstore.google.com/detail/mcefogikngeheopmdmaapfgpnnlgcoid';
const arrow = '<span aria-hidden="true">↗</span>';
const escape = (text) =>
  text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const button = (c) =>
  `<a class="button button-primary" href="${install}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><circle cx="12" cy="12" r="3.8"/><path d="M12 8.2h8.7M8.7 13.9l-4.4-7.6m9.6 9-4.4 7"/></svg>${c.install}${arrow}</a>`;

function page(locale) {
  const c = content[locale];
  const base = locale === 'zh' ? './' : '../';
  const assetLocale = locale === 'zh' ? 'zh_CN' : 'global';
  return `<!doctype html>
<html lang="${c.lang}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<script src="${base}language.js"></script>
<title>${escape(c.title)}</title>
<meta name="description" content="${escape(c.description)}">
<meta name="theme-color" content="#f9fafb">
<meta property="og:type" content="website"><meta property="og:title" content="${escape(c.title)}"><meta property="og:description" content="${escape(c.description)}">
<link rel="icon" type="image/png" href="${base}assets/icon.png">
<link rel="alternate" hreflang="zh-CN" href="${base}"><link rel="alternate" hreflang="en" href="${base}en/">
<link rel="stylesheet" href="${base}style.css"><script src="${base}site.js" defer></script>
</head>
<body>
<a class="skip-link" href="#main">${c.skip}</a>
<header class="header"><div class="container header-inner">
<a class="brand" href="${base}" aria-label="Interline · 行间"><img src="${base}assets/icon.png" width="34" height="34" alt=""><span>Interline <span class="brand-cn">行间</span></span></a>
<nav aria-label="${locale === 'zh' ? '主导航' : 'Main navigation'}">${c.nav.map((label, i) => `<a href="#${['experience', 'engines', 'faq'][i]}">${label}</a>`).join('')}</nav>
<div class="header-actions"><a class="language" href="${c.alternate}?lang=${locale === 'zh' ? 'en' : 'zh'}" lang="${locale === 'zh' ? 'en' : 'zh-CN'}" hreflang="${locale === 'zh' ? 'en' : 'zh-CN'}">${c.language}</a><a class="header-github" href="${repo}">GitHub ${arrow}</a></div>
</div></header>
<main id="main">
<section class="hero container" aria-labelledby="hero-title">
<p class="eyebrow"><span class="status-dot" aria-hidden="true"></span>${c.eyebrow}</p>
<h1 id="hero-title">${c.headline}</h1><p class="hero-intro">${c.intro}</p>
<div class="hero-actions">${button(c)}<a class="button button-secondary" href="${repo}">${c.source}${arrow}</a></div>
<p class="install-note">${c.note}</p>
<a class="explore" href="#experience">${c.explore}<span aria-hidden="true">↓</span></a>
<div class="hero-preview"><div class="window-bar" aria-hidden="true"><span class="window-dots">● ● ●</span><span>Interline · ${c.tabs[0].label}</span><span>↗</span></div><img src="${base}assets/${assetLocale}/screenshot-1-bilingual.png" width="1280" height="800" fetchpriority="high" alt="${c.tabs[0].alt}"></div>
</section>
<div class="benefit-strip"><div class="container">${c.strip.map((s) => `<span><span class="check" aria-hidden="true">✓</span>${s}</span>`).join('')}</div></div>
<section class="section container" id="experience" aria-labelledby="experience-title">
<div class="section-heading"><p class="eyebrow">${c.experienceLabel}</p><h2 id="experience-title">${c.experienceTitle}</h2><p>${c.experienceIntro}</p></div>
<div class="experience-tabs" aria-label="${c.nav[0]}">${c.tabs.map((tab, i) => `<a class="experience-tab" id="tab-${i}" href="#panel-${i}"><span class="tab-number">0${i + 1}</span>${tab.label}<span class="tab-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
<div class="panels">${c.tabs.map((tab, i) => `<div class="experience-panel" id="panel-${i}" aria-labelledby="tab-${i}"><div class="panel-copy"><span class="feature-index" aria-hidden="true">0${i + 1}</span><h3>${tab.title}</h3><p>${tab.text}</p><div class="shortcut"><kbd>${tab.key}</kbd><span>${tab.hint}</span></div></div><figure><img src="${base}assets/${assetLocale}/${tab.image}" width="1280" height="800" loading="lazy" alt="${tab.alt}"><figcaption>${c.screenshotNote}</figcaption></figure></div>`).join('')}</div>
</section>
<section class="engine-section" id="engines" aria-labelledby="engine-title"><div class="container engine-layout">
<div class="engine-heading"><p class="eyebrow">${c.engineLabel}</p><h2 id="engine-title">${c.engineTitle}</h2><p>${c.engineText}</p><a class="text-link" href="${repo}#choose-your-translation-engine">${c.source}${arrow}</a></div>
<div class="engine-options"><article class="engine-basic"><div class="option-top"><span class="option-marker" aria-hidden="true">A</span><span>GOOGLE TRANSLATE</span></div><h3>${c.engineBasic}</h3><p>${c.engineBasicText}</p></article><article class="engine-ai"><div class="option-top"><span class="option-marker" aria-hidden="true">B</span><span>BRING YOUR OWN KEY</span></div><h3>${c.engineAI}</h3><p>${c.engineAIText}</p><div class="providers"><span>OpenAI</span><span>Anthropic</span><span>Gemini</span><span>OpenRouter</span></div><p class="small">${c.compatible}</p></article><p class="engine-note">${c.cost}</p></div>
</div></section>
<section class="section container trust-section" aria-labelledby="trust-title"><div class="section-heading"><p class="eyebrow">${c.trustLabel}</p><h2 id="trust-title">${c.trustTitle}</h2></div><div class="trust-grid">${c.trust.map(([title, text], i) => `<article><span class="trust-symbol" aria-hidden="true">${['&lt;/&gt;', '◎', '↗'][i]}</span><h3>${title}</h3><p>${text}</p></article>`).join('')}</div><a class="text-link" href="${repo}/blob/main/PRIVACY.md">${c.privacy}${arrow}</a></section>
<section class="faq-section container" id="faq" aria-labelledby="faq-title"><div><p class="eyebrow">${c.faqLabel}</p><h2 id="faq-title">${c.faqTitle}</h2></div><div class="faq-list">${c.faqs.map(([q, a]) => `<details><summary>${q}<span class="faq-plus" aria-hidden="true">+</span></summary><p>${a}</p></details>`).join('')}</div></section>
<section class="closing"><div class="container closing-inner"><div><p class="eyebrow">INTERLINE · 行间</p><h2>${c.closing}</h2><p>${c.closingText}</p></div><div>${button(c)}<p class="install-note">${c.note}</p></div></div></section>
</main>
<footer class="container footer"><div><a class="brand" href="${base}"><img src="${base}assets/icon.png" width="28" height="28" alt=""><span>Interline <span class="brand-cn">行间</span></span></a><p>${c.footerTag}</p></div><div class="footer-links">${c.footer.map((label, i) => `<a href="${repo}${['', '/issues', '/blob/main/PRIVACY.md'][i]}">${label}${arrow}</a>`).join('')}<span class="license">MIT License</span></div></footer>
</body></html>`;
}

await rm(output, { recursive: true, force: true });
await mkdir(new URL('en/', output), { recursive: true });
await mkdir(new URL('assets/', output), { recursive: true });
for (const file of ['style.css', 'site.js', 'language.js']) {
  await cp(new URL(file, import.meta.url), new URL(file, output));
}
await cp(new URL('public/icon/128.png', root), new URL('assets/icon.png', output));
for (const locale of ['zh_CN', 'global']) {
  await mkdir(new URL(`assets/${locale}/`, output), { recursive: true });
  for (const name of [
    'screenshot-1-bilingual.png',
    'screenshot-2-selection.png',
    'screenshot-4-input-translation.png',
  ]) {
    await cp(new URL(`assets/store/${locale}/${name}`, root), new URL(`assets/${locale}/${name}`, output));
  }
}
await writeFile(new URL('index.html', output), page('zh'));
await writeFile(new URL('en/index.html', output), page('en'));
await writeFile(new URL('.nojekyll', output), '');
console.log(`Website built: ${fileURLToPath(output)}`);
