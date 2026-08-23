/**
 * @module dom/input/indicator
 *
 * The transient hint shown next to an editable while its text is being
 * translated in place, the brief "撤销" affordance offered afterwards, and a
 * short-lived failure notice (input translation must never fail silently, but
 * must not interrupt typing either).
 *
 * Unlike page-translation gloss (which lives in the host DOM and inherits its
 * styles), this is a floating overlay — so it speaks OUR manuscript language:
 * paper-raised ground, warm ink, kai label, 朱 petal spinner. It follows the
 * HOST page's painted scheme (not the OS): a dark pill over a light page reads
 * as a glitch. Renders inside its own shadow root on a single
 * `<aie-omt-input-hint>` element, fully isolated and self-removing.
 *
 * It never steals focus: the spinner/fail phases are `pointer-events: none`,
 * and the undo affordance only takes a click after the edit is committed.
 */

import { PROJECT_PREFIX, Z_INDEX } from '@/constants';
import { getHostColorScheme, subscribeHostColorScheme } from '@/dom/host-scheme';
import { buildPetalCss, createPetalSpinner } from '@/dom/inject/petal-loader';
import { m } from '@/paraglide/messages.js';

const HINT_TAG = `${PROJECT_PREFIX}-input-hint`;
const SPINNER_CLASS = `${PROJECT_PREFIX}-input-hint-spinner`;
const UNDO_MS = 4500; // how long the 撤销 affordance lingers
const FAIL_MS = 1600; // failure notice: long enough to read, gone before it nags

/** Place the host element just under an editable's bounding box (viewport-fixed). */
function positionUnder(host: HTMLElement, anchor: Element): void {
  const r = anchor.getBoundingClientRect();
  host.style.left = `${Math.round(r.left)}px`;
  host.style.top = `${Math.round(Math.min(r.bottom + 6, window.innerHeight - 40))}px`;
}

export class InputHint {
  private host: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private offScroll: (() => void) | null = null;
  private offScheme: (() => void) | null = null;

  /**
   * The pill is viewport-fixed and does NOT track its anchor: after a scroll
   * (a chat box jumping on send, the user reading on) it would float over
   * unrelated content. Terminal states (undo/fail) dismiss on the first
   * scroll instead; the spinner keeps its place (a translation is in flight —
   * losing the indicator would read as a silent failure).
   */
  private dismissOnScroll(): void {
    this.offScroll?.();
    const onScroll = () => this.hide();
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    this.offScroll = () => document.removeEventListener('scroll', onScroll, { capture: true });
  }

  /** Does this event originate inside the hint (the pill's own interactions)? */
  ownsEvent(e: Event): boolean {
    return this.host !== null && e.composedPath().includes(this.host);
  }

  private ensure(anchor: Element): ShadowRoot {
    if (!this.host) {
      const host = document.createElement(HINT_TAG);
      host.style.cssText = `position:fixed;z-index:${Z_INDEX.popover};margin:0;padding:0;border:0;background:none;pointer-events:none`;
      const shadow = host.attachShadow({ mode: 'open' });
      const style = document.createElement('style');
      // Manuscript tokens (theme.other), hand-mirrored: this overlay is
      // deliberately React/Mantine-free to stay in the lean content bundle.
      style.textContent = `
        :host { all: initial; }
        @keyframes pillIn {
          from { opacity: 0; transform: translateY(2px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          font: 12px/1.3 "LXGW WenKai", "Kaiti SC", "Noto Serif SC", serif;
          color: #3A332A; background: rgba(255,253,248,0.96);
          border: 1px solid rgba(33,28,21,0.14); border-radius: 999px;
          padding: 4px 11px; box-shadow: 0 1px 2px rgba(33,28,21,.06), 0 4px 12px -4px rgba(33,28,21,.12);
          white-space: nowrap;
          animation: pillIn 120ms cubic-bezier(0.2, 0, 0, 1);
        }
        :host(.dark) .pill {
          color: #D8CFBE; background: rgba(30,26,20,0.96);
          border-color: rgba(236,228,214,0.16);
          box-shadow: 0 1px 2px rgba(0,0,0,.3), 0 4px 12px -4px rgba(0,0,0,.5);
        }
        .undo { pointer-events: auto; cursor: pointer; }
        .undo:hover, .undo:focus-visible { color: #C2402A; outline: none; }
        :host(.dark) .undo:hover, :host(.dark) .undo:focus-visible { color: #E2614A; }
        .fail { color: #A81D2D; }
        :host(.dark) .fail { color: #E04C5C; }
        .kbd {
          font: 10px/1 "Spline Sans Mono", ui-monospace, monospace;
          opacity: 0.7; letter-spacing: 0.04em;
        }
        .${SPINNER_CLASS} { color: #C2402A; }
        :host(.dark) .${SPINNER_CLASS} { color: #E2614A; }
        ${buildPetalCss(SPINNER_CLASS)}
      `;
      shadow.append(style);
      document.body.appendChild(host);
      this.host = host;
      this.shadow = shadow;
      // Track the host's painted scheme for as long as the pill lives — a
      // spinner can outlive a host theme switch (translation in flight).
      // ONE subscription per host lifetime (started here, not per showing);
      // hide() tears it down with the host.
      this.offScheme = subscribeHostColorScheme((scheme) => this.host?.classList.toggle('dark', scheme === 'dark'));
    }
    // Follow the HOST page's painted scheme, synced per showing (the
    // subscription above only fires on CHANGES while the pill is up).
    this.host.classList.toggle('dark', getHostColorScheme() === 'dark');
    positionUnder(this.host, anchor);
    return this.shadow!;
  }

  private swapPill(anchor: Element): { shadow: ShadowRoot; pill: HTMLSpanElement } {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    // Each state arms its own dismissal — the spinner must not inherit a
    // previous undo pill's scroll listener.
    this.offScroll?.();
    this.offScroll = null;
    const shadow = this.ensure(anchor);
    shadow.querySelector('.pill')?.remove();
    this.host!.style.pointerEvents = 'none';
    const pill = document.createElement('span');
    pill.className = 'pill';
    shadow.append(pill);
    return { shadow, pill };
  }

  /** Show the "翻译中…" spinner pill under `anchor`. */
  spinner(anchor: Element): void {
    const { pill } = this.swapPill(anchor);
    const spin = createPetalSpinner(document);
    spin.setAttribute('class', SPINNER_CLASS);
    spin.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    label.textContent = m.common_translating();
    pill.append(spin, label);
  }

  /**
   * A brief "未能翻译" notice, then gone. Input translation fails QUIETLY, not
   * silently: the user pressed the gesture and deserves to know it didn't land,
   * but their draft is untouched, so nothing needs doing — no button, no nag.
   */
  fail(anchor: Element): void {
    const { pill } = this.swapPill(anchor);
    pill.classList.add('fail');
    pill.setAttribute('role', 'status');
    pill.textContent = m.input_failed();
    this.dismissOnScroll();
    this.hideTimer = setTimeout(() => this.hide(), FAIL_MS);
  }

  /**
   * Swap the spinner for a clickable "撤销" affordance that restores the
   * original text. Auto-dismisses after {@link UNDO_MS}.
   */
  undo(anchor: Element, onUndo: () => void): void {
    const { pill } = this.swapPill(anchor);
    pill.classList.add('undo');
    pill.setAttribute('role', 'button');
    pill.tabIndex = 0;
    pill.textContent = `${m.input_undo()} `;
    // The shortcut everyone's fingers already know — within the undo window
    // the controller answers Cmd/Ctrl+Z (the native stack is broken by most
    // write paths); the label makes that discoverable.
    const kbd = document.createElement('span');
    kbd.className = 'kbd';
    kbd.textContent = /mac/i.test(navigator.platform) ? '⌘Z' : 'Ctrl+Z';
    pill.append(kbd);
    const trigger = () => {
      onUndo();
      this.hide();
    };
    // pointerdown, not click: fire before the field can blur/scroll it away.
    pill.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      trigger();
    });
    pill.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
    this.dismissOnScroll();
    this.hideTimer = setTimeout(() => this.hide(), UNDO_MS);
  }

  hide(): void {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
    this.offScroll?.();
    this.offScroll = null;
    this.offScheme?.();
    this.offScheme = null;
    this.host?.remove();
    this.host = null;
    this.shadow = null;
  }
}
