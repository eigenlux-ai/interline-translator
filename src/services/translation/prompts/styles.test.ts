/**
 * PromptStyle assembly + scope resolution + expert validation.
 */
import { describe, expect, it } from 'vitest';
import type { PromptConfig, PromptStyle } from '@/data/models';
import { buildBatchPrompt } from '../batch/protocol';
import { BUILTIN_STYLES, findStyle, isBuiltinStyleId } from './builtin-styles';
import { buildAnnotatePrompt, buildReference, buildSummaryPrompt, buildTranslatePrompt, expertDivergesBatchCache, fillTemplate, isLexicalUnit, resolvePromptStyle, styleBlock, validateExpertTemplates } from './index';

const SALT = 'a1b2c3';
const academic = BUILTIN_STYLES.find((s) => s.id === 'builtin:academic')!;
const userStyle: PromptStyle = { id: 'u1', name: '我的风格', directives: 'Sound like a pirate.' };

const bare: PromptConfig = { styles: [], siteRules: [] };

describe('styleBlock injection (single pipeline)', () => {
  it('injects directives under the authority preamble, before the reference block', () => {
    const { system, prompt } = buildTranslatePrompt('Hi', 'en', 'zh-CN', bare, { title: 'T' }, academic);
    expect(prompt).toBe('Hi'); // user message stays pure
    const skeleton = system.indexOf('Output ONLY the translation');
    const style = system.indexOf('Style directives');
    const authority = system.indexOf('ALWAYS take precedence');
    const reference = system.indexOf('Reference (context only');
    expect(skeleton).toBeGreaterThanOrEqual(0);
    expect(style).toBeGreaterThan(skeleton);
    expect(authority).toBeGreaterThan(skeleton);
    expect(reference).toBeGreaterThan(style);
    expect(system).toContain('scholarly register');
  });

  it('素译 (no style) leaves the skeleton unmodified', () => {
    const { system } = buildTranslatePrompt('Hi', 'auto', 'zh-CN', bare);
    expect(system).not.toContain('Style directives');
  });

  it('blank directives inject nothing', () => {
    const { system } = buildTranslatePrompt('Hi', 'auto', 'zh-CN', bare, undefined, { id: 'x', name: 'x', directives: '  ' });
    expect(system).not.toContain('Style directives');
  });
});

describe('expert single override', () => {
  const expertCfg: PromptConfig = {
    styles: [],
    siteRules: [],
    expert: { single: { system: 'MY SYSTEM to {target}', user: 'Translate: {text} (page {title})' } },
  };

  it('takes over the whole template — no style slot, no reference block', () => {
    const { system, prompt } = buildTranslatePrompt('Hello', 'en', 'zh-CN', expertCfg, { title: 'Page' }, academic);
    expect(system).toBe('MY SYSTEM to Simplified Chinese');
    expect(system).not.toContain('Style directives');
    expect(system).not.toContain('Reference');
    expect(prompt).toBe('Translate: Hello (page Page)');
  });

  it('a user template WITHOUT {text} is ignored at runtime (imported-config guard)', () => {
    const cfg: PromptConfig = { styles: [], siteRules: [], expert: { single: { system: 'S', user: 'no placeholder' } } };
    const { prompt } = buildTranslatePrompt('Hello', 'auto', 'zh-CN', cfg);
    expect(prompt).toBe('Hello');
  });
});

describe('batch pipeline + styles', () => {
  it('style coexists with the marker protocol (skeleton intact)', () => {
    const { system } = buildBatchPrompt(['a', 'b'], 'auto', 'zh-CN', bare, undefined, SALT, userStyle);
    expect(system).toContain(`[[${SALT}#N]]`); // marker instruction survives
    expect(system).toContain('Sound like a pirate.');
    expect(system.indexOf('Style directives')).toBeGreaterThan(system.indexOf('never merge, split, drop'));
  });

  it('a VALID expert batch template (keeps the marker token) takes over', () => {
    const cfg: PromptConfig = {
      styles: [],
      siteRules: [],
      expert: { batch: { system: 'CUSTOM. Echo [[{salt}#N]] markers. Target {target}.' } },
    };
    const { system } = buildBatchPrompt(['a'], 'auto', 'zh-CN', cfg, undefined, SALT, userStyle);
    // The ~n token rule is PROTOCOL and rides along even under a full expert
    // takeover (items are encoded unconditionally — see buildBatchPrompt).
    expect(system).toBe(`CUSTOM. Echo [[${SALT}#N]] markers. Target Simplified Chinese.\nThe token [[${SALT}~n]] inside a segment represents a paragraph break. Keep each [[${SALT}~n]] token in the translation at the corresponding position, unchanged. It never ends the segment — translate ALL text after it.`);
  });

  it('an INVALID expert batch template (marker token lost) falls back to the skeleton', () => {
    const cfg: PromptConfig = { styles: [], siteRules: [], expert: { batch: { system: '翻译得口语化一点' } } };
    const { system } = buildBatchPrompt(['a'], 'auto', 'zh-CN', cfg, undefined, SALT);
    expect(system).toContain(`[[${SALT}#N]]`); // the wire protocol survives a hostile import
    expect(system).not.toContain('口语化');
  });
});

describe('resolvePromptStyle', () => {
  const cfg: PromptConfig = {
    styles: [userStyle],
    activeStyleId: 'builtin:academic',
    siteRules: [
      { pattern: '*.example.com', styleId: 'u1' },
      { pattern: 'docs.example.com', styleId: 'builtin:technical' },
      { pattern: 'gone.example.com', styleId: 'deleted-style' },
    ],
  };

  it('no host → global default (builtin id resolves from code)', () => {
    expect(resolvePromptStyle(cfg)?.id).toBe('builtin:academic');
  });

  it('site rule wins over global; LONGEST pattern wins among matches', () => {
    expect(resolvePromptStyle(cfg, 'www.example.com')?.id).toBe('u1');
    expect(resolvePromptStyle(cfg, 'docs.example.com')?.id).toBe('builtin:technical');
  });

  it('a dangling styleId is skipped (falls to the next resolvable rule or global)', () => {
    expect(resolvePromptStyle(cfg, 'gone.example.com')?.id).toBe('u1'); // *.example.com still matches
    const only = { ...cfg, siteRules: [{ pattern: 'gone.example.com', styleId: 'deleted-style' }] };
    expect(resolvePromptStyle(only, 'gone.example.com')?.id).toBe('builtin:academic');
  });

  it('no style anywhere → undefined (素译)', () => {
    expect(resolvePromptStyle({ styles: [], siteRules: [] })).toBeUndefined();
  });
});

describe('validateExpertTemplates', () => {
  it('rejects a batch template that lost the marker token', () => {
    expect(validateExpertTemplates({ batch: { system: 'just translate' } })).toBe('batch-marker-missing');
  });
  it('rejects a single user template without {text}', () => {
    expect(validateExpertTemplates({ single: { user: 'translate it' } })).toBe('single-text-missing');
  });
  it('accepts valid templates and empty experts', () => {
    expect(validateExpertTemplates({})).toBeNull();
    expect(validateExpertTemplates({ batch: { system: 'keep [[{salt}#N]]' }, single: { user: 'T: {text}' } })).toBeNull();
  });
});

describe('builtin styles', () => {
  it('ids are namespaced and resolvable via findStyle', () => {
    for (const s of BUILTIN_STYLES) {
      expect(isBuiltinStyleId(s.id)).toBe(true);
      expect(findStyle([], s.id)).toBe(s);
    }
    expect(findStyle([userStyle], 'u1')).toBe(userStyle);
    expect(findStyle([], undefined)).toBeUndefined();
  });
});

describe('注疏 length-aware modes', () => {
  it('isLexicalUnit: words and tight phrases yes, prose no', () => {
    expect(isLexicalUnit('serendipity')).toBe(true);
    expect(isLexicalUnit('break a leg')).toBe(true);
    expect(isLexicalUnit('明日黄花')).toBe(true);
    expect(isLexicalUnit('This is a full sentence.')).toBe(false);
    expect(isLexicalUnit('a rather long noun phrase with many words')).toBe(false);
    expect(isLexicalUnit('他说：明天见')).toBe(false); // punctuation → prose
    expect(isLexicalUnit('')).toBe(false);
  });

  it('a word gets the lexicographer persona (senses ①, ≤5 lines contract)', () => {
    const { system } = buildAnnotatePrompt('serendipity', '机缘巧合', 'zh-CN');
    expect(system).toContain('lexicographer');
    expect(system).toContain('①');
    expect(system).not.toContain('注疏者');
  });

  it('a passage keeps the annotator persona and demands 「anchor」 quotes', () => {
    const { system } = buildAnnotatePrompt('The die is cast, and we must cross.', '木已成舟，我们必须过河。', 'zh-CN');
    expect(system).toContain('注疏者');
    expect(system).toContain('「fragment」');
    expect(system).not.toContain('lexicographer');
  });
});

describe('expert templates — independence and placeholder safety', () => {
  it('a USER-ONLY expert template applies on top of the default skeleton (legacy customUserPrompt semantics)', () => {
    const cfg: PromptConfig = { styles: [], siteRules: [], expert: { single: { user: 'Wrap: {text} → {target}' } } };
    const { system, prompt } = buildTranslatePrompt('Hello', 'auto', 'zh-CN', cfg, undefined, academic);
    expect(prompt).toBe('Wrap: Hello → Simplified Chinese');
    // system side is NOT taken over: skeleton + style + reference all intact
    expect(system).toContain('Output ONLY the translation');
    expect(system).toContain('Style directives');
  });

  it('one-pass fill: a page title containing literal {text} cannot smuggle the source text into the title slot', () => {
    const cfg: PromptConfig = { styles: [], siteRules: [], expert: { single: { system: 'S', user: 'T: {title} | {text}' } } };
    const { prompt } = buildTranslatePrompt('SECRET', 'auto', 'zh-CN', cfg, { title: 'About {text} interpolation' });
    expect(prompt).toBe('T: About {text} interpolation | SECRET'); // title's braces stay literal
  });

  it('fillTemplate leaves unknown/unprovided keys as literal braces', () => {
    expect(fillTemplate('{target} {salt} {nope}', { target: 'X' })).toBe('X {salt} {nope}');
  });

  it('batch expert templates get {source}/{title} filled (the UI hint promises them everywhere)', () => {
    const cfg: PromptConfig = {
      styles: [],
      siteRules: [],
      expert: { batch: { system: 'Keep [[{salt}#N]]. Page {title}, from {source}, into {target}.' } },
    };
    const { system } = buildBatchPrompt(['a'], 'en', 'zh-CN', cfg, { title: 'Docs' }, SALT);
    expect(system).toBe(`Keep [[${SALT}#N]]. Page Docs, from English, into Simplified Chinese.\nThe token [[${SALT}~n]] inside a segment represents a paragraph break. Keep each [[${SALT}~n]] token in the translation at the corresponding position, unchanged. It never ends the segment — translate ALL text after it.`);
  });

  it('styleBlock is ONE implementation — the batch skeleton reuses it with its own rules noun', () => {
    const single = buildTranslatePrompt('Hi', 'auto', 'zh-CN', bare, undefined, academic).system;
    const batch = buildBatchPrompt(['Hi'], 'auto', 'zh-CN', bare, undefined, SALT, academic).system;
    expect(single).toContain('the output-format rules above ALWAYS take precedence');
    expect(batch).toContain('the marker and output-format rules above ALWAYS take precedence');
    expect(styleBlock(academic, 'marker and output-format rules')).toContain('marker and output-format rules');
  });

  it('expertDivergesBatchCache: single.system or a USABLE batch template diverges; user-only or invalid batch does not', () => {
    expect(expertDivergesBatchCache({ styles: [], siteRules: [] })).toBe(false);
    expect(expertDivergesBatchCache({ styles: [], siteRules: [], expert: { single: { user: 'X {text}' } } })).toBe(false);
    expect(expertDivergesBatchCache({ styles: [], siteRules: [], expert: { single: { system: 'S' } } })).toBe(true);
    expect(expertDivergesBatchCache({ styles: [], siteRules: [], expert: { batch: { system: 'no marker' } } })).toBe(false);
    expect(expertDivergesBatchCache({ styles: [], siteRules: [], expert: { batch: { system: 'has [[{salt}#N]]' } } })).toBe(true);
  });
});

describe('通读全文 — page overview context', () => {
  it('buildSummaryPrompt: target-language, entity-focused, page text as the user message', () => {
    const { system, prompt } = buildSummaryPrompt('Long page text …', 'zh-CN');
    expect(system).toContain('Simplified Chinese');
    expect(system).toContain('named entities');
    expect(prompt).toBe('Long page text …');
  });

  it('buildReference renders the overview as context-only (and only when present)', () => {
    const withSummary = buildReference('auto', { summary: '本页介绍 K8s 运维。' });
    expect(withSummary).toContain('Page overview');
    expect(withSummary).toContain('本页介绍 K8s 运维。');
    expect(withSummary).toContain('do NOT translate');
    expect(buildReference('auto', {})).toBe('');
  });
});
