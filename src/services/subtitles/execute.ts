/** Background-only subtitle executor. Each actual upstream call acquires exactly one shared slot. */
import { streamText } from 'ai';
import type { Config, LangCode, ProviderConfig, SourceLang } from '@/data/models';
import { makeWatchdog, shortStopError, watchdogError } from '@/services/stream/limiter';
import { sharedAdmission, type AdmissionMeta } from '@/services/translation/admission';
import { buildBatchPrompt, createBatchParser, decodeNewlineTokens } from '@/services/translation/batch/protocol';
import { resolveGlossary } from '@/services/translation/glossary';
import { llmCallOptions, requireApiKey } from '@/services/translation/preflight';
import { resolvePromptStyle, styleBlock } from '@/services/translation/prompts';
import { createLlmModel } from '@/services/translation/provider/llm';
import { googleFreeTranslate } from '@/services/translation/provider/mt';
import { createThinkStripper } from '@/services/translation/reasoning';
import { SUBTITLE_LIMITS } from './protocol';

export interface SubtitleExecutionItem {
  key: string;
  text: string;
  context: string;
}
export interface SubtitleExecution {
  config: Config;
  provider: ProviderConfig;
  source: string;
  target: string;
  title?: string;
  domain?: string;
  items: SubtitleExecutionItem[];
  signal: AbortSignal;
  admission: Omit<AdmissionMeta, 'providerId' | 'signal'>;
  /** Called once as soon as a numbered cue closes, before later cues finish. */
  onItem?: (key: string, text: string) => void;
}
export async function executeSubtitleBatch(input: SubtitleExecution): Promise<Map<string, string>> {
  const { source, target, items, signal } = input;
  if (input.provider.kind === 'google-mt') {
    const results = await Promise.all(
      items.map(async (item) => {
        const out = await sharedAdmission.run({ ...input.admission, providerId: input.provider.id, signal }, () =>
          googleFreeTranslate(item.text, source as SourceLang, target as LangCode, undefined, signal)
        );
        if (out.text) input.onItem?.(item.key, out.text);
        return [item.key, out.text] as const;
      })
    );
    return new Map(results);
  }
  // Each marked item has its OWN explicit stable context. Batch membership does
  // not supply context, and context is never included in the requested output.
  const built = buildBatchPrompt(
    items.map((item) => item.text),
    source as SourceLang,
    target as LangCode,
    input.config.prompt
  );
  built.system =
    [
      `Translate spoken video subtitles from ${source} into ${target}. Use concise, natural language.`,
      'Return only each exact marker followed by that subtitle translation. Translate each item independently using only its own reference. Other batch items are unrelated. Never translate reference context or add commentary.',
      `Title: ${input.title ?? ''}`,
      ...items.map(
        (item, i) =>
          `Reference for marker ${i + 1} (do not translate): ${item.context}\nTerminology for this item: ${JSON.stringify(resolveGlossary(input.config.glossary, input.domain ?? 'www.youtube.com', item.text))}`
      ),
      `Preserve paragraph tokens [[${built.salt}~n]] and all numbered markers exactly.`,
    ].join('\n') +
    styleBlock(
      resolvePromptStyle(input.config.prompt, input.domain ?? 'www.youtube.com'),
      'subtitle marker and output-format rules'
    );
  const parser = createBatchParser(built.salt);
  const strip = createThinkStripper();
  const acc = new Map<number, string>();
  const output = new Map<string, string>();
  const apply = (events: ReturnType<typeof parser.push>) => {
    for (const event of events) {
      const item = items[event.index - 1];
      if (!item || output.has(item.key)) continue;
      acc.set(event.index, (acc.get(event.index) ?? '') + event.delta);
      if (event.done) {
        const text = decodeNewlineTokens(acc.get(event.index) ?? '', built.salt).trim();
        if (text) {
          output.set(item.key, text);
          input.onItem?.(item.key, text);
        }
      }
    }
  };
  await sharedAdmission.run({ ...input.admission, providerId: input.provider.id, signal }, async () => {
    const provider = input.provider;
    const model = await createLlmModel(provider, requireApiKey(provider));
    const localAbort = new AbortController();
    const watchdog = makeWatchdog(
      AbortSignal.any([signal, localAbort.signal]),
      SUBTITLE_LIMITS.idleExecutionMs,
      SUBTITLE_LIMITS.totalExecutionMs
    );
    let error: unknown;
    try {
      const result = streamText({
        model,
        system: built.system,
        prompt: built.prompt,
        abortSignal: watchdog.signal,
        maxRetries: 0,
        ...llmCallOptions(provider),
        maxOutputTokens: Math.min(
          provider.params?.maxOutputTokens ?? SUBTITLE_LIMITS.defaultOutputTokens,
          SUBTITLE_LIMITS.maxOutputTokens
        ),
        onError: (event) => {
          error = event.error;
        },
      });
      const finish = Promise.resolve(result.finishReason).catch(() => undefined);
      let characters = 0;
      for await (const delta of result.textStream) {
        watchdog.beat();
        characters += delta.length;
        signal.throwIfAborted();
        if (characters > SUBTITLE_LIMITS.maxResponseCharacters) throw new Error('Subtitle response exceeds budget');
        apply(parser.push(strip.push(delta)));
      }
      if (error) throw error;
      signal.throwIfAborted();
      if (watchdog.timedOut()) throw watchdogError();
      const stopped = shortStopError(await finish);
      if (stopped) throw stopped;
      apply(parser.push(strip.flush()));
      apply(parser.flush());
    } catch (error) {
      localAbort.abort(error);
      throw error;
    } finally {
      watchdog.done();
    }
  });
  return output;
}
