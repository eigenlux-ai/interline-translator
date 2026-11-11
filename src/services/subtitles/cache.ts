import type { Config, ProviderConfig } from '@/data/models';
import { stableProviderFingerprint, stableStringify } from '@/services/translation/cache/cache-key';
import { clearCacheNamespace, dexieCache } from '@/services/translation/cache/db';
import { resolveGlossary } from '@/services/translation/glossary';
import { resolvePromptStyle, styleBlock } from '@/services/translation/prompts';
import type { SubtitleSubscription, SubtitleWindow } from './protocol';

export const SUBTITLE_PROMPT_VERSION = 'subtitle-1';
let epoch = 0;
let writes: Promise<void> = Promise.resolve();
export function subtitleCacheEpoch(): number {
  return epoch;
}
/** Epoch changes before asynchronous deletion, and writes serialize with clearing. */
export function clearSubtitleCache(): Promise<void> {
  epoch++;
  const result = writes.then(() => clearCacheNamespace('subtitle:'));
  writes = result.catch(() => {});
  return result;
}
export function writeSubtitleCache(key: string, text: string, expectedEpoch: number): Promise<void> {
  const result = writes.then(async () => {
    if (epoch === expectedEpoch && text) await dexieCache.set(key, text);
  });
  writes = result.catch(() => {});
  return result;
}
export async function subtitleCacheKey(
  config: Config,
  provider: ProviderConfig,
  target: string,
  window: SubtitleWindow,
  cue: SubtitleSubscription,
  domain = 'www.youtube.com'
): Promise<string> {
  const input = stableStringify({
    task: SUBTITLE_PROMPT_VERSION,
    provider: stableProviderFingerprint(provider),
    source: window.sourceLanguage,
    target,
    text: cue.text.trim().replace(/\r\n/g, '\n'),
    context: cue.context ?? '',
    title: window.title ?? '',
    style: styleBlock(resolvePromptStyle(config.prompt, domain), 'subtitle marker and output-format rules'),
    glossary: resolveGlossary(config.glossary, domain, cue.text),
  });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return `subtitle:${Array.from(new Uint8Array(digest), (x) => x.toString(16).padStart(2, '0')).join('')}`;
}
