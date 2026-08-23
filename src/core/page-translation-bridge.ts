/**
 * @module core/page-translation-bridge
 *
 * In-page bridge between the floating ball (React, in the shadow surface) and
 * the page-translation OWNER (vanilla, in `entrypoints/page-translate.content`).
 * They are two separate content scripts, but every content script an extension injects into
 * one frame shares a SINGLE isolated world — so a private EventTarget hung off
 * the isolated-world `window` couples them with none of the usual friction:
 *
 *   • no background relay to forward the message,
 *   • no `tabs.sendMessage` (content scripts have no tabId to target), and
 *   • no leak to the host page — the bus lives on our own `window` object, not
 *     on the shared DOM, so the page's main world can't observe it.
 *
 * The single owner of translation state stays `entrypoints/page-translate.content`.
 * The ball only REQUESTS a state and RENDERS the state the owner broadcasts back; it
 * never runs a PageTranslator of its own (that would double-translate).
 */

import { PROJECT_PREFIX } from '@/constants';

/** Property on the isolated-world window holding the shared bus. */
const BUS_KEY = `__${PROJECT_PREFIX}-pt-bridge`;

const SET = 'set'; // ball → owner: turn translation on/off (detail: boolean)
const QUERY = 'query'; // ball → owner: please (re)broadcast the current state
const STATE = 'state'; // owner → ball: the current state (detail: boolean)

function bus(): EventTarget {
  const w = window as unknown as Record<string, EventTarget | undefined>;
  return (w[BUS_KEY] ??= new EventTarget());
}

/** Ball → owner: request whole-page translation be turned on (true) or off (false). */
export function requestSetPageTranslation(enabled: boolean): void {
  bus().dispatchEvent(new CustomEvent(SET, { detail: enabled }));
}

/** Owner: handle on/off requests from the ball. Returns an unsubscribe fn. */
export function onSetPageTranslation(cb: (enabled: boolean) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<boolean>).detail);
  bus().addEventListener(SET, handler);
  return () => bus().removeEventListener(SET, handler);
}

/** Ball → owner: ask the owner to (re)broadcast the current state (used on mount). */
export function requestPageTranslationState(): void {
  bus().dispatchEvent(new Event(QUERY));
}

/** Owner: handle a state query — respond by calling {@link emitPageTranslationState}. */
export function onPageTranslationStateQuery(cb: () => void): () => void {
  const handler = () => cb();
  bus().addEventListener(QUERY, handler);
  return () => bus().removeEventListener(QUERY, handler);
}

/** Owner → ball: broadcast the current translation state (on every change + on query). */
export function emitPageTranslationState(active: boolean): void {
  bus().dispatchEvent(new CustomEvent(STATE, { detail: active }));
}

/** Ball: subscribe to state broadcasts from the owner. Returns an unsubscribe fn. */
export function onPageTranslationState(cb: (active: boolean) => void): () => void {
  const handler = (e: Event) => cb((e as CustomEvent<boolean>).detail);
  bus().addEventListener(STATE, handler);
  return () => bus().removeEventListener(STATE, handler);
}
