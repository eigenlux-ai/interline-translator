// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { DATA_OMNI } from '@/constants';
import { walkAndLabel } from '../traversal';
import { PETAL_COMET } from './petal-loader';
import { applyDisplayMode, PENDING_CLASS, SRC_FONT_VAR } from './styles';
import { ensureGlossNode, findGloss, removeAllGloss, setTranslatedHtml, sourceNewlineRuns } from './wrapper';

function root(html: string): Element {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div;
}
let counter = 0;
const seqId = () => `id-${counter++}`;
beforeEach(() => {
  counter = 0;
});

describe('inlineHost descent (via ensureGlossNode inline)', () => {
  // inlineHost descends ONLY to escape a flex/grid track (verified by computed
  // display). happy-dom has no layout engine → getComputedStyle reports `block`,
  // so inlineHost never descends here; it appends at the unit element. The
  // flex-column same-line escape (the MediaWiki radio-label case) needs a real
  // layout engine and is verified in the browser, not in this suite.
  it('appends at the unit element in a non-track context (no descent without layout)', () => {
    const r = root('<div class="lbl"><label><span class="t">Small</span></label></div>');
    document.body.innerHTML = '';
    document.body.appendChild(r);
    const [u] = walkAndLabel(r, seqId);
    setTranslatedHtml(ensureGlossNode(u, 'inline'), '小');
    // Unit element is the div.lbl (label/span are inline) — gloss appends there,
    // NOT buried inside the inner span/label (which would happen with an
    // unconditional descent).
    expect((u.element as HTMLElement).lastElementChild?.tagName.toLowerCase()).toBe('aie-omt-inline');
    expect(r.querySelector('span.t')!.querySelector('aie-omt-inline')).toBeNull();
  });

  it('does NOT descend into a link — 译文 is a sibling of <a>, not inside it', () => {
    const r = root('<div><a href="/x">Documentation</a></div>');
    const [u] = walkAndLabel(r, seqId);
    setTranslatedHtml(ensureGlossNode(u, 'inline'), '文档');
    expect(r.querySelector('a')!.querySelector('aie-omt-inline')).toBeNull();
    // sibling of the link, inside the div
    const gloss = r.querySelector('aie-omt-inline')!;
    expect(gloss.parentElement?.tagName.toLowerCase()).toBe('div');
  });

  it('does NOT descend into <b>/<em> (would inherit bold/italic)', () => {
    const r = root('<div><b>Important</b></div>');
    const [u] = walkAndLabel(r, seqId);
    setTranslatedHtml(ensureGlossNode(u, 'inline'), '重要');
    expect(r.querySelector('b')!.querySelector('aie-omt-inline')).toBeNull();
  });
});

describe('shell wrappers (border/background pills)', () => {
  it('descends INTO a sole shell child — the control itself reads bilingual', () => {
    // aicanvas CTA shape: sole pill span inside the unit block. Outside the
    // pill the 译文 dangles as a stray caption; inside, the pill is bilingual.
    const r = root(
      '<div><span class="pill" style="display:inline-flex;border:1px solid #888">View Component</span></div>'
    );
    document.body.innerHTML = '';
    document.body.appendChild(r);
    const [u] = walkAndLabel(r, seqId);
    setTranslatedHtml(ensureGlossNode(u, 'inline'), '查看组件');
    expect(r.querySelector('span.pill')!.querySelector('aie-omt-inline')).not.toBeNull();
  });

  it('serialization unwraps a sole shell — the 译文 never reproduces the chrome', () => {
    const r = root(
      '<div><span class="pill" style="display:inline-flex;border:1px solid #888">View Component</span></div>'
    );
    document.body.innerHTML = '';
    document.body.appendChild(r);
    const [u] = walkAndLabel(r, seqId);
    // No {{n}} wrapper markers: the pill's inner content serialized directly.
    expect(u.serialized.text).toBe('View Component');
  });

  it('a plain text-style wrapper still reproduces (the 带样式 promise)', () => {
    const r = root('<div><b>Important</b></div>');
    const [u] = walkAndLabel(r, seqId);
    expect(u.serialized.text).toBe('{{0}}Important{{1}}');
  });
});

describe('clipped-source fallback (line-clamp / overflow hidden)', () => {
  it('stamps the source for the 仅译文 collapse, and restore clears it', () => {
    const r = root(
      '<div><p style="overflow-y:hidden">A long clipped paragraph that will need a sibling gloss to stay visible</p></div>'
    );
    document.body.innerHTML = '';
    document.body.appendChild(r);
    const [u] = walkAndLabel(r, seqId);
    const gloss = ensureGlossNode(u, 'block');
    // Sibling, not inside — and the source carries the collapse handle.
    expect(u.element.querySelector('aie-omt-block')).toBeNull();
    expect(gloss.parentElement).toBe(u.element.parentElement);
    expect(u.element.hasAttribute(DATA_OMNI.clipped)).toBe(true);
    removeAllGloss(r);
    expect(u.element.hasAttribute(DATA_OMNI.clipped)).toBe(false);
    expect(r.querySelectorAll('[data-omni-translated]').length).toBe(0);
  });
});

describe('findGloss / dedup', () => {
  it('inline: finds the gloss by id even after the host appends a trailing child', () => {
    const r = root('<h2>Hello world</h2>');
    const [u] = walkAndLabel(r, seqId);
    const first = ensureGlossNode(u, 'inline');
    // host SPA re-render appends a node AFTER our gloss
    r.querySelector('h2')!.appendChild(document.createElement('span'));
    // findGloss must still locate it (not via lastElementChild)
    expect(findGloss(u, 'inline')).toBe(first);
    // → a re-entry reuses the same node, no duplicate
    const second = ensureGlossNode(u, 'inline');
    expect(second).toBe(first);
    expect(r.querySelectorAll('aie-omt-inline[data-omni-translated]').length).toBe(1);
  });

  it('stamps the target lang on the 译文 (CJK font / line-break / SR voice)', () => {
    const r = root('<h2>Hello world</h2>');
    const [u] = walkAndLabel(r, seqId);
    expect(ensureGlossNode(u, 'inline', 'zh-CN').getAttribute('lang')).toBe('zh-CN');
  });

  it('sets dir="auto" so an RTL target renders right-to-left in an LTR host', () => {
    const r = root('<p>A paragraph long enough for block injection mode here please thanks.</p>');
    const [u] = walkAndLabel(r, seqId);
    expect(ensureGlossNode(u, 'block', 'ar').getAttribute('dir')).toBe('auto');
  });

  it('stamps the opt-in style preset as data-omni-style (drives the preset CSS)', () => {
    const r = root('<h2>Hello world</h2>');
    const [u] = walkAndLabel(r, seqId);
    expect(ensureGlossNode(u, 'inline', 'zh-CN', 'underline').getAttribute(DATA_OMNI.style)).toBe('underline');
  });

  it("stamps data-omni-font only for 'kai' — 'inherit' leaves the 译文 on the host font", () => {
    const r = root('<h2>One</h2><h2>Two</h2>');
    const [a, b] = walkAndLabel(r, seqId);
    expect(ensureGlossNode(a, 'inline', 'zh-CN', 'blend', 'kai').getAttribute(DATA_OMNI.font)).toBe('kai');
    expect(ensureGlossNode(b, 'inline', 'zh-CN', 'blend', 'inherit').hasAttribute(DATA_OMNI.font)).toBe(false);
  });

  it('block: finds the gloss appended inside the source (no clip → inside, not sibling)', () => {
    const r = root('<div><p>A long paragraph for block injection mode testing here please thanks.</p></div>');
    const [u] = walkAndLabel(r, seqId);
    const first = ensureGlossNode(u, 'block');
    expect(u.element.querySelector('aie-omt-block[data-omni-translated]')).toBe(first); // inside the <p>
    expect(findGloss(u, 'block')).toBe(first);
    expect(ensureGlossNode(u, 'block')).toBe(first); // idempotent
  });
});

describe('pending spinner (three-petal spiral)', () => {
  it('injects an SVG spinner with fade-tail layers and a11y attributes', () => {
    const r = root('<h2>Hello world</h2>');
    const [u] = walkAndLabel(r, seqId);
    const gloss = ensureGlossNode(u, 'inline');
    const spinner = gloss.querySelector(`svg.${PENDING_CLASS}`);
    expect(spinner).not.toBeNull();
    expect(spinner!.getAttribute('role')).toBe('img');
    expect(spinner!.getAttribute('aria-label')).toBe('translating');
    // multiple comet layers compose the cumulative fade tail
    expect(spinner!.querySelectorAll(`.${PETAL_COMET}`).length).toBeGreaterThan(1);
  });

  it('setTranslatedHtml replaces the spinner with the translation', () => {
    const r = root('<h2>Hello world</h2>');
    const [u] = walkAndLabel(r, seqId);
    const gloss = ensureGlossNode(u, 'inline');
    setTranslatedHtml(gloss, '你好');
    expect(gloss.querySelector(`svg.${PENDING_CLASS}`)).toBeNull();
    expect(gloss.textContent).toBe('你好');
  });
});

describe('removeAllGloss byte-exact restore', () => {
  it('inline append inside the source restores exactly', () => {
    const r = root('<h2>Hi there friend</h2>');
    const original = r.innerHTML;
    const [u] = walkAndLabel(r, seqId);
    setTranslatedHtml(ensureGlossNode(u, 'inline'), '你好');
    removeAllGloss(r);
    expect(r.innerHTML).toBe(original);
  });

  it('block (appended inside the source) restores exactly', () => {
    const r = root('<p>A long enough paragraph of text goes here for block mode testing indeed.</p>');
    const original = r.innerHTML;
    const [u] = walkAndLabel(r, seqId);
    setTranslatedHtml(ensureGlossNode(u, 'block'), '一段文字');
    removeAllGloss(r);
    expect(r.innerHTML).toBe(original);
  });

  it('clears walk markers on the source', () => {
    const r = root('<p>Hello world</p>');
    const [u] = walkAndLabel(r, seqId);
    ensureGlossNode(u, 'block');
    removeAllGloss(r);
    expect(r.querySelectorAll(`[${DATA_OMNI.walked}]`).length).toBe(0);
    expect(r.querySelector('p')!.hasAttribute(DATA_OMNI.walkId)).toBe(false);
  });

  it('findGloss still finds an afterend gloss after the host inserted a node between (no duplicate)', () => {
    const r = root('<p>A long enough paragraph of text goes here for the clipped fallback.</p>');
    document.body.appendChild(r);
    const [u] = walkAndLabel(r, seqId);
    // Simulate the clipped-source fallback placement: gloss as afterend sibling.
    const gloss = document.createElement('aie-omt-block');
    gloss.setAttribute(DATA_OMNI.translated, '');
    gloss.setAttribute(DATA_OMNI.walkId, u.id);
    u.element.after(gloss);
    expect(findGloss(u, 'block')).toBe(gloss);

    // Host inserts an ad/react node BETWEEN source and gloss mid-stream.
    const ad = document.createElement('div');
    u.element.after(ad);
    expect(u.element.nextElementSibling).toBe(ad);
    expect(findGloss(u, 'block')).toBe(gloss); // position-independent — ensureGlossNode won't duplicate
  });

  it('clears the marker on ROOT itself when root became the unit (toggle-off-then-on)', () => {
    // A minimal page whose <body>-like root holds text + inline children only:
    // walk() labels ROOT as the unit. querySelectorAll can't see root — a
    // leftover marker made the next walk skip the whole tree (never re-translate).
    const r = root('Direct text with <b>inline</b> children only');
    document.body.innerHTML = '';
    document.body.appendChild(r);
    const units = walkAndLabel(r, seqId);
    expect(units.map((u) => u.element)).toContain(r); // root IS the unit
    ensureGlossNode(units[0], 'block');

    removeAllGloss(r);
    expect(r.hasAttribute(DATA_OMNI.walked)).toBe(false);
    expect(r.hasAttribute(DATA_OMNI.walkId)).toBe(false);
    // Walking again must pick the content up afresh.
    expect(walkAndLabel(r, seqId).length).toBe(1);
  });
});

describe('three-state view: source-metric vars + mode attribute', () => {
  it('stamps the inherited font metrics onto the gloss as CSS vars at creation', () => {
    const r = root('<p style="font-size: 20px">Hello world paragraph text</p>');
    document.body.innerHTML = '';
    document.body.appendChild(r);
    const [u] = walkAndLabel(r, seqId);
    const node = ensureGlossNode(u, 'block');
    // The exact computed value is the layout engine's business — the var must
    // simply EXIST so the translation-only mode can restore the gloss size.
    expect(node.style.getPropertyValue(SRC_FONT_VAR)).not.toBe('');
  });

  it('neutralizes an ACTIVE translation-only mode for the measure and puts it back', () => {
    document.documentElement.setAttribute(DATA_OMNI.display, 'translation');
    const r = root('<p>Hello world paragraph text</p>');
    document.body.innerHTML = '';
    document.body.appendChild(r);
    const [u] = walkAndLabel(r, seqId);
    ensureGlossNode(u, 'block');
    expect(document.documentElement.getAttribute(DATA_OMNI.display)).toBe('translation');
    document.documentElement.removeAttribute(DATA_OMNI.display);
  });

  it('applyDisplayMode stamps <html> for the non-default modes and clears it for bilingual', () => {
    applyDisplayMode(document, 'translation');
    expect(document.documentElement.getAttribute(DATA_OMNI.display)).toBe('translation');
    applyDisplayMode(document, 'original');
    expect(document.documentElement.getAttribute(DATA_OMNI.display)).toBe('original');
    applyDisplayMode(document, 'bilingual');
    expect(document.documentElement.hasAttribute(DATA_OMNI.display)).toBe(false);
  });
});

describe('sourceNewlineRuns — edge runs are whitespace, not separators', () => {
  const preWrap = (inner: string) => {
    const el = document.createElement('div');
    el.style.whiteSpace = 'pre-wrap';
    el.innerHTML = inner;
    document.body.appendChild(el);
    return el;
  };

  it('counts interior separators only: a trailing \\n never skews the count', () => {
    const el = preWrap('First paragraph\nSecond paragraph\n');
    try {
      expect(sourceNewlineRuns(el)).toHaveLength(1);
    } finally {
      el.remove();
    }
  });

  it('a leading \\n is tolerated symmetrically', () => {
    const el = preWrap('\nFirst paragraph\nSecond paragraph');
    try {
      expect(sourceNewlineRuns(el)).toHaveLength(1);
    } finally {
      el.remove();
    }
  });

  it('an all-whitespace tail spanning nodes drops every trailing run', () => {
    const el = preWrap('<span>Only paragraph\n</span><span> \n </span>');
    try {
      expect(sourceNewlineRuns(el)).toHaveLength(0); // one paragraph — nothing to interleave
    } finally {
      el.remove();
    }
  });
});

describe('mirrorTypography white-space (clip-fallback sibling)', () => {
  it('mirrors preserving values but never nowrap (ellipsis-truncated labels must wrap)', () => {
    for (const [ws, expected] of [
      ['pre', 'pre'],
      ['pre-wrap', 'pre-wrap'],
      ['nowrap', ''], // an ellipsis label's sibling gloss must NOT be pinned unwrappable
      ['normal', ''],
    ] as const) {
      const r = root(`<div style="overflow-y: hidden; white-space: ${ws}">Long clipped source text</div>`);
      document.body.innerHTML = '';
      document.body.appendChild(r);
      const [u] = walkAndLabel(r, seqId);
      const node = ensureGlossNode(u, 'block');
      if (node.getAttribute(DATA_OMNI.layout) === 'block' && node.parentElement === r) {
        // happy-dom reported no clip → inside placement; the mirror never ran. Skip silently.
        continue;
      }
      expect(node.style.whiteSpace, `white-space: ${ws}`).toBe(expected);
    }
  });
});
