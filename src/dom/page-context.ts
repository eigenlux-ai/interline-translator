/** Page overview and per-text context choices survive translation off/on.
 * Kept only for the current view of a live root; no DOM nodes are retained by
 * the context state. A new URL/title/language pair gets a fresh session.
 */
export class PageContext {
  private summary = '';
  private readonly choices = new Map<string, string>();
  private choiceChars = 0;

  constructor(readSummary: () => Promise<string>) {
    // Never block the first viewport. Even a response arriving while
    // translation is off is useful to the next instance on this same view.
    void readSummary()
      .then((summary) => {
        this.summary = summary || '';
      })
      .catch(() => {});
  }

  forText(text: string): string {
    const previous = this.choices.get(text);
    if (previous !== undefined) return previous; // '' is an intentional choice
    const summary = this.summary;
    this.choices.set(text, summary);
    this.choiceChars += text.length;
    // Bound long-lived feeds, including ones that never navigate. Overview
    // strings are shared references; source text dominates this map's cost.
    while (this.choices.size > 10_000 || this.choiceChars > 2_000_000) {
      const oldest = this.choices.keys().next().value!;
      this.choices.delete(oldest);
      this.choiceChars -= oldest.length;
    }
    return summary;
  }
}

const views = new WeakMap<Element, { scope: string; context: PageContext }>();

export function getPageContext(root: Element, scope: string, readSummary: () => Promise<string>): PageContext {
  const previous = views.get(root);
  if (previous?.scope === scope) return previous.context;
  const context = new PageContext(readSummary);
  views.set(root, { scope, context });
  return context;
}
