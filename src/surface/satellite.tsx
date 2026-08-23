/**
 * @module surface/satellite
 *
 * Component-level shadow UI, designed for "many instances, near-zero cost":
 *
 * - No provider stack and no React root per instance — the host surface's
 *   single React tree projects content into each satellite via createPortal,
 *   so theme/managers/modals context is available for free.
 * - No stylesheet copies — the host surface's injected styles (Mantine layer
 *   CSS, prefixed Tailwind, theme variables) are compiled once into
 *   constructable CSSStyleSheets and shared across every satellite shadow
 *   root via `adoptedStyleSheets`.
 * - Lifecycle management — host pages can mutate anchors at any time during
 *   SPA re-renders. A single MutationObserver cleans up orphaned satellites
 *   (when the anchor is removed) and re-attaches displaced ones (when the anchor
 *   moves or a node is inserted), ensuring the satellite consistently tracks its anchor.
 *
 * Discipline: satellites are for plugin-owned UI ("chrome"). Page-content
 * rewriting (e.g. inserted translated paragraphs) must NOT use satellites —
 * that is the vanilla page-DOM track (see README recipes).
 *
 * Known constraints (kernel scope):
 * - The registry is a per-JS-context singleton: satellites bind to ONE host
 *   surface per content-script context. Running multiple host surfaces in
 *   the same frame is unsupported for satellites (per-surface registries
 *   are a planned extension if ever needed).
 * - Lifecycle management requires one subtree-wide MutationObserver while any
 *   satellite is active (using a microtask-coalesced sweep per mutation batch).
 *   On mutation-heavy SPA hosts with many satellites, it's better to explicitly
 *   call destroy() when you know the component's lifetime has ended.
 */

import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { useComputedColorScheme, useDirection, useMantineTheme } from '@mantine/core';
import { createPortal } from 'react-dom';
import { SATELLITE_TAG, SURFACE_ROOT_CLASS } from '@/constants';
import { useSurface } from './context';
import { resolveIsolatedEvents } from './isolate-events';

export interface SatelliteHandle {
  id: string;
  hostElement: HTMLElement;
  /**
   * Imperative content update. Prefer DECLARATIVE updates — re-render the host
   * React tree so the portal reconciles — for normal React state; reach for
   * `update()` only from imperative (non-React) call sites that hold the handle.
   */
  update: (node: ReactNode) => void;
  destroy: () => void;
}

export interface CreateSatelliteOptions {
  /** insertAdjacentElement position relative to the anchor. Default 'afterend'. */
  position?: InsertPosition;
  /**
   * Stop the listed events from propagating out of the satellite into the host
   * page (mirrors the host surface's WXT `isolateEvents`). `true` (default) →
   * `DEFAULT_ISOLATED_EVENTS` (keyboard); an array → those event types; `false`
   * → no isolation.
   *
   * Listeners attach in the BUBBLE phase, so host-page CAPTURE-phase listeners
   * on ancestors still see the event — same limitation as WXT/@webext-core.
   * Pointer events are NOT isolated by default (satellites are inline, and most
   * host hotkey clashes are keyboard); pass an explicit array to add them.
   */
  isolateEvents?: boolean | string[];
}

interface SatelliteRecord {
  id: string;
  /** The element the satellite was anchored to. Tracked for two reasons:
   *  (1) liveness — when the host removes JUST the anchor (SPA reconciliation
   *  replacing a node), the satellite would otherwise stay connected and orphan;
   *  (2) adjacency — when the host MOVES the anchor (re-parents it elsewhere),
   *  the satellite is re-inserted next to it so it keeps tracking its anchor. */
  anchor: Element;
  /** insertAdjacentElement position used at creation — re-applied on adjacency
   *  repair so non-default positions keep their semantics. */
  position: InsertPosition;
  hostElement: HTMLElement;
  rootElement: HTMLElement;
  node: ReactNode;
}

/** Whether the satellite still sits at `position` relative to its anchor. */
function isSatelliteAdjacent(anchor: Element, host: HTMLElement, position: InsertPosition): boolean {
  switch (position) {
    case 'beforebegin':
      return anchor.previousElementSibling === host;
    case 'afterbegin':
      return anchor.firstElementChild === host;
    case 'beforeend':
      return anchor.lastElementChild === host;
    case 'afterend':
    default:
      return anchor.nextElementSibling === host;
  }
}

const supportsConstructableSheets = typeof CSSStyleSheet !== 'undefined' && 'replaceSync' in CSSStyleSheet.prototype;

let nextSatelliteId = 0;

class SatelliteRegistry {
  private records = new Map<string, SatelliteRecord>();
  private snapshot: SatelliteRecord[] = [];
  private listeners = new Set<() => void>();
  private sheets: CSSStyleSheet[] = [];
  private cssTexts: string[] = [];
  private styleSource: ShadowRoot | null = null;
  private observer: MutationObserver | null = null;
  private checkScheduled = false;
  private useConstructableSheets = supportsConstructableSheets;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = (): SatelliteRecord[] => this.snapshot;

  private commit() {
    this.snapshot = [...this.records.values()];
    this.listeners.forEach((listener) => listener());
  }

  /** Called by SatelliteOutlet once the host surface is mounted. */
  setStyleSource(shadowRoot: ShadowRoot) {
    if (this.styleSource === shadowRoot) return;
    this.styleSource = shadowRoot;
    void this.refreshSheets();
  }

  /**
   * Rebuild shared sheets from whatever styles live in the host surface's
   * shadow root. This automatically captures the full static CSS injected by
   * WXT (cssInjectionMode: 'ui') AND the Mantine theme-variables <style>
   * rendered in-tree — single source of truth, no extra plumbing. Re-run on
   * theme changes (the variables style content is rewritten in place).
   *
   * Note on side effects: the captured static CSS includes the global.css
   * `--text-*`/`--radius-*` Tailwind rem-compensation (`* var(--mantine-scale)`).
   * This allows satellites to inherit the host surface's rem scale automatically,
   * matching the shared-variable dependency that the host surface uses.
   */
  async refreshSheets() {
    const source = this.styleSource;
    if (!source) return;

    const cssTexts: string[] = [];
    source.querySelectorAll('style').forEach((styleEl) => {
      if (styleEl.textContent) cssTexts.push(styleEl.textContent);
    });
    // Dev mode may deliver entrypoint CSS via <link>; inline it. NOTE: this
    // fetch runs under the HOST page's CSP — on a strict-CSP host page it can be
    // blocked, leaving a dev-mode satellite unstyled (build output bundles CSS
    // as inline <style>, so production is unaffected). Verify styling against a
    // build, not dev, on locked-down sites.
    for (const linkEl of source.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')) {
      try {
        cssTexts.push(await fetch(linkEl.href).then((r) => r.text()));
      } catch (error) {
        console.warn('[surface/satellite] failed to inline stylesheet link (host CSP?)', error);
      }
    }

    this.cssTexts = cssTexts;
    if (this.useConstructableSheets) {
      try {
        this.sheets = cssTexts.map((css) => {
          const sheet = new CSSStyleSheet();
          sheet.replaceSync(css);
          return sheet;
        });
      } catch (error) {
        // Constructability can fail even where replaceSync exists (e.g.
        // restrictive environments) — degrade to per-root <style> clones.
        console.warn('[surface/satellite] constructable sheets unavailable, falling back', error);
        this.useConstructableSheets = false;
        this.sheets = [];
      }
    }
    this.records.forEach((record) => this.applySheets(record.rootElement.getRootNode() as ShadowRoot));
  }

  private applySheets(shadowRoot: ShadowRoot) {
    if (this.useConstructableSheets) {
      shadowRoot.adoptedStyleSheets = this.sheets;
      return;
    }
    // Fallback: per-root <style> clones (uses more memory but maintains functionality).
    // Order is critical here (@layer): we must insert each style before the root
    // element to preserve capture order, as prepending each item would invert it.
    shadowRoot.querySelectorAll('style[data-satellite-style]').forEach((el) => el.remove());
    const rootElement = shadowRoot.querySelector(`.${SURFACE_ROOT_CLASS}`);
    this.cssTexts.forEach((css) => {
      const styleEl = document.createElement('style');
      styleEl.dataset.satelliteStyle = '';
      styleEl.textContent = css;
      if (rootElement) {
        shadowRoot.insertBefore(styleEl, rootElement);
      } else {
        shadowRoot.append(styleEl);
      }
    });
  }

  create(anchor: Element, node: ReactNode, options?: CreateSatelliteOptions): SatelliteHandle {
    const id = `sat-${nextSatelliteId++}`;
    const position = options?.position ?? 'afterend';
    const hostElement = document.createElement(SATELLITE_TAG);
    const inserted = anchor.insertAdjacentElement(position, hostElement);
    if (!inserted) {
      throw new Error(`[surface/satellite] could not insert satellite at ${position}`);
    }

    const shadowRoot = hostElement.attachShadow({ mode: 'open' });
    // Event isolation, matching the host surface (which gets it from WXT's
    // createShadowRootUi isolateEvents). Satellites use raw attachShadow, so
    // without this, keystrokes inside a satellite (inline-edit inputs, etc.)
    // bubble out and trigger HOST-page keyboard shortcuts (YouTube/Gmail/…).
    // Attaching on the shadowRoot catches everything in the subtree before it
    // crosses the boundary; listeners are GC'd with the host element on destroy.
    for (const type of resolveIsolatedEvents(options?.isolateEvents)) {
      shadowRoot.addEventListener(type, (event) => event.stopPropagation());
    }
    const rootElement = document.createElement('div');
    rootElement.classList.add(SURFACE_ROOT_CLASS);
    shadowRoot.append(rootElement);
    this.applySheets(shadowRoot);

    this.records.set(id, { id, anchor, position, hostElement, rootElement, node });
    this.ensureObserver();
    this.commit();

    return {
      id,
      hostElement,
      update: (nextNode) => this.update(id, nextNode),
      destroy: () => this.destroy(id),
    };
  }

  private update(id: string, node: ReactNode) {
    const record = this.records.get(id);
    if (!record) return;
    this.records.set(id, { ...record, node });
    this.commit();
  }

  destroy(id: string) {
    const record = this.records.get(id);
    if (!record) return;
    this.records.delete(id);
    record.hostElement.remove();
    if (this.records.size === 0) {
      this.observer?.disconnect();
      this.observer = null;
    }
    this.commit();
  }

  /**
   * Lifecycle management: a single subtree observer schedules one sweep per
   * mutation batch to handle two things for each satellite:
   *
   * - DESTROY when its host element OR its anchor leaves the document — the
   *   anchor check catches SPA reconciliation that removes just the anchored
   *   node, which would otherwise leave the satellite connected and orphaned.
   * - RE-ATTACH when the anchor is still connected but the satellite is no
   *   longer adjacent to it — the host moved the anchor (re-parented it) or
   *   inserted a node between them. Re-inserting at the original `position`
   *   keeps the satellite tracking its anchor (DOM-adjacency follow; satellites
   *   are in-flow, so this is also visual follow). Moving an already-connected
   *   host element does not tear down its shadow root or React portal.
   *
   * Re-attaching mutates the DOM, which re-triggers the observer; the next
   * sweep finds adjacency restored and is a no-op, so it settles in one extra
   * batch (no loop) unless the host actively fights it every frame.
   */
  private ensureObserver() {
    if (this.observer) return;
    this.observer = new MutationObserver(() => {
      if (this.checkScheduled) return;
      this.checkScheduled = true;
      queueMicrotask(() => {
        this.checkScheduled = false;
        // Snapshot first: destroy() mutates `records` (and may disconnect the
        // observer + commit) — collecting the dead ids up front keeps this loop
        // independent of iteration-during-mutation and commit side effects.
        const dead: string[] = [];
        for (const record of this.records.values()) {
          if (!record.hostElement.isConnected || !record.anchor.isConnected) {
            dead.push(record.id);
            continue;
          }
          if (!isSatelliteAdjacent(record.anchor, record.hostElement, record.position)) {
            record.anchor.insertAdjacentElement(record.position, record.hostElement);
          }
        }
        for (const id of dead) this.destroy(id);
      });
    });
    this.observer.observe(document.documentElement, { childList: true, subtree: true });
  }
}

// Per-JS-context singleton. Internal — the public API is createSatellite() +
// SatelliteOutlet(); the raw registry is not exported to keep its mutating
// methods (destroy/refreshSheets/…) out of reach of consumers.
const satellites = new SatelliteRegistry();

/** Imperative API usable from anywhere in the content script. */
export function createSatellite(anchor: Element, node: ReactNode, options?: CreateSatelliteOptions): SatelliteHandle {
  return satellites.create(anchor, node, options);
}

/**
 * Renders every satellite as a portal of the host surface's React tree and
 * keeps satellite roots in sync with the theme (color-scheme + dir attributes,
 * shared variable sheets). Mounted once by the app shell (bootstrap).
 */
export function SatelliteOutlet() {
  const env = useSurface();
  const records = useSyncExternalStore(satellites.subscribe, satellites.getSnapshot);
  const computedColorScheme = useComputedColorScheme('light');
  const { dir } = useDirection();
  const theme = useMantineTheme();

  useEffect(() => {
    if (env.kind === 'shadow' && env.shadowRoot) satellites.setStyleSource(env.shadowRoot);
  }, [env]);

  // Theme object identity changes on primary-color/theme updates, and the
  // in-tree Mantine variables <style> may also be rewritten on color-scheme
  // flips — re-capture the shared sheets on either signal.
  useEffect(() => {
    void satellites.refreshSheets();
  }, [theme, computedColorScheme]);

  // Each satellite is its own shadow tree, so the host surface root's
  // attributes don't reach it — Mantine's scheme tokens and its `[dir=rtl]`
  // rules both resolve against the satellite root itself.
  useEffect(() => {
    records.forEach((record) => {
      record.rootElement.setAttribute('data-mantine-color-scheme', computedColorScheme);
      record.rootElement.setAttribute('dir', dir);
    });
  }, [records, computedColorScheme, dir]);

  return <>{records.map((record) => createPortal(record.node, record.rootElement, record.id))}</>;
}
