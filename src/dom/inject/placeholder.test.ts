// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { countPlaceholders, restoreInline, serializeInline, splitHtmlByBreaks } from './placeholder';

function el(html: string): Element {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}

describe('serializeInline', () => {
  it('flattens inline tags into numbered placeholders', () => {
    const { text, tags } = serializeInline(el('Hello <a href="x">world</a>!'));
    expect(text).toBe('Hello {{0}}world{{1}}!');
    expect(tags[0]).toBe('<a href="x">');
    expect(tags[1]).toBe('</a>');
  });

  it('handles nested inline tags', () => {
    const { text } = serializeInline(el('a <b>bold <i>x</i></b> z'));
    expect(text).toBe('a {{0}}bold {{1}}x{{2}}{{3}} z');
  });

  it('treats BR and skipped elements as opaque placeholders', () => {
    const { text, tags } = serializeInline(el('a<br>b'));
    expect(text).toBe('a{{0}}b');
    expect(tags[0]).toBe('<br>');
  });

  it('rides a sentence chip through as ONE opaque placeholder (X @mention DIV)', () => {
    // Attached to the document: isInlineChip needs a computed inline display.
    const host = document.createElement('div');
    host.innerHTML = 'ask <div style="display:inline-flex"><img src="a.png"><a href="/u">@kayla</a></div> about it';
    document.body.appendChild(host);
    try {
      const { text, tags } = serializeInline(host);
      expect(text).toBe('ask {{0}} about it');
      expect(tags[0]).toContain('@kayla');
      expect(tags[0]).not.toContain('<img'); // the avatar is never duplicated into the 译文
    } finally {
      host.remove();
    }
  });

  it('drops aria-hidden subtrees entirely — decoration is never reproduced', () => {
    // nextjs.org's author row: an aria-hidden avatar facepile whose <img>s,
    // cloned into the 译文, lost their --size context and rendered enormous.
    const { text, tags } = serializeInline(
      el('Posted by <span aria-hidden="true"><img src="a.png"><img src="b.png"></span>team')
    );
    expect(text).toBe('Posted by team');
    expect(tags).toEqual([]);
  });

  it('strips nested media out of opaque fragments (translate=no smuggling)', () => {
    const { text, tags } = serializeInline(el('See <span translate="no">Next.js <img src="logo.png"></span> docs'));
    expect(text).toBe('See {{0}} docs');
    expect(tags[0]).toBe('<span translate="no">Next.js </span>');
  });

  it('scrubs identity, handlers, and non-content from every opaque descendant', () => {
    const source = el(
      'See <span translate="no" id="brand" onclick="boom()" aria-labelledby="label" class="brand">' +
        '<code id="code" onmouseover="boom()" aria-describedby="help" style="color:red">Brand</code>' +
        '<script>boom()</script><style>.brand{display:none}</style><template>hidden</template>' +
        '<noscript>fallback</noscript><img src="logo.png"></span> docs'
    );
    const { text, tags } = serializeInline(source);
    const restored = el(restoreInline(text, tags).html);
    expect(
      restored.querySelectorAll('[id], [onclick], [onmouseover], [aria-labelledby], [aria-describedby]')
    ).toHaveLength(0);
    expect(restored.querySelectorAll('script, style, template, noscript, img')).toHaveLength(0);
    expect(restored.querySelector('span')?.className).toBe('brand');
    expect(restored.querySelector('code')?.getAttribute('style')).toBe('color:red');
    expect(restored.textContent).toBe('See Brand docs');
    expect(source.querySelector('#brand')).not.toBeNull();
    expect(source.querySelector('script')).not.toBeNull();
  });

  it('reads opaque descendant visibility in the original ancestor CSS context', () => {
    const sheet = document.createElement('style');
    sheet.textContent = '.opaque-context .context-hidden { display:none }';
    document.head.append(sheet);
    const host = el('<span translate="no">Brand <b class="context-hidden">secret</b><i> visible</i></span>');
    host.classList.add('opaque-context');
    document.body.append(host);
    try {
      expect(getComputedStyle(host.querySelector('b')!).display).toBe('none');
      const { text, tags } = serializeInline(host);
      expect(restoreInline(text, tags).html).toBe('<span translate="no">Brand <i> visible</i></span>');
      expect(host.querySelector('b')?.textContent).toBe('secret');
    } finally {
      host.remove();
      sheet.remove();
    }
  });

  it('strips nested aria-hidden decoration out of opaque fragments too', () => {
    // aria-hidden one wrapper deep, inside an opaque translate=no span: the
    // per-child drop can't see it, so the opaque fragment must scrub it — else
    // the 译文 reproduces decoration that visibleText already dropped from the key.
    const { text, tags } = serializeInline(
      el('See <span translate="no">Brand <span aria-hidden="true">★</span></span> docs')
    );
    expect(text).toBe('See {{0}} docs');
    expect(tags[0]).toBe('<span translate="no">Brand </span>');
  });
});

describe('serialize → restore round-trip', () => {
  it('restores the original inline structure when placeholders survive', () => {
    const source = el('Hello <a href="x">world</a>!');
    const { text, tags } = serializeInline(source);
    // simulate translation that keeps placeholders intact
    const translated = text.replace('Hello', '你好').replace('world', '世界');
    const { html, ok } = restoreInline(translated, tags);
    expect(ok).toBe(true);
    expect(html).toBe('你好 <a href="x">世界</a>!');
  });

  it('reproduces formatting but never identity/behaviour attributes (no second id in the page)', () => {
    // The 译文 stands BESIDE the source, so a replayed `id` gives the document
    // two of something it has one of: getElementById still answers with the
    // original (document order), which is what makes it silent, while
    // querySelectorAll('#x'), aria-labelledby and host hooks see the twin.
    const source = el(
      'read <span id="x" class="hl" style="color:red" aria-labelledby="y" onclick="boom()">this</span>'
    );
    const { text, tags } = serializeInline(source);
    expect(tags[0]).toBe('<span class="hl" style="color:red">');
    const { html, ok } = restoreInline(text.replace('read ', '读').replace('this', '这个'), tags);
    expect(ok).toBe(true);
    // Formatting survives — that is what 带样式翻译 promises …
    expect(html).toBe('读<span class="hl" style="color:red">这个</span>');
    // … the page's identity space does not gain a duplicate.
    const probe = document.createElement('div');
    probe.innerHTML = html;
    expect(probe.querySelectorAll('[id], [aria-labelledby], [onclick]').length).toBe(0);
  });

  it('escapes translated text so engine markup cannot inject', () => {
    const { tags } = serializeInline(el('hi <b>x</b>'));
    const { html } = restoreInline('<img src=q onerror=alert(1)>{{0}}x{{1}}', tags);
    expect(html).toContain('&lt;img');
    expect(html).not.toContain('<img');
  });

  it('falls back to escaped plain text when placeholders are dropped', () => {
    const { tags } = serializeInline(el('a <b>b</b> c'));
    const { html, ok } = restoreInline('translated without placeholders', tags);
    expect(ok).toBe(false);
    expect(html).toBe('translated without placeholders');
  });

  it('flags duplicated placeholders as a mismatch', () => {
    const { tags } = serializeInline(el('<b>x</b>'));
    const { ok } = restoreInline('{{0}}{{0}}{{1}}', tags);
    expect(ok).toBe(false);
  });

  it('strips MT-mangled placeholder braces in the fallback (no visible junk)', () => {
    // Some MT reformats the markers: inner whitespace, extra braces, or a brace
    // dropped on EITHER side (`{{0`, `0}}`, `0}`). The mismatch fallback must
    // still leave NO brace debris in the 译文.
    const { tags } = serializeInline(el('a <b>b</b> c'));
    for (const mangled of [
      '你好 {{ 0 }} 世界',
      '你好 { {0} } 世界',
      '你好 {{0} 世界',
      '你好 {{0}}{{0}} 世界',
      '你好 0}} 世界', // lost the leading `{{`
      '你好 0} 世界', // lost one of each
    ]) {
      const { html, ok } = restoreInline(mangled, tags);
      expect(ok).toBe(false);
      expect(html).not.toMatch(/[{}]/);
    }
  });

  it('strips a brace run whose index the engine swallowed entirely', () => {
    // Google Translate returned `更重要的是，}}他们贬低了设计的作用…` for an
    // elyx.design paragraph: the digit is gone, so the index-bearing passes
    // can't see the debris and it rendered as visible junk.
    const tags = ['<ink>', '</ink>'];
    const { html, ok } = restoreInline('更重要的是，}}他们贬低了设计的作用。', tags);
    expect(ok).toBe(false);
    expect(html).toBe('更重要的是，他们贬低了设计的作用。');
  });

  it("keeps a BALANCED brace pair — that is the page's own content, not debris", () => {
    // A docs page explaining a template engine. The fallback knows OUR markers
    // were mangled; it must not eat the user's braces on the way out.
    const tags = ['<b>', '</b>'];
    const { html, ok } = restoreInline('在模板里写 {{ name }} 即可。', tags);
    expect(ok).toBe(false);
    expect(html).toBe('在模板里写 {{ name }} 即可。');
  });

  it('drops a debrided placeholder index but keeps real bracketed / out-of-range text', () => {
    // `Java{{0}}[6]{{1}}` mangled by MT to `Java0}}[6]`: the `0}}` debris (a valid
    // index 0..1, with a surviving brace) must go, while the `[6]` footnote
    // reference and an unrelated `{2024}` (no brace-adjacent index < count) stay.
    const tags = ['<sup>', '</sup>']; // 2 placeholders → indices 0,1 valid
    const { html, ok } = restoreInline('Java0}}[6] {2024}', tags);
    expect(ok).toBe(false);
    expect(html).toBe('Java[6] {2024}');
  });
});

describe('countPlaceholders', () => {
  it('counts placeholder tokens', () => {
    expect(countPlaceholders('a {{0}} b {{1}}')).toBe(2);
    expect(countPlaceholders('none')).toBe(0);
  });
});

describe('splitHtmlByBreaks — 逐段对照 translation-side paragraphing', () => {
  it('splits at single and grouped <br> runs (a run is ONE separator)', () => {
    expect(splitHtmlByBreaks('one<br>two')).toEqual(['one', 'two']);
    expect(splitHtmlByBreaks('one<br><br>two<br>three')).toEqual(['one', 'two', 'three']);
    expect(splitHtmlByBreaks('one<br/>\n<br >two')).toEqual(['one', 'two']);
  });

  it('keeps attributes and case-insensitivity; escaped text never splits', () => {
    expect(splitHtmlByBreaks('a<BR class="x">b')).toEqual(['a', 'b']);
    // restoreInline escapes text — a literal "<br" typed by a page arrives as &lt;br
    expect(splitHtmlByBreaks('say &lt;br&gt; aloud')).toEqual(['say &lt;br&gt; aloud']);
  });
});
