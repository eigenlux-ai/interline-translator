// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DATA_OMNI } from '@/constants';
import { PageTranslator } from './page-translation';
import * as skipPolicyModule from './skip-policy';

// Page translation now streams over the batch Port. We mock the client and keep
// `translateBatch` as the configurable backing fn (its `{ items }` arg + return
// `{ items }` mirror the old proxy shape, so the existing call-inspection tests
// and behaviour overrides carry over unchanged). The streamed result is replayed
// as per-segment `onSegDone` callbacks.
const { translateBatch, summarizePage, segStreams } = vi.hoisted(() => ({
  translateBatch: vi.fn(),
  summarizePage: vi.fn(),
  // Each stream's onSeg handler, in call order — lets a test replay raw
  // mid-flight deltas (the token-sweep and spinner-state paths are otherwise
  // unreachable, since the mock jumps straight to segDone).
  segStreams: [] as Array<(index: number, delta: string) => void>,
}));
vi.mock('@/services/translation/contract', () => ({
  getTranslationService: () => ({ summarizePage }),
}));
vi.mock('@/services/stream/batch-client', () => ({
  streamBatchTranslate: (
    meta: object,
    items: string[],
    handlers: { onSeg?: (index: number, delta: string) => void; onSegDone: (index: number, text: string) => void }
  ) => {
    if (handlers.onSeg) segStreams.push(handlers.onSeg);
    return {
      done: Promise.resolve(translateBatch({ items, ...meta })).then((res: { items: Array<string | undefined> }) => {
        res.items.forEach((text, i) => handlers.onSegDone(i + 1, text ?? ''));
      }),
      cancel: () => {},
    };
  },
}));

// Stub IntersectionObserver: report every observed element as immediately visible.
class IOStub {
  constructor(private cb: (entries: Array<{ isIntersecting: boolean; target: Element }>) => void) {}
  observe(el: Element) {
    this.cb([{ isIntersecting: true, target: el }]);
  }
  unobserve() {}
  disconnect() {}
}

// Manual observer for viewport/clipping and scroll-backlog regressions.
class ControlledIO {
  static instance: ControlledIO;
  readonly observed = new Set<Element>();
  constructor(private cb: (entries: Array<{ isIntersecting: boolean; target: Element }>) => void) {
    ControlledIO.instance = this;
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.observed.clear();
  }
  emit(elements: Element[], isIntersecting: boolean) {
    this.cb(elements.filter((el) => this.observed.has(el)).map((target) => ({ target, isIntersecting })));
  }
}

// Default headroom covers the fill path's requestAnimationFrame hop (~16ms in
// happy-dom) even under CI load — 10ms flaked when the machine was busy.
const tick = (ms = 40) => new Promise((r) => setTimeout(r, ms));
// Shared outcome-poller for POSITIVE conditions — debounce chains + rAF hops
// fire arbitrarily late under suite load (a fixed 300ms and even a 3000ms
// budget both flaked in CI-like contention), so poll generously. NEGATIVE
// assertions (nothing should happen) keep their fixed waits — there the
// elapsed time IS the assertion.
const waitFor = async (cond: () => boolean, timeoutMs = 5000) => {
  const t0 = Date.now();
  while (!cond() && Date.now() - t0 < timeoutMs) await tick(20);
};

beforeEach(() => {
  summarizePage.mockReset();
  summarizePage.mockResolvedValue('');
  (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IOStub;
  segStreams.length = 0;
  translateBatch.mockReset();
  translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
    items: items.map((s) => `[t]${s}`),
    providerId: 'mock',
  }));
  // Fresh <body> per test: happy-dom doesn't always flush a MutationObserver's
  // queued records on disconnect(), so a prior test's leaked observer would still
  // fire on this test's DOM. Replacing the body leaves it observing a detached node.
  document.body.replaceWith(document.createElement('body'));
});

afterEach(() => {
  document.body.innerHTML = '';
});

describe('PageTranslator', () => {
  it('injects 译文 nodes with translated text for visible units', async () => {
    document.body.innerHTML = '<p>Hello world</p><p>Second para</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const gloss = document.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(gloss.length).toBe(2);
    expect(gloss[0].textContent).toContain('[t]Hello world');
    expect(gloss[1].textContent).toContain('[t]Second para');
    expect(translateBatch).toHaveBeenCalledOnce(); // both units packed into one batch
    pt.stop();
  });

  it.each(['scroll away', 'remove source', 'restart'])('rechecks async detection after %s', async (action) => {
    globalThis.IntersectionObserver = ControlledIO as unknown as typeof IntersectionObserver;
    document.body.innerHTML = '<p>Content awaiting language detection</p>';
    const el = document.querySelector('p')!;
    let release!: (skip: boolean) => void;
    const detect = vi
      .spyOn(skipPolicyModule, 'detectSaysSkip')
      .mockImplementationOnce(
        () =>
          new Promise<boolean>((resolve) => {
            release = resolve;
          })
      )
      .mockResolvedValue(false);
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    try {
      pt.start();
      await waitFor(() => ControlledIO.instance.observed.has(el));
      ControlledIO.instance.emit([el], true);
      await waitFor(() => !!release);
      expect(release).toBeTypeOf('function');
      if (action === 'scroll away') ControlledIO.instance.emit([el], false);
      else if (action === 'remove source') el.remove();
      else {
        pt.stop();
        pt.start();
      }
      release(false);
      await tick();
      expect(translateBatch).not.toHaveBeenCalled();
      expect(document.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();
      if (action !== 'remove source') {
        ControlledIO.instance.emit([el], true);
        await waitFor(() => translateBatch.mock.calls.length === 1);
        expect(translateBatch).toHaveBeenCalledOnce();
      }
    } finally {
      pt.stop();
      detect.mockRestore();
    }
  });

  it('waits for intersection instead of translating window-aligned but clipped content', async () => {
    globalThis.IntersectionObserver = ControlledIO as unknown as typeof IntersectionObserver;
    document.body.innerHTML = '<div style="overflow:hidden;height:20px"><p>Clipped panel content</p></div>';
    const el = document.querySelector('p')!;
    el.getBoundingClientRect = () => ({ top: 100, bottom: 140, left: 0, right: 200 }) as DOMRect;
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    try {
      pt.start();
      await waitFor(() => ControlledIO.instance.observed.has(el));
      ControlledIO.instance.emit([el], false);
      await tick();
      expect(translateBatch).not.toHaveBeenCalled();
      expect(document.querySelector('[data-omni-translated]')).toBeNull();
      ControlledIO.instance.emit([el], true);
      await waitFor(() => translateBatch.mock.calls.length === 1);
      expect(translateBatch).toHaveBeenCalledOnce();
    } finally {
      pt.stop();
    }
  });

  it('defers a queued unit that exits before dispatch, then translates it on re-entry once', async () => {
    globalThis.IntersectionObserver = ControlledIO as unknown as typeof IntersectionObserver;
    document.body.innerHTML = '<p>Paragraph scrolled past</p>';
    const el = document.querySelector('p')!;
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 20 });
    try {
      pt.start();
      await waitFor(() => ControlledIO.instance.observed.has(el));
      ControlledIO.instance.emit([el], true);
      ControlledIO.instance.emit([el], false);
      await tick(60);
      expect(translateBatch).not.toHaveBeenCalled();
      expect(document.querySelector('[data-omni-translated]')).toBeNull();
      ControlledIO.instance.emit([el], true);
      ControlledIO.instance.emit([el], true);
      await waitFor(() => translateBatch.mock.calls.length === 1);
      expect(translateBatch).toHaveBeenCalledOnce();
      expect(translateBatch.mock.calls[0][0].items).toEqual(['Paragraph scrolled past']);
    } finally {
      pt.stop();
    }
  });

  it('bounds active batches and drops scrolled-past backlog before a slot opens', async () => {
    globalThis.IntersectionObserver = ControlledIO as unknown as typeof IntersectionObserver;
    document.body.innerHTML = Array.from({ length: 30 }, (_, i) => `<p>Reading paragraph number ${i}</p>`).join('');
    const elements = [...document.querySelectorAll('p')];
    const releases: Array<() => void> = [];
    translateBatch.mockImplementation(
      ({ items }: { items: string[] }) =>
        new Promise((resolve) => {
          releases.push(() => resolve({ items: items.map((s) => `[t]${s}`) }));
        })
    );
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      maxBatchItems: 1,
    });
    try {
      pt.start();
      await waitFor(() => ControlledIO.instance.observed.size === elements.length);
      ControlledIO.instance.emit(elements, true);
      await tick();
      expect(translateBatch).toHaveBeenCalledTimes(2);
      expect(document.querySelectorAll('[data-omni-translated]')).toHaveLength(2);
      ControlledIO.instance.emit(elements.slice(0, -1), false);
      releases[0]();
      await waitFor(() => translateBatch.mock.calls.length === 3);
      expect(translateBatch).toHaveBeenCalledTimes(3);
      expect(translateBatch.mock.calls[2][0].items).toEqual(['Reading paragraph number 29']);
      releases[1]();
      releases[2]();
      await tick();
      expect(translateBatch).toHaveBeenCalledTimes(3);
      ControlledIO.instance.emit([elements[10]], true);
      await waitFor(() => translateBatch.mock.calls.length === 4);
      expect(translateBatch.mock.calls[3][0].items).toEqual(['Reading paragraph number 10']);
      releases[3]();
    } finally {
      pt.stop();
      releases.forEach((release) => release());
    }
  });

  it('releases a failed batch slot so queued visible content can finish', async () => {
    document.body.innerHTML = '<p>First paragraph fails</p><p>Second paragraph works</p><p>Third paragraph works</p>';
    translateBatch.mockRejectedValueOnce(new Error('rate limited'));
    const pt = new PageTranslator(document.body, { source: 'en', target: 'zh-CN', maxBatchItems: 1, flushDelayMs: 0 });
    try {
      pt.start();
      await waitFor(() => document.querySelectorAll(`[${DATA_OMNI.state}="done"]`).length === 2);
      expect(translateBatch).toHaveBeenCalledTimes(3);
      expect(document.querySelectorAll(`[${DATA_OMNI.state}="done"]`)).toHaveLength(2);
      expect(document.querySelector(`[${DATA_OMNI.state}="error"]`)?.textContent).toContain('rate limited');
    } finally {
      pt.stop();
    }
  });

  it('old streams cannot fill or release slots belonging to a restarted session', async () => {
    document.body.innerHTML = '<p>First paragraph</p><p>Second paragraph</p><p>Third paragraph</p>';
    const releases: Array<() => void> = [];
    translateBatch.mockImplementation(
      ({ items }: { items: string[] }) =>
        new Promise((resolve) => {
          releases.push(() => resolve({ items: items.map((s) => `[t]${s}`) }));
        })
    );
    const pt = new PageTranslator(document.body, { source: 'en', target: 'zh-CN', maxBatchItems: 1, flushDelayMs: 0 });
    try {
      pt.start();
      await waitFor(() => releases.length === 2);
      pt.stop();
      pt.start();
      await waitFor(() => releases.length === 4);
      releases[0]();
      releases[1]();
      segStreams[0](1, 'stale stream');
      await tick();
      expect(translateBatch).toHaveBeenCalledTimes(4);
      expect(document.querySelectorAll(`[${DATA_OMNI.state}="done"]`)).toHaveLength(0);
      expect(document.body.textContent).not.toContain('stale stream');
      releases[2]();
      await waitFor(() => releases.length === 5);
      expect(translateBatch).toHaveBeenCalledTimes(5);
    } finally {
      pt.stop();
      releases.forEach((release) => release());
    }
  });

  it('orders a batch closest-to-viewport first at flush time (scroll-past backlog)', async () => {
    // DOM order is farthest-first on purpose: the sort, not the walk, must
    // decide prompt order. happy-dom rects are all zeros, so hand each unit a
    // rect that places it far below / just below / inside the viewport.
    document.body.innerHTML =
      '<p id="far">Far below content</p><p id="mid">Mid distance content</p><p id="near">On screen content</p>';
    const rect = (top: number) => () => ({ top, bottom: top + 50, left: 0, right: 100 }) as DOMRect;
    const h = window.innerHeight;
    document.getElementById('far')!.getBoundingClientRect = rect(h + 2000);
    document.getElementById('mid')!.getBoundingClientRect = rect(h + 600);
    document.getElementById('near')!.getBoundingClientRect = rect(100);
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    expect(translateBatch).toHaveBeenCalledOnce();
    const sent = (translateBatch.mock.calls[0][0] as { items: string[] }).items;
    expect(sent).toEqual(['On screen content', 'Mid distance content', 'Far below content']);
    pt.stop();
  });

  it('带样式翻译 off: the engine sees plain text and the 译文 carries no inline markup', async () => {
    document.body.innerHTML = '<p>Hello <a href="/x">world</a> and <b>friends</b> of the web</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0, richText: false });
    pt.start();
    await tick();

    // Engine input is the visible text — no {{n}} placeholder protocol.
    const sent = (translateBatch.mock.calls.at(-1)![0] as { items: string[] }).items;
    expect(sent[0]).not.toContain('{{');
    expect(sent[0]).toContain('Hello world and friends of the web');
    // The gloss is plain text — the source's inline tags are not reproduced.
    const gloss = document.querySelector(`[${DATA_OMNI.translated}]`)!;
    expect(gloss.querySelector('a, b')).toBeNull();
    expect(gloss.textContent).toContain('[t]Hello world and friends of the web');
    pt.stop();
  });

  it('带样式翻译 default (on): placeholders flow to the engine and markup is restored', async () => {
    document.body.innerHTML = '<p>Hello <a href="/x">world</a> of links and other words</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const sent = (translateBatch.mock.calls.at(-1)![0] as { items: string[] }).items;
    expect(sent[0]).toContain('{{0}}');
    const gloss = document.querySelector(`[${DATA_OMNI.translated}]`)!;
    expect(gloss.querySelector('a')).not.toBeNull();
    pt.stop();
  });

  it('通读全文 on: batches issued AFTER the overview lands carry it; SPA nav invalidates it', async () => {
    summarizePage.mockResolvedValue('K8s 运维指南概览');
    // enough prose to clear the 600-char floor
    document.body.innerHTML = `<p>${'K8s operations '.repeat(50)}</p>`;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      pageContext: true,
    });
    pt.start();
    await tick();
    expect(summarizePage).toHaveBeenCalledOnce();
    // first batch raced the summary — it may or may not carry it; force a NEW batch after it landed
    document.body.insertAdjacentHTML('beforeend', '<p>Late paragraph after summary</p>');
    await tick(80);
    const last = translateBatch.mock.calls.at(-1)![0] as { context?: { summary?: string } };
    expect(last.context?.summary).toBe('K8s 运维指南概览');
    pt.stop();
  });

  it('通读全文 off (default): no summary call, no summary in context', async () => {
    document.body.innerHTML = '<p>Hello plain</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(summarizePage).not.toHaveBeenCalled();
    const meta = translateBatch.mock.calls[0][0] as { context?: { summary?: string } };
    expect(meta.context?.summary).toBeUndefined();
    pt.stop();
  });

  it('sends the page title + host as request context (domain sense for the model, site rules for the resolver)', async () => {
    document.title = 'My Article — Example Site';
    document.body.innerHTML = '<p>Hello context</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const meta = translateBatch.mock.calls[0][0] as { context?: { title?: string; domain?: string } };
    expect(meta.context?.title).toBe('My Article — Example Site');
    expect(meta.context?.domain).toBe(location.hostname || undefined);
    pt.stop();
    document.title = '';
  });

  it('preserves inline tags through placeholder restore', async () => {
    translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
      // echo back the placeholder text unchanged (a faithful translator keeps placeholders)
      items: items.map((s) => s.replace('Hello', '你好')),
      providerId: 'mock',
    }));
    document.body.innerHTML = '<p>Hello <a href="/x">world</a></p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const gloss = document.querySelector(`[${DATA_OMNI.translated}]`)!;
    const link = gloss.querySelector('a');
    expect(link).not.toBeNull();
    expect(link!.getAttribute('href')).toBe('/x');
    expect(gloss.textContent).toContain('你好');
    pt.stop();
  });

  it('stop() restores the page exactly (removes 译文 + clears markers)', async () => {
    document.body.innerHTML = '<p>Hello world</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(document.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(1);

    pt.stop();
    expect(document.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(0);
    expect(document.querySelectorAll(`[${DATA_OMNI.walked}]`).length).toBe(0);
    expect(document.body.innerHTML).toBe('<p>Hello world</p>');
  });

  it('uses inline mode for flex children — appended inside, no block sibling', async () => {
    // Block children of a flex row: each is its own unit; a block 译文 sibling
    // would add a flex item and break the row → must inject inline.
    document.body.innerHTML = '<div id="row" style="display:flex"><div>Item one</div><div>Item two</div></div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const row = document.getElementById('row')!;
    expect(row.children.length).toBe(2); // no extra flex items injected into the row
    expect(document.querySelectorAll('aie-omt-inline[data-omni-translated]').length).toBe(2);
    expect(document.querySelectorAll('aie-omt-block').length).toBe(0);
    const firstCell = row.children[0];
    expect(firstCell.lastElementChild?.getAttribute(DATA_OMNI.layout)).toBe('inline');
    expect(firstCell.textContent).toContain('[t]Item one'); // 译文 lives inside the cell
    pt.stop();
  });

  it('long table cell → inline (no stray block sibling inside the <tr>)', async () => {
    // A block 译文 sibling of a <td> would be a stray non-cell node breaking the
    // table. Long cell text must therefore inject inline (appended inside the td).
    const long = 'This table cell holds a long sentence that exceeds the inline threshold for sure here.';
    document.body.innerHTML = `<table><tbody><tr><td>${long}</td></tr></tbody></table>`;
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const tr = document.querySelector('tr')!;
    expect(tr.querySelector('aie-omt-block')).toBeNull(); // no stray block node in the row
    const td = document.querySelector('td')!;
    expect(td.querySelector('aie-omt-inline[data-omni-translated]')).not.toBeNull();
    expect(td.textContent).toContain(`[t]${long}`); // 译文 lives inside the cell
    pt.stop();
  });

  it('content link in prose → 译文 stays at the paragraph level, NOT inside the link', async () => {
    // A prose link is not its own unit; the surrounding direct text stops the
    // descent at the <p>, so the 译文 must never bury itself in the inline link
    // (which would make it clickable / inherit link styling). Real-browser block
    // nav-link same-line descent is verified separately in the browser.
    document.body.innerHTML = '<p>see <a href="/x">this</a> now</p>'; // short → inline mode
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const a = document.querySelector('a')!;
    expect(a.querySelector('[data-omni-translated]')).toBeNull(); // never inside the content link
    const gloss = document.querySelector('aie-omt-inline[data-omni-translated]')!;
    expect(gloss.parentElement?.tagName.toLowerCase()).toBe('p'); // at the paragraph level
    pt.stop();
  });

  it('nav link unit (whole content is one <a>) → 译文 carries NO duplicate <a>', async () => {
    // A TOC/sidebar item `<li><a><span>text</span></a>`: the link wraps the
    // entire unit. The 译文 must reproduce only the text, never a second working
    // <a href> (which, appended inside the original <a>, is an invalid a-in-a).
    document.body.innerHTML = '<li><a href="#prereq"><span>Prerequisites</span></a></li>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const gloss = document.querySelector(`aie-omt-inline[${DATA_OMNI.translated}]`)!;
    expect(gloss.querySelector('a')).toBeNull(); // no reproduced link inside the 译文
    expect(gloss.textContent).toContain('[t]Prerequisites');
    // exactly one anchor on the page — the original, untouched
    expect(document.querySelectorAll('a[href="#prereq"]').length).toBe(1);
    pt.stop();
  });

  it('link group (Prev/Next pager: 2+ sibling links, no prose) → each link its own unit, no block reproducing both', async () => {
    document.body.innerHTML =
      '<div id="pager">' +
      '<a href="/prev" rel="prev"><span>Previous<br><span>Quick Start</span></span></a>' +
      '<a href="/next" rel="next"><span>Next<br><span>Hello World</span></span></a>' +
      '</div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const pager = document.getElementById('pager')!;
    // No single block gloss reproducing BOTH cards as siblings of the container.
    expect(pager.parentElement!.querySelector('aie-omt-block')).toBeNull();
    // Each link got its own inline gloss, appended inside that link.
    const prev = pager.querySelector('a[rel="prev"]')!;
    const next = pager.querySelector('a[rel="next"]')!;
    expect(prev.querySelector('[data-omni-translated]')).not.toBeNull();
    expect(next.querySelector('[data-omni-translated]')).not.toBeNull();
    // No gloss reproduces a duplicate <a href> link.
    for (const g of document.querySelectorAll('[data-omni-translated]')) {
      expect(g.querySelector('a')).toBeNull();
    }
    // Still exactly the two original anchors.
    expect(document.querySelectorAll('#pager > a').length).toBe(2);
    pt.stop();
  });

  it('partial content link (link wraps only part of the unit) → 译文 KEEPS the link', async () => {
    translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
      items: items.map((s) => s.replace('see', '见').replace('this', '这个')),
      providerId: 'mock',
    }));
    document.body.innerHTML = '<p>see <a href="/x">this</a> now</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const gloss = document.querySelector(`[${DATA_OMNI.translated}]`)!;
    expect(gloss.querySelector('a')?.getAttribute('href')).toBe('/x'); // link preserved in 译文
    pt.stop();
  });

  it('a trailing empty marker child does not orphan the element text', async () => {
    // An empty, non-inline marker child (e.g. a perf/telemetry custom element at
    // the end of a heading or link) must NOT turn its parent into a non-leaf and
    // drop the parent's own text.
    document.body.innerHTML = '<h2 id="ttl">A heading whose text must survive a trailing marker<x-mark></x-mark></h2>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const sent = translateBatch.mock.calls.flatMap((c) => c[0].items as string[]).join(' ');
    expect(sent).toContain('A heading whose text must survive a trailing marker');
    expect(document.querySelector('[data-omni-translated]')).not.toBeNull();
    pt.stop();
  });

  it('hidden subtree ([hidden] / display:none) is NOT translated', async () => {
    document.body.innerHTML =
      '<p>Visible text here</p>' +
      '<div hidden><p>Hidden menu item</p></div>' +
      '<div style="display:none"><p>Collapsed template content</p></div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const items = translateBatch.mock.calls.flatMap((c) => c[0].items as string[]);
    expect(items).toContain('Visible text here');
    expect(items).not.toContain('Hidden menu item'); // [hidden] subtree pruned
    // Exactly one gloss — only the visible paragraph.
    expect(document.querySelectorAll('[data-omni-translated]').length).toBe(1);
    pt.stop();
  });

  it('icon-only link (only an sr-only label + svg) is NOT translated', async () => {
    document.body.innerHTML =
      '<div class="social">' +
      '<a href="https://github.com/x"><span class="sr-only">GitHub</span><svg viewBox="0 0 1 1"></svg></a>' +
      '<a href="https://discord.gg/x"><span class="sr-only">Discord</span><svg viewBox="0 0 1 1"></svg></a>' +
      '</div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    // No 译文 injected for icon-only links (the sr-only label is not visible text).
    expect(document.querySelectorAll('[data-omni-translated]').length).toBe(0);
    expect(translateBatch).not.toHaveBeenCalled();
    pt.stop();
  });

  it('visible text + sr-only label → translates the visible text, drops sr-only from 译文', async () => {
    // A control with a real visible label AND an sr-only helper: translate the
    // visible label only; the sr-only text must not enter the 译文.
    document.body.innerHTML = '<button><span class="sr-only">extra context</span>Save</button>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const gloss = document.querySelector('[data-omni-translated]')!;
    expect(gloss).not.toBeNull();
    expect(gloss.textContent).toContain('[t]Save');
    expect(gloss.textContent).not.toContain('extra context'); // sr-only not reproduced
    pt.stop();
  });

  it('pre-skips already-target-language units before translating (no RPC, no spinner)', async () => {
    document.body.innerHTML =
      '<p>这是一段已经是中文的内容，不应该被发去翻译。</p>' + // already zh → pre-skip
      '<p>在 JavaScript 中引擎负责执行代码并优化性能。</p>' + // zh-dominant with a term → pre-skip
      '<p>This whole line is English and must be translated now.</p>' + // en → translate
      '<p>これは日本語の文です。</p>'; // Japanese (kana) → translate to zh
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const sent = translateBatch.mock.calls.flatMap((c) => c[0].items as string[]).join(' ');
    expect(sent).toContain('This whole line is English'); // English sent
    expect(sent).toContain('これは'); // Japanese sent (kana ⇒ translate)
    expect(sent).not.toContain('已经是中文'); // already Chinese not sent
    expect(sent).not.toContain('引擎负责执行'); // Han-dominant not sent
    pt.stop();
  });

  it('already-target / untranslatable text (engine returns it unchanged) → no 译文', async () => {
    // The engine echoes the input back (text is already the target language, or a
    // bare proper noun). We must not inject a 译文 that just duplicates the source.
    translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
      items: items.map((s) => s), // unchanged
      providerId: 'mock',
    }));
    document.body.innerHTML = '<p>这是一段已经是中文的文本，不需要再翻译。</p><p>Translate me please now</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const ps = document.querySelectorAll('p');
    expect(ps[0].querySelector('[data-omni-translated]')).toBeNull(); // unchanged → dropped
    expect(ps[1].querySelector('[data-omni-translated]')).toBeNull(); // also unchanged here → dropped
    expect(document.querySelectorAll('[data-omni-translated]').length).toBe(0);
    pt.stop();
  });

  it('already-target text that contained inline tags (engine drops placeholders) → no 译文', async () => {
    // The engine returns the visible text unchanged but WITHOUT the placeholder
    // markers ({{0}}…) — so it equals unit.text, not unit.serialized.text. The
    // guard must compare against the plain visible text too, or a duplicate 译文
    // survives. Source is already Chinese, with an inline <code> in the middle.
    translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
      // strip the {{n}} placeholders the serializer inserted for <code> → plain text
      items: items.map((s) => s.replace(/\{\{\d+\}\}/g, '代码')),
      providerId: 'mock',
    }));
    document.body.innerHTML = '<p>这段文本里有一个 <code>代码</code> 词，整体已是中文无需翻译。</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    expect(document.querySelectorAll('[data-omni-translated]').length).toBe(0); // unchanged vs visible → dropped
    pt.stop();
  });

  it('host removes a translated source → its orphaned afterend 译文 is swept', async () => {
    // The clipped-source fallback puts the 译文 as an afterend SIBLING (not inside
    // the source), so when a host surgically removes only the source element the
    // sibling would be left orphaned. onMutations(removedNodes) must sweep it by
    // walkId. (happy-dom has no layout, so we hand-build the afterend-sibling
    // shape a real clip would produce.)
    const host = document.createElement('div');
    const src = document.createElement('p');
    src.setAttribute(DATA_OMNI.walked, '');
    src.setAttribute(DATA_OMNI.walkId, 'u-orphan');
    src.textContent = 'مصدر';
    const gloss = document.createElement('aie-omt-block');
    gloss.setAttribute(DATA_OMNI.translated, '');
    gloss.setAttribute(DATA_OMNI.walkId, 'u-orphan');
    gloss.textContent = '译文';
    host.append(src, gloss);
    document.body.appendChild(host);

    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(document.querySelector(`[${DATA_OMNI.translated}][${DATA_OMNI.walkId}="u-orphan"]`)).not.toBeNull();

    src.remove(); // host removes ONLY the source → afterend gloss now orphaned
    // Poll for the sweep (MO delivery can lag under worker load — a fixed
    // tick flaked); the assertion below still fails hard if it never happens.
    const t0 = Date.now();
    while (
      document.querySelector(`[${DATA_OMNI.walkId}="u-orphan"][${DATA_OMNI.translated}]`) &&
      Date.now() - t0 < 2000
    ) {
      await tick(20);
    }
    expect(document.querySelector(`[${DATA_OMNI.translated}][${DATA_OMNI.walkId}="u-orphan"]`)).toBeNull();
    pt.stop();
  });

  it('host MOVES a translated source (remove + re-add) → keeps its 译文, does not drop it', async () => {
    // A drag-reorder / virtual-list recycle / keyed reconcile moves a node: it
    // appears in removedNodes AND addedNodes of the same batch. By the time the
    // observer runs the source is re-attached (isConnected), so we must NOT treat
    // it as removed — its inside 译文 moved with it and must survive, and the unit
    // must stay tracked (not silently dropped from translation forever).
    document.body.innerHTML =
      '<div id="from"><p>A fairly long paragraph that goes into block mode for sure here please.</p></div>' +
      '<div id="to"></div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const p = document.querySelector('p')!;
    expect(p.querySelector('[data-omni-translated]')).not.toBeNull();
    expect(document.querySelectorAll('[data-omni-translated]').length).toBe(1);

    document.getElementById('to')!.appendChild(p); // MOVE the source across containers
    await tick();

    // 译文 still present, still inside the moved source, still exactly one.
    expect(p.parentElement?.id).toBe('to');
    expect(p.querySelector('[data-omni-translated]')).not.toBeNull();
    expect(document.querySelectorAll('[data-omni-translated]').length).toBe(1);
    pt.stop();
  });

  it('routes by text length: short → inline (same line), long → block (own line)', async () => {
    const longText = 'This is a fairly long paragraph of prose that clearly exceeds the inline threshold for sure.';
    document.body.innerHTML = `<h2>Quick Start</h2><p>${longText}</p>`;
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const heading = document.querySelector('h2')!;
    const para = document.querySelector('p')!;
    // Short heading → inline 译文 appended INSIDE, on the same line.
    expect(heading.querySelector('aie-omt-inline[data-omni-translated]')).not.toBeNull();
    expect(heading.querySelector('aie-omt-block')).toBeNull();
    // Long paragraph → block 译文 appended INSIDE the source (groups with the
    // text, on its own line via display:block), NOT an afterend sibling.
    expect(para.querySelector('aie-omt-block[data-omni-translated]')).not.toBeNull();
    expect(para.nextElementSibling?.tagName.toLowerCase()).not.toBe('aie-omt-block');
    expect(para.querySelector('aie-omt-inline')).toBeNull();
    pt.stop();
  });
});

describe('PageTranslator — dynamic content (reveal / text change / node pool)', () => {
  // The debounced dynamic flush waits 150ms, but under worker load a timer can
  // For NEGATIVE assertions (nothing should happen) a fixed wait is the point.
  const dynamicTick = () => tick(300);

  it('sweeps glosses once per root for a batch rewrite, preserving unchanged translations', async () => {
    document.body.innerHTML = '<p id="stable">Stable sentence</p><div id="host"></div>';
    const shadow = document.getElementById('host')!.attachShadow({ mode: 'open' });
    const sources: Element[] = [];
    for (const root of [document.body, shadow]) {
      for (let i = 0; i < 8; i++) {
        const p = document.createElement('p');
        p.textContent = `Original sentence ${sources.length}`;
        root.append(p);
        sources.push(p);
      }
    }
    const selector = `[${DATA_OMNI.translated}]`;
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    const finished = (prefix: string) => sources.every((p) => p.querySelector(selector)?.textContent?.includes(prefix));
    await waitFor(() => finished('[t]Original'));
    expect(finished('[t]Original')).toBe(true);
    const stable = document.getElementById('stable')!;
    const stableGloss = stable.querySelector(selector);
    const lightQueries = vi.spyOn(document.body, 'querySelectorAll');
    const shadowQueries = vi.spyOn(shadow, 'querySelectorAll');
    try {
      sources.forEach((p, i) => {
        (p.firstChild as Text).data = `Updated sentence ${i}`;
      });
      (stable.firstChild as Text).data = 'Stable sentence';
      await waitFor(() => finished('[t]Updated'));
      expect(finished('[t]Updated')).toBe(true);
      expect(sources.every((p) => p.querySelectorAll(selector).length === 1)).toBe(true);
      expect(stable.querySelector(selector)).toBe(stableGloss);
      expect(lightQueries.mock.calls.filter(([s]) => s === selector)).toHaveLength(1);
      expect(shadowQueries.mock.calls.filter(([s]) => s === selector)).toHaveLength(1);
    } finally {
      lightQueries.mockRestore();
      shadowQueries.mockRestore();
      pt.stop();
    }
  });

  it('translates a hidden panel when it is REVEALED (tabs/accordion pattern)', async () => {
    document.body.innerHTML = '<div id="panel" hidden><p>Hidden tab content</p></div><p>Visible text</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const panel = document.getElementById('panel')!;
    // Walk-pruned while hidden: no marks, no gloss inside.
    expect(panel.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();

    panel.removeAttribute('hidden'); // the host reveals the tab — attributes-only change
    await waitFor(() => !!panel.querySelector(`[${DATA_OMNI.translated}]`));

    expect(panel.querySelector(`[${DATA_OMNI.translated}]`)?.textContent).toContain('[t]Hidden tab content');
    pt.stop();
  });

  it('replaces a stale 译文 when the source TEXT changes in place (characterData)', async () => {
    document.body.innerHTML = '<p id="chat">First message</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const p = document.getElementById('chat')!;
    expect(p.querySelector(`[${DATA_OMNI.translated}]`)?.textContent).toContain('[t]First message');

    // happy-dom occasionally DROPS a characterData record when many observers
    // ran earlier in the same worker (cousin of the disconnect quirk noted in
    // beforeEach) — diagnosed via state snapshot: on flaky runs the unit's
    // walkId never changed, i.e. the record never arrived. Re-poke instead of
    // sleeping longer: a genuinely broken retranslate path fails regardless of
    // how many pokes it gets. Verified against real Chrome's MO live.
    const translatedSecond = () =>
      document.querySelector(`[${DATA_OMNI.translated}]`)?.textContent?.includes('[t]Second') ?? false;
    for (let poke = 0; poke < 4 && !translatedSecond(); poke++) {
      (p.firstChild as Text).data = `Second message${'.'.repeat(poke)}`; // in-place swap, no childList record
      await waitFor(translatedSecond, 700);
    }

    const glosses = document.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses[0]?.textContent).toContain('[t]Second');
    expect(glosses.length).toBe(1); // stale gloss replaced, not accumulated
    expect(glosses[0].textContent).toContain('[t]Second message');
    pt.stop();
  });

  it('translates a skeleton element filled with a text node AFTER the walk', async () => {
    document.body.innerHTML = '<p id="skeleton"></p><p>Real text</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const skeleton = document.getElementById('skeleton')!;
    expect(skeleton.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();

    skeleton.appendChild(document.createTextNode('Streamed-in content')); // bare text node, no element added
    // happy-dom drops MO records under worker load (see the chat test's note):
    // re-poke via the rescan nudge — production's own second healing signal.
    const filled = () => !!skeleton.querySelector(`[${DATA_OMNI.translated}]`);
    for (let poke = 0; poke < 4 && !filled(); poke++) {
      pt.notifyShadowAttached();
      await waitFor(filled, 700);
    }

    expect(skeleton.querySelector(`[${DATA_OMNI.translated}]`)?.textContent).toContain('[t]Streamed-in content');
    pt.stop();
  });

  // retry: this test needs a LIVE MutationObserver, and happy-dom's wedges
  // outright under worker load (hand-fed records + rescan nudges were both
  // tried; the downstream path stalls with the environment, not our code —
  // verified against real Chrome's MO). Independent runs pass; retry owns it.
  it('re-translates a pooled node re-attached with STALE marks (virtual list)', { retry: 3 }, async () => {
    document.body.innerHTML = '<div id="list"><p id="row">Row content</p></div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const row = document.getElementById('row')!;
    expect(row.hasAttribute(DATA_OMNI.walked)).toBe(true);

    // Batch 1: the virtual list pools the node (detach) → tracking pruned.
    row.remove();
    await tick(30);
    // The pool reuses the node for a DIFFERENT item: content rewritten (which
    // also wipes the old inside gloss), but last attachment's marks survive.
    row.textContent = 'Recycled row content';
    // Batch 2: re-attached later with stale marks from previous attachment.
    document.getElementById('list')!.appendChild(row);
    const refilled = () => !!row.querySelector(`[${DATA_OMNI.translated}]`)?.textContent?.includes('[t]Recycled');
    await waitFor(refilled);

    const gloss = row.querySelector(`[${DATA_OMNI.translated}]`);
    expect(gloss?.textContent).toContain('[t]Recycled row content'); // NOT skipped-forever
    expect(document.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(1);
    pt.stop();
  });

  it('the rescan healer NEVER refills stale 译文 onto a recycled node (guard in refillFromCache)', async () => {
    document.body.innerHTML = '<p id="row">Original text</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const row = document.getElementById('row')!;
    expect(row.querySelector(`[${DATA_OMNI.translated}]`)?.textContent).toContain('[t]Original text');

    // Recycle: the host wipes the content (gloss goes with it) but the walked
    // marks + unit tracking survive — then a full rescan fires (shadow attach).
    row.textContent = 'Recycled different text';
    pt.notifyShadowAttached();
    await dynamicTick();

    // The healer must NOT resurrect '[t]Original text' onto the changed node.
    const gloss = row.querySelector(`[${DATA_OMNI.translated}]`);
    expect(gloss?.textContent ?? '').not.toContain('[t]Original text');
    pt.stop();
  });

  it('an EMPTY segDone drops the gloss quietly (engine gave up ≠ error banner)', async () => {
    translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
      items: items.map(() => ''), // the batch fallback's documented give-up
      providerId: 'mock',
    }));
    document.body.innerHTML = '<p>Untranslatable-ish</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick(60);

    expect(document.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(0); // no stuck spinner…
    expect(document.querySelector(`[${DATA_OMNI.state}="error"]`)).toBeNull(); // …and no error marker
    pt.stop();
  });

  it('streaming display sweeps ~n tokens — whole ones AND a trailing half-token', async () => {
    document.body.innerHTML = '<p>Alpha beta gamma delta epsilon</p>';
    // Hold the batch open: the sweep only matters while the stream is in flight.
    let release!: (v: { items: string[] }) => void;
    translateBatch.mockImplementation(() => new Promise((r) => (release = r)));
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const emit = segStreams.at(-1)!;
    emit(1, '第一段[[ab12cd~n]]第二');
    emit(1, '段[[ab12cd~'); // a delta can cut a token anywhere
    await tick(); // RAF-buffered stream flush

    const gloss = document.querySelector(`[${DATA_OMNI.translated}]`)!;
    expect(gloss.getAttribute(DATA_OMNI.state)).toBe('streaming');
    expect(gloss.textContent).toBe('第一段\n第二段'); // token → break, half-token hidden

    release({ items: ['[t]final text'] });
    await tick();
    expect(document.querySelector(`[${DATA_OMNI.translated}]`)!.textContent).toContain('[t]final text');
    pt.stop();
  });

  it('does not self-trigger: its own gloss writes cause no re-translation loop', async () => {
    document.body.innerHTML = '<p>Loop check text</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(translateBatch).toHaveBeenCalledOnce();

    await dynamicTick(); // let any (wrong) scheduled rescan/retranslate fire
    await dynamicTick();

    expect(translateBatch).toHaveBeenCalledOnce(); // still exactly one batch
    expect(document.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(1);
    pt.stop();
  });
});

describe('PageTranslator — shadow DOM (open roots)', () => {
  function mountShadowHost(initialHtml = '<p>Shadow paragraph text</p>') {
    const host = document.createElement('div');
    host.id = 'sd-host';
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = initialHtml;
    return { host, shadow };
  }

  it('translates content inside an open shadow root (gloss + styles land IN the root)', async () => {
    document.body.innerHTML = '<p>Light DOM text</p>';
    const { shadow } = mountShadowHost();
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await waitFor(() => !!shadow.querySelector(`[${DATA_OMNI.translated}]`));

    expect(shadow.querySelector(`[${DATA_OMNI.translated}]`)?.textContent).toContain('[t]Shadow paragraph text');
    // Styles don't pierce shadow boundaries — the root needs its own copy
    // (constructable sheet, or the <style data-omni-styles> fallback).
    const styled = (shadow.adoptedStyleSheets?.length ?? 0) > 0 || !!shadow.querySelector('style[data-omni-styles]');
    expect(styled).toBe(true);
    pt.stop();
  });

  it('observes mutations INSIDE the root: content added after start gets translated', async () => {
    document.body.innerHTML = '<p>Light DOM text</p>';
    const { shadow } = mountShadowHost();
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await waitFor(() => !!shadow.querySelector(`[${DATA_OMNI.translated}]`));

    const late = document.createElement('p');
    late.textContent = 'Added inside the shadow later';
    shadow.appendChild(late);
    await waitFor(() => !!late.querySelector(`[${DATA_OMNI.translated}]`));

    expect(late.querySelector(`[${DATA_OMNI.translated}]`)?.textContent).toContain('[t]Added inside the shadow later');
    pt.stop();
  });

  it('adopts a shadow HOST added after start (discovered via the light-DOM observer)', async () => {
    document.body.innerHTML = '<p>Light DOM text</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();

    const { shadow } = mountShadowHost('<p>Late host shadow text</p>');
    // Production fires TWO discovery signals for a late host: the light-DOM MO
    // record AND the MAIN-world attachShadow hook. happy-dom under parallel
    // load occasionally drops the MO delivery — exercise the second signal
    // too, exactly as a real page would.
    pt.notifyShadowAttached();
    await waitFor(() => !!shadow.querySelector(`[${DATA_OMNI.translated}]`));
    expect(shadow.querySelector(`[${DATA_OMNI.translated}]`)?.textContent).toContain('[t]Late host shadow text');
    pt.stop();
  });

  it('stop() sweeps glosses and marks OUT of shadow roots (they are separate query scopes)', async () => {
    document.body.innerHTML = '';
    const { shadow } = mountShadowHost();
    const original = shadow.innerHTML;
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await waitFor(() => !!shadow.querySelector(`[${DATA_OMNI.translated}]`));

    pt.stop();
    expect(shadow.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(0);
    expect(shadow.querySelectorAll(`[${DATA_OMNI.walked}]`).length).toBe(0);
    expect(shadow.innerHTML).toBe(original); // byte-exact restore inside the root too
  });

  it('never translates our own surface hosts', async () => {
    document.body.innerHTML = '<p>Light DOM text</p>';
    const own = document.createElement('aie-omt-surface');
    document.body.appendChild(own);
    const ownShadow = own.attachShadow({ mode: 'open' });
    ownShadow.innerHTML = '<p>Our own panel text</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick(60);

    expect(ownShadow.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();
    expect(ownShadow.querySelector(`[${DATA_OMNI.walked}]`)).toBeNull();
    pt.stop();
  });
});

describe('PageTranslator — dynamic entries respect skip-context ancestors (final-review H1/H2)', () => {
  it('typing inside a contenteditable editor NEVER injects 译文 (walk prunes at the ancestor; mutations start inside)', async () => {
    document.body.innerHTML =
      '<p>Normal page text</p><div id="editor" contenteditable="true"><div id="line">draft line</div></div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await waitFor(() => !!document.querySelector(`[${DATA_OMNI.translated}]`));

    // Simulate typing: characterData + a text-node swap deep inside the editor.
    const line = document.getElementById('line')!;
    (line.firstChild as Text).data = 'draft line grew longer';
    line.appendChild(document.createTextNode(' and more'));
    await tick(300); // full debounce window

    const editor = document.getElementById('editor')!;
    expect(editor.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();
    expect(editor.querySelector(`[${DATA_OMNI.walked}]`)).toBeNull();
    pt.stop();
  });

  it('text swapped inside a <pre> (syntax highlighter rewrite) is not translated', async () => {
    // A CODE pre (highlighter class fingerprint) — a plain prose <pre> translates now.
    document.body.innerHTML =
      '<p>Prose text here</p><pre class="highlight"><span id="tok">const value = compute()</span></pre>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await waitFor(() => !!document.querySelector(`[${DATA_OMNI.translated}]`));

    const tok = document.getElementById('tok')!;
    (tok.firstChild as Text).data = 'const highlighted = rewrite()';
    await tick(300);

    expect(document.querySelector(`pre [${DATA_OMNI.translated}]`)).toBeNull();
    pt.stop();
  });

  it('a LATE segDone for a retired unit does not resurrect its gloss', async () => {
    // Hold the first batch open until after the unit is retranslated away.
    let releaseFirst!: (res: { items: string[] }) => void;
    let call = 0;
    translateBatch.mockImplementation(({ items }: { items: string[] }) => {
      call++;
      if (call === 1) return new Promise((res) => (releaseFirst = res));
      return Promise.resolve({ items: items.map((s: string) => `[t]${s}`) });
    });
    document.body.innerHTML = '<p id="msg">Original text</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick(60); // first batch in flight, spinner up

    const p = document.getElementById('msg')!;
    (p.firstChild as Text).data = 'Replaced text'; // retranslate retires the old unit
    await waitFor(
      () => document.querySelector(`[${DATA_OMNI.translated}]`)?.textContent?.includes('[t]Replaced') ?? false
    );

    releaseFirst({ items: ['[t]Original text'] }); // the OLD unit's segDone arrives late
    await tick(120);

    const glosses = [...document.querySelectorAll(`[${DATA_OMNI.translated}]`)];
    expect(glosses).toHaveLength(1); // no resurrected duplicate under the dead walkId
    expect(glosses[0].textContent).toContain('[t]Replaced');
    expect(document.querySelector(`[${DATA_OMNI.state}="error"]`)).toBeNull(); // and no conjured error gloss
    pt.stop();
  });

  it('a no-op text commit (identical text) keeps the existing gloss — no spinner churn', async () => {
    document.body.innerHTML = '<p id="same">Stable sentence</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await waitFor(() => !!document.querySelector(`[${DATA_OMNI.translated}]`));
    expect(translateBatch).toHaveBeenCalledOnce();
    const glossBefore = document.querySelector(`[${DATA_OMNI.translated}]`);

    (document.getElementById('same')!.firstChild as Text).data = 'Stable sentence'; // identical commit
    await tick(300);

    expect(document.querySelector(`[${DATA_OMNI.translated}]`)).toBe(glossBefore); // same node, untouched
    expect(translateBatch).toHaveBeenCalledOnce(); // no second request
    pt.stop();
  });
});

describe('three-state view lifecycle', () => {
  it('start stamps the configured mode, setDisplayMode flips it live without re-translating, stop clears it', async () => {
    document.body.innerHTML = '<p>Hello world</p>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      displayMode: 'translation',
    });
    pt.start();
    await tick();
    expect(document.documentElement.getAttribute(DATA_OMNI.display)).toBe('translation');
    const callsBefore = translateBatch.mock.calls.length;

    pt.setDisplayMode('original');
    expect(document.documentElement.getAttribute(DATA_OMNI.display)).toBe('original');
    pt.setDisplayMode('bilingual');
    expect(document.documentElement.hasAttribute(DATA_OMNI.display)).toBe(false);
    // Pure attribute writes — switching modes never issues a translate call.
    expect(translateBatch.mock.calls.length).toBe(callsBefore);

    pt.setDisplayMode('translation');
    pt.stop();
    // stop() restores the untouched page — the mode marker goes with it.
    expect(document.documentElement.hasAttribute(DATA_OMNI.display)).toBe(false);
  });

  it('setDisplayMode before start is remembered and applied by start', async () => {
    document.body.innerHTML = '<p>Hello world</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.setDisplayMode('original'); // inactive: remembered, not applied
    expect(document.documentElement.hasAttribute(DATA_OMNI.display)).toBe(false);
    pt.start();
    await tick();
    expect(document.documentElement.getAttribute(DATA_OMNI.display)).toBe('original');
    pt.stop();
  });
});

describe('SPA re-injection protection', () => {
  // A DONE gloss means the final fill ran and the HTML cache holds its payload —
  // deleting a still-streaming gloss exercises the (separate) pending path.
  const doneGloss = () => document.querySelector<HTMLElement>(`[${DATA_OMNI.translated}][${DATA_OMNI.state}="done"]`);

  it('a host-deleted gloss is re-injected from the cached HTML — zero extra translate calls', async () => {
    document.body.innerHTML = '<p>Hello world</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await waitFor(() => doneGloss() !== null);
    expect(doneGloss()!.textContent).toContain('[t]Hello world');
    const calls = translateBatch.mock.calls.length;

    doneGloss()!.remove(); // the host's keyed re-render eats our node
    pt.notifyShadowAttached(); // second healing path — see the cap test's note
    await waitFor(() => doneGloss() !== null);

    const revived = doneGloss();
    expect(revived).not.toBeNull();
    expect(revived!.textContent).toContain('[t]Hello world');
    expect(translateBatch.mock.calls.length).toBe(calls); // refilled from cache, not re-translated
    pt.stop();
  });

  it('concedes after MAX_REINJECT rounds against a host that keeps deleting', async () => {
    document.body.innerHTML = '<p>Hello world</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();

    for (let round = 0; round < 3; round++) {
      await waitFor(() => doneGloss() !== null);
      expect(doneGloss(), `round ${round}: gloss should exist before deletion`).not.toBeNull();
      doneGloss()!.remove();
      // Belt and braces: the eviction path answers the removal record, and the
      // RESCAN healer answers this nudge — production has both; happy-dom
      // under parallel load sometimes loses the former's MO delivery.
      pt.notifyShadowAttached();
    }
    // Third re-injection was the last allowed — the fourth deletion sticks.
    await waitFor(() => doneGloss() !== null);
    expect(doneGloss()).not.toBeNull();
    doneGloss()!.remove();
    pt.notifyShadowAttached();
    await tick(300); // NEGATIVE assertion — a fixed wait is the point (covers the 150ms rescan debounce)
    expect(document.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();
    pt.stop();
  });

  it('the unchanged-drop is OUR removal — never resurrected, never re-translated', async () => {
    translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
      items: [...items], // engine returns the input unchanged (already target language)
      providerId: 'mock',
    }));
    document.body.innerHTML = '<p>Hello world</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(document.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull(); // dropped as unchanged
    const calls = translateBatch.mock.calls.length;
    await tick(80); // give any (wrong) resurrection loop time to fire
    expect(document.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();
    expect(translateBatch.mock.calls.length).toBe(calls);
    pt.stop();
  });

  it('a gloss evicted while still PENDING re-enters the pipeline', async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    translateBatch.mockImplementationOnce(async ({ items }: { items: string[] }) => {
      await gate; // hold the first batch open so the gloss stays a spinner
      return { items: items.map((s) => `[t]${s}`), providerId: 'mock' };
    });
    document.body.innerHTML = '<p>Hello world</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const spinner = document.querySelector(`[${DATA_OMNI.translated}][${DATA_OMNI.state}="pending"]`);
    expect(spinner).not.toBeNull();

    spinner!.remove(); // host eats the pending gloss
    await tick();
    release();
    await tick();

    // The unit re-entered the pipeline: a second translate call filled a fresh gloss.
    expect(translateBatch.mock.calls.length).toBeGreaterThanOrEqual(2);
    const revived = document.querySelector(`[${DATA_OMNI.translated}]`);
    expect(revived).not.toBeNull();
    expect(revived!.textContent).toContain('[t]Hello world');
    pt.stop();
  });
});

describe('<pre> translation (prose vs code)', () => {
  it('a PLAIN <pre> (mail archive / poetry) translates, keeping its newlines in the payload', async () => {
    document.body.innerHTML = '<pre>First line of the letter\nSecond line follows here</pre>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const gloss = document.querySelector(`pre [${DATA_OMNI.translated}]`);
    expect(gloss).not.toBeNull();
    // The engine received the RAW text — line structure intact, not collapsed.
    const sent = translateBatch.mock.calls.flatMap((c) => c[0].items as string[]);
    expect(sent.some((s) => s.includes('First line of the letter\nSecond line follows here'))).toBe(true);
    pt.stop();
  });

  it('pre>code (the Markdown code-block shape) stays untranslated', async () => {
    document.body.innerHTML = '<p>Prose here</p><pre><code>const x = compute()\nreturn x</code></pre>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(document.querySelector(`p [${DATA_OMNI.translated}]`)).not.toBeNull();
    expect(document.querySelector(`pre [${DATA_OMNI.translated}]`)).toBeNull();
    pt.stop();
  });

  it('a highlighter-classed <pre> (no <code> child) stays untranslated', async () => {
    document.body.innerHTML =
      '<div class="highlight"><pre><span>def compute():</span></pre></div><pre class="language-js"><span>let y</span></pre>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(document.querySelector(`pre [${DATA_OMNI.translated}]`)).toBeNull();
    pt.stop();
  });
});

describe('closed shadow roots (chrome.dom probe + late-attach signal)', () => {
  type ChromeStub = { chrome?: { dom?: { openOrClosedShadowRoot?: (el: Element) => ShadowRoot | null } } };
  const g = globalThis as ChromeStub;
  const closedRoots = new WeakMap<Element, ShadowRoot>();
  const stubChromeDom = () => {
    g.chrome = { dom: { openOrClosedShadowRoot: (el) => closedRoots.get(el) ?? null } };
  };
  const attachClosed = (host: Element, html: string) => {
    const root = host.attachShadow({ mode: 'closed' });
    root.innerHTML = html;
    closedRoots.set(host, root);
    return root;
  };
  afterEach(() => {
    delete g.chrome;
  });

  it('translates content inside a CLOSED root when the probe API exists', async () => {
    stubChromeDom();
    document.body.innerHTML = '<x-closed></x-closed>';
    const root = attachClosed(document.querySelector('x-closed')!, '<p>Closed shadow paragraph</p>');
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const gloss = root.querySelector(`[${DATA_OMNI.translated}]`);
    expect(gloss).not.toBeNull();
    expect(gloss!.textContent).toContain('[t]Closed shadow paragraph');
    pt.stop();
    expect(root.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull(); // restore sweeps closed roots too
  });

  it('a root attached AFTER the walk is picked up by the notifyShadowAttached rescan', async () => {
    stubChromeDom();
    document.body.innerHTML = '<p>Light text</p><x-late></x-late>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(document.querySelector(`p [${DATA_OMNI.translated}]`)).not.toBeNull();

    // attachShadow on the already-walked host — NO light-DOM mutation fires.
    const root = attachClosed(document.querySelector('x-late')!, '<p>Late closed content</p>');
    pt.notifyShadowAttached(); // what the MAIN-world hook's signal triggers
    await waitFor(() => root.querySelector(`[${DATA_OMNI.translated}]`) !== null); // debounced rescan
    const gloss = root.querySelector(`[${DATA_OMNI.translated}]`);
    expect(gloss).not.toBeNull();
    expect(gloss!.textContent).toContain('[t]Late closed content');
    pt.stop();
  });
});

describe('<pre> leaf semantics (loose text, wrappers, inline code)', () => {
  it('a container with LOOSE TEXT beside a code-pre still translates the prose', async () => {
    document.body.innerHTML = '<div id="mix">Intro prose here <pre><code>const x = 1</code></pre> closing prose.</div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const sent = translateBatch.mock.calls.flatMap((c) => c[0].items as string[]).join('|');
    expect(sent).toContain('Intro prose here');
    expect(sent).toContain('closing prose');
    expect(sent).not.toContain('const x = 1'); // the code never rides along
    expect(document.querySelector(`#mix [${DATA_OMNI.translated}]`)).not.toBeNull();
    expect(document.querySelector(`pre [${DATA_OMNI.translated}]`)).toBeNull();
    pt.stop();
  });

  it('a wrapper div whose ONLY child is a code-pre produces no unit at all', async () => {
    document.body.innerHTML = '<p>Real prose</p><div class="highlight"><pre><span>def compute():</span></pre></div>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const sent = translateBatch.mock.calls.flatMap((c) => c[0].items as string[]).join('|');
    expect(sent).not.toContain('def compute'); // code text never reaches the engine
    expect(document.querySelector('.highlight [' + 'data-omni-translated' + ']')).toBeNull();
    pt.stop();
  });

  it('a PROSE pre containing an inline <code> snippet still translates', async () => {
    document.body.innerHTML = '<pre>The changelog says <code>--flag</code> was removed.\nSecond line of prose.</pre>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    expect(document.querySelector(`pre [${DATA_OMNI.translated}]`)).not.toBeNull();
    pt.stop();
  });
});

describe('re-injection cap hardening (element-keyed + decay + stale guard)', () => {
  const anyGloss = () => document.querySelector<HTMLElement>(`[${DATA_OMNI.translated}]`);

  it('a host that keeps eating PENDING glosses runs out of rounds (cap survives the re-walk id change)', async () => {
    // Every batch stalls forever — glosses never leave the pending state.
    translateBatch.mockImplementation(() => new Promise(() => {}));
    document.body.innerHTML = '<p>Hello world</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();

    // Initial + up to MAX_REINJECT re-walks = bounded; afterwards the host wins.
    for (let round = 0; round < 6; round++) {
      await waitFor(() => anyGloss() !== null, 1000);
      const g = anyGloss();
      if (!g) break;
      g.remove();
      pt.notifyShadowAttached(); // deterministic trigger (MO delivery can drop under load)
      await tick(200);
    }
    await tick(300);
    expect(anyGloss()).toBeNull(); // conceded — no unbounded pending loop
    // 1 initial batch + at most MAX_REINJECT re-walk batches (each re-walk re-enqueues once).
    expect(translateBatch.mock.calls.length).toBeLessThanOrEqual(4);
    pt.stop();
  });

  it('an eviction in the SAME commit as a text change never refills the stale translation', async () => {
    document.body.innerHTML = '<p id="tgt">Hello world</p>';
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await waitFor(() => anyGloss()?.getAttribute(DATA_OMNI.state) === 'done');

    // One React-style commit: swap the text AND delete our gloss.
    const p = document.getElementById('tgt')!;
    anyGloss()!.remove();
    (p.firstChild as Text).data = 'Completely new text';
    await tick(60); // eviction path runs on the MO batch — must NOT refill "[t]Hello world"
    const early = anyGloss();
    expect(early?.textContent ?? '').not.toContain('[t]Hello world');

    // The debounced retranslate then owns it with the NEW text.
    await waitFor(() => (anyGloss()?.textContent ?? '').includes('[t]Completely new text'));
    expect(anyGloss()!.textContent).toContain('[t]Completely new text');
    pt.stop();
  });

  it('benign re-renders spaced past the decay window never exhaust the cap', async () => {
    vi.useFakeTimers({ toFake: ['Date'] }); // only Date.now — real timers keep driving the pipeline
    try {
      document.body.innerHTML = '<p>Hello world</p>';
      const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
      pt.start();
      const done = () => document.querySelector(`[${DATA_OMNI.translated}][${DATA_OMNI.state}="done"]`);
      for (let round = 0; round < 6; round++) {
        const t0 = Date.now();
        while (!done() && Date.now() - t0 < 3000) await new Promise((r) => setTimeout(r, 20));
        expect(done(), `round ${round}`).not.toBeNull();
        done()!.remove();
        pt.notifyShadowAttached();
        vi.setSystemTime(Date.now() + 6_000); // next attempt lands past REINJECT_DECAY_MS
        await new Promise((r) => setTimeout(r, 250));
      }
      // Six evictions, all re-injected — a benign host never starves.
      expect(done()).not.toBeNull();
      pt.stop();
    } finally {
      vi.useRealTimers();
    }
  });

  it('mutations INSIDE an adopted closed root are observed (eviction heals there too)', async () => {
    const closedRoots = new WeakMap<Element, ShadowRoot>();
    (globalThis as { chrome?: unknown }).chrome = {
      dom: { openOrClosedShadowRoot: (el: Element) => closedRoots.get(el) ?? null },
    };
    try {
      document.body.innerHTML = '<x-c></x-c>';
      const host = document.querySelector('x-c')!;
      const root = host.attachShadow({ mode: 'closed' });
      root.innerHTML = '<p>Closed content here</p>';
      closedRoots.set(host, root);
      const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
      pt.start();
      await waitFor(() => root.querySelector(`[${DATA_OMNI.translated}]`) !== null);

      root.querySelector(`[${DATA_OMNI.translated}]`)!.remove(); // host re-render inside the CLOSED root
      await waitFor(() => root.querySelector(`[${DATA_OMNI.translated}]`) !== null);
      expect(root.querySelector(`[${DATA_OMNI.translated}]`)).not.toBeNull(); // MO on the closed root delivered
      pt.stop();
    } finally {
      delete (globalThis as { chrome?: unknown }).chrome;
    }
  });
});

describe('逐段对照 paragraphInterleave', () => {
  const multiPara = '<p>First paragraph here<br><br>Second paragraph here<br>Third paragraph here</p>';

  it('OFF (default): whole 译文 stays one gloss at the unit end', async () => {
    document.body.innerHTML = multiPara;
    const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
    pt.start();
    await tick();
    const glosses = document.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses.length).toBe(1);
    expect(document.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(0);
    pt.stop();
  });

  it('ON: each translated paragraph lands after its source paragraph', async () => {
    document.body.innerHTML = multiPara;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const p = document.querySelector('p')!;
    const glosses = p.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses.length).toBe(3); // one per paragraph
    expect(p.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(2); // segments 2..3 marked
    // Paragraph 1's gloss sits BEFORE the first <br> group (right after its text).
    const firstBr = p.querySelector('br')!;
    expect(glosses[0].nextElementSibling).toBe(firstBr);
    expect(glosses[0].textContent).toContain('[t]First paragraph here');
    expect(glosses[2].textContent).toContain('Third paragraph here');
    // The last gloss is the unit's last element (after the third paragraph).
    expect(p.lastElementChild).toBe(glosses[2]);
    pt.stop();
  });

  it('ON: single-paragraph units are untouched; toggle-off restores byte-exact', async () => {
    document.body.innerHTML = '<p>Just one paragraph</p>' + multiPara;
    const before = '<p>Just one paragraph</p>' + multiPara;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    expect(document.querySelectorAll('p')[0].querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(1);
    pt.stop();
    expect(document.body.innerHTML).toBe(before);
  });

  it('ON: a full rescan leaves an INTACT interleave alone — same nodes, no re-place (F3)', async () => {
    document.body.innerHTML = multiPara;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const p = document.querySelector('p')!;
    const before = [...p.querySelectorAll(`[${DATA_OMNI.translated}]`)];
    expect(before.length).toBe(3);
    // Two SPA-style full rescans in a row: the healer must recognise the
    // fingerprint (data-omni-parts) as intact and not rebuild the layout.
    pt.notifyShadowAttached();
    await tick(300);
    pt.notifyShadowAttached();
    await tick(300);
    const after = [...p.querySelectorAll(`[${DATA_OMNI.translated}]`)];
    expect(after.length).toBe(3);
    after.forEach((node, i) => expect(node).toBe(before[i])); // node identity — never re-created
    // A REAL eviction still heals: chew one segment out, rescan, layout returns.
    p.querySelector(`[${DATA_OMNI.seg}]`)!.remove();
    await tick(300); // let the eviction path settle first
    pt.notifyShadowAttached();
    await waitFor(() => p.querySelectorAll(`[${DATA_OMNI.translated}]`).length === 3);
    expect(p.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(3);
    pt.stop();
  });

  it('ON: engine that eats a <br> falls back to the whole-block layout', async () => {
    translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
      // Strip ALL placeholders — restored html has no <br>, counts mismatch.
      items: items.map((s: string) => `[t]${s.replace(/\{\{\d+\}\}/g, ' ')}`),
      providerId: 'mock',
    }));
    document.body.innerHTML = multiPara;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const glosses = document.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses.length).toBe(1); // fallback: single whole-block gloss
    expect(document.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(0);
    pt.stop();
  });
});

describe('逐段对照 — structural safety (review fixes)', () => {
  it('a <br> nested inside an inline child forces the whole-block fallback', async () => {
    // Counts LOOK equal (1 nested break both sides) but interleaving would
    // slice the reproduced <a> markup and insert a gloss inside the link.
    document.body.innerHTML =
      '<p>Contact us: <a href="/x">line one of the address<br>line two of it</a> and see more.</p>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    expect(document.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(1); // whole block
    expect(document.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(0);
    expect(document.querySelector('a')!.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();
    pt.stop();
  });

  it('comments inside a <br> run do not break the group (still interleaves)', async () => {
    document.body.innerHTML = '<p>First paragraph here<br><!-- sep --><br>Second paragraph here</p>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const p = document.querySelector('p')!;
    expect(p.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(2);
    expect(p.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(1);
    pt.stop();
  });

  it('a unit OPENING on a <br> falls back to the whole block (no empty stray gloss)', async () => {
    // Placeholder-position-preserving mock: a real engine keeps the leading
    // {{n}} at the head, so the translated FIRST paragraph is empty (the
    // default mock's [t] prefix would fabricate content before the break).
    translateBatch.mockImplementation(async ({ items }: { items: string[] }) => ({
      items: items.map((s: string) => s.replace(/^((?:\{\{\d+\}\})*)/, '$1[t]')),
      providerId: 'mock',
    }));
    document.body.innerHTML = '<p><br>Starts after a break with enough text to go block mode</p>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const glosses = document.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses.length).toBe(1);
    expect(glosses[0].textContent!.trim().length).toBeGreaterThan(0);
    pt.stop();
  });

  it('partial eviction heals: host deletes the PRIMARY gloss → full re-place from cache', async () => {
    document.body.innerHTML = '<p>First paragraph here<br><br>Second paragraph here</p>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const p = document.querySelector('p')!;
    expect(p.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(2);
    // Host evicts the PRIMARY (non-seg) gloss only.
    p.querySelector(`[${DATA_OMNI.translated}]:not([${DATA_OMNI.seg}])`)!.remove();
    await tick(80); // mutation observer → eviction heal
    const glosses = p.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses.length).toBe(2); // fully re-placed
    expect(glosses[0].textContent).toContain('First paragraph here');
    pt.stop();
  });

  it('partial eviction heals: host deletes a SEGMENT → full re-place from cache', async () => {
    document.body.innerHTML = '<p>First paragraph here<br><br>Second paragraph here</p>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const p = document.querySelector('p')!;
    p.querySelector(`[${DATA_OMNI.seg}]`)!.remove();
    await tick(80);
    const glosses = p.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses.length).toBe(2);
    expect(glosses[1].textContent).toContain('Second paragraph here');
    pt.stop();
  });
});

describe('逐段对照 — self-eviction loop guard (oracle B-1)', () => {
  it('a SECOND partial eviction still heals (the re-place must not burn the quota on itself)', async () => {
    document.body.innerHTML = '<p>First paragraph here<br><br>Second paragraph here</p>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const p = document.querySelector('p')!;
    p.querySelector(`[${DATA_OMNI.seg}]`)!.remove();
    await tick(80);
    expect(p.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(2); // healed once
    // Host strikes again within the decay window — an un-marked self-removal
    // would have saturated bumpReinject (3 attempts) during the first heal.
    p.querySelector(`[${DATA_OMNI.seg}]`)!.remove();
    await tick(80);
    const glosses = p.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses.length).toBe(2); // healed AGAIN
    expect(glosses[1].textContent).toContain('Second paragraph here');
    pt.stop();
  });
});

describe('逐段对照 — newline paragraphs (pre-wrap hosts, v2)', () => {
  const PRE = 'style="white-space:pre-wrap"';

  it('interleaves \\n-separated paragraphs of a single text node (the X/Threads shape)', async () => {
    document.body.innerHTML = `<div ${PRE}>First tweet paragraph right here\n\nSecond paragraph of the tweet\n\nThird one closes it out</div>`;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const div = document.querySelector('div')!;
    const glosses = [...div.querySelectorAll(`[${DATA_OMNI.translated}]`)];
    expect(glosses.length).toBe(3);
    expect(div.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(2);
    expect(div.hasAttribute(DATA_OMNI.split)).toBe(true);
    expect(glosses[0].textContent).toContain('First tweet paragraph');
    expect(glosses[2].textContent).toContain('Third one closes');
    // Each gloss sits right after its source paragraph: the node FOLLOWING
    // gloss #0 must be the text node that STARTS with the separator newlines.
    const after = glosses[0].nextSibling!;
    expect(after.nodeType).toBe(3);
    expect((after.textContent ?? '').startsWith('\n\n')).toBe(true);
    pt.stop();
    // Byte-exact restore: normalize healed the splits, marker gone.
    expect(document.body.innerHTML).toBe(
      `<div ${PRE}>First tweet paragraph right here\n\nSecond paragraph of the tweet\n\nThird one closes it out</div>`
    );
    pt.stop();
  });

  it('a trailing \\n on the source preserves newline interleave layout', async () => {
    // Edge runs are whitespace, not separators; only interior runs count as split boundaries.
    document.body.innerHTML = `<div ${PRE}>First paragraph text here\n\nSecond paragraph text here\n</div>`;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const div = document.querySelector('div')!;
    expect(div.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(2);
    expect(div.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(1);
    pt.stop();
    // Byte-exact restore including the trailing newline.
    expect(document.body.innerHTML).toBe(`<div ${PRE}>First paragraph text here\n\nSecond paragraph text here\n</div>`);
  });

  it('does NOT interleave when white-space does not preserve newlines', async () => {
    document.body.innerHTML = '<div>Newlines collapse here\n\nso this is really one flowing paragraph</div>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    expect(document.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(1);
    expect(document.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(0);
    expect(document.querySelector(`[${DATA_OMNI.split}]`)).toBeNull();
    pt.stop();
  });

  it('mixed direct <br> + newline shape falls back to the whole block', async () => {
    document.body.innerHTML = `<div ${PRE}>Alpha paragraph text<br>Beta paragraph text\n\nGamma paragraph text</div>`;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    expect(document.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(1);
    expect(document.querySelector(`[${DATA_OMNI.split}]`)).toBeNull();
    pt.stop();
  });

  it('host framework rewriting the first half deletes OUR untouched leftovers and retranslates clean', async () => {
    document.body.innerHTML = `<div ${PRE}>Original first paragraph\n\nOriginal second paragraph</div>`;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const div = document.querySelector('div')!;
    expect(div.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(2);
    // React-style rewrite: the framework holds the FIRST text node and writes
    // the complete new tweet into it — our minted continuation is now a stale
    // duplicate.
    const firstText = [...div.childNodes].find((n) => n.nodeType === 3)!;
    firstText.textContent = 'Replaced whole tweet text in one node';
    // characterData → retranslate debounce → rewalk → re-translate
    await waitFor(() => (div.textContent ?? '').includes('[t]Replaced whole tweet'));
    const text = div.textContent ?? '';
    expect(text).not.toContain('Original second'); // stale leftover deleted
    expect(text).toContain('Replaced whole tweet');
    expect(text).toContain('[t]Replaced whole tweet'); // retranslated
    pt.stop();
  });
});

describe('逐段对照 — paragraph interleave edge cases (evidence gate, nl refill)', () => {
  const PRE = 'style="white-space:pre-wrap"';

  it('B-1: a text change ELSEWHERE in the unit must NOT delete minted host paragraphs', async () => {
    // The X shape: text node with paragraphs + an inline span (hashtag/label).
    document.body.innerHTML = `<div ${PRE}>Alpha paragraph text here\n\nBeta paragraph text here <span id="tag">#x</span></div>`;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const div = document.querySelector('div')!;
    expect(div.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(2);
    // Host edits ONLY the span — the retained split halves are untouched.
    document.getElementById('tag')!.textContent = '#y';
    await tick(300);
    const text = div.textContent ?? '';
    // The real host paragraph must survive.
    expect(text).toContain('Beta paragraph text here');
    expect(text).toContain('#y');
    pt.stop();
    expect(document.body.innerHTML).toContain('Beta paragraph text here');
  });

  it('B-2: partial eviction of a NEWLINE-interleaved unit heals from cache', async () => {
    document.body.innerHTML = `<div ${PRE}>First newline paragraph here\n\nSecond newline paragraph here</div>`;
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const div = document.querySelector('div')!;
    expect(div.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(2);
    div.querySelector(`[${DATA_OMNI.seg}]`)!.remove();
    await tick(80);
    const glosses = div.querySelectorAll(`[${DATA_OMNI.translated}]`);
    expect(glosses.length).toBe(2); // re-placed, not permanently lost
    expect(glosses[1].textContent).toContain('Second newline paragraph');
    pt.stop();
  });
});

describe('逐段对照 — X multi-span shape (v2.1 DOM carving)', () => {
  it('interleaves newlines buried inside inline spans (the real tweetText shape)', async () => {
    // X slices tweet prose into multiple inline <span>s; the \n separators
    // live INSIDE span text nodes, never as direct children of the unit.
    document.body.innerHTML =
      '<div style="white-space:pre-wrap"><span>Trust her tonight friends \n\n1u- </span><span>Kayla Thornton</span><span> Over 8.5 Points\n\nAlready dropped fifteen against this team recently.</span></div>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const div = document.querySelector('div')!;
    const glosses = [...div.querySelectorAll(`[${DATA_OMNI.translated}]`)];
    expect(glosses.length).toBe(3); // 2 newline runs → 3 paragraphs
    expect(div.querySelectorAll(`[${DATA_OMNI.seg}]`).length).toBe(2);
    expect(glosses[0].textContent).toContain('Trust her tonight');
    expect(glosses[1].textContent).toContain('Over 8.5 Points');
    expect(glosses[2].textContent).toContain('Already dropped fifteen');
    // Reproduced inline markup survives the carve: the second paragraph's
    // gloss contains the reproduced <span> boundary without broken tags.
    pt.stop();
    expect(document.body.innerHTML).toBe(
      '<div style="white-space:pre-wrap"><span>Trust her tonight friends \n\n1u- </span><span>Kayla Thornton</span><span> Over 8.5 Points\n\nAlready dropped fifteen against this team recently.</span></div>'
    );
    pt.stop();
  });
});

describe('逐段对照 — no carving into interactive elements (v2.1 self-review)', () => {
  it('newlines inside an <a> never mint segments — gloss must not become link content', async () => {
    document.body.innerHTML =
      '<div style="white-space:pre-wrap">Intro text before the linked address here <a href="/x">First address line\n\nSecond address line</a> trailing text after</div>';
    const pt = new PageTranslator(document.body, {
      source: 'auto',
      target: 'zh-CN',
      flushDelayMs: 0,
      paragraphInterleave: true,
    });
    pt.start();
    await tick();
    const div = document.querySelector('div')!;
    expect(div.querySelectorAll(`[${DATA_OMNI.translated}]`).length).toBe(1); // whole block
    expect(document.querySelector('a')!.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();
    expect(div.querySelector(`[${DATA_OMNI.split}]`)).toBeNull();
    pt.stop();
  });
});

it('refreshes the translation when an inline source element is removed', async () => {
  document.body.innerHTML = '<p>This is a sentence with <strong>important extra words</strong> at the end.</p>';
  const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
  try {
    pt.start();
    await waitFor(() => !!document.querySelector(`[${DATA_OMNI.translated}][${DATA_OMNI.state}="done"]`));
    const before = translateBatch.mock.calls.length;
    document.querySelector('p > strong')!.remove();
    await tick(400);
    expect(translateBatch.mock.calls.length).toBeGreaterThan(before);
  } finally {
    pt.stop();
  }
});

it('retranslates the enclosing paragraph when inline content is added without creating nested units', async () => {
  document.body.innerHTML = '<p>This sentence has its original context.</p>';
  const pt = new PageTranslator(document.body, { source: 'auto', target: 'zh-CN', flushDelayMs: 0 });
  try {
    pt.start();
    await waitFor(() => !!document.querySelector(`[${DATA_OMNI.translated}][${DATA_OMNI.state}="done"]`));
    const p = document.querySelector('p')!;
    p.insertAdjacentHTML('beforeend', '<em> Additional context matters.</em>');
    await waitFor(
      () => p.querySelector(`[${DATA_OMNI.translated}]`)?.textContent?.includes('Additional context matters') === true
    );
    expect(p.querySelectorAll(`[${DATA_OMNI.translated}]`)).toHaveLength(1);
    expect(p.querySelector('em')!.querySelector(`[${DATA_OMNI.translated}]`)).toBeNull();
    expect(p.querySelector(`[${DATA_OMNI.translated}]`)?.textContent).toContain(
      'This sentence has its original context. Additional context matters.'
    );
  } finally {
    pt.stop();
  }
});

it('yields discovery between slices and cancels unfinished scanning on stop', async () => {
  vi.useFakeTimers();
  let time = 0;
  const clock = vi.spyOn(performance, 'now').mockImplementation(() => time++);
  document.body.innerHTML = Array.from(
    { length: 200 },
    (_, i) => `<p>Paragraph number ${i} for incremental scanning.</p>`
  ).join('');
  const pt = new PageTranslator(document.body, { source: 'en', target: 'zh-CN', flushDelayMs: 100 });
  try {
    pt.start();
    expect(document.querySelectorAll(`[${DATA_OMNI.walked}]`)).toHaveLength(0);
    await vi.advanceTimersToNextTimerAsync();
    const discovered = document.querySelectorAll(`[${DATA_OMNI.walked}]`).length;
    expect(discovered).toBeGreaterThan(0);
    expect(discovered).toBeLessThan(200);
    pt.stop();
    await vi.runAllTimersAsync();
    expect(document.querySelectorAll(`[${DATA_OMNI.walked}]`)).toHaveLength(0);
    expect(translateBatch).not.toHaveBeenCalled();
  } finally {
    pt.stop();
    clock.mockRestore();
    vi.useRealTimers();
  }
});

it('reopening with page context preserves both pre-summary and post-summary batches', async () => {
  let resolveSummary!: (summary: string) => void;
  summarizePage.mockImplementation(
    () => new Promise<string>((resolve) => {
      resolveSummary = resolve;
    })
  );
  const original = 'Repository installation instructions and configuration options. '.repeat(12);
  document.body.innerHTML = `<p>${original}</p>`;
  const options = { source: 'en', target: 'zh-CN', flushDelayMs: 0, pageContext: true } as const;
  const first = new PageTranslator(document.body, options);
  first.start();
  await waitFor(() => translateBatch.mock.calls.length > 0);
  expect(translateBatch.mock.calls[0][0].context.summary).toBeUndefined();
  resolveSummary('Repository overview');
  await tick();
  document.body.insertAdjacentHTML('beforeend', '<p>Additional usage examples below the fold.</p>');
  await waitFor(() => translateBatch.mock.calls.length === 2);
  expect(translateBatch.mock.calls[1][0].context.summary).toBe('Repository overview');
  await tick();
  const firstContexts = new Map<string, string | undefined>();
  for (const [request] of translateBatch.mock.calls) {
    for (const item of request.items) firstContexts.set(item, request.context.summary);
  }
  expect(firstContexts.size).toBe(2);
  first.stop();
  translateBatch.mockClear();
  const second = new PageTranslator(document.body, options);
  second.start();
  await waitFor(() => translateBatch.mock.calls.length === 2);
  const contexts = new Map<string, string | undefined>();
  for (const [request] of translateBatch.mock.calls) {
    for (const item of request.items) contexts.set(item, request.context.summary);
  }
  expect(contexts).toEqual(firstContexts);
  expect(contexts.get('Additional usage examples below the fold.')).toBe('Repository overview');
  expect(summarizePage).toHaveBeenCalledOnce();
  second.stop();
});
