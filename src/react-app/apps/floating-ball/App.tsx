/**
 * @module react-app/apps/floating-ball
 *
 * 悬浮翻译球 — a draggable launcher pinned to the page edge that toggles
 * whole-page translation, plus a compact control panel (target language, 译文
 * style preset, translate/undo). Lives in the shared shadow surface (mounted
 * alongside SelectionApp by `entrypoints/float-ui.content`), so its styles are
 * fully isolated from the host page.
 *
 * It does NOT own translation state: clicking 翻译此页 only REQUESTS a state over
 * the in-page bridge; the single owner (`entrypoints/page-translate.content`) runs the
 * PageTranslator and broadcasts state back, which we render. See
 * `core/page-translation-bridge`.
 *
 * The control renders inside the shared shadow surface with isolated styles and
 * filters. State changes are communicated via the in-page messaging bridge.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  CloseButton,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { storage } from '#imports';
import { sendMessage } from '@/core/messaging';
import {
  onPageTranslationState,
  requestPageTranslationState,
  requestSetPageTranslation,
} from '@/core/page-translation-bridge';
import { GearIcon } from '@/react-app/components/icons';
import StylePreview from '@/react-app/components/settings/StylePreview';
import { usePublicConfig } from '@/react-app/hooks/usePublicConfig';
import { PROJECT_PREFIX, Z_INDEX } from '@/constants';
import { langOptions, pairGlyphs, type DisplayMode } from '@/data/models';
import { PRESET_ACCENT } from '@/dom/inject/styles';
import { syncUiLocaleFrom } from '@/i18n';
import { m } from '@/paraglide/messages.js';
import { getConfigService, type PublicConfig, type PublicConfigPatch } from '@/services/config/public';
import { isSiteEnabled, resolveSiteMode, setSiteMode } from '@/services/config/site-control';
import { BALL, clamp, MARGIN, placeToPos, snapPlacement, tuckOffset, type BallPlacement, type HoldReason } from './geometry';
import { useTuck } from './use-tuck';

const PANEL_W = 288;
const DRAG_THRESHOLD = 4; // px of movement that cancels a pending click/long-press
const LONG_PRESS_MS = 350; // hold this long (without moving) to enter drag mode
const GLASS_BLUR = 'blur(20px) saturate(180%)'; // frosted vibrancy

/**
 * Scheme-adaptive glass palette. The DISC stays a neutral lens over the host
 * page (it defers by design), but the opened PANEL is OUR instrument — it
 * speaks the manuscript palette: frosted PAPER, warm ink, 朱 accents. Values
 * mirror theme.other (paper/paperRaised/ink/inkSoft — hand-mirrored: this
 * component is deliberately token-inlined for the lean glass math).
 */
interface Glass {
  ring: string;
  ink: string;
  inkDim: string;
  inkFaint: string;
  panelBg: string;
  shadow: string;
}

const LIGHT_GLASS: Glass = {
  ring: 'rgba(33,28,21,0.12)', // hair (warm ink)
  ink: '#211C15', // ink
  inkDim: '#5C5348', // ink-soft
  inkFaint: '#74695B', // sand.6 — ≥4.5:1 on frosted paper
  panelBg: 'rgba(255,253,248,0.82)', // paper-raised, frosted
  shadow: '0 1px 2px rgba(33,28,21,.06), 0 16px 40px -12px rgba(33,28,21,.26)',
};

const DARK_GLASS: Glass = {
  ring: 'rgba(236,228,214,0.15)',
  ink: '#ECE4D6',
  inkDim: '#B3A893',
  inkFaint: '#93897A',
  panelBg: 'rgba(22,19,14,0.80)', // warm charcoal, frosted
  shadow: '0 2px 4px rgba(0,0,0,.4), 0 16px 40px -12px rgba(0,0,0,.6)',
};

/**
 * 印蜕 palette: OFF = ink-wash grey (蘸墨待命), ON = seal-paste cinnabar
 * (染朱工作). Absolute colours on purpose — a stamped seal is an OBJECT laid
 * on the page, not themed chrome; it does not follow the host colour scheme.
 */
const SEAL_INK = '#78736A';
const SEAL_ZHU = '#A8241C';
const SEAL_FACE = '#FAF6ED'; // 白文 — paper-white carving on the solid pad
const SEAL_RADIUS = 8;
const SEAL_PAD_INSET = 3.5;

/** Ids for defs that render INSIDE our shadow surface — url(#id) resolves per
 *  tree scope, so a host-body def would silently not apply (probe-verified). */
const SEAL_FILTER = `${PROJECT_PREFIX}-seal-rough`;
const SEAL_PRESS = `${PROJECT_PREFIX}-seal-press`;
const SUB_STAMP = `${PROJECT_PREFIX}-sub-stamp`;
const SEAL_FILTER_SM = `${PROJECT_PREFIX}-seal-rough-sm`;
const SEAL_FILTER_FRAME = `${PROJECT_PREFIX}-seal-rough-frame`;

/** The any-source mark — a globe on the 24px icon grid, filled, currentColor. */
const GLOBE_PATH =
  'M9.206 3.182A9.25 9.25 0 0 0 2.78 11.25h4.48c.033-1.096.135-2.176.305-3.2c.207-1.254.515-2.41.91-3.4a9.3 9.3 0 0 1 .731-1.468M12 1.25a10.75 10.75 0 1 0 0 21.5a10.75 10.75 0 0 0 0-21.5m0 1.5c-.261 0-.599.126-.991.532c-.396.41-.791 1.051-1.141 1.925c-.347.869-.63 1.917-.824 3.089c-.155.94-.25 1.937-.282 2.954h6.476a22.5 22.5 0 0 0-.282-2.954c-.194-1.172-.477-2.22-.824-3.089c-.35-.874-.745-1.515-1.14-1.925c-.393-.406-.73-.532-.992-.532m4.74 8.5a24 24 0 0 0-.305-3.2c-.207-1.254-.515-2.41-.91-3.4a9.3 9.3 0 0 0-.732-1.468a9.24 9.24 0 0 1 3.748 2.277a9.25 9.25 0 0 1 2.678 5.791zm-1.502 1.5H8.762c.031 1.017.127 2.014.282 2.954c.194 1.172.477 2.22.824 3.089c.35.874.745 1.515 1.14 1.925c.393.406.73.532.992.532c.261 0 .599-.126.991-.532c.396-.41.791-1.051 1.141-1.925c.347-.869.63-1.917.824-3.089c.155-.94.25-1.937.282-2.954m-.444 8.068c.27-.434.515-.929.73-1.468c.396-.99.704-2.146.911-3.4a24 24 0 0 0 .304-3.2h4.48a9.25 9.25 0 0 1-6.426 8.068m-5.588 0a9.3 9.3 0 0 1-.73-1.468c-.396-.99-.704-2.146-.911-3.4a24 24 0 0 1-.304-3.2H2.78a9.25 9.25 0 0 0 6.425 8.068';

/** The seal face cuts CJK in KAITI FIRST — the approved spec's letterforms.
 *  (KAI_FONT_STACK is the 译文 stack and puts LXGW WenKai first; on machines
 *  that have it, the seal would drift from the approved look.) Latin letters
 *  are cut in a serif; other scripts fall through the stack's tail cleanly. */
const SEAL_KAI = '"Kaiti SC", "STKaiti", "Kaiti", "LXGW WenKai", serif';
const glyphFont = (ch: string) =>
  /^[A-Za-z]/.test(ch) ? 'Georgia, "Times New Roman", serif' : SEAL_KAI;

/** The sub seal's settings mark — mosaic blocks on the 512 grid, filled,
 *  currentColor (rides the same carve filter as the seal body). */
const SETTINGS_PATH =
  'M36.571 475.429h73.143V365.714H36.571zM109.714 36.57H36.571v182.86h73.143zm182.857 0H219.43v73.143h73.142zM0 329.143h146.286V256H0zm219.429 146.286h73.142V256H219.43zm-36.572-256h146.286v-73.143H182.857zM475.43 36.57h-73.143V256h73.143zm-109.715 256v73.143H512V292.57zm36.572 182.858h73.143v-73.143h-73.143z';

const placementStore = storage.defineItem<BallPlacement>(`local:${PROJECT_PREFIX}:ball-placement`, {
  fallback: { side: 'right', topRatio: 0.82 },
});

const TARGET_OPTIONS = langOptions();

export default function FloatingBallApp() {
  const theme = useMantineTheme();
  const scheme = useComputedColorScheme('light');
  const g = scheme === 'dark' ? DARK_GLASS : LIGHT_GLASS;

  // Viewport size for placement math — visualViewport, NOT window.inner*:
  // classic scrollbars (Windows, macOS "always show") live inside innerWidth
  // but OUTSIDE the fixed-position containing block. Sized by inner*, the
  // ball loses its edge margin to the scrollbar and the tucked half gets
  // swallowed down to a sliver. visualViewport excludes the scrollbar gutter
  // on whichever edge it sits (RTL included), stays on `window` (no host
  // document access), and emits its own resize when a scrollbar APPEARS
  // (content growth) — which window resize never reports.
  const vpSize = () => ({
    w: window.visualViewport?.width ?? window.innerWidth,
    h: window.visualViewport?.height ?? window.innerHeight,
  });
  const [vp, setVp] = useState(vpSize);
  const [placement, setPlacement] = useState<BallPlacement>({ side: 'right', topRatio: 0.82 });
  const [pos, setPos] = useState(() => {
    const { w, h } = vpSize();
    return { x: w - BALL - MARGIN, y: h * 0.82 };
  });
  const [dragging, setDragging] = useState(false);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(false);
  // 半隐:印静置时滑进页缘半个身位。focusHold 让键盘焦点等同 hover。
  // `entered` gates a one-shot entrance: first paint sits fully beyond the
  // edge, then slides in half a body (skipped under prefers-reduced-motion:
  // born at rest instead).
  const [entered, setEntered] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [focusHold, setFocusHold] = useState(false);
  const [subHover, setSubHover] = useState(false);
  // 钤印: the press plays when translation turns ON (set from the state
  // subscription below — any trigger, panel button or future direct click).
  const [stamping, setStamping] = useState(false);

  // The hold list IS the tuck policy: every reason the seal must stay out,
  // derived fresh each render. Adding a hold = one line here (plus its
  // HoldReason member) — the scheduler lives in useTuck and never changes.
  const holds: HoldReason[] = [];
  if (hover || focusHold) holds.push('pointer');
  if (open) holds.push('panel');
  if (dragging) holds.push('drag');
  if (stamping) holds.push('stamp');
  const { tucked, reveal, linger } = useTuck(holds);

  // Only KEYBOARD focus pins the seal out (:focus-visible heuristic). A
  // pointer click also focuses the button — without this gate, focus stuck
  // after every click and the seal never tucked until the user clicked
  // elsewhere on the page.
  const onSealFocus = (e: React.FocusEvent) => {
    let keyboard = true;
    try {
      keyboard = (e.target as Element).matches(':focus-visible');
    } catch {
      /* happy-dom: no :focus-visible — treat as keyboard, tests act quickly */
    }
    if (keyboard) {
      setFocusHold(true);
      reveal();
    }
  };
  const [config, setConfigState] = usePublicConfig();

  /** Press state machine: 'pressed' (click pending, long-press timer armed) →
   *  'drag' (timer fired: ball follows pointer) | 'cancelled' (moved too far
   *  before the timer — neither click nor drag). */
  const press = useRef<{ dx: number; dy: number; startX: number; startY: number; mode: 'pressed' | 'drag' | 'cancelled' } | null>(null);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load the persisted placement once.
  useEffect(() => {
    let alive = true;
    void placementStore.getValue().then((p) => {
      if (!alive) return;
      setPlacement(p);
      const { w, h } = vpSize();
      setPos(placeToPos(p, w, h));
      // Entrance AFTER the persisted side is known (sliding in from the wrong
      // edge would be worse than no entrance). rAF: let the fully-hidden
      // position paint once so the transition has a start frame.
      requestAnimationFrame(() => {
        if (alive) setEntered(true);
      });
    });
    return () => {
      alive = false;
    };
  }, []);

  const prevActive = useRef(active);
  const stampBackstop = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mirror the owner's translation state; ask for it once on mount. State
  // CHANGES also drive the seal's theatre from right here (an event callback,
  // not an effect — the lint bans sync setState inside effects): float out,
  // hold the linger window, and stamp when turning on.
  useEffect(() => {
    const off = onPageTranslationState((next) => {
      if (next !== prevActive.current) {
        linger(); // both directions: 墨↔朱 must be seen
        if (next && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          setStamping(true);
          // Backstop: backgrounded tabs PAUSE CSS animations, so animationend
          // may never fire (session restore translates background tabs) — a
          // stuck `stamping` would hold the seal out forever. Whichever of
          // onAnimationEnd / this timer lands first wins; double-clear is a
          // no-op. Background timer throttling (~1s) is still fine. The timer
          // is TRACKED so a rapid off→on within 600ms can't let round one's
          // backstop chop round two's press mid-animation.
          if (stampBackstop.current) clearTimeout(stampBackstop.current);
          stampBackstop.current = setTimeout(() => setStamping(false), 600);
        }
      }
      prevActive.current = next;
      setActive(next);
    });
    requestPageTranslationState();
    return off;
    // `linger` is a stable useCallback — listed only to satisfy the lint; the
    // subscription must still run exactly once on mount.
  }, [linger]);

  /** The app's root box — used to tell "inside our surface" from a host-page click. */
  const rootRef = useRef<HTMLDivElement>(null);

  // Light dismissal, like any floating menu: a pointerdown OUTSIDE our shadow
  // surface (host page) or Escape closes the open panel. Judged by
  // composedPath() CONTAINING our shadow root — that also covers the Select /
  // style-picker dropdowns, which render in a portal inside the same surface
  // (an attribute check on the panel subtree would misread those as outside
  // and close the panel mid-pick). Capture phase, so a host page calling
  // stopPropagation() on bubbled clicks can't pin the panel open.
  useEffect(() => {
    if (!open) return;
    const root = rootRef.current;
    const surface = root?.getRootNode();
    const onPointerDown = (e: PointerEvent) => {
      const path = e.composedPath();
      // Inside = our own subtree, or anywhere in our shadow surface (portals).
      // The ShadowRoot check is skipped when mounted straight into a document
      // (unit tests) — there "the whole document" would swallow every click.
      if (root && path.includes(root)) return;
      if (surface instanceof ShadowRoot && path.includes(surface)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  // Re-anchor to the snapped edge on viewport resize.
  useEffect(() => {
    const onResize = () => {
      const { w, h } = vpSize();
      setVp({ w, h });
      // Mid-drag, the ball follows the pointer (not yet snapped) — don't yank it
      // back to the committed edge anchor until the drag ends.
      if (press.current?.mode === 'drag') return;
      setPos(placeToPos(placement, w, h));
    };
    window.addEventListener('resize', onResize);
    window.visualViewport?.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.visualViewport?.removeEventListener('resize', onResize);
    };
  }, [placement]);

  // ── Drag: pointer-capture so it survives leaving the disc; a small threshold
  //    distinguishes a drag from a click (which toggles the panel). ──
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    // Tucked = the press only REVEALS: no drag, no click action. This one rule
    // is also the touch story (first tap wakes, second tap acts) — and it
    // prevents a drag starting 37px off from under the finger.
    if (tucked) {
      linger(); // touch has no hover to hold it out
      return;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    press.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y, startX: e.clientX, startY: e.clientY, mode: 'pressed' };
    // LONG-PRESS enters drag mode (the seal is a BUTTON — cursor stays a
    // pointer until then). Held still past the timer → the ball is picked up.
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => {
      if (press.current?.mode !== 'pressed') return;
      press.current.mode = 'drag';
      setDragging(true);
      setOpen(false); // don't drag a ball with its panel hanging off it
    }, LONG_PRESS_MS);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = press.current;
    if (!d) return;
    if (d.mode === 'pressed') {
      // Wandering before the long-press fires is neither a click nor a drag.
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > DRAG_THRESHOLD) {
        d.mode = 'cancelled';
        if (pressTimer.current) clearTimeout(pressTimer.current);
      }
      return;
    }
    if (d.mode !== 'drag') return;
    setPos({
      x: clamp(e.clientX - d.dx, MARGIN, vp.w - BALL - MARGIN),
      y: clamp(e.clientY - d.dy, MARGIN, vp.h - BALL - MARGIN),
    });
  };

  const onPointerUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    const d = press.current;
    press.current = null;
    if (!d) return;
    if (d.mode === 'pressed') {
      // A click (released before the long-press) STAMPS: page translation
      // toggles directly — the highest-frequency action lives at zero depth.
      // The panel moved to the 押脚 sub seal below.
      requestSetPageTranslation(!active);
      return;
    }
    if (d.mode !== 'drag') return;
    setDragging(false);
    // Snap to the nearer vertical edge; persist edge + fraction.
    const next = snapPlacement(pos.x, pos.y, vp.w, vp.h);
    setPlacement(next);
    setPos(placeToPos(next, vp.w, vp.h));
    void placementStore.setValue(next);
  };

  // A drag interrupted by `pointercancel` / lost capture (touch gesture, OS
  // takeover, context menu) never fires `pointerup` — clear the drag state so
  // the ball doesn't stick in its grabbing pose. Snapping is skipped: the ball
  // simply stays where it is, re-anchoring on the next resize/reload.
  const onPointerCancel = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    if (!press.current) return;
    press.current = null;
    setDragging(false);
  };

  // The newest config, readable imperatively — the patch below is diffed and
  // SENT from here, never from inside a setState updater. React is free to
  // defer an updater to the render phase (it only evaluates one eagerly while
  // the fiber has no pending update), so a write issued in there resolves
  // after patchConfig already returned: patchAndReapply would re-translate the
  // page against the config it just replaced.
  const configRef = useRef(config);
  useEffect(() => {
    configRef.current = config;
  });

  const patchConfig = useCallback(
    (mut: (c: PublicConfig) => PublicConfigPatch): Promise<void> => {
      const prev = configRef.current;
      if (!prev) return Promise.resolve();
      // Send ONLY the section the click actually changed — shipping every
      // section from the ball's snapshot would widen the cross-surface
      // last-writer-wins window to settings it never touched. The gateway
      // merges it into the full config (providers stay out of reach) and
      // re-mirrors, which echoes back through watchPublicConfig.
      const patch = mut(prev);
      // Two patches inside one tick would both diff the pre-click snapshot —
      // the render that refreshes the ref hasn't happened yet.
      configRef.current = { ...prev, ...patch };
      setConfigState((cur) => (cur ? { ...cur, ...patch } : cur));
      return getConfigService().patch(patch);
      // setConfigState is a useState setter (stable) — listed only because the
      // lint can't see through the usePublicConfig tuple.
    },
    [setConfigState]
  );

  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  });

  /**
   * Settings apply LIVE: with the page already translated, changing 译入/样式
   * re-runs the translation with the new values — the action button stays a
   * pure on/off toggle instead of doubling as a hidden "apply settings".
   * Sequenced after the patch resolves (the gateway mirrors before resolving,
   * so the owner's re-read sees the new values).
   */
  const patchAndReapply = useCallback(
    (mut: (c: PublicConfig) => PublicConfigPatch) => {
      void patchConfig(mut).then(() => {
        if (activeRef.current) requestSetPageTranslation(true);
      });
    },
    [patchConfig]
  );

  // Defer to site control: on a `never` site translation is forbidden even
  // manually, so the launcher has nothing to offer — hide it entirely. (Until
  // config resolves we optimistically show it; a `never` site then hides it.)
  const siteEnabled = config ? isSiteEnabled(config.siteControl, location.hostname) : true;

  const target = config?.translate.target ?? 'zh-CN';
  const pair = pairGlyphs(config?.translate.source ?? 'auto', target);
  // The UI speaks the language its user READS; an optimistic target patch
  // reflips it instantly. Synced before the JSX below evaluates any m.*() —
  // including StylePreview's.
  syncUiLocaleFrom(config);
  const style = config?.appearance.bilingualStyle ?? 'blend';
  const alwaysOn = config ? resolveSiteMode(config.siteControl, location.hostname) === 'always' : false;
  // Derived in the background mirror — content never sees the providers array.
  const providerLabel = config?.defaultProviderLabel || '\u2014'; // em dash — no dev placeholder in user-facing UI

  // Panel opens toward viewport centre so it never spills off-screen.
  const onRight = placement.side === 'right';
  const openUp = pos.y + BALL / 2 > vp.h / 2;
  // The sub seal sits BELOW by default; it flips above only when the space
  // under the ball can't fit it (gap 7 + seal 22 + a little breathing room).
  const subAbove = vp.h - pos.y - BALL < 33;
  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    width: PANEL_W,
    ...(openUp ? { bottom: BALL + 12 } : { top: BALL + 12 }),
    ...(onRight ? { right: 0 } : { left: 0 }),
  };

  // Ball = 印蜕: state picks the material (蘸墨 / 染朱).
  const seal = active ? SEAL_ZHU : SEAL_INK;

  if (!siteEnabled) return null;

  return (
    <Box
      ref={rootRef}
      // Tagged so SelectionApp treats this as our own UI and ignores its clicks.
      data-omni-selection-ui=""
      onPointerEnter={() => {
        setHover(true);
        reveal();
      }}
      onPointerLeave={() => setHover(false)}
      style={{
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: BALL,
        height: BALL,
        zIndex: Z_INDEX.mainUi,
        userSelect: 'none',
        touchAction: 'none',
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Invisible hit strip: tucked, only ~17px of seal stays visible — this
          widens the hover zone 12px into the page (and 10px vertically) so the
          half-hidden seal is easy to catch, AND stretches outward to the very
          viewport edge: a pointer resting in the seal↔edge gap must still
          count as hovering, or the tuck starts and the sliding seal re-enters
          the pointer mid-animation — an oscillation loop.

          It is mounted ONLY while it has that job to do. Left permanent it sat
          over the host page in every state, eating clicks in a band around a
          fully-visible 34px seal — an unprompted piece of our UI covering
          someone else's page, which is the one thing this product does not do.
          `hover` keeps it alive through the reveal: unmounting it out from
          under the pointer would fire pointerleave and restart the very
          oscillation it exists to prevent. */}
      {(tucked || hover) && (
        <Box
          data-omni-hit-strip=""
          style={{
            position: 'absolute',
            top: -10,
            bottom: -10,
            ...(placement.side === 'right' ? { left: -12, right: -MARGIN } : { right: -12, left: -MARGIN }),
          }}
        />
      )}
      {open && config && (
        <Paper
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            ...panelStyle,
            background: g.panelBg,
            backdropFilter: GLASS_BLUR,
            WebkitBackdropFilter: GLASS_BLUR,
            border: `1px solid ${g.ring}`,
            borderRadius: 16,
            boxShadow: g.shadow,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Group justify="space-between" align="center" px="md" pt="sm" pb={6}>
            <Text style={{ fontSize: 15, fontWeight: 600, color: g.ink, letterSpacing: '-0.01em' }}>
              {m.ball_panel_title()}
            </Text>
            <CloseButton onClick={() => setOpen(false)} size="sm" aria-label={m.ball_close_panel()} c={g.inkDim} />
          </Group>
          <Stack gap="xs" px="md" pb="md">
            {/* Card 1: 阅读视图 (Reading View) */}
            <Box
              p={10}
              style={{
                borderRadius: 10,
                backgroundColor: scheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 253, 248, 0.65)',
                border: `1px solid ${g.ring}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              {/* Target language */}
              <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <Text size="xs" fw={600} style={{ color: g.inkDim }}>
                  {m.ball_target()}
                </Text>
                <Select
                  variant="unstyled"
                  data={TARGET_OPTIONS}
                  value={target}
                  onChange={(v) => v && patchAndReapply((c) => ({ translate: { ...c.translate, target: v } }))}
                  allowDeselect={false}
                  size="xs"
                  w={140}
                  comboboxProps={{ withinPortal: true }}
                  styles={{
                    input: { textAlign: 'right', color: g.ink, fontWeight: 500, paddingRight: 24, fontSize: 12 },
                    section: { color: g.inkFaint, width: 18, justifyContent: 'flex-end' },
                  }}
                />
              </Box>

              {/* Three-state view (双语/仅译文/仅原文) */}
              <Box style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Text size="xs" fw={600} style={{ color: g.inkDim }}>
                  {m.display_label()}
                </Text>
                <SegmentedControl
                  size="xs"
                  fullWidth
                  data={[
                    { value: 'bilingual', label: m.display_bilingual() },
                    { value: 'translation', label: m.display_translation() },
                    { value: 'original', label: m.display_original() },
                  ]}
                  value={config.appearance.displayMode ?? 'bilingual'}
                  onChange={(v) =>
                    patchConfig((c) => ({ appearance: { ...c.appearance, displayMode: v as DisplayMode } }))
                  }
                  styles={{
                    root: { background: scheme === 'dark' ? 'rgba(0,0,0,0.28)' : 'rgba(33,28,21,0.07)' },
                  }}
                />
              </Box>

              {/* 逐段对照 */}
              {(config.appearance.displayMode ?? 'bilingual') === 'bilingual' && (
                <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 2 }}>
                  <Text size="xs" style={{ color: g.inkDim }}>
                    {m.interleave_label()}
                  </Text>
                  <Switch
                    size="xs"
                    color="cinnabar"
                    checked={config.appearance.paragraphInterleave ?? true}
                    onChange={(e) => {
                      const on = e.currentTarget.checked;
                      patchAndReapply((c) => ({ appearance: { ...c.appearance, paragraphInterleave: on } }));
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Card 2: 译文样式 (Translation Style) */}
            <Box
              p={10}
              style={{
                borderRadius: 10,
                backgroundColor: scheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 253, 248, 0.65)',
                border: `1px solid ${g.ring}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <Text size="xs" fw={600} style={{ color: g.inkDim }}>
                {m.ball_style()}
              </Text>
              <StylePreview
                value={style}
                onChange={(v) => patchAndReapply((c) => ({ appearance: { ...c.appearance, bilingualStyle: v } }))}
                font={config.appearance.translationFont}
                compact
                palette={{
                  gloss: g.ink,
                  inkFaint: g.inkFaint,
                  hair: g.ring,
                  paper: scheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.55)',
                  accent: PRESET_ACCENT,
                }}
              />
            </Box>

            {/* Card 3: 站点规则 (Site Rules) */}
            <Box
              p={10}
              style={{
                borderRadius: 10,
                backgroundColor: scheme === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 253, 248, 0.65)',
                border: `1px solid ${g.ring}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <Box style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Text size="xs" fw={600} style={{ color: g.inkDim }}>
                  {m.ball_always_site()}
                </Text>
                <Text
                  size="10px"
                  c="dimmed"
                  style={{
                    fontFamily: theme.fontFamilyMonospace,
                    maxWidth: 150,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {location.hostname}
                </Text>
              </Box>
              <Switch
                size="xs"
                color="cinnabar"
                checked={alwaysOn}
                onChange={(e) =>
                  patchConfig((c) => ({
                    siteControl: setSiteMode(
                      c.siteControl,
                      location.hostname,
                      e.currentTarget.checked ? 'always' : null
                    ),
                  }))
                }
              />
            </Box>

            {/* Bottom Action button */}
            <Box pt={4}>
              <Button
                fullWidth
                radius="md"
                variant={active ? 'light' : 'filled'}
                color="cinnabar"
                size="sm"
                onClick={() => requestSetPageTranslation(!active)}
                style={{
                  fontWeight: 600,
                  boxShadow: active ? 'none' : '0 2px 8px rgba(194, 64, 42, 0.35)',
                  transition: 'all 0.2s ease',
                }}
              >
                {active ? m.ball_action_restore() : m.ball_action_translate()}
              </Button>
            </Box>
          </Stack>

          {/* Footer */}
          <Box
            style={{
              padding: '8px 14px',
              borderTop: `1px solid ${g.ring}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: theme.fontFamilyMonospace,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: g.inkDim,
              }}
            >
              {providerLabel}
            </Text>
            <UnstyledButton
              onClick={() => void sendMessage('openOptionsPage', undefined)}
              aria-label={m.popup_open_settings()}
              style={{
                fontSize: 11,
                color: 'var(--mantine-color-cinnabar-6)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <GearIcon width={11} height={11} />
              {m.popup_settings()}
            </UnstyledButton>
          </Box>
        </Paper>
      )}

      {/* Static defs for the seal, INSIDE the shadow surface (tree-scoped
          url(#id) resolution) + the press keyframes. Low-frequency single-
          octave turbulence: continuous carved wobble, not grainy fuzz. */}
      <svg width={0} height={0} style={{ position: 'absolute' }} aria-hidden="true">
        <filter id={SEAL_FILTER} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves={1} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.8} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* 边框专属:用频率换幅度。满幅(1.8)置换会被某些 Chromium 栅格化
            路径把 1.5px 细环掰碎(ego lite 实测);单纯降幅到 1.0 又让长波
            (0.05≈20px 波长)上的弯完全不可见。改高频双 octave + 幅度压在
            环厚之内:起伏数量翻倍补回手刻随机感,幅度 1.25 < 1.5 物理上
            断不了环。 */}
        <filter id={SEAL_FILTER_FRAME} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.095" numOctaves={2} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.25} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* 小印专属:0.05 的波长(~20px)在 22px 元素上近乎恒值 — 边只被平移
            不起伏。频率提高 + 双 octave 才在小尺寸上显出同等的手刻歪扭。 */}
        <filter id={SEAL_FILTER_SM} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.085" numOctaves={2} seed={23} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      {/* Press animation uses the INDEPENDENT `scale` property: a keyframed
          `transform` would hijack the whole property and clobber positional
          transforms (the tuck offset rides `transform`). Rigid stone: fast
          ease-in press, exponential ease-out release, no elastic overshoot. */}
      <style>{`@keyframes ${SEAL_PRESS}{0%{scale:1;animation-timing-function:cubic-bezier(.55,0,.7,.4)}40%{scale:.9;animation-timing-function:cubic-bezier(.16,1,.3,1)}100%{scale:1}}
@keyframes ${SUB_STAMP}{0%{opacity:0;scale:1.35;animation-timing-function:cubic-bezier(.5,0,.75,.35)}45%{opacity:1;scale:.96;animation-timing-function:cubic-bezier(.3,1,.36,1)}100%{opacity:1;scale:1}}
@keyframes sealAura{0%{transform:scale(0.96);opacity:0.35}100%{transform:scale(1.06);opacity:0.85}}`}</style>

      {/* The control — a stamped seal (印蜕): carved frame, gap, solid pad.
          Ink-grey at rest, seal-paste cinnabar when the page is translated. */}
      <UnstyledButton
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onFocus={onSealFocus}
        onBlur={() => setFocusHold(false)}
        onAnimationEnd={() => setStamping(false)}
        // KEYBOARD activation: Enter/Space on a <button> fires a synthetic
        // click (detail === 0) and NO pointer events.
        onClick={(e) => {
          if (e.detail !== 0) return;
          if (tucked) {
            linger();
            return;
          }
          requestSetPageTranslation(!active);
        }}
        aria-label={active ? m.ball_action_restore() : m.ball_action_translate()}
        aria-pressed={active}
        title={active ? m.ball_active_title() : m.ball_action_translate()}
        style={{
          position: 'relative',
          width: BALL,
          height: BALL,
          display: 'block',
          cursor: dragging ? 'grabbing' : 'pointer',
          filter: 'drop-shadow(0 1.5px 3px rgba(33, 28, 21, 0.25))',
          transform: dragging
            ? 'scale(0.95)'
            : tucked
              ? `translateX(${
                  entered
                    ? tuckOffset(
                        placement.side,
                        placement.side === 'right' ? Math.max(0, window.innerWidth - vp.w) : 0
                      )
                    : (placement.side === 'right' ? 1 : -1) * (MARGIN + BALL)
                }px)`
              : hover || focusHold
                ? 'translateY(-1.5px)'
                : undefined,
          transition: tucked
            ? 'transform 440ms cubic-bezier(0.2, 0, 0, 1)'
            : 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1)',
          animation: stamping ? `${SEAL_PRESS} 280ms` : undefined,
        }}
      >
        {/* aura — subtle breathing cinnabar glow when active */}
        {active && (
          <Box
            style={{
              position: 'absolute',
              inset: -2.5,
              borderRadius: SEAL_RADIUS + 2,
              border: '1.5px solid var(--mantine-color-cinnabar-5)',
              animation: 'sealAura 2s ease-in-out infinite alternate',
              pointerEvents: 'none',
            }}
          />
        )}
        {/* frame — 1.5px carved border */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            border: `1.5px solid ${seal}`,
            borderRadius: SEAL_RADIUS,
            filter: `url(#${SEAL_FILTER_FRAME})`,
            transition: 'border-color 240ms ease',
            pointerEvents: 'none',
          }}
        />
        {/* pad — the solid impression, 2px of paper showing between it and the frame */}
        <Box
          style={{
            position: 'absolute',
            inset: SEAL_PAD_INSET,
            background: seal,
            borderRadius: 4,
            filter: `url(#${SEAL_FILTER})`,
            transition: 'background 240ms ease',
            pointerEvents: 'none',
          }}
        />
        {/* face — the language direction: source top-left (globe = any),
            target bottom-right (dominant), two 界格 corner strokes filling the
            empty diagonal. Filtered like the frame/pad + 0.3px soften — the
            glyphs must read as CARVED, not stickered on (approved-spec
            fidelity; re-evaluate on Windows fallback fonts when we get one). */}
        <Box
          aria-hidden
          style={{
            position: 'absolute',
            inset: SEAL_PAD_INSET,
            zIndex: 1,
            color: SEAL_FACE,
            pointerEvents: 'none',
            filter: `url(#${SEAL_FILTER}) blur(0.3px)`,
            // The surface's global antialiased smoothing thins kai strokes
            // visibly at 13.5px — the approved spec rendered with subpixel
            // (auto). The LAST computed-style delta vs the demo clone.
            WebkitFontSmoothing: 'auto',
          }}
        >
          {pair.src === null ? (
            <svg
              viewBox="0 0 24 24"
              width={11}
              height={11}
              fill="currentColor"
              style={{ position: 'absolute', top: 2.5, left: 3, display: 'block' }}
            >
              <path fillRule="evenodd" clipRule="evenodd" d={GLOBE_PATH} />
            </svg>
          ) : (
            <Text
              span
              style={{ position: 'absolute', top: 3.5, left: 4.5, fontSize: 10.5, lineHeight: 1, fontFamily: glyphFont(pair.src) }}
            >
              {pair.src}
            </Text>
          )}
          <Text
            span
            style={{ position: 'absolute', right: 3.5, bottom: 3, fontSize: 13.5, lineHeight: 1, fontFamily: glyphFont(pair.dst) }}
          >
            {pair.dst}
          </Text>
          <Box
            style={{ position: 'absolute', top: 4.5, right: 4.5, width: 4.5, height: 4.5, borderTop: '1.6px solid currentColor', borderRight: '1.6px solid currentColor' }}
          />
          <Box
            style={{ position: 'absolute', bottom: 4.5, left: 4.5, width: 4.5, height: 4.5, borderBottom: '1.6px solid currentColor', borderLeft: '1.6px solid currentColor' }}
          />
        </Box>
      </UnstyledButton>

      {/* 押脚小印「设」 — the panel entry, revealed with the float-out. Same
          intaglio language as the main seal (solid pad, paper glyph), constant
          cinnabar = "clickable", hierarchy carried by size (34 vs 22). Hidden
          AND untabbable while tucked (a focusable invisible button is a real
          a11y bug); unmounted while the panel is open (the panel occupies its
          spot). Full strength on arrival — hover-revealed controls in muted
          "waiting" states read as disabled. */}
      {!open && (
        <UnstyledButton
          onClick={() => {
            reveal();
            setOpen(true);
            // Opening UNMOUNTS this button; a removed element fires no
            // blur/pointerleave, so both holds would leak stuck-on: focusHold
            // (Tab → Enter → Escape leaves the seal pinned out forever) and
            // subHover (remount shows the pressed-hover colour). Clear here.
            setFocusHold(false);
            setSubHover(false);
          }}
          onPointerEnter={() => setSubHover(true)}
          onPointerLeave={() => setSubHover(false)}
          onFocus={onSealFocus}
          onBlur={() => setFocusHold(false)}
          aria-label={m.ball_open_panel()}
          title={m.ball_open_panel()}
          tabIndex={tucked ? -1 : 0}
          style={{
            position: 'absolute',
            left: (BALL - 22) / 2,
            ...(subAbove ? { bottom: BALL + 7 } : { top: BALL + 7 }),
            width: 22,
            height: 22,
            borderRadius: 5,
            display: 'grid',
            placeItems: 'center',
            background: subHover ? '#8E1D14' : SEAL_ZHU,
            color: SEAL_FACE,
            filter: `url(#${SEAL_FILTER_SM}) drop-shadow(0 1px 2px rgba(33, 28, 21, 0.22))`,
            visibility: tucked ? 'hidden' : 'visible',
            opacity: tucked ? 0 : 1,
            transform: subHover ? 'translateY(-1px)' : undefined,
            // 落印 entrance: once the main seal visually settles (165ms into
            // its 260ms sheet-spring slide), the 押脚 is pressed onto the
            // paper from above — 1.35× soft ease-in fall, 0.96 press, then a
            // settle LONGER than the fall (108ms down, 132ms easing out) —
            // the Apple comfort: land early, sit down slowly. Independent
            // `scale`/`opacity` so hover's translateY and the tuck translateX
            // are never clobbered. `backwards` fill keeps it invisible through
            // the delay. Reveals only happen from foreground interaction, so
            // paused-animation background tabs can't strand it; no state rides
            // on animationend.
            animation:
              !tucked && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
                ? `${SUB_STAMP} 240ms 165ms backwards`
                : undefined,
            // Visibility flips WITHOUT a transition: delayed-visibility tricks
            // stall in backgrounded tabs (paused transitions never finish),
            // leaving a hidden-but-visible button.
            transition: tucked ? 'opacity 140ms ease' : 'background 160ms ease, transform 160ms ease',
          }}
        >
          <svg viewBox="0 0 512 512" width={12} height={12} fill="currentColor" style={{ display: 'block' }} aria-hidden="true">
            <path d={SETTINGS_PATH} />
          </svg>
        </UnstyledButton>
      )}
    </Box>
  );
}
