/**
 * @module dom/input/replace
 *
 * Replace an editable's text with the translation. Routing:
 *
 *   1. Main-world editors (selector in ./protocol — editable BODIES and hidden
 *      conduits only, never container chrome) go through the injector bridge:
 *      the editor's own instance API applies the write, atomically guarded by
 *      `expectedBefore`. 'raced' aborts outright — the user kept typing.
 *      On 'miss', native-field conduits (Monaco's / CM5's hidden textareas)
 *      return false rather than fake success by writing an invisible textarea;
 *      contenteditable bodies degrade to the DOM chain below.
 *
 *   2. input/textarea → setNativeValue: call the prototype value setter (bypasses
 *      React's value tracker) + dispatch input/change so frameworks see it.
 *
 *   3. contenteditable → degradation chain: simulated paste first, then
 *      execCommand('insertText'), then Range replacement — each verified by
 *      read-back before the next runs. Synthetic paste leads because it has
 *      no default DOM mutation without editor acceptance, ensuring reliable read-back.
 *      execCommand follows for editors without paste model listeners.
 *
 * An identity write (the field already contains the target value) reports success
 * as a no-op without escalating to destructive DOM rewrites.
 */

import { getDeepActiveElement, readEditableText, type EditableKind } from './active-element';
import { injectViaMainWorld, isMainWorldEditor } from './injector-bridge';
import { squashWhitespace, stripTriggerSpaces, type RichSnapshot } from './protocol';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Set a native field's value via the prototype setter, bypassing React's tracker. */
export function setNativeValue(el: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  if (setter) setter.call(el, value);
  else el.value = value;
  // `composed`: every native input/change is composed, and this module writes
  // into fields nested in shadow DOM (see ./active-element) — an uncomposed
  // event stops at the root and a framework listener delegated outside it never
  // learns the value changed.
  el.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  el.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
}

function selectAllContent(el: HTMLElement): void {
  el.focus();
  const range = el.ownerDocument.createRange();
  range.selectNodeContents(el);
  const sel = el.ownerDocument.defaultView?.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

/**
 * The field now reads as exactly the translation, or shows the translation with
 * the original gone — i.e. the strategy REPLACED rather than appended (or
 * failed). This read-back is what lets one chain cover many editors without
 * knowing which is which.
 */
function replaced(el: HTMLElement, value: string, before: string): boolean {
  // Whitespace-squashed containment: the editor re-blocks a multi-line paste
  // however it likes (each line its own <div>/<p>), and textContent then glues
  // those blocks — an exact includes() would false-miss a good write and send
  // the chain on to a MORE destructive strategy.
  const now = squashWhitespace(el.textContent ?? '');
  const wanted = squashWhitespace(value);
  const prior = squashWhitespace(before);
  if (wanted === '') return false; // nothing checkable — never claim success
  // Exact match first: the field holds the translation and NOTHING else, so
  // whether the translation happens to contain the original is irrelevant. The
  // containment test below cannot tell "the model echoed the source / kept a
  // proper noun / emitted 原文（译文）" apart from "the write appended after the
  // original", and reading a clean write as an append escalated the chain into
  // an editor that was already correct.
  if (now === wanted) return true;
  return now.includes(wanted) && (prior === '' || wanted === prior || !now.includes(prior));
}

/** Dispatch a synthetic paste carrying `value` as text/plain. */
function dispatchPaste(el: HTMLElement, value: string): void {
  const dt = new DataTransfer();
  dt.setData('text/plain', value);
  el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true, composed: true }));
}

async function replaceContentEditable(el: HTMLElement, value: string, signal?: AbortSignal): Promise<boolean> {
  const before = el.textContent ?? '';
  // Identity no-op: the field (minus trigger-space residue) already reads as
  // the translation — success, and nothing to write.
  if (before === value || stripTriggerSpaces(before) === value) return true;

  // 1) Simulated paste — model-managed editors route it through their model,
  //    and a synthetic paste has NO default DOM mutation, so a passing
  //    read-back here is trustworthy (model and DOM moved together).
  try {
    selectAllContent(el);
    // Slate-family editors mirror the DOM selection into their internal model
    // via a THROTTLED selectionchange listener (~100ms in WangEditor). Pasting
    // before that sync lands makes the editor paste at its OLD selection —
    // appending after the original instead of replacing it.
    const snapshot = readEditableText(el);
    await sleep(120);
    const active = getDeepActiveElement();
    if (signal?.aborted || readEditableText(el) !== snapshot || (active !== el && !(active && el.contains(active))))
      return false;
    dispatchPaste(el, value);
    const pastedSnapshot = readEditableText(el);
    await sleep(15); // let the editor's async model update + re-render settle
    if (signal?.aborted) return false;
    const focused = getDeepActiveElement();
    if (focused !== el && !(focused && el.contains(focused))) return false;
    if (readEditableText(el) !== pastedSnapshot && !replaced(el, value, before)) return false;
    if (replaced(el, value, before)) return true;
  } catch {
    /* ClipboardEvent/DataTransfer unavailable — fall through */
  }

  // 2) execCommand insertText — trusted beforeinput, preserves undo, widest
  //    reach on plain/paste-less editors. Its default DOM mutation can fool the
  //    read-back on editors that ignore beforeinput — which is why it no longer
  //    leads the chain.
  try {
    selectAllContent(el);
    if (el.ownerDocument.execCommand('insertText', false, value) && replaced(el, value, before)) return true;
  } catch {
    /* execCommand unsupported here — fall through */
  }

  // 3) Range replacement (last resort) + input event so listeners react.
  selectAllContent(el);
  const sel = el.ownerDocument.defaultView?.getSelection();
  const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
  if (range) {
    range.deleteContents();
    range.insertNode(el.ownerDocument.createTextNode(value));
    sel?.removeAllRanges();
  } else {
    el.textContent = value;
  }
  el.dispatchEvent(new InputEvent('input', { bubbles: true, composed: true, inputType: 'insertText', data: value }));
  return replaced(el, value, before);
}

/**
 * Replace `el`'s text with `value`. Returns true on success.
 *
 * `expectedBefore` (trigger-space-stripped snapshot from the same read that
 * sourced the translation) guards the native write and the main-world atomic
 * update. DOM fallback writes also recheck text and focus across their awaits.
 * `signal` invalidates pending fallback work when the feature stops. Undo omits
 * the baseline check, but still preserves edits made during an async fallback.
 *
 * `rich` is 撤销's snapshot of the document as the EDITOR serialized it, so a
 * restore puts the bold/links/lists back instead of the flattened text. Only
 * the main-world route can honour it — the DOM chain below simulates typing and
 * has no way to say "this run of characters was bold", so it restores plain
 * text (which is what the whole undo did before). Writing the markup into the
 * host DOM ourselves is exactly the model≠DOM desync this chain exists to
 * avoid: the editors reaching it are the ones whose instance we could NOT find.
 */
export async function replaceEditableText(
  el: Element,
  kind: EditableKind,
  value: string,
  opts: { expectedBefore?: string; rich?: RichSnapshot; signal?: AbortSignal } = {}
): Promise<boolean> {
  if (opts.signal?.aborted) return false;
  if (isMainWorldEditor(el)) {
    const snapshot = readEditableText(el);
    const outcome = await injectViaMainWorld(el, value, {
      ...(opts.expectedBefore !== undefined ? { expectedBefore: opts.expectedBefore } : {}),
      ...(opts.rich ? { rich: opts.rich } : {}),
    });
    if (outcome === 'applied') return true;
    if (outcome === 'raced') return false; // user kept typing — never clobber, never fall back
    // 'miss': a native field matching the main-world list is a hidden conduit
    // (Monaco/CM5) — writing IT would change nothing visible while reporting
    // success, so fail honestly. Contenteditable bodies still get the chain.
    if (kind !== 'contenteditable') return false;
    if (opts.signal?.aborted || readEditableText(el) !== snapshot) return false;
    return replaceContentEditable(el as HTMLElement, value, opts.signal);
  }

  if (opts.expectedBefore !== undefined && stripTriggerSpaces(readEditableText(el)) !== opts.expectedBefore)
    return false;
  if (kind === 'input' || kind === 'textarea') {
    const field = el as HTMLInputElement | HTMLTextAreaElement;
    if (field.value !== value) setNativeValue(field, value);
    return true;
  }
  return replaceContentEditable(el as HTMLElement, value, opts.signal);
}
