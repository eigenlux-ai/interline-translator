/** Promotional frames around production captures and the labeled subtitle illustration. */
export const names = [
  'screenshot-1-bilingual',
  'screenshot-2-selection',
  'screenshot-3-settings',
  'screenshot-4-input-translation',
  'screenshot-5-subtitles',
];
export function artworkHtml(l, locale, index) {
  const dark = index === 4;
  return `<!doctype html><html lang="${l.ui}"><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1280px;height:800px;overflow:hidden;background:${dark ? '#191e27' : '#f7f3ed'};color:${dark ? '#f8f3eb' : '#29251f'};font-family:system-ui,-apple-system,sans-serif}
header{position:absolute;inset:24px 56px auto;display:flex;align-items:center;justify-content:space-between;font-size:12px;letter-spacing:.4px}.brand{display:flex;align-items:center;gap:10px;font-weight:600}.brand img{width:28px;height:28px}.release{color:${dark ? '#e4aa94' : '#ac3d2d'};border:1px solid ${dark ? '#4f4a48' : '#ddcfc2'};border-radius:30px;padding:6px 12px;font-size:11px}
h1{position:absolute;left:56px;top:64px;margin:0;font-size:${locale === 'ko' ? 34 : 38}px;font-weight:650;letter-spacing:-1.2px;line-height:1.25}
p{position:absolute;left:58px;top:113px;margin:0;font-size:15px;color:${dark ? '#b9b7b4' : '#7a7065'}}
.frame{position:absolute;left:79px;top:163px;width:1122px;height:602px;border-radius:14px;border:1px solid ${dark ? '#494c51' : '#e1d8cd'};overflow:hidden;box-shadow:0 18px 38px #19151116}.frame img{display:block;width:1120px;height:600px}
footer{position:absolute;left:58px;right:58px;bottom:10px;display:flex;justify-content:space-between;font-size:10px;letter-spacing:.4px;color:${dark ? '#c8b5a7' : '#8c7d70'}}
</style><header><span class="brand"><img src="/icon.png">Interline <span style="font-weight:400;opacity:.6">· 行间</span></span><span class="release">${l.open} &nbsp; / &nbsp; 1.1</span></header><h1>${l.labels[index]}</h1><p>${l.details[index]}</p><div class="frame"><img src="/raw/${locale}-${names[index]}.png"></div><footer><span>github.com/eigenlux-ai/interline-translator</span><span>${String(index + 1).padStart(2, '0')} / 05</span></footer></html>`;
}
export function promoHtml(l, locale, marquee) {
  if (!marquee)
    return `<!doctype html><html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:440px;height:280px;padding:30px;background:#f7f3ed;color:#29251f;font-family:system-ui,-apple-system,sans-serif}header{display:flex;align-items:center;gap:12px;font-size:27px;font-weight:650;letter-spacing:-1px}img{width:46px;height:46px}h1{font-size:${locale === 'global' ? 32 : 27}px;line-height:1.4;letter-spacing:-.7px;max-width:365px;font-weight:550;margin:26px 0}footer{position:absolute;left:30px;bottom:24px;width:380px;border-top:1px solid #dfd3c5;padding-top:14px;color:#a83c2c;font-size:12px}</style><header><img src="/icon.png">Interline <span style="font-size:16px;font-weight:400">行间</span></header><h1>${l.title}</h1><footer>${l.open}</footer></html>`;
  return `<!doctype html><html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:1400px;height:560px;overflow:hidden;background:#f7f3ed;color:#29251f;font-family:system-ui,-apple-system,sans-serif}header{position:absolute;left:60px;top:45px;display:flex;align-items:center;gap:14px;font-size:30px;font-weight:600}header img{width:46px;height:46px}h1{position:absolute;left:60px;top:158px;width:540px;font-size:${locale === 'global' ? 60 : 43}px;letter-spacing:-1.6px;line-height:1.3;font-weight:550;margin:0}p{position:absolute;left:62px;top:317px;width:495px;font-size:17px;color:#796e62;line-height:1.8}.capture{position:absolute;left:630px;top:112px;width:728px;height:390px;border-radius:13px;outline:1px solid #ded4c9;box-shadow:0 20px 50px #33281e20}footer{position:absolute;left:62px;bottom:45px;color:#a83c2c;font-size:13px}.version{position:absolute;right:44px;top:58px;color:#98836f;font-size:12px;letter-spacing:2px}</style><header><img src="/icon.png">Interline · 行间</header><span class="version">READ · WATCH · WRITE</span><h1>${l.title}</h1><p>${l.sub}</p><img class="capture" src="/raw/${locale}-screenshot-1-bilingual.png"><footer>${l.open}</footer></html>`;
}
