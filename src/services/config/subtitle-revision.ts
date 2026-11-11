/** Background-only semantic revision. Only the opaque digest crosses into content scripts. */
import type { Config } from '@/data/models';
import { stableProviderFingerprint, stableStringify } from '@/services/translation/cache/cache-key';
import { resolveSubtitleProvider } from './video-subtitles';

export async function subtitleTranslationRevision(config: Config): Promise<string> {
  const provider = resolveSubtitleProvider(config);
  // Credentials, UI preferences and queue budgets do not change completed translations.
  // Include all prompt/glossary rules so edits to an applicable site rule also invalidate them.
  const value = stableStringify({
    version: 1,
    provider: provider ? stableProviderFingerprint(provider) : null,
    target:
      config.videoSubtitles.translation.target.mode === 'fixed'
        ? config.videoSubtitles.translation.target.language
        : config.translate.target,
    prompt: config.prompt,
    glossary: config.glossary,
  });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}
