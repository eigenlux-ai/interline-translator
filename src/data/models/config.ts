/**
 * @module data/models/config
 *
 * Canonical config shape — the single source of truth for the extension's
 * persisted settings. Pure TS interfaces (zero runtime) so any surface can
 * import them. The Zod schema in `services/config/schema.ts` is asserted to
 * match this shape (`satisfies z.ZodType<Config>`), so they cannot drift.
 */

import type { LangCode, SourceLang, UiLangSetting } from './lang';
import type { GlossaryEntry } from './translate';
import type { ProviderConfig } from './provider';

export interface TranslateConfig {
  /** Provider used when a request doesn't name one. */
  defaultProviderId?: string;
  source: SourceLang;
  target: LangCode;
  /**
   * Languages the user already reads — never translate text detected as one of
   * these (the target is always implicitly skipped too). For multilingual users;
   * empty by default.
   */
  skipLanguages: LangCode[];
  /**
   * 通读全文: summarize the WHOLE page once and inject the overview into every
   * translation prompt for that page (consistent renderings, domain sense).
   * OPT-IN and default OFF deliberately — it sends content the user never
   * scrolled to off to the engine (a privacy boundary the user must cross
   * themselves) and costs one extra LLM call per page. LLM engines only.
   */
  pageContext?: boolean;
  /**
   * 带样式翻译: preserve inline formatting (links/bold/inline code) across
   * translation via the `{{n}}` placeholder protocol. Default ON (absent =
   * true). OFF is the quality escape hatch: placeholders can degrade the
   * translation itself (they interrupt the sentence the engine sees), and
   * plain-text mode sidesteps every marker-mangling failure — the 译文 is
   * then injected as unformatted text.
   */
  richText?: boolean;
}

/**
 * A user-visible translation style.
 * Its `directives` are injected into a fixed slot of every pipeline's prompt
 * skeleton — the user owns TASTE (tone/register/word choice), the engine keeps
 * owning PROTOCOL (markers, output-only, placeholder preservation). Builtin
 * presets are defined in code (services/translation/prompts/builtin-styles) and
 * referenced by id; only user-created styles live here.
 */
export interface PromptStyle {
  /** User styles: random id. Builtins: 'builtin:academic' etc. */
  id: string;
  /** User-visible name (builtin names are localized at render time, not stored). */
  name: string;
  /** Natural-language style instructions injected into the prompt slot. */
  directives: string;
}

/** Per-site style pin: glob domain pattern → style id (longest pattern wins). */
export interface PromptStyleSiteRule {
  pattern: string;
  /** Dangling id (style deleted) → the rule is ignored, falling back to global. */
  styleId: string;
}

/**
 * Expert escape hatch: FULL template override per pipeline, for users who want
 * to own the whole prompt (few-shot examples etc.). Overrides win over style
 * injection on their pipeline. The batch template is validated on save AND
 * guarded at runtime — it must keep the `[[{salt}#` marker instruction or the
 * whole-page wire protocol breaks (see prompts/validateExpertTemplates).
 */
export interface PromptExpertConfig {
  single?: { system?: string; user?: string };
  batch?: { system?: string };
}

/**
 * A named glossary collection — 「AI 术语集」,「建筑术语集」… Terms belong to
 * a DOMAIN, and the domain (not the individual term) carries the scoping:
 * the whole set toggles on/off and optionally binds to matching sites (same
 * glob semantics as style/site rules; empty = everywhere).
 *
 * Injection stays ON-DEMAND per entry: a term enters the prompt only when it
 * actually occurs in the text being translated — token-cheap, and cache keys
 * stay stable for unrelated text no matter how many sets the user hoards.
 * Set order matters: for duplicate terms the earlier set (then earlier entry)
 * wins.
 */
export interface GlossarySet {
  id: string;
  name: string;
  enabled: boolean;
  /** Optional site scope for the WHOLE set (glob; empty/absent = everywhere). */
  pattern?: string;
  entries: GlossaryEntry[];
}

/** User-defined prompt system: styles + scope resolution + expert overrides. */
export interface PromptConfig {
  /** User-created styles only (builtins ship in code). */
  styles: PromptStyle[];
  /** Global default style; undefined = 素译 (no style injection). */
  activeStyleId?: string;
  siteRules: PromptStyleSiteRule[];
  expert?: PromptExpertConfig;
}

/**
 * In-input translation: tap the space bar N times in an input field to translate
 * draft text in place. Prefixing with `/en` or `en:` overrides the target language.
 */
export interface InputTranslationConfig {
  enabled: boolean;
  /** Consecutive spaces (within ~300ms) that fire the trigger. */
  triggerCount: number;
  /**
   * The language you WRITE INTO — deliberately separate from `translate.target`
   * (your reading language), because input translation is the opposite
   * direction: you type your own language to post in a foreign one. Defaults to
   * English; a `/xx …` prefix still overrides it per edit.
   */
  target: LangCode;
}

/** Per-site behaviour: translate automatically, never, or follow the default. */
export type SiteMode = 'auto' | 'always' | 'never';

export interface SiteRule {
  /** Glob/domain pattern, e.g. `*.example.com`. */
  pattern: string;
  mode: SiteMode;
}

export interface SiteControlConfig {
  defaultMode: SiteMode;
  rules: SiteRule[];
}

/**
 * Visual display styles for translation nodes next to original text.
 * Default `blend` matches the host page appearance. Line decorations
 * (underline/dashed/dotted/wavy) tint to inherited text color; emphasis
 * presets (dim/highlight/blockquote/card) adapt across inline and block layouts;
 * `blur` reveals translated text on hover.
 */
export const BILINGUAL_STYLES = [
  'blend',
  'dim',
  'underline',
  'dashed',
  'dotted',
  'wavy',
  'highlight',
  'blockquote',
  'card',
  'blur',
] as const;

export type BilingualStyle = (typeof BILINGUAL_STYLES)[number];

/**
 * How a translated page presents original vs 译文 — a pure-CSS VIEW over the
 * already-injected glosses (switching never re-translates): `bilingual` shows
 * both (the default), `translation` collapses the original text (media stays),
 * `original` hides the 译文 for a quick peek at the source.
 */
export const DISPLAY_MODES = ['bilingual', 'translation', 'original'] as const;
export type DisplayMode = (typeof DISPLAY_MODES)[number];

/** Visual presentation of in-page bilingual output. */
export interface AppearanceConfig {
  colorScheme: 'auto' | 'light' | 'dark';
  /** Opt-in visual treatment of the translated node; `blend` = look like source. */
  bilingualStyle: BilingualStyle;
  /** Translation typeface: the kai brush font, or inherit the host's. */
  translationFont: 'kai' | 'inherit';
  /** The three-state view of a translated page (bilingual/translation/original). */
  displayMode: DisplayMode;
  /**
   * 逐段对照: when a single translation unit holds MULTIPLE paragraphs
   * (<br>-separated runs — mail bodies, poems, forum posts), interleave each
   * translated paragraph right after its source paragraph instead of hanging
   * the whole 译文 below the whole source. Pure placement — the unit is still
   * translated as ONE block (cross-paragraph context, unfragmented cache).
   */
  paragraphInterleave: boolean;
}

export interface Config {
  /** Schema version; drives the migration chain. */
  version: number;
  language: {
    /**
     * Interface language: `auto` (default) follows `translate.target` — the
     * one language the product KNOWS its user reads — or a pinned locale for
     * learners who read foreign pages but want a native UI. Resolved by
     * `resolveUiLang` (src/i18n).
     */
    ui: UiLangSetting;
  };
  providers: ProviderConfig[];
  translate: TranslateConfig;
  prompt: PromptConfig;
  glossary: GlossarySet[];
  inputTranslation: InputTranslationConfig;
  siteControl: SiteControlConfig;
  appearance: AppearanceConfig;
}
