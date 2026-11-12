/** Explicitly labeled promotional illustration, not a live player capture. */
export function subtitleIllustrationHtml(source, translation) {
  const escape = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<!doctype html><html><meta charset="utf-8"><style>
*{box-sizing:border-box}body{margin:0;width:1120px;height:600px;overflow:hidden;background:#161a1f;font-family:system-ui,-apple-system,sans-serif}.scene{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.captions{position:absolute;left:5%;width:90%;bottom:54px;text-align:center;color:#fff;font-size:26px;line-height:1.45;text-shadow:0 1px 3px #000}.line{display:table;margin:4px auto;padding:3px 12px;background:rgba(0,0,0,.75);border-radius:4px;max-width:100%;overflow-wrap:anywhere}.translation{font-weight:600}
</style><img class="scene" src="/subtitle-scene.png"><div class="captions"><div class="line" dir="auto">${escape(source)}</div><div class="line translation" dir="auto">${escape(translation)}</div></div></html>`;
}
