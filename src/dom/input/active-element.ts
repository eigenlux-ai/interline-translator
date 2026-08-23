/**
 * @module dom/input/active-element
 *
 * Find the genuinely-focused editable, piercing shadow roots (Gemini, Discord,
 * and other web-component editors nest the real field inside shadow DOM), and
 * classify what kind of editable it is — which decides the replacement strategy
 * (per the beforeinput probe: native fields → setNativeValue; contenteditable →
 * beforeinput/execCommand/Range).
 */

import { anyShadowRoot } from '../shadow';

export type EditableKind = 'input' | 'textarea' | 'contenteditable';

/**
 * The deepest activeElement, descending through shadow roots — open AND closed
 * (`anyShadowRoot`: content scripts see closed roots via Firefox's element
 * property / Chromium's chrome.dom, so an editor inside a closed root is still
 * findable even though its key events reach us retargeted to the host).
 */
export function getDeepActiveElement(root: Document | ShadowRoot = document): Element | null {
  let el: Element | null = root.activeElement;
  for (;;) {
    const inner = el && anyShadowRoot(el)?.activeElement;
    if (!inner) return el;
    el = inner;
  }
}

/** Text-bearing <input> types we translate (skip password/email/number/etc.). */
const TEXTUAL_INPUT_TYPES = new Set(['text', 'search', 'url', '']);

/** Classify an editable element, or null if it isn't a translatable field. */
export function classifyEditable(el: Element | null): EditableKind | null {
  if (!el) return null;

  if (el instanceof HTMLTextAreaElement) {
    return el.readOnly || el.disabled ? null : 'textarea';
  }
  if (el instanceof HTMLInputElement) {
    if (el.readOnly || el.disabled) return null;
    // NEVER touch a password field (security) or non-textual inputs.
    return TEXTUAL_INPUT_TYPES.has(el.type) ? 'input' : null;
  }

  const editable = (el as HTMLElement).isContentEditable;
  if (editable) return 'contenteditable';

  return null;
}

/** Read the current text of an editable. */
export function readEditableText(el: Element): string {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return el.value;
  // innerText, not textContent: textContent glues block boundaries
  // ("<div>a</div><div>b</div>" → "ab"), so a multi-line draft would reach the
  // translation engine as run-together words — and poison the undo baseline
  // and race snapshots read through here. innerText renders blocks as newlines
  // (its forced layout is fine for a per-gesture read).
  if (el instanceof HTMLElement) return el.innerText;
  return el.textContent ?? '';
}
