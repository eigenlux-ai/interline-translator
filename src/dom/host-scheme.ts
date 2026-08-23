/**
 * @module dom/host-scheme
 *
 * Which color scheme does the HOST PAGE actually render in? In-page floating
 * UI (selection card, floating ball panel) must match the page it hovers over,
 * not the OS: with a dark system and a light page, a system-following panel is
 * a charcoal island on white — it reads as a glitch, not a theme.
 *
 * Ground truth is the painted background: composite body over html over the
 * UA's canvas, then compare luminance. The page's declared `color-scheme`
 * plays exactly one role — picking the CANVAS color underneath (a page that
 * paints nothing itself and flips `color-scheme: dark` gets a dark canvas
 * from the UA, invisible to computed backgroundColor). Whatever the page
 * actually paints still composites OVER that and wins: many light sites
 * declare "light dark", so the declaration alone is never trusted against
 * real paint.
 */

interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

let colorCtx: CanvasRenderingContext2D | null | undefined;
const colorCache = new Map<string, Rgba | null>();

/** Let the BROWSER resolve a color we can't regex (paint it on a 1×1 canvas,
 *  read the pixel back) — full CSS color math for free, any space. */
function normalizeViaCanvas(value: string): Rgba | null {
  try {
    if (colorCtx === undefined) {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      colorCtx = canvas.getContext('2d', { willReadFrequently: true });
    }
    if (!colorCtx) return null;
    colorCtx.clearRect(0, 0, 1, 1);
    colorCtx.fillStyle = value;
    colorCtx.fillRect(0, 0, 1, 1);
    const data = colorCtx.getImageData(0, 0, 1, 1)?.data;
    if (!data) return null;
    return { r: data[0], g: data[1], b: data[2], a: data[3] / 255 };
  } catch {
    return null; // no real canvas (test DOMs) → treat as unpaintable, skip
  }
}

function parseColor(value: string): Rgba | null {
  // Fast path: standard rgb()/rgba() format.
  const m = value.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)(?:[ ,/]+([\d.]+))?\s*\)/);
  if (m) {
    return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] === undefined ? 1 : Number(m[4]) };
  }
  // Computed backgroundColor can serialize in modern color spaces like lab(),
  // oklch(), or color() functions. Canvas parsing normalizes them into RGBA.
  if (!value) return null;
  let parsed = colorCache.get(value);
  if (parsed === undefined) {
    if (colorCache.size >= 256) colorCache.clear();
    parsed = normalizeViaCanvas(value);
    colorCache.set(value, parsed);
  }
  return parsed;
}

/** src over dst (straight alpha). */
function composite(src: Rgba, dst: Rgba): Rgba {
  const a = src.a + dst.a * (1 - src.a);
  if (a === 0) return { r: 255, g: 255, b: 255, a: 0 };
  const ch = (s: number, d: number) => (s * src.a + d * dst.a * (1 - src.a)) / a;
  return { r: ch(src.r, dst.r), g: ch(src.g, dst.g), b: ch(src.b, dst.b), a };
}

function luminance({ r, g, b }: Rgba): number {
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export type HostColorScheme = 'light' | 'dark';

const CANVAS_LIGHT: Rgba = { r: 255, g: 255, b: 255, a: 1 };
/** Chrome's dark-mode canvas is #121212-ish; the exact value only has to
 *  read as dark through the luminance threshold. */
const CANVAS_DARK: Rgba = { r: 18, g: 18, b: 18, a: 1 };

/** The scheme the UA paints the CANVAS in, resolved from the root's
 *  color-scheme (falling back to `<meta name="color-scheme">`, which sets the
 *  canvas without ever showing up in computed style). "light dark" means the
 *  UA picks by OS preference. */
function canvasBase(doc: Document, rootStyle: CSSStyleDeclaration | null): Rgba {
  let declared = rootStyle?.colorScheme ?? '';
  if (!declared || declared === 'normal') {
    declared = doc.querySelector('meta[name="color-scheme" i]')?.getAttribute('content') ?? '';
  }
  if (!/\bdark\b/i.test(declared)) return CANVAS_LIGHT;
  if (/\blight\b/i.test(declared) && !doc.defaultView?.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return CANVAS_LIGHT;
  }
  return CANVAS_DARK;
}

/** The composited background the host actually paints: body over html over
 *  the UA canvas (whose color follows the declared color-scheme). */
function paintedBackground(doc: Document): Rgba {
  const win = doc.defaultView;
  if (!win?.getComputedStyle) return CANVAS_LIGHT;
  const rootStyle = doc.documentElement ? win.getComputedStyle(doc.documentElement) : null;
  let painted = canvasBase(doc, rootStyle);
  for (const style of [rootStyle, doc.body ? win.getComputedStyle(doc.body) : null]) {
    if (!style) continue;
    const bg = parseColor(style.backgroundColor);
    if (bg && bg.a > 0) painted = composite(bg, painted);
  }
  return painted;
}

/** The scheme the host page paints in, sampled from its real backgrounds. */
export function detectHostColorScheme(doc: Document = document): HostColorScheme {
  return luminance(paintedBackground(doc)) < 0.4 ? 'dark' : 'light';
}

/* ────────────────────────────────────────────────────────────────────────────
   Live tracking. A one-shot sample goes stale the moment the host flips its
   own theme switch — the mounted floater becomes an inverted island. One
   refcounted singleton watches for every consumer (MantineRegistry's
   follow-host strategy, InputHint): a single MutationObserver + media-query
   listener + coalescing rAF, torn down when the last subscriber leaves.

   Signals:
   - attribute changes on <html>/<body> — how virtually every site-level theme
     switch lands (a class or data-* attribute; next-themes, Docusaurus,
     VitePress, …). Unfiltered on purpose: the repaint may ride class, style
     or any data-* name, and it's only two nodes.
   - prefers-color-scheme change — sites skinned purely by media query repaint
     with ZERO DOM mutation; this is the only signal for them.
   - visibilitychange → visible — cheap catch-all: anything both of the above
     miss (CSSOM edits, swapped <link> hrefs, rewritten <meta color-scheme> —
     head is deliberately not observed) gets corrected when the user returns
     to the tab.

   - transitionend on <html>/<body> — see the settle loop below.

   Rechecks coalesce through one rAF (at most one forced style recalc per
   frame). rAF pauses in background tabs and fires on return — self-healing,
   and visibilitychange covers the same edge.

   THE TRANSITION TRAP (found in a real browser, invisible to happy-dom): a
   host theme switch is typically ONE attribute flip followed by a CSS
   background transition. The flip triggers a recheck while the background
   still paints the OLD color, and the transition's tail emits no further
   mutation — a single sample would lock in the stale scheme forever. So a
   recheck keeps re-sampling frame-by-frame until the painted color holds
   still (bounded, so a page with a permanently animating background can't
   pin us to per-frame recalcs), and transitionend on html/body catches
   transitions longer than the bound. */

type SchemeListener = (scheme: HostColorScheme) => void;

/** Frames a recheck may chase a still-moving background (~2s at 60fps). */
const MAX_SETTLE_FRAMES = 120;

const listeners = new Set<SchemeListener>();
let cached: HostColorScheme | null = null; // non-null while the watcher runs
let observer: MutationObserver | null = null;
let media: MediaQueryList | null = null;
let rafId: number | null = null;
let lastPaint = ''; // serialized painted color from the previous sample
let settleFrames = 0;

const paintKey = ({ r, g, b, a }: Rgba): string => `${r},${g},${b},${a}`;

function recheck(): void {
  rafId = null;
  const painted = paintedBackground(document);
  const key = paintKey(painted);
  const next: HostColorScheme = luminance(painted) < 0.4 ? 'dark' : 'light';
  if (next !== cached) {
    cached = next;
    for (const listener of [...listeners]) listener(next);
  }
  // Mid-transition: the paint is still moving — keep watching it (bounded).
  if (key !== lastPaint) {
    lastPaint = key;
    if (settleFrames < MAX_SETTLE_FRAMES) {
      settleFrames += 1;
      schedule();
    }
  } else {
    settleFrames = 0;
  }
}

function schedule(): void {
  if (rafId !== null || listeners.size === 0) return;
  rafId = requestAnimationFrame(recheck);
}

function onVisibility(): void {
  if (document.visibilityState === 'visible') schedule();
}

/** Only html/body backgrounds feed the detector — ignore the page's other
 *  transitions (hover effects etc. would otherwise schedule noise). */
function onTransitionEnd(e: Event): void {
  if (e.target === document.documentElement || e.target === document.body) schedule();
}

function start(): void {
  const painted = paintedBackground(document);
  cached = luminance(painted) < 0.4 ? 'dark' : 'light';
  lastPaint = paintKey(painted);
  settleFrames = 0;
  observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, { attributes: true });
  // Content scripts run at document_idle so body exists; guarded anyway.
  if (document.body) observer.observe(document.body, { attributes: true });
  media = window.matchMedia?.('(prefers-color-scheme: dark)') ?? null;
  media?.addEventListener?.('change', schedule);
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('transitionend', onTransitionEnd, { capture: true, passive: true });
}

function stop(): void {
  observer?.disconnect();
  observer = null;
  media?.removeEventListener?.('change', schedule);
  media = null;
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
  document.removeEventListener('visibilitychange', onVisibility);
  document.removeEventListener('transitionend', onTransitionEnd, { capture: true });
  cached = null;
}

/**
 * Subscribe to the host page's painted scheme; the listener fires only when
 * the detected scheme actually changes. Returns an unsubscriber (idempotent).
 */
export function subscribeHostColorScheme(listener: SchemeListener): () => void {
  if (listeners.size === 0) start();
  listeners.add(listener);
  return () => {
    if (!listeners.delete(listener)) return;
    if (listeners.size === 0) stop();
  };
}

/**
 * Current host scheme: the watcher's cache while anyone subscribes (O(1), no
 * style recalc — safe as a useSyncExternalStore snapshot), a fresh sample
 * otherwise.
 */
export function getHostColorScheme(): HostColorScheme {
  return cached ?? detectHostColorScheme();
}
