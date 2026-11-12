/** Local sample/artwork server for Ego Lite captures; no browser or profile is launched. */
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { artworkHtml, promoHtml } from './artwork.mjs';
import { locales } from './copy.mjs';
import { sampleHtml } from './fixtures.mjs';
import { subtitleIllustrationHtml } from './subtitle-illustration.mjs';

const root = process.cwd();
const server = createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://127.0.0.1:9341');
    const locale = u.searchParams.get('locale') || 'global';
    if (!locales[locale]) {
      res.writeHead(404);
      res.end();
      return;
    }
    if (u.pathname === '/subtitle-scene.png') {
      res.setHeader('Content-Type', 'image/png');
      res.end(await readFile(path.join(root, 'assets/store/source/subtitle-scene.png')));
      return;
    }
    if (u.pathname === '/subtitle-illustration') {
      const ui = locales[locale].ui;
      const original = JSON.parse(
        await readFile(path.join(root, 'messages', (ui === 'en' ? 'zh' : 'en') + '.json'), 'utf8')
      );
      const translated = JSON.parse(await readFile(path.join(root, 'messages', ui + '.json'), 'utf8'));
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(
        subtitleIllustrationHtml(
          original.video_subtitles_preview_original,
          translated.video_subtitles_preview_translation
        )
      );
      return;
    }
    if (u.pathname === '/icon.png' || /^\/raw\/[\w-]+\.png$/.test(u.pathname)) {
      const file = u.pathname === '/icon.png' ? 'public/icon/128.png' : '.cache/store-capture' + u.pathname;
      res.setHeader('Content-Type', 'image/png');
      res.end(await readFile(path.join(root, file)));
      return;
    }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    if (u.pathname === '/artwork') res.end(artworkHtml(locales[locale], locale, Number(u.searchParams.get('index'))));
    else if (u.pathname === '/promo')
      res.end(promoHtml(locales[locale], locale, u.searchParams.get('size') === 'marquee'));
    else res.end(sampleHtml(locale, u.searchParams.get('mode') || 'article'));
  } catch {
    res.writeHead(500);
    res.end('Capture asset unavailable');
  }
});
server.listen(9341, '127.0.0.1', () => console.log('Store capture server: http://127.0.0.1:9341'));
