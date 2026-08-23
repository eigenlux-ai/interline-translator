import { describe, expect, it } from 'vitest';
import type { PromptConfig } from '@/data/models';
import { ANNOTATE_EMPTY_SENTINEL, buildAnnotatePrompt, buildTranslatePrompt } from './index';

const CFG: PromptConfig = { styles: [], siteRules: [] };

describe('buildTranslatePrompt', () => {
  it('keeps the user message as NOTHING but the text (labels would echo back translated)', () => {
    const { system, prompt } = buildTranslatePrompt('Hello there', 'auto', 'zh-CN', CFG);
    expect(prompt).toBe('Hello there');
    expect(system).toContain('Simplified Chinese');
  });
});

describe('buildAnnotatePrompt', () => {
  it('hands the model BOTH sides and demands terse target-language notes', () => {
    // A full sentence → passage mode (a bare idiom now gets the词条 persona).
    const { system, prompt } = buildAnnotatePrompt('Break a leg out there tonight!', '今晚祝你演出大获成功！', 'zh-CN');
    expect(prompt).toContain('原文:\nBreak a leg out there tonight!');
    expect(prompt).toContain('译文:\n今晚祝你演出大获成功！');
    expect(system).toContain('Simplified Chinese');
    expect(system).toContain('· '); // the one-line note format is pinned in the contract
    expect(system).toContain(ANNOTATE_EMPTY_SENTINEL); // and so is the quiet empty
  });
});
