/**
 * @module dom/page-translation
 *
 * Orchestrates whole-page bilingual translation from the content side:
 *   - walk + label translation units (idempotent);
 *   - IntersectionObserver → lazy-translate units as they near the viewport;
 *   - MutationObserver → pick up dynamic content (skipping our own output to
 *     avoid self-trigger loops). Three dimensions, because pages change in
 *     three ways: childList (new/removed nodes), attributes (hidden panels
 *     REVEALED — tabs/accordions/details, which the walk pruned while hidden),
 *     and characterData + bare text nodes (skeletons filled in place, React
 *     swapping a text node under an already-walked element);
 *   - onUrlChange → re-scan after SPA navigations.
 *
 * Requests go through the service CONTRACT (proxy-service) — never the engine
 * internals. Batching here is a light debounce+chunk (the background owns the
 * real rate-limit/retry queue); content must not import queue/** (bundle red
 * line), so this stays dependency-free.
 */

import { DATA_OMNI } from '@/constants';
import type { BilingualStyle, DisplayMode, LangCode, SourceLang } from '@/data/models';
import { streamBatchTranslate, type BatchStreamHandle } from '@/services/stream/batch-client';
import { sweepNewlineTokensForDisplay } from '@/services/translation/batch/nl-token';
import { getTranslationService } from '@/services/translation/contract';
import { detectSaysSkip, scriptSaysSkip, skipPolicy, type SkipPolicy } from './skip-policy';
import { inSkippedAncestry, isSkippedElement } from './filter';
import { restoreInline, splitHtmlByBreaks } from './inject/placeholder';
import { applyDisplayMode, ensurePresetStyles, removePresetStyles } from './inject/styles';
import { withViewportAnchor } from './inject/viewport-anchor';
import {
  ensureGlossNode,
  findGloss,
  removeAllGloss,
  glossNewlineRuns,
  segGlosses,
  setError,
  setTranslatedHtml,
  sourceBreakGroups,
  sourceNewlineRuns,
  splitRunRewritten,
  withDisplayModeNeutralized,
  type InjectMode,
  type NewlineRun,
} from './inject/wrapper';
import { onUrlChange } from './listen';
import { TABLE_INTERNAL_DISPLAYS, TABLE_PARENT_TAGS } from './policy';
import { walkAndLabel, type TranslationUnit } from './traversal';
import { visibleText } from './visibility';

/** Source-text length at/below which the 译文 goes inline (same line) vs block (own line). */
const INLINE_MAX_CHARS = 40;

/** SPA re-injection attempts per source element before conceding to a hostile host. */
const MAX_REINJECT = 3;
/** Attempts older than this don't count — benign periodic re-renders never starve. */
const REINJECT_DECAY_MS = 5_000;

export interface PageTranslatorOptions {
  source: SourceLang;
  target: LangCode;
  /** Languages the user already reads — never translate text detected as one. */
  skipLanguages?: readonly LangCode[];
  /** Opt-in visual treatment of the 译文 (blend/underline/highlight/…). */
  bilingualStyle?: BilingualStyle;
  /** Opt-in译文 font — 'kai' switches to the brush/kai stack; 'inherit' follows the host. */
  translationFont?: 'kai' | 'inherit';
  /** Three-state view of the translated page (bilingual/translation/original). */
  displayMode?: DisplayMode;
  /** 通读全文 — summarize the page once, inject the overview into every batch. */
  pageContext?: boolean;
  /** 逐段对照 — interleave per-paragraph 译文 into multi-paragraph units (see AppearanceConfig). */
  paragraphInterleave?: boolean;
  /** 带样式翻译 — placeholder-preserve inline formatting. Default true; false sends/injects plain text. */
  richText?: boolean;
  /**
   * Plain-language copy for a failed unit, in the INTERFACE language. Injected
   * because i18n belongs to the entrypoint: `dom/**` must stay free of the
   * react-app layer, and the interface language follows translate.target at
   * runtime, so the string can only be resolved at failure time. Without it a
   * unit falls back to the raw engine message — English and jargon-heavy, but
   * still the truth about what went wrong.
   */
  errorText?: (raw: string) => string;
  /** Max units per translateBatch RPC. */
  maxBatchItems?: number;
  /** Debounce window to gather newly-visible units before flushing. */
  flushDelayMs?: number;
  /** Preload margin for the IntersectionObserver. */
  rootMargin?: string;
}

/**
 * Shared observer config (root document AND each adopted shadow root — the
 * observer's subtree doesn't cross shadow boundaries, so every root is its own
 * observe() target). Reveal-class attributes only — NOT our own data-omni-*
 * markers, so walking/labelling never feeds back into the observer.
 */
const MO_OPTIONS: MutationObserverInit = {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['hidden', 'style', 'class', 'open', 'aria-hidden'],
  characterData: true,
};

export class PageTranslator {
  private io: IntersectionObserver | null = null;
  private mo: MutationObserver | null = null;
  private stopUrl: (() => void) | null = null;
  private active = false;
  private readonly unitsById = new Map<string, TranslationUnit>();
  private readonly modeById = new Map<string, InjectMode>();
  private pending: TranslationUnit[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  /** In-flight batch streams, cancelled on stop(). */
  private readonly inflight = new Set<BatchStreamHandle>();
  /** unitId → accumulated raw stream text (progressive display before segDone). */
  private readonly streamAcc = new Map<string, string>();
  /** unitId → latest text awaiting a RAF write (coalesces chunk → DOM writes). */
  private readonly streamBuf = new Map<string, string>();
  private rafQueued = false;
  /** unitId → final segDone text awaiting one anchored fill pass per frame. */
  private readonly fillQueue = new Map<string, { unit: TranslationUnit; text: string }>();
  /** Final rendered HTML per unit — the zero-network source for SPA re-injection. */
  private readonly lastHtmlById = new Map<string, string>();
  /** Re-injection attempts per SOURCE ELEMENT (WeakMap: element identity survives
   *  the pending-path re-walk that mints a fresh unit id; GC owns the cleanup). */
  private readonly reinjectCount = new WeakMap<Element, { n: number; ts: number }>();
  /** Glosses WE removed on purpose (the unchanged-drop) — not host evictions. */
  private readonly selfRemovedGloss = new WeakSet<Element>();
  /**
   * splitText bookkeeping per unit (newline interleave), grouped BY ORIGIN
   * text node: the retained first half (with a snapshot of its data at mint
   * time) and the continuations minted out of it.
   *
   * When a host framework rewrites a split text node, it updates only the node
   * it directly references (the retained first half). Minted continuations
   * are tracked per origin node so that rewrites can be detected and cleaned up
   * accurately without affecting adjacent text nodes.
   */
  private readonly splitNodesById = new Map<
    string,
    Array<{ retained: Text; snapshot: string; minted: Array<{ node: Text; snapshot: string }> }>
  >();
  private fillRafQueued = false;
  /**
   * 通读全文 state. `null` = not fetched yet (or invalidated by an SPA nav);
   * '' = fetched-and-useless (page too short / MT engine / failure) — batches
   * proceed WITHOUT it either way, and only batches issued after it lands
   * carry it (keys stay self-consistent per batch, never blocking首屏).
   */
  private pageSummary: string | null = null;
  private summaryEpoch = 0;

  /**
   * Every adopted host-page shadow root, OPEN and CLOSED alike (the walk
   * probes closed roots via anyShadowRoot) — styles + observer + gloss sweep
   * scope. A strong Set on purpose: stop() must sweep glosses out of each
   * root; cleared there, so detached roots don't outlive the session.
   */
  private readonly shadowRoots = new Set<ShadowRoot>();

  private readonly maxBatchItems: number;
  /** Char budget per batch — flush early so long paragraphs don't form a huge prompt. */
  private readonly maxBatchChars = 3000;
  private pendingChars = 0;
  private readonly flushDelayMs: number;
  private readonly rootMargin: string;
  private readonly preloadMargin: number;
  private readonly policy: SkipPolicy;
  private readonly richText: boolean;

  constructor(
    private readonly root: Element,
    private readonly opts: PageTranslatorOptions
  ) {
    this.maxBatchItems = opts.maxBatchItems ?? 16;
    this.flushDelayMs = opts.flushDelayMs ?? 60;
    this.rootMargin = opts.rootMargin ?? '300px';
    this.preloadMargin = parseInt(this.rootMargin, 10) || 300;
    this.policy = skipPolicy(opts.target, opts.skipLanguages ?? []);
    this.richText = opts.richText ?? true;
  }

  /**
   * What the engine sees for a unit — the single seam of 带样式翻译. Rich (default):
   * the placeholder serialization, restored to inline markup on fill. Plain: the
   * visible text with NO tags — cache keys derive from the sent text, so the two
   * modes never share cache entries. Plain mode sends no placeholders, so the
   * engine has no reason to emit `{{n}}`; if it hallucinates one anyway, it lands
   * as harmless literal text (restoreInline can't index empty tags — index 0 is
   * out of range, ok:false, and the fallback escapes it).
   */
  private payload(unit: TranslationUnit): { text: string; tags: string[] } {
    return this.richText ? unit.serialized : { text: unit.text, tags: [] };
  }

  start(): void {
    if (this.active) return;
    this.active = true;
    ensurePresetStyles(this.root.ownerDocument);
    // The three-state view is a property of the TRANSLATED page — stamped on
    // start, live-switchable while active (setDisplayMode), cleared on stop.
    applyDisplayMode(this.root.ownerDocument, this.opts.displayMode ?? 'bilingual');

    this.io = new IntersectionObserver((entries) => this.onIntersect(entries), { rootMargin: this.rootMargin });
    // The observer exists BEFORE the first scan: a shadow root discovered
    // mid-walk is attached to this same instance immediately (adoptShadowRoot).
    this.mo = new MutationObserver((muts) => this.onMutations(muts));
    this.mo.observe(this.root, MO_OPTIONS);
    this.scan(this.root);
    this.fetchPageSummary();

    this.stopUrl = onUrlChange(() => {
      // Let the new view settle, then drop units the old view left detached and
      // pick up the new content (walk is idempotent).
      setTimeout(() => {
        if (!this.active) return;
        this.pruneDetached();
        // A new view is a new page: the old overview no longer describes it.
        this.pageSummary = null;
        this.fetchPageSummary();
        this.scan(this.root);
      }, 300);
    });
  }

  /**
   * 通读全文: fetch the page overview once per view (start + each SPA nav).
   * Best-effort and non-blocking — translation never waits for it. The epoch
   * guard drops a slow response that lands after the view changed (it would
   * describe the WRONG page).
   */
  private fetchPageSummary(): void {
    if (!this.opts.pageContext) return;
    const epoch = ++this.summaryEpoch;
    // textContent decides whether there is enough prose to summarize AT ALL.
    // innerText is the better sample (it drops hidden text and honours layout),
    // but reading it forces a full-page layout — and this runs on start and
    // again after every SPA navigation, usually only to discard the result.
    // textContent is a superset of innerText, so a page that fails this gate
    // could never have passed it.
    if ((this.root.textContent ?? '').replace(/\s+/g, ' ').trim().length < 600) {
      this.pageSummary = '';
      return;
    }
    const text = ((this.root as HTMLElement).innerText ?? this.root.textContent ?? '').replace(/\s+/g, ' ').trim();
    if (text.length < 600) {
      this.pageSummary = ''; // too little VISIBLE prose for an overview to help
      return;
    }
    getTranslationService()
      .summarizePage(text.slice(0, 8000), this.opts.target)
      .then((summary) => {
        if (this.active && epoch === this.summaryEpoch) this.pageSummary = summary || '';
      })
      .catch(() => {
        if (epoch === this.summaryEpoch) this.pageSummary = '';
      });
  }

  /**
   * A MAIN-world signal reported a shadow root attached AFTER its host was
   * walked (entrypoints/shadow-hook.content). No mutation ever fires inside a
   * tree we haven't adopted, so nudge the debounced rescan — the walk re-probes
   * every host (open and closed, via anyShadowRoot) and adopts what it finds.
   */
  notifyShadowAttached(): void {
    if (this.active) this.scheduleRescan(this.root);
  }

  /**
   * Switch the three-state view of the already-translated page — one attribute
   * write, no re-translation. Remembered on opts so glosses created later (and
   * a future start()) keep the mode.
   */
  setDisplayMode(mode: DisplayMode): void {
    this.opts.displayMode = mode;
    if (this.active) applyDisplayMode(this.root.ownerDocument, mode);
  }

  stop(): void {
    this.active = false;
    applyDisplayMode(this.root.ownerDocument, 'bilingual');
    this.io?.disconnect();
    this.mo?.disconnect();
    this.stopUrl?.();
    if (this.flushTimer) clearTimeout(this.flushTimer);
    if (this.dynamicTimer) clearTimeout(this.dynamicTimer);
    this.dynamicTimer = null;
    this.rescanQueue.clear();
    this.retranslateQueue.clear();
    // Abort any streaming batches so the background cancels their LLM calls.
    this.inflight.forEach((h) => h.cancel());
    this.inflight.clear();
    this.streamAcc.clear();
    this.streamBuf.clear();
    this.fillQueue.clear();
    // Restore the page: remove every injected 译文 + clear source markers,
    // anchored so the content the user is reading doesn't jump. Shadow roots
    // are their own querySelectorAll scopes — sweep each adopted one too, and
    // hand back their stylesheet: a sheet left adopted is still our fingerprint
    // on the host (and on the fallback path it is a literal <style> node in the
    // host <head>, which a serialized page would carry).
    const win = this.root.ownerDocument.defaultView;
    withViewportAnchor(() => {
      removeAllGloss(this.root);
      this.shadowRoots.forEach((shadow) => removeAllGloss(shadow));
    }, win);
    removePresetStyles(this.root.ownerDocument);
    this.shadowRoots.forEach((shadow) => removePresetStyles(shadow));
    this.shadowRoots.clear();
    this.unitsById.clear();
    this.modeById.clear();
    this.splitNodesById.clear();
    this.lastHtmlById.clear();
    this.pending = [];
    this.pendingChars = 0;
    this.io = this.mo = this.stopUrl = null;
  }

  /**
   * Decide how to inject a unit's translation based on text length and DOM context:
   * Short text (headings, nav items, labels) renders inline on the same line;
   * longer text (paragraphs) renders as a block below the source. Elements whose
   * parent layout cannot legally hold a block sibling (flex/grid tracks, table rows)
   * safely fall back to inline rendering.
   */
  private chooseMode(unit: TranslationUnit): InjectMode {
    if (unit.text.length <= INLINE_MAX_CHARS) return 'inline';
    return this.blockSiblingIllegal(unit.element) ? 'inline' : 'block';
  }

  /**
   * True when an `afterend` block sibling would be illegal or break layout under
   * this element's parent — then long text falls back to inline (appended
   * inside, layout-safe) instead of a block sibling. Two families:
   *  - HORIZONTAL TRACKS (flex-row / grid): a block sibling becomes an extra
   *    flex/grid item and breaks the row.
   *  - TABLE INTERNALS (a `<tr>`/`<table>`/row-group parent): a block sibling of
   *    a `<td>`/`<tr>` is a stray non-cell node — invalid table structure. We
   *    check the PARENT, never the cell: a `<td>`'s OWN display is `table-cell`,
   *    which is a legal block container (appending inside is fine).
   */
  private blockSiblingIllegal(el: Element): boolean {
    const parent = el.parentElement;
    if (!parent) return false;
    // Tag-based table check first — non-layout engines don't report table display.
    if (TABLE_PARENT_TAGS.has(parent.tagName.toUpperCase())) return true;
    const win = el.ownerDocument.defaultView;
    if (!win?.getComputedStyle) return false;
    const pcs = win.getComputedStyle(parent);
    const pd = pcs.display;
    if ((pd === 'flex' || pd === 'inline-flex') && !pcs.flexDirection.startsWith('column')) return true;
    if (pd === 'grid' || pd === 'inline-grid') return true;
    return TABLE_INTERNAL_DISPLAYS.has(pd);
  }

  /**
   * Walk a subtree, register new units, and either translate them right away
   * (already in/near the viewport — faster first screen, and resilient to
   * environments where IntersectionObserver is throttled) or observe them for
   * lazy translation when they scroll into view.
   */
  private scan(root: Element): void {
    if (!this.io) return;
    for (const unit of walkAndLabel(root, undefined, (shadow) => this.adoptShadowRoot(shadow))) {
      this.unitsById.set(unit.id, unit);
      if (this.isNearViewport(unit.element)) this.enqueue(unit);
      else this.io.observe(unit.element);
    }
    this.repairMissingGlosses(root);
  }

  /**
   * The rescan half of SPA re-injection protection: a tracked unit whose 译文
   * is GONE (host deleted it) but whose final HTML is cached gets it back.
   * The walk itself can't help — the source still carries its walked marker,
   * so it is skipped as "done". This complements the eviction path
   * (onMutations) with a trigger-independent healer, and runs ONLY on the
   * FULL rescans (URL change / shadow attach): incremental added-node scans
   * would pay an O(units) sweep for content the eviction path already covers.
   * A unit whose gloss WE dropped (unchanged) has no cached HTML — never
   * resurrected. Shares the per-element attempt cap with the eviction path.
   */
  private repairMissingGlosses(root: Element): void {
    if (root !== this.root) return;
    const win = this.root.ownerDocument.defaultView;
    // Anchored like every other height-changing pass — a full-page heal can
    // restore several blocks above the viewport at once.
    withViewportAnchor(() => {
      for (const [id, unit] of this.unitsById) {
        if (!this.lastHtmlById.has(id)) continue;
        if (!unit.element.isConnected) continue;
        this.refillFromCache(id, unit);
      }
    }, win);
  }

  /**
   * Guarded refill from the HTML cache — the one shared implementation both
   * healing paths use, so the gloss options can never drift between them.
   * True when a gloss was actually (re)created.
   */
  private refillFromCache(id: string, unit: TranslationUnit): boolean {
    const html = this.lastHtmlById.get(id);
    if (!html) return false;
    // The source may have changed since this HTML was rendered (e.g. virtual-list
    // recycling, in-place text update) — verify text equality before refilling.
    if (visibleText(unit.element).replace(/\s+/g, ' ').trim() !== unit.text) return false;
    const mode = this.modeById.get(id) ?? 'block';
    // A surviving gloss usually means "already there (paths raced)" — no
    // attempt burned. EXCEPT an interleaved multi-paragraph unit: the host
    // may have evicted individual SEGMENTS (or the primary — findGloss
    // excludes segments, so that reads as missing), and segment completeness
    // isn't statically checkable (placement depends on live DOM gates). Any
    // eviction on such a unit re-places the whole layout — zero network,
    // placeTranslatedHtml sweeps survivors first, bumpReinject caps hostile
    // loops exactly like every other heal.
    const existing = findGloss(unit, mode);
    const multiPara =
      this.opts.paragraphInterleave &&
      (splitHtmlByBreaks(html).length > 1 || html.includes('\n'));
    if (existing && !multiPara) return false;
    if (existing && multiPara) {
      // Interleave intact? The placement fingerprint says how many glosses
      // this layout finished with; when they are all still live this is a
      // rescan passing by, not an eviction — return without burning quota.
      // A missing fingerprint (pre-stamp gloss) falls through: one re-place
      // stamps it and the next rescan short-circuits here.
      const expected = Number(existing.getAttribute(DATA_OMNI.parts) ?? '0');
      if (expected > 0 && 1 + segGlosses(unit).length === expected) return false;
    }
    if (!this.bumpReinject(unit.element)) return false;
    if (existing) {
      // OUR removal — without the marker the observer reads it as a host
      // eviction and re-heals what we just re-placed, a self-feeding loop
      // that burns the whole reinject quota and then rejects REAL evictions
      // for the decay window (oracle review, B-1).
      this.selfRemovedGloss.add(existing);
      existing.remove();
    }
    this.placeTranslatedHtml(
      unit,
      ensureGlossNode(unit, mode, this.opts.target, this.opts.bilingualStyle, this.opts.translationFont),
      html
    );
    return true;
  }

  /**
   * Count a re-injection attempt against the ELEMENT (not the unit id — the
   * pending-eviction path re-walks under a fresh id, and an id-keyed cap would
   * reset every cycle, letting a hostile host drive an unbounded re-translate
   * loop). Attempts DECAY: a host that re-renders benignly every few seconds
   * must not exhaust a lifetime budget — only a rapid delete loop (faster than
   * REINJECT_DECAY_MS per round) accumulates to the cap and concedes.
   */
  private bumpReinject(el: Element): boolean {
    const now = Date.now();
    const prev = this.reinjectCount.get(el);
    const attempts = prev && now - prev.ts < REINJECT_DECAY_MS ? prev.n + 1 : 1;
    if (attempts > MAX_REINJECT) return false;
    this.reinjectCount.set(el, { n: attempts, ts: now });
    return true;
  }

  /**
   * First encounter with a host-page shadow root (open OR closed): give it the
   * gloss stylesheet (styles don't pierce shadow boundaries) and its own
   * observer attachment (neither does MutationObserver's subtree). The walk
   * itself already descends into the root — this is the per-root plumbing.
   */
  private adoptShadowRoot(shadow: ShadowRoot): void {
    if (this.shadowRoots.has(shadow)) return;
    this.shadowRoots.add(shadow);
    ensurePresetStyles(shadow);
    this.mo?.observe(shadow, MO_OPTIONS);
  }

  /**
   * Drop map entries whose source element has left the document (SPA route
   * change, virtual-list recycling). Without this `unitsById`/`modeById` only
   * ever grow over a long session and pin detached DOM from being GC'd. Keyed on
   * `isConnected`, so a node that was MOVED (still in the tree) is kept. Run once
   * per mutation batch and on route change — not per scanned subtree (which would
   * be O(insertions × units) on a chatty page).
   */
  private pruneDetached(): void {
    for (const [id, unit] of this.unitsById) {
      // Full per-unit retirement — hand-deleting a subset of the maps here
      // once leaked lastHtmlById (a rendered-HTML string per ever-seen unit)
      // over long SPA sessions, the exact growth this method exists to stop.
      if (!unit.element.isConnected) this.retireUnit(id);
    }
    // Shadow roots whose host left the document: stop pinning the whole
    // detached tree (long SPA sessions rotate components indefinitely). A
    // reused host re-adopts via the walk; MutationObserver holds targets
    // weakly, so no explicit un-observe is needed.
    for (const shadow of this.shadowRoots) {
      if (!shadow.host?.isConnected) this.shadowRoots.delete(shadow);
    }
  }

  /** True if the element is within the preload margin of the viewport. */
  private isNearViewport(el: Element): boolean {
    const win = el.ownerDocument.defaultView;
    if (!win) return true;
    const m = this.preloadMargin;
    const r = el.getBoundingClientRect();
    return r.bottom >= -m && r.top <= win.innerHeight + m && r.right >= -m && r.left <= win.innerWidth + m;
  }

  private onIntersect(entries: IntersectionObserverEntry[]): void {
    if (!this.active) return; // a callback can still fire after stop() — ignore it
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as Element;
      this.io?.unobserve(el);
      const id = el.getAttribute(DATA_OMNI.walkId);
      const unit = id ? this.unitsById.get(id) : undefined;
      if (unit) this.enqueue(unit);
    }
  }

  private onMutations(muts: MutationRecord[]): void {
    if (!this.active) return; // queued records can still arrive after disconnect — ignore
    const orphanIds = new Set<string>();
    const evictedIds = new Set<string>();
    for (const m of muts) {
      // Ignore mutations inside our own output (spinner/innerHTML/stream text
      // updates). characterData records target a TEXT node — resolve to its
      // element before the closest() check, or our own stream writes loop back.
      // A childList record on an adopted SHADOW ROOT targets the root itself
      // (nodeType 11): there is no element — and nothing above a root can be
      // our gloss — so it passes the guard with targetEl null.
      const isRootTarget = m.target.nodeType === 11;
      const targetEl = m.target.nodeType === 1 ? (m.target as Element) : isRootTarget ? null : m.target.parentElement;
      if (!isRootTarget && (!targetEl || targetEl.closest?.(`[${DATA_OMNI.translated}]`))) continue;

      // The walk prunes at ANCESTOR level (a contenteditable editor, a <pre>),
      // so nodes inside such subtrees carry no marker — but mutation records
      // START inside them (typing = characterData on a line-div deep in the
      // editor). Without this chain re-check we'd inject 译文 into content the
      // user is writing. Gates every dynamic entry below.
      const skippedContext = targetEl !== null && inSkippedAncestry(targetEl, this.root);

      if (m.type === 'attributes') {
        // A reveal-class attribute changed (attributes always target an
        // element). If this subtree was walk-pruned while hidden it carries no
        // markers — a debounced re-walk picks it up now that it shows (and is
        // a cheap marker-skip when nothing changed). INSIDE an already-walked
        // unit, though, an attribute flip is styling, not new content: the
        // walk only marks the unit ROOT, so an inner span looks virgin to a
        // rescan and would be minted as a NESTED unit with a duplicate 译文
        // ("Overview 概览 概览" on every tab-activation class toggle). The
        // unit's gloss stands — skip.
        if (targetEl && !skippedContext && !targetEl.closest?.(`[${DATA_OMNI.walked}]`)) {
          this.scheduleRescan(targetEl);
        }
        continue;
      }
      if (m.type === 'characterData') {
        if (targetEl && !skippedContext) this.onTextChanged(targetEl);
        continue;
      }
      for (const node of Array.from(m.addedNodes)) {
        // A bare text node landing under an existing element (skeleton fill,
        // React swapping the text child) never shows up as an added ELEMENT.
        // (targetEl is null only for text dropped DIRECTLY on a shadow root —
        // not a real content shape; skip it.)
        if (node.nodeType === 3) {
          if (targetEl && !skippedContext) this.onTextChanged(targetEl);
          continue;
        }
        if (node.nodeType !== 1) continue;
        const el = node as Element;
        if (el.hasAttribute?.(DATA_OMNI.translated)) continue;
        // Re-attached from a node pool (virtual list): stale markers from a
        // PREVIOUS attachment would make isSkippedElement drop it forever.
        this.clearStaleMarks(el);
        if (isSkippedElement(el) || skippedContext) continue;
        this.scan(el);
      }
      for (const node of Array.from(m.removedNodes)) {
        if (node.nodeType !== 1) continue;
        this.collectGlossEvictions(node as Element, evictedIds);
        this.collectOrphans(node as Element, orphanIds);
      }
    }
    // Order matters: reconcile prunes units whose SOURCE left, so the eviction
    // pass below only re-injects for sources that are still alive.
    if (orphanIds.size) this.reconcileRemovals(orphanIds);
    if (evictedIds.size) this.reinjectEvicted(evictedIds);
  }

  /**
   * Gather unit ids whose 译文 the HOST deleted (a React keyed commit rewriting
   * children) — the gloss left the document while we did not remove it. Skips
   * moves (re-attached in the same batch → still connected) and our own
   * deliberate removals (the unchanged-drop marks itself in selfRemovedGloss).
   */
  private collectGlossEvictions(removed: Element, ids: Set<string>): void {
    const glosses: Element[] = [];
    if (removed.hasAttribute(DATA_OMNI.translated)) glosses.push(removed);
    removed.querySelectorAll(`[${DATA_OMNI.translated}]`).forEach((g) => glosses.push(g));
    for (const g of glosses) {
      if (g.isConnected || this.selfRemovedGloss.has(g)) continue;
      const id = g.getAttribute(DATA_OMNI.walkId);
      if (id) ids.add(id);
    }
  }

  /**
   * SPA re-injection protection. A host re-render deleted our 译文 while its
   * SOURCE stayed alive: without this, the source's surviving walked marker
   * makes every future walk skip it and the paragraph silently loses its
   * translation forever. Re-fill from the cached final HTML (zero network); a
   * unit evicted while still pending re-enters the pipeline instead. Capped
   * per source ELEMENT with decay (see bumpReinject) — capped at MAX_REINJECT rounds
   * to prevent infinite loops against hostile frameworks while tolerating normal re-renders.
   */
  private reinjectEvicted(ids: Set<string>): void {
    const win = this.root.ownerDocument.defaultView;
    withViewportAnchor(() => {
      for (const id of ids) {
        const unit = this.unitsById.get(id);
        if (!unit || !unit.element.isConnected) continue; // source left too — the orphan path owns it
        // The same commit that deleted the gloss may ALSO have changed the
        // source text (React swapping copy in place). Re-filling would flash a
        // translation of text that no longer exists for the retranslate
        // debounce window — let the scheduled retranslate own it instead.
        if (visibleText(unit.element).replace(/\s+/g, ' ').trim() !== unit.text) continue;
        if (this.lastHtmlById.has(id)) {
          this.refillFromCache(id, unit);
        } else if (this.bumpReinject(unit.element)) {
          // Evicted while still streaming/pending: retire the unit and let the
          // normal pipeline redo it (the request cache absorbs the cost). The
          // element-keyed cap holds across the re-walk's fresh unit id, so a
          // host that keeps eating pending glosses still runs out of rounds.
          this.rewalk(unit.element, id);
        }
      }
    }, win);
  }

  /** Drop every per-unit record (tracking, stream, fill, re-inject bookkeeping). */
  private retireUnit(id: string): void {
    // Release the IntersectionObserver target FIRST — it is the one record the
    // browser holds, not us. A unit retired before it ever intersected (a
    // virtual-list row recycled below the fold) would otherwise stay
    // registered for the session, pinning its detached subtree and paying an
    // intersection recomputation for content that no longer exists.
    const unit = this.unitsById.get(id);
    if (unit) this.io?.unobserve(unit.element);
    this.unitsById.delete(id);
    this.modeById.delete(id);
    this.splitNodesById.delete(id);
    this.streamAcc.delete(id);
    this.streamBuf.delete(id);
    this.fillQueue.delete(id);
    this.lastHtmlById.delete(id);
  }

  /**
   * Retire a unit, strip its walk marks, and re-enter the element into the
   * pipeline as fresh content — the ONE implementation of "rewalk from
   * scratch" (retranslateUnit and the pending-eviction path both use it, so
   * the mark set can't drift between them).
   */
  private rewalk(el: Element, id: string): void {
    this.retireUnit(id);
    el.removeAttribute(DATA_OMNI.walked);
    el.removeAttribute(DATA_OMNI.walkId);
    // The clipped stamp belongs to the RETIRED unit's sibling gloss — the
    // fresh walk re-stamps if (and only if) the new unit clips again.
    el.removeAttribute(DATA_OMNI.clipped);
    this.scan(el);
  }

  /**
   * A text-level change under `el`. Inside an already-walked unit the existing
   * 译文 is now STALE — retranslate the unit. Anywhere else (an element that had
   * no text when walked) it's brand-new content — rescan.
   */
  private onTextChanged(el: Element): void {
    const holder = el.closest?.(`[${DATA_OMNI.walked}]`);
    if (holder) this.scheduleRetranslate(holder);
    else this.scheduleRescan(el);
  }

  /**
   * Markers surviving from a previous attachment (virtual-list node pools
   * detach → later re-attach across mutation batches; reconcileRemovals pruned
   * the tracking in between). Unit ids still tracked are MOVES — keep those.
   * For the rest, drop the marks and any orphaned 译文 so the subtree walks
   * fresh; the cache absorbs the re-translation.
   */
  private clearStaleMarks(el: Element): void {
    const marked: Element[] = [];
    if (el.hasAttribute?.(DATA_OMNI.walked)) marked.push(el);
    el.querySelectorAll?.(`[${DATA_OMNI.walked}]`).forEach((n) => marked.push(n));
    for (const node of marked) {
      const id = node.getAttribute(DATA_OMNI.walkId);
      if (id && this.unitsById.has(id)) continue; // tracked move, not a pool re-attach
      node.removeAttribute(DATA_OMNI.walked);
      node.removeAttribute(DATA_OMNI.walkId);
      node.removeAttribute(DATA_OMNI.clipped);
    }
    if (marked.length) {
      el.querySelectorAll?.(`[${DATA_OMNI.translated}]`).forEach((gloss) => {
        const id = gloss.getAttribute(DATA_OMNI.walkId);
        if (id && !this.unitsById.has(id)) gloss.remove();
      });
    }
  }

  /** Debounce store for reveal/text-driven work (attribute storms coalesce). */
  private readonly rescanQueue = new Set<Element>();
  private readonly retranslateQueue = new Set<Element>();
  private dynamicTimer: ReturnType<typeof setTimeout> | null = null;

  private scheduleRescan(el: Element): void {
    this.rescanQueue.add(el);
    this.scheduleDynamicFlush();
  }

  private scheduleRetranslate(el: Element): void {
    this.retranslateQueue.add(el);
    this.scheduleDynamicFlush();
  }

  private scheduleDynamicFlush(): void {
    if (this.dynamicTimer) return;
    this.dynamicTimer = setTimeout(() => {
      this.dynamicTimer = null;
      if (!this.active) return;
      const rescan = [...this.rescanQueue];
      const retranslate = [...this.retranslateQueue];
      this.rescanQueue.clear();
      this.retranslateQueue.clear();
      for (const el of retranslate) {
        if (el.isConnected) this.retranslateUnit(el);
      }
      // Keep only the OUTERMOST queued roots: a nested rescan is work the
      // ancestor's walk already does. Pairwise `contains` was O(n²), and this
      // queue fills from a whole-document observer watching `class`/`style`,
      // so a hover- or scroll-driven class storm can drop hundreds of
      // containers into one 150ms window. In document order an element can
      // only be covered by the most recently kept root, so one pass suffices.
      rescan.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
      let outermost: Element | null = null;
      for (const el of rescan) {
        if (!el.isConnected) continue;
        if (outermost?.contains(el)) continue;
        outermost = el;
        this.scan(el);
      }
    }, 150);
  }

  /**
   * The text under a walked unit changed in place: its 译文 (if any) describes
   * text that no longer exists. Drop gloss + tracking + marks, then re-walk the
   * element so it re-enters the normal pipeline as fresh content.
   */
  private retranslateUnit(el: Element): void {
    const id = el.getAttribute(DATA_OMNI.walkId);
    if (!id) return;
    // No-op text events are common (React re-committing identical text, a
    // relative-time label re-rendering unchanged): if the visible text still
    // matches the tracked unit, keep the gloss — tearing it down would flash a
    // spinner and burn a request every debounce window.
    const tracked = this.unitsById.get(id);
    if (tracked && visibleText(el).replace(/\s+/g, ' ').trim() === tracked.text) return;
    // Handle text rewrites for newline-interleaved units: when the host framework
    // rewrites text, it updates the retained text node. Check whether a whole-run rewrite
    // occurred before removing minted continuation nodes, then re-walk the clean content.
    const groups = this.splitNodesById.get(id);
    if (groups) {
      for (const { retained, snapshot, minted } of groups) {
        const stale = retained.isConnected ? splitRunRewritten(retained.data, snapshot) : true;
        if (!stale) continue;
        for (const { node, snapshot: mintedSnapshot } of minted) {
          if (node.isConnected && node.data === mintedSnapshot) node.remove();
        }
      }
      this.splitNodesById.delete(id);
      el.normalize();
      el.removeAttribute(DATA_OMNI.split);
    }
    // Sweep the stale gloss BEFORE the rewalk retires the id (retireUnit also
    // drops the fillQueue entry — a queued fill would resurrect a dead gloss).
    this.forEachGloss((gloss) => {
      if (gloss.getAttribute(DATA_OMNI.walkId) === id) gloss.remove();
    });
    this.rewalk(el, id);
  }

  /**
   * Gather the unit ids of sources in a removed subtree that have TRULY left the
   * document, into `ids`. A host MOVE (drag-reorder, virtual-list recycle, keyed
   * reconcile) reports the node in `removedNodes` but re-attaches it in the same
   * batch — by the time this observer callback runs the DOM is in its final
   * state, so an `isConnected` source is one that moved, not one that left. We
   * must NOT reconcile those: their inside gloss moved along with them, and
   * pruning their tracking would orphan the gloss and (since the source keeps its
   * `data-omni-walked` marker) leave it never re-translated.
   */
  private collectOrphans(removed: Element, ids: Set<string>): void {
    // Our own gloss being removed (isUnchanged / teardown) is not a source removal.
    if (removed.hasAttribute(DATA_OMNI.translated)) return;
    const walked: Element[] = [];
    if (removed.hasAttribute(DATA_OMNI.walked)) walked.push(removed);
    removed.querySelectorAll(`[${DATA_OMNI.walked}]`).forEach((el) => walked.push(el));
    for (const el of walked) {
      if (el.isConnected) continue; // moved, still live — keep tracking it
      const id = el.getAttribute(DATA_OMNI.walkId);
      if (id) ids.add(id);
    }
  }

  /**
   * Prune tracking for genuinely-removed units and sweep the 译文 they left
   * orphaned. An inline / inside gloss leaves WITH its source; only the
   * clipped-source `afterend` SIBLING fallback survives detached. One pass over
   * our own gloss nodes, matched against the id set by attribute (no walkId
   * interpolated into a selector), so a large batch is O(glosses) not
   * O(removed × DOM).
   */
  private reconcileRemovals(ids: Set<string>): void {
    for (const id of ids) this.retireUnit(id);
    this.forEachGloss((gloss) => {
      const id = gloss.getAttribute(DATA_OMNI.walkId);
      if (id && ids.has(id)) gloss.remove();
    });
  }

  /** Visit every injected gloss — the light root AND each adopted shadow root
   *  (querySelectorAll never crosses a shadow boundary). */
  private forEachGloss(cb: (gloss: Element) => void): void {
    this.root.querySelectorAll(`[${DATA_OMNI.translated}]`).forEach(cb);
    this.shadowRoots.forEach((shadow) => shadow.querySelectorAll(`[${DATA_OMNI.translated}]`).forEach(cb));
  }

  private enqueue(unit: TranslationUnit): void {
    // Layer 1 — synchronous SCRIPT skip (CJK is decisive): drop already-target /
    // skip-language text before it's even queued. No RPC, no spinner.
    if (scriptSaysSkip(unit.text, this.policy)) return;
    this.pending.push(unit);
    this.pendingChars += this.payload(unit).text.length;
    if (this.pending.length >= this.maxBatchItems || this.pendingChars >= this.maxBatchChars) {
      this.flush();
    } else {
      if (this.flushTimer) clearTimeout(this.flushTimer);
      this.flushTimer = setTimeout(() => this.flush(), this.flushDelayMs);
    }
  }

  private flush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
    if (this.pending.length === 0) return;
    const batch = this.pending;
    this.pending = [];
    this.pendingChars = 0;
    void this.processBatch(this.orderByViewport(batch));
  }

  /**
   * Order a batch closest-to-viewport first, measured at FLUSH time — during a
   * scroll burst most of `pending` is content the user rushed past, not what
   * they stopped on. The model emits a batch's segments in prompt order, so
   * this ordering directly decides which 译文 lands first. One rect read per
   * unit, then a stable sort: units already on screen (distance 0) keep
   * reading order.
   */
  private orderByViewport(batch: TranslationUnit[]): TranslationUnit[] {
    if (batch.length < 2) return batch;
    return batch
      .map((unit) => ({ unit, d: this.viewportDistance(unit.element) }))
      .sort((a, b) => a.d - b.d)
      .map((e) => e.unit);
  }

  /** Vertical gap between the element and the viewport edge (0 = on screen). */
  private viewportDistance(el: Element): number {
    const win = el.ownerDocument.defaultView;
    if (!win) return 0;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0) return -r.bottom;
    if (r.top > win.innerHeight) return r.top - win.innerHeight;
    return 0;
  }

  /**
   * Layer 2 — async on-device DETECTION skip (covers Latin languages the script
   * check can't), then translate the survivors. The pending spinner is created
   * HERE (after detection), not at enqueue, so a skipped unit never flashes one.
   */
  private async processBatch(batch: TranslationUnit[]): Promise<void> {
    const win = this.root.ownerDocument.defaultView as (Window & typeof globalThis) | null;
    // Detect in parallel: the detector is shared/cached, and up to 16 serial
    // awaits added ~20-80ms of pure latency to every batch's first token.
    const skips = await Promise.all(batch.map((unit) => detectSaysSkip(unit.text, this.policy, win)));
    const survivors = batch.filter((_, i) => !skips[i]);
    if (!this.active || survivors.length === 0) return;
    // One display-mode neutralize around the whole batch: each gloss creation
    // measures its inherited metrics, and under an active 仅译文 collapse the
    // per-node <html> attribute toggle would force a full-document style
    // recalc per unit (see withDisplayModeNeutralized).
    withDisplayModeNeutralized(this.root.ownerDocument, () => {
      for (const unit of survivors) {
        const mode = this.chooseMode(unit);
        this.modeById.set(unit.id, mode);
        ensureGlossNode(unit, mode, this.opts.target, this.opts.bilingualStyle, this.opts.translationFont); // pending spinner now that it's confirmed
      }
    });
    await this.translateBatch(survivors);
  }

  private async translateBatch(batch: TranslationUnit[]): Promise<void> {
    const win = this.root.ownerDocument.defaultView;
    const filled = new Set<string>(); // unit ids that received a final segDone
    const handle = streamBatchTranslate(
      {
        source: this.opts.source,
        target: this.opts.target,
        // Host feeds per-site PromptStyle/glossary rules; title anchors the
        // model's domain sense ("Star" on a GitHub page vs a review site).
        // Title enters the system prompt, so cache keys become PAGE-scoped —
        // a deliberate trade: reload/SPA-revisit of the same title still
        // hits, and short UI chrome is exactly what benefits most from the
        // title's disambiguation. Capped to bound token cost.
        context: {
          domain: win?.location.hostname || undefined,
          title: this.root.ownerDocument.title.trim().slice(0, 200) || undefined,
          summary: this.pageSummary || undefined,
        },
      },
      batch.map((u) => this.payload(u).text),
      {
        // Progressive: append the raw stream to the node (RAF-buffered). Inline
        // {{n}} placeholders briefly show literally; segDone renders for real.
        onSeg: (index, delta) => {
          if (!this.active) return;
          const unit = batch[index - 1];
          if (!unit) return;
          const acc = (this.streamAcc.get(unit.id) ?? '') + delta;
          this.streamAcc.set(unit.id, acc);
          this.streamBuf.set(unit.id, acc);
          this.scheduleStreamFlush(win);
        },
        // Final, trimmed text → the real render (restoreInline + unchanged drop).
        onSegDone: (index, text) => {
          if (!this.active) return;
          const unit = batch[index - 1];
          if (!unit) return;
          filled.add(unit.id);
          this.streamBuf.delete(unit.id);
          this.streamAcc.delete(unit.id);
          // Coalesce fills into one anchored DOM pass per frame: each fill
          // changes height (spinner → text), and anchoring per segDone meant a
          // full read→write→read reflow cycle for every one of up to 16
          // segments arriving back-to-back.
          this.fillQueue.set(unit.id, { unit, text });
          this.scheduleFillFlush(win);
        },
      }
    );
    this.inflight.add(handle);
    let failure = '';
    try {
      await handle.done;
    } catch (e) {
      // The reason the batch died is the ONLY actionable thing the user gets —
      // "no API key" and "rate limited" call for completely different moves,
      // and a fixed "translation failed" hides both.
      failure = e instanceof Error ? e.message : String(e);
    } finally {
      this.inflight.delete(handle);
    }
    if (!this.active) return;
    // Whether the batch failed outright (no API key, SW recycled) or "finished"
    // with per-item casualties (one MT fetch failed), a unit that never got its
    // segDone must not keep its spinner forever: mark it and drop its partial
    // stream accumulation. (Cancellation resolves `done` too, but stop() clears
    // `active` first, so the guard above keeps teardown out of here.)
    // A per-item casualty carries no batch-level error: name the outcome
    // rather than inventing a cause.
    const raw = failure || 'translation unavailable';
    const message = this.opts.errorText?.(raw) ?? raw;
    batch.forEach((unit) => {
      this.streamBuf.delete(unit.id);
      this.streamAcc.delete(unit.id);
      if (filled.has(unit.id)) return;
      // A unit retired mid-flight (retranslated/removed) must not get an error
      // gloss conjured onto the live element under its dead walkId.
      if (!this.unitsById.has(unit.id)) return;
      setError(
        ensureGlossNode(
          unit,
          this.modeById.get(unit.id) ?? 'block',
          this.opts.target,
          this.opts.bilingualStyle,
          this.opts.translationFont
        ),
        message
      );
    });
  }

  /** Coalesce streaming chunk writes into one DOM pass per animation frame. */
  private scheduleStreamFlush(win: (Window & typeof globalThis) | null): void {
    if (this.rafQueued) return;
    this.rafQueued = true;
    const run = () => {
      this.rafQueued = false;
      if (!this.active) return;
      this.streamBuf.forEach((raw, unitId) => {
        const unit = this.unitsById.get(unitId);
        if (unit) this.streamWrite(unit, raw);
      });
      this.streamBuf.clear();
    };
    if (win?.requestAnimationFrame) win.requestAnimationFrame(run);
    else run();
  }

  /** One anchored DOM pass per frame for all final fills that arrived in it. */
  private scheduleFillFlush(win: Window | null | undefined): void {
    if (this.fillRafQueued) return;
    this.fillRafQueued = true;
    const run = () => {
      this.fillRafQueued = false;
      if (!this.active) return;
      // Drop fills whose unit was RETIRED while queued (retranslate/removal):
      // filling would resurrect a gloss under the old walkId next to the new
      // unit's own — a duplicate nothing tracks.
      const fills = [...this.fillQueue.values()].filter((f) => this.unitsById.has(f.unit.id));
      this.fillQueue.clear();
      if (fills.length === 0) return;
      // Height changes as spinners become text — one anchor around the whole
      // pass keeps the page from jumping without a reflow per segment.
      withViewportAnchor(() => {
        for (const f of fills) this.fill(f.unit, f.text);
      }, win);
    };
    if (win?.requestAnimationFrame) win.requestAnimationFrame(run);
    else run();
  }

  /** Replace the spinner with the in-progress raw text (no restore yet). */
  private streamWrite(unit: TranslationUnit, raw: string): void {
    const node = ensureGlossNode(
      unit,
      this.modeById.get(unit.id) ?? 'block',
      this.opts.target,
      this.opts.bilingualStyle,
      this.opts.translationFont
    );
    node.setAttribute(DATA_OMNI.state, 'streaming');
    // Mid-stream text still carries the protocol's salted ~n tokens — the
    // background decodes only at segDone — so sweep them at this display seam
    // or a multi-paragraph unit flashes `[[a1b2c3~n]]` literals while streaming.
    node.textContent = sweepNewlineTokensForDisplay(raw);
  }

  private fill(unit: TranslationUnit, translated: string): void {
    // One payload per fill — the unchanged-check's text and the restore's tags
    // must come from the same mode (they can't disagree if they share the object).
    const p = this.payload(unit);
    const node = ensureGlossNode(
      unit,
      this.modeById.get(unit.id) ?? 'block',
      this.opts.target,
      this.opts.bilingualStyle,
      this.opts.translationFont
    );
    // The engine returns the input UNCHANGED when the text is already in the
    // target language (auto-detected zh → zh) or is untranslatable (a bare proper
    // noun / code), and EMPTY when it has nothing to offer (the batch fallback's
    // documented give-up is an empty segDone). Neither is an ERROR — showing a
    // marker (or a duplicate) just vandalizes a readable page; drop the gloss.
    if (isUnchanged(translated, p.text, unit.text)) {
      // OUR removal, not a host eviction — mark it so the SPA re-injection
      // pass doesn't resurrect (and endlessly re-translate) an unchanged unit.
      this.selfRemovedGloss.add(node);
      this.lastHtmlById.delete(unit.id);
      node.remove();
      // Stamp lifetime == gloss lifetime: a clipped source whose gloss was
      // just dropped must not stay armed for the 仅译文 collapse (the CSS is
      // also :has-gated on the sibling gloss — this keeps the DOM honest).
      unit.element.removeAttribute(DATA_OMNI.clipped);
      return;
    }
    // restoreInline always returns safe HTML (text escaped, only page tags raw);
    // on placeholder mismatch it returns escaped plain text.
    const { html } = restoreInline(translated, p.tags);
    this.lastHtmlById.set(unit.id, html); // the re-injection source (see reinjectEvicted)
    this.placeTranslatedHtml(unit, node, html);
  }

  /**
   * Final placement of a unit's rendered 译文 — the one seam 逐段对照 hooks
   * into, shared by the live fill and the SPA re-injection heal so the two
   * can never disagree on layout. Default: the whole HTML into the single
   * gloss node. With `paragraphInterleave` on, a multi-paragraph unit (source
   * paragraphs separated by <br> groups) gets each translated paragraph
   * placed right AFTER its source paragraph — gloss #i inserted before break
   * group #i, the last one staying at the unit's end. Interleave applies only
   * when it can be exact:
   *   - block mode, gloss INSIDE the source (a clipped source's afterend
   *     sibling has no breaks to interleave with);
   *   - translated paragraph count === source paragraph count (an engine that
   *     ate a <br> placeholder falls back to the whole-block layout).
   * Empty paragraphs keep their slot but render no gloss.
   */
  private placeTranslatedHtml(unit: TranslationUnit, node: HTMLElement, html: string): void {
    this.placeLayout(unit, node, html);
    // Fingerprint the finished layout on the primary: 1 primary + N segments
    // actually placed (empty paragraphs render none — the LIVE count is the
    // truth, not the theoretical split). refillFromCache compares this against
    // the live count so a full rescan passing an INTACT interleave never
    // re-places it (F3: those self-driven re-places burned the reinject quota
    // meant for hostile hosts, then rejected REAL evictions for the window).
    node.setAttribute(DATA_OMNI.parts, String(1 + segGlosses(unit).length));
  }

  private placeLayout(unit: TranslationUnit, node: HTMLElement, html: string): void {
    // Always clear previous interleave segments first — a re-fill (retranslate,
    // settings change) must never stack fresh segments onto stale ones. Marked
    // as OUR removals: un-marked, the observer would treat each sweep as a
    // host eviction and re-trigger the heal it is part of (see refillFromCache).
    for (const seg of segGlosses(unit)) {
      this.selfRemovedGloss.add(seg);
      seg.remove();
    }
    const structural =
      this.opts.paragraphInterleave &&
      this.modeById.get(unit.id) === 'block' &&
      !unit.element.hasAttribute(DATA_OMNI.clipped) &&
      node.parentElement !== unit.element.parentElement; // inside the source, not the sibling fallback
    // Heal previous splitText scars before rescanning: segments are gone, the
    // halves are adjacent again — normalize restores the pristine text-node
    // layout so runs are re-detected on clean structure every pass.
    if (unit.element.hasAttribute(DATA_OMNI.split)) {
      unit.element.normalize();
      unit.element.removeAttribute(DATA_OMNI.split);
    }
    this.splitNodesById.delete(unit.id);
    const groups = structural ? sourceBreakGroups(unit.element) : [];
    const runs = structural ? sourceNewlineRuns(unit.element) : [];
    // Mixed br+newline shapes interleave as NEITHER kind: a br-level
    // interleave would leave newline paragraphs buried inside one segment —
    // half-exact layouts are harder to reason about than a clean fallback.
    if (groups.length > 0 && runs.length === 0) return this.placeBr(unit, node, html, groups);
    if (runs.length > 0 && groups.length === 0) return this.placeNl(unit, node, html, runs);
    setTranslatedHtml(node, html);
  }

  /** <br>-paragraph interleave: split the translated HTML string at its own
   *  <br> runs and land part #i before source break group #i. */
  private placeBr(unit: TranslationUnit, node: HTMLElement, html: string, groups: HTMLElement[][]): void {
    const parts = splitHtmlByBreaks(html);
    // First-paragraph guard measured on TEXT (a markup-only part like
    // "<i></i>" is still an empty stray gloss) — same yardstick as the nl
    // branch's Range.toString().
    const probe = unit.element.ownerDocument.createElement('div');
    probe.innerHTML = parts[0] ?? '';
    if (parts.length === groups.length + 1 && (probe.textContent ?? '').trim()) {
      this.interleaveParts(node, parts, groups.map((g) => g[0]));
      return;
    }
    setTranslatedHtml(node, html); // count mismatch / empty first — whole block wins
  }

  /** Newline-paragraph interleave (X/Threads: inline spans / bare text with
   *  literal \n in a pre-wrap container). The translation is split at the DOM
   *  level: render the WHOLE html into the primary gloss first, then carve it
   *  at its own newline runs with Range.extractContents — the browser
   *  balances tags cut mid-element, so a paragraph break nested inside
   *  reproduced inline markup can never mis-slice it (the string-split hazard
   *  that once limited this to direct text children). */
  private placeNl(unit: TranslationUnit, node: HTMLElement, html: string, runs: NewlineRun[]): void {
    setTranslatedHtml(node, html);
    const glossRuns = glossNewlineRuns(node);
    if (glossRuns.length !== runs.length) return; // counts mismatch — whole html already in the primary
    // A LEADING separator would carve everything out and leave the primary
    // as an empty done-stamped shell (a stray margin band) — same guard as
    // the br path's parts[0].trim(), expressed on the DOM.
    const lead = node.ownerDocument.createRange();
    lead.setStart(node, 0);
    lead.setEnd(glossRuns[0].node, glossRuns[0].start);
    if (!lead.toString().trim()) return;
    // Mint insertion anchors by splitting each source run's text node at
    // the run START — the separator newlines stay with the FOLLOWING half,
    // so the visual order (paragraph / gloss / blank line / next
    // paragraph) matches the <br> layout. splitText fires
    // childList+characterData records, but visibleText is unchanged, so
    // retranslateUnit's no-op guard absorbs the echo. Every anchor is filed
    // under the ORIGIN node it came out of — that grouping is what keeps the
    // React-rewrite defence from reaching across carved spans.
    const anchors: Text[] = [];
    const byOrigin = new Map<Text, Array<{ node: Text; snapshot: string }>>();
    // Right-to-left: splitting mutates offsets to the right of the cut. Two
    // runs in the same node therefore share one origin — `run.node` is still
    // the same object after the later split truncated it.
    for (const run of [...runs].reverse()) {
      const tail = run.node.splitText(run.start);
      anchors.unshift(tail);
      const group = byOrigin.get(run.node);
      if (group) group.unshift({ node: tail, snapshot: tail.data });
      else byOrigin.set(run.node, [{ node: tail, snapshot: tail.data }]);
    }
    this.splitNodesById.set(
      unit.id,
      [...byOrigin].map(([retained, minted]) => ({ retained, snapshot: retained.data, minted }))
    );
    unit.element.setAttribute(DATA_OMNI.split, '');
    // Carve the translation right-to-left: each pass extracts the LAST
    // remaining paragraph into a segment gloss and drops its separator
    // (the source keeps its own newlines; the gloss must not re-render them).
    const doc = node.ownerDocument;
    for (let i = glossRuns.length - 1; i >= 0; i--) {
      const run = glossRuns[i];
      const tailRange = doc.createRange();
      tailRange.setStart(run.node, run.end);
      if (node.lastChild) tailRange.setEndAfter(node.lastChild);
      const frag = tailRange.extractContents();
      const sepRange = doc.createRange();
      sepRange.setStart(run.node, run.start);
      sepRange.setEnd(run.node, Math.min(run.end, run.node.length));
      sepRange.deleteContents();
      if ((frag.textContent ?? '').trim()) {
        const seg = node.cloneNode(false) as HTMLElement;
        seg.setAttribute(DATA_OMNI.seg, String(i + 1));
        seg.appendChild(frag);
        // Paragraph i+1's 译文 sits right after its SOURCE paragraph: before
        // the NEXT separator's tail, or (for the last paragraph) at the
        // unit's end — the primary gloss still parks there but moves to its
        // own slot right after this loop.
        const nextAnchor = anchors[i + 1];
        if (nextAnchor) nextAnchor.parentNode?.insertBefore(seg, nextAnchor);
        else unit.element.appendChild(seg);
      }
    }
    // The primary keeps paragraph 1; move it before the first separator.
    anchors[0].parentNode?.insertBefore(node, anchors[0]);
  }

  /** Shared interleave placement: parts[i] lands before anchors[i]; the last
   *  part stays at the unit end. parts.length === anchors.length + 1. */
  private interleaveParts(node: HTMLElement, parts: string[], anchors: Node[]): void {
    // Paragraph 1 lives in the EXISTING node (keeps findGloss/idempotency
    // anchored); move it before the first separator.
    setTranslatedHtml(node, parts[0]);
    anchors[0].parentNode?.insertBefore(node, anchors[0]);
    for (let i = 1; i < parts.length; i++) {
      if (!parts[i].trim()) continue; // empty paragraph — no gloss, slot kept
      // Clone the primary gloss shell: every attribute (walkId, lang, style
      // preset, dir, the stamped font-size vars for the 仅译文 restore) rides
      // along for free; only the segment marker is added.
      const seg = node.cloneNode(false) as HTMLElement;
      seg.setAttribute(DATA_OMNI.seg, String(i));
      setTranslatedHtml(seg, parts[i]);
      const anchor = anchors[i];
      if (anchor) anchor.parentNode?.insertBefore(seg, anchor);
      else node.parentElement?.appendChild(seg); // last paragraph — unit end
    }
  }
}

/** True when there's no useful 译文 to show: the engine returned nothing, or gave
 *  back the source unchanged (already target language / untranslatable). Compared
 *  whitespace-normalized so trivial reflow doesn't count.
 *
 *  We compare against the serialized form (placeholders intact — engine kept
 *  them). The plain-visible comparison is gated on the unit actually HAVING had
 *  inline tags (serialized ≠ visible): only then can the engine return the source
 *  unchanged-but-placeholder-stripped. For a plain-text unit the two are equal,
 *  and widening to visible would wrongly drop legit verbatim results (a heading
 *  that is just "iPhone 15", "HTTP/2") whose correct translation equals the
 *  source. */
function isUnchanged(translated: string, serialized: string, visible: string): boolean {
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
  const t = norm(translated);
  if (t === '') return true;
  const s = norm(serialized);
  if (t === s) return true;
  const v = norm(visible);
  return v !== s && t === v; // visible-branch only when placeholders were present
}
