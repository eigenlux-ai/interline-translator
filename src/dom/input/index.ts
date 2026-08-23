/**
 * @module dom/input
 *
 * Input-box translation controller. Watches keydown (capture phase), fires on
 * the N-space trigger, translates the focused field's text, and replaces it in
 * place — with the guards the deep-dive + probe demanded:
 *   - IME composition (isComposing / keyCode 229) is never interrupted (CJK);
 *   - auto-repeat (key.repeat) ignored;
 *   - shadow-piercing active element (Gemini/Discord);
 *   - password/non-textual inputs skipped (security);
 *   - async race re-check: if the user kept typing while we waited, abort;
 *   - site blacklist for editors known to fight synthetic edits.
 */

import type { LangCode, SourceLang } from '@/data/models';
import { withKeepAlive } from '@/services/keep-alive';
import { getTranslationService } from '@/services/translation/contract';
import { classifyEditable, getDeepActiveElement, readEditableText, type EditableKind } from './active-element';
import { InputHint } from './indicator';
import { isMainWorldEditor, readViaMainWorld } from './injector-bridge';
import { stripTriggerSpaces, type RichSnapshot } from './protocol';
import { replaceEditableText } from './replace';
import { parseInputCommand, SpaceTrigger, type SpaceTriggerOptions } from './triggers';

/**
 * The hostname that policy checks (site control) should judge. In an
 * about:blank / srcdoc iframe (TinyMCE's iframe mode, many embeds)
 * `location.hostname` is '' — fall back to the embedding chain's origin, so a
 * site's rules keep applying inside the frames it spawns.
 */
export function effectiveHostname(): string {
  if (location.hostname) return location.hostname;
  const ancestor = location.ancestorOrigins?.[0];
  if (ancestor) {
    try {
      return new URL(ancestor).hostname;
    } catch {
      /* opaque ancestor origin — fall through */
    }
  }
  return '';
}

export interface InputTranslatorOptions extends SpaceTriggerOptions {
  source?: SourceLang;
  defaultTarget: LangCode;
}

export class InputTranslator {
  private readonly trigger: SpaceTrigger;
  private readonly hint = new InputHint();
  private busy = false;
  private stopFn: (() => void) | null = null;
  /**
   * The last in-place edit, kept so the 撤销 affordance can restore the original.
   * `rich` is the editor's own serialization of that original when the adapter
   * had one — without it a restore writes back plain text, which silently
   * destroys the bold/links/lists the draft came with.
   */
  private lastEdit: { el: Element; kind: EditableKind; original: string; rich?: RichSnapshot } | null = null;

  constructor(private readonly opts: InputTranslatorOptions) {
    this.trigger = new SpaceTrigger(opts);
  }

  start(): void {
    if (this.stopFn) return;
    // No host blacklist: the injector tries the editor's own instance API first,
    // and every DOM-chain fallback read-back-verifies before committing — a write
    // that can't land fails silently (never a partial/desync'd edit), so there is
    // nothing to pre-emptively opt out. Site-level opt-out lives in siteControl.
    const onKeyDown = (e: KeyboardEvent) => this.onKeyDown(e);
    // A mouse click is the other way to "move on" (clicking the SEND button
    // instead of Enter) — it ends the undo window too. Clicks on the pill
    // itself are its own trigger, not a dismissal.
    const onPointerDown = (e: PointerEvent) => {
      if (!e.isTrusted || !this.lastEdit || this.hint.ownsEvent(e)) return;
      this.lastEdit = null;
      this.hint.hide();
    };
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    this.stopFn = () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
    };
  }

  stop(): void {
    this.stopFn?.();
    this.stopFn = null;
    this.hint.hide();
    this.lastEdit = null;
  }

  private onKeyDown(e: KeyboardEvent): void {
    // Synthetic keydowns must not drive the trigger: a page could fabricate
    // the whole space sequence and fire a translation with no user gesture.
    if (!e.isTrusted) return;
    // The undo window: Cmd/Ctrl+Z restores (the native stack is broken by
    // most write paths — setNativeValue clears it, editor setData resets its
    // own history — so within the window WE are the user's Z). Any other real
    // keystroke ENDS the window: typing more or Enter-to-send both mean
    // "accepted, moved on". Bare modifiers pass through — Cmd+Z arrives as a
    // Meta keydown first, and eating the window there would kill the shortcut.
    if (this.lastEdit) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        e.stopPropagation(); // the page's own undo must not also fire
        this.restoreLast();
        return;
      }
      if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
        this.lastEdit = null;
        this.hint.hide();
      }
    }
    // Never interfere with IME composition (CJK input would lose characters).
    if (e.isComposing || e.keyCode === 229) {
      this.trigger.reset();
      return;
    }
    if (e.repeat) return;
    // Chorded space is a COMMAND, not typing: Ctrl+Space toggles IMEs on
    // Windows, Alt/Cmd+Space are launchers — none may count toward the streak.
    if (e.ctrlKey || e.altKey || e.metaKey) {
      this.trigger.reset();
      return;
    }
    if (e.key !== ' ') {
      this.trigger.reset();
      return;
    }
    const el = getDeepActiveElement();
    const kind = classifyEditable(el);
    if (!el || !kind) {
      this.trigger.reset();
      return;
    }
    if (!this.trigger.space(now())) return;

    // Trigger fired: swallow this space and translate the field.
    e.preventDefault();
    void this.translateField(el, kind);
  }

  private async translateField(el: Element, kind: EditableKind): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      // Local snapshot for the race re-check. Only the trigger's OWN residue —
      // trailing ASCII spaces (the gesture can produce nothing else) — is
      // normalised away; a newline/tab typed while we await is real input and
      // must abort. (An earlier `\s+$` strip silently ate those too.)
      const localRaw = stripTriggerSpaces(readEditableText(el));

      // The translation source AND the undo original. Virtualized editors
      // (CodeMirror/Monaco) render only the viewport into the DOM, so the DOM
      // read is a fragment — prefer the MODEL text via the main-world injector;
      // everything else (and injector miss) uses the DOM read. The same read
      // brings back the rich snapshot 撤销 restores from.
      const model = isMainWorldEditor(el) ? await readViaMainWorld(el) : null;
      const baseline = stripTriggerSpaces(model?.text ?? readEditableText(el));
      const { target, text } = parseInputCommand(baseline);
      if (!text.trim()) return;

      this.hint.spinner(el);
      // Timeout INSIDE the keep-alive: `busy` serializes gestures, so a
      // never-settling translate would otherwise mute input translation on
      // this page forever — and the keep-alive must be RELEASED when that
      // timeout fires (wrapped the other way round, the very hang the timeout
      // exists for would leave the 20s ping pinning the SW until page close).
      const out = await withKeepAlive(() =>
        withTimeout(
          getTranslationService().translate({
            text,
            source: this.opts.source ?? 'auto',
            target: target ?? this.opts.defaultTarget,
            // Per-site PromptStyle rules apply to input translation too —
            // styling what you WRITE on a site is a legitimate use; the title
            // hints at the venue's register (issue tracker vs forum).
            context: {
              domain: location.hostname || undefined,
              title: document.title.trim().slice(0, 200) || undefined,
            },
          }),
          TRANSLATE_TIMEOUT_MS
        )
      );
      // Empty output guard: engines legitimately return '' (think-only LLM
      // output, untranslatable scraps). Writing '' isn't a no-op — the replace
      // chains CLEAR the field first and only then fail verification, wiping
      // the draft with no undo affordance. Nothing to show → keep the draft.
      if (!out.text.trim()) {
        this.hint.fail(el);
        return;
      }
      // Race re-check: the user typed real (non-trigger) content while we
      // awaited → don't clobber. The main-world apply re-checks once more,
      // atomically, right before writing (expectedBefore below).
      if (stripTriggerSpaces(readEditableText(el)) !== localRaw) {
        this.hint.hide();
        return;
      }
      // Focus re-check: the user moved on to another field (or away entirely)
      // while we awaited. Writing would yank focus back mid-typing — and the
      // DOM chain's select-all would put their next keystroke over the WHOLE
      // field. A translation nobody is looking at is safe to drop.
      const active = getDeepActiveElement();
      if (active !== el && !(active && el.contains(active))) {
        this.hint.hide();
        return;
      }
      if (await replaceEditableText(el, kind, out.text, { expectedBefore: baseline })) {
        this.lastEdit = { el, kind, original: baseline, ...(model?.rich ? { rich: model.rich } : {}) };
        this.hint.undo(el, () => this.restoreLast()); // brief 撤销 affordance
      } else {
        // The write didn't land (editor fought every strategy). The draft is
        // intact — say so briefly instead of vanishing the spinner wordlessly.
        this.hint.fail(el);
      }
    } catch {
      // Quietly, not silently: the user pressed the gesture — a 1.6s notice
      // ("未能翻译，原文未动") acknowledges it without interrupting typing.
      this.hint.fail(el);
    } finally {
      this.busy = false;
    }
  }

  /** Restore the original text of the most recent in-place translation. */
  private restoreLast(): void {
    const e = this.lastEdit;
    if (!e) return;
    void replaceEditableText(e.el, e.kind, e.original, e.rich ? { rich: e.rich } : {});
    this.lastEdit = null;
    this.hint.hide();
  }
}

function now(): number {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

/** Generous ceiling — slow LLMs are fine, a hung promise is not. */
const TRANSLATE_TIMEOUT_MS = 30_000;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('[input] translation timed out')), ms);
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}
