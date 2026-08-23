// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { DATA_OMNI } from '@/constants';
import { walkAndLabel } from './traversal';

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

describe('walkAndLabel', () => {
  it('collects leaf blocks as units, recursing past block containers', () => {
    const r = root('<div><p>Hello world</p><p>Second para</p></div>');
    const units = walkAndLabel(r, seqId);
    expect(units.map((u) => u.text)).toEqual(['Hello world', 'Second para']);
  });

  it('labels unit elements with walked + id', () => {
    const r = root('<p>Hello world</p>');
    const [unit] = walkAndLabel(r, seqId);
    expect(unit.element.hasAttribute(DATA_OMNI.walked)).toBe(true);
    expect(unit.element.getAttribute(DATA_OMNI.walkId)).toBe(unit.id);
  });

  it('keeps inline children inside the unit (one unit, placeholders)', () => {
    const r = root('<p>Hello <a href="x">world</a></p>');
    const units = walkAndLabel(r, seqId);
    expect(units).toHaveLength(1);
    expect(units[0].serialized.text).toBe('Hello {{0}}world{{1}}');
  });

  it('skips script/style/code and notranslate', () => {
    const r = root('<div><p>Keep me</p><code>skip()</code><p class="notranslate">no</p><style>x{}</style></div>');
    expect(walkAndLabel(r, seqId).map((u) => u.text)).toEqual(['Keep me']);
  });

  it('skips numeric/punctuation-only and empty blocks', () => {
    const r = root('<div><p>123.45</p><p>   </p><p>Real text</p></div>');
    expect(walkAndLabel(r, seqId).map((u) => u.text)).toEqual(['Real text']);
  });

  it('is idempotent — a second walk yields nothing new', () => {
    const r = root('<div><p>Hello world</p></div>');
    expect(walkAndLabel(r, seqId)).toHaveLength(1);
    expect(walkAndLabel(r, seqId)).toHaveLength(0);
  });

  it('treats list items as separate units', () => {
    const r = root('<ul><li>First item</li><li>Second item</li></ul>');
    expect(walkAndLabel(r, seqId).map((u) => u.text)).toEqual(['First item', 'Second item']);
  });

  it('translates text mixed with void/replaced children (form labels, icon+text)', () => {
    const r = root('<label><input type="radio"> Automatic</label><button><svg></svg>Save</button>');
    const units = walkAndLabel(r, seqId);
    expect(units.map((u) => u.text.trim())).toEqual(['Automatic', 'Save']);
  });
});

describe('walkAndLabel — shadow DOM (open roots)', () => {
  it('descends into an open shadow root and labels units inside', () => {
    const r = root('<div id="host"></div>');
    const shadow = r.querySelector('#host')!.attachShadow({ mode: 'open' });
    const p = document.createElement('p');
    p.textContent = 'Inside the shadow';
    shadow.appendChild(p);

    const roots: ShadowRoot[] = [];
    const units = walkAndLabel(r, seqId, (s) => roots.push(s));
    expect(units.map((u) => u.text)).toEqual(['Inside the shadow']);
    expect(roots).toEqual([shadow]); // caller gets the root for observer/style plumbing
  });

  it('reaches NESTED shadow roots (reports each once)', () => {
    const r = root('<div id="outer"></div>');
    const outer = r.querySelector('#outer')!.attachShadow({ mode: 'open' });
    const mid = document.createElement('div');
    outer.appendChild(mid);
    const inner = mid.attachShadow({ mode: 'open' });
    const p = document.createElement('p');
    p.textContent = 'Deeply nested text';
    inner.appendChild(p);

    const roots: ShadowRoot[] = [];
    const units = walkAndLabel(r, seqId, (s) => roots.push(s));
    expect(units.map((u) => u.text)).toEqual(['Deeply nested text']);
    expect(roots).toEqual([outer, inner]);
  });

  it('cannot see a CLOSED root (documented v1 stance — same as immersive-translate)', () => {
    const r = root('<div id="host"></div>');
    const shadow = r.querySelector('#host')!.attachShadow({ mode: 'closed' });
    const p = document.createElement('p');
    p.textContent = 'Hidden in closed shadow';
    shadow.appendChild(p);
    expect(walkAndLabel(r, seqId)).toHaveLength(0);
  });

  it('never descends into OUR OWN prefix-tagged hosts (surfaces would self-translate)', () => {
    const r = root('');
    const host = document.createElement('aie-omt-surface');
    r.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    const p = document.createElement('p');
    p.textContent = 'Our own UI text';
    shadow.appendChild(p);
    expect(walkAndLabel(r, seqId)).toHaveLength(0);
  });

  it('labels slotted light children exactly once (they render via <slot> but live in the light tree)', () => {
    const r = root('<div id="host"><p>Slotted light text</p></div>');
    const host = r.querySelector('#host')!;
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.appendChild(document.createElement('slot'));

    const units = walkAndLabel(r, seqId);
    expect(units.map((u) => u.text)).toEqual(['Slotted light text']);
  });
});

describe('walkAndLabel — computed display overrides the inline tag list', () => {
  it('an <a> restyled as a flex card is NOT inline: the walk recurses into it', () => {
    // The aicanvas shape: whole card is one <a class="flex flex-col"> full of
    // headings/paragraphs. Tag-list-only classification swallowed the card
    // into ONE unit (word-mashed blob + phantom flex-row gloss). Attached to
    // the document — computed display only exists for connected nodes.
    const r = root(
      '<div><a href="/c" style="display:flex"><h3>Card title</h3><p>A longer card description</p></a></div>'
    );
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units.map((u) => u.text)).toEqual(['Card title', 'A longer card description']);
    } finally {
      r.remove();
    }
  });

  it('an un-styled <a> keeps tag-list inline behavior (fallback path)', () => {
    // Detached root: no layout box, computed display reports '' — the same
    // shape as a non-layout engine — so the tag list decides, as before.
    const r = root('<p>see <a href="x">the docs</a> now</p>');
    expect(walkAndLabel(r, seqId)).toHaveLength(1);
  });

  it('display:none on an inline tag does not flip it to block (boxless fallback)', () => {
    const r = root('<p>Visible text <span style="display:none">hidden aside</span></p>');
    document.body.appendChild(r);
    try {
      expect(walkAndLabel(r, seqId)).toHaveLength(1);
    } finally {
      r.remove();
    }
  });
});

describe('walkAndLabel — tag/layout disagreement (the two-way guard)', () => {
  it('an inline tag restyled block inside a text-bearing parent stays IN the unit (Tailwind hero line break)', () => {
    const r = root('<h1>Deploy faster <span style="display:block">with our platform</span></h1>');
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units).toHaveLength(1);
      // the parent's direct text must not be orphaned
      expect(units[0].text).toContain('Deploy faster');
      expect(units[0].text).toContain('with our platform');
    } finally {
      r.remove();
    }
  });

  it('a block tag restyled inline-block that is a structural card is NOT swallowed', () => {
    const r = root(
      '<div><div style="display:inline-block"><h3>Card title</h3><p>Card description text</p></div></div>'
    );
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units.map((u) => u.text)).toEqual(['Card title', 'Card description text']);
    } finally {
      r.remove();
    }
  });

  it('a block-restyled inline tag with NO parent direct text still recurses (the flex-card path)', () => {
    const r = root('<div><a href="/c" style="display:block"><h3>T</h3><p>Longer description</p></a></div>');
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units.map((u) => u.text)).toEqual(['T', 'Longer description']);
    } finally {
      r.remove();
    }
  });
});

describe('walkAndLabel — sentence chips (inline-restyled DIV amid running text)', () => {
  it('an inline-flex @mention DIV mid-sentence stays in-unit (X tweetText shape)', () => {
    // X's mention chip: a DIV (non-phrasing) restyled inline-flex sitting in
    // the middle of a sentence of inline spans. Recursing at the DIV shattered
    // the sentence into three fragment units, each translated out of context.
    const r = root(
      '<div><span>bro can you ask about the </span><div style="display:inline-flex"><a href="/u">@kayla</a></div><span> injury today please?</span></div>'
    );
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units).toHaveLength(1);
      expect(units[0].text).toContain('bro can you ask about the');
      expect(units[0].text).toContain('@kayla');
      expect(units[0].text).toContain('injury today please?');
    } finally {
      r.remove();
    }
  });

  it('a chip wrapping a control still recurses (no cloned-button disease)', () => {
    const r = root(
      '<div><span>Pick the action </span><div style="display:inline-flex"><button>Go now</button></div><span> to continue</span></div>'
    );
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units.length).toBeGreaterThan(1); // NOT swallowed into one unit
      expect(units.map((u) => u.text)).toContain('Go now'); // control is its own unit, as before
    } finally {
      r.remove();
    }
  });

  it('a long inline-block DIV is structure, not a chip, even amid text', () => {
    const r = root(
      '<div>Compare <div style="display:inline-block"><h3>Card title</h3><p>A long card description well over the chip cap</p></div></div>'
    );
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units.map((u) => u.text)).toEqual(['Card title', 'A long card description well over the chip cap']);
    } finally {
      r.remove();
    }
  });
});

describe('walkAndLabel — UA-default inline-block controls are never swallowed', () => {
  it('a non-flex button row stays per-button units (no "CancelOK" mash, no cloned buttons)', () => {
    // BUTTON is inline-block by UA DEFAULT — that is not a restyle, and the
    // control must never become in-unit content (its clone in the 译文 would
    // render a second fake button).
    const r = root(
      '<div><button style="display:inline-block">Cancel</button><button style="display:inline-block">Confirm order</button></div>'
    );
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units.map((u) => u.text)).toEqual(['Cancel', 'Confirm order']);
    } finally {
      r.remove();
    }
  });

  it('an inline-restyled <li> nav keeps per-item units', () => {
    const r = root(
      '<ul><li style="display:inline">First item</li><li style="display:inline">Second item</li></ul>'
    );
    document.body.appendChild(r);
    try {
      const units = walkAndLabel(r, seqId);
      expect(units.map((u) => u.text)).toEqual(['First item', 'Second item']);
    } finally {
      r.remove();
    }
  });
});

describe('walkAndLabel — ruby / edit-mark phrasing families', () => {
  it('a sentence with <ruby> is ONE unit — the furigana never becomes the unit', () => {
    // Japanese prose: <ruby> was missing from the tag list, so the <p> was not a
    // leaf and the walk recursed to <rt> — the only leaf in sight. Result: the
    // extension translated the READING (かんじ) and silently dropped the sentence
    // that reading annotates.
    const r = root('<p>日本語の<ruby>漢字<rt>かんじ</rt></ruby>を読む</p>');
    const units = walkAndLabel(r, seqId);
    expect(units).toHaveLength(1);
    expect(units[0].text).toBe('日本語の漢字を読む');
    // The annotation is dropped from the 译文 too: a reading of the SOURCE script
    // painted over translated words is noise, so only <ruby> itself round-trips.
    expect(units[0].serialized.text).toBe('日本語の{{0}}漢字{{1}}を読む');
    expect(units[0].serialized.tags).toEqual(['<ruby>', '</ruby>']);
  });

  it('drops the <rp> parenthesis fallback with the reading it wraps', () => {
    const r = root('<p>読み方は<ruby>漢字<rp>(</rp><rt>かんじ</rt><rp>)</rp></ruby>です</p>');
    const units = walkAndLabel(r, seqId);
    expect(units).toHaveLength(1);
    expect(units[0].text).toBe('読み方は漢字です');
  });

  it('a heading that is nothing but <ruby> translates the BASE, not the reading', () => {
    // The shape that needs <rt>/<rb> in the inline list: the <ruby> itself is the
    // leaf block, so its own children decide leafness. With <rt> outside the list
    // the walk recursed one level further and made the reading the whole unit.
    const r = root('<h2><ruby><rb>東京</rb><rt>とうきょう</rt></ruby></h2>');
    const units = walkAndLabel(r, seqId);
    expect(units.map((u) => u.text)).toEqual(['東京']);
  });

  it('keeps <ins>/<del> edit marks inside the unit (one unit, tags round-trip)', () => {
    const r = root('<p>text with <ins>added</ins> and <del>removed</del> words</p>');
    const units = walkAndLabel(r, seqId);
    expect(units).toHaveLength(1);
    expect(units[0].text).toBe('text with added and removed words');
    expect(units[0].serialized.text).toBe('text with {{0}}added{{1}} and {{2}}removed{{3}} words');
  });
});
