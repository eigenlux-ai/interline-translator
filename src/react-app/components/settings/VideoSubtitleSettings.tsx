/** Independent subtitle preferences; every edit uses the background field gateway. */
import { useState } from 'react';
import {
  Accordion,
  Alert,
  Box,
  Button,
  Group,
  Paper,
  SegmentedControl,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import { browser } from '#imports';
import { langOptions, type Config, type VideoSubtitlesPatch } from '@/data/models';
import { resolveUiLang } from '@/i18n';
import { m } from '@/paraglide/messages.js';
import { getConfigService, toPublicConfig } from '@/services/config/public';
import { defaultVideoSubtitles, SUBTITLE_REQUEST_LIMITS } from '@/services/config/video-subtitles';
import PreferenceNumberInput from './PreferenceNumberInput';
import SettingsSection from './SettingsSection';

const LANGUAGES = langOptions();
const INHERIT = '__inherit__';

export default function VideoSubtitleSettings({ config }: { config: Config }) {
  const preferences = config.videoSubtitles;
  const projection = toPublicConfig(config);
  const [status, setStatus] = useState<'ok' | 'error' | null>(null);
  const [busy, setBusy] = useState(false);
  const run = async (operation: () => Promise<unknown>) => {
    setStatus(null);
    setBusy(true);
    try {
      await operation();
      setStatus('ok');
    } catch {
      setStatus('error');
    } finally {
      setBusy(false);
    }
  };
  const patch = (fields: VideoSubtitlesPatch) => {
    void run(() => getConfigService().patchVideoSubtitles(fields));
  };
  const target = preferences.translation.target;
  const provider = preferences.translation.provider;
  const appearance = preferences.appearance;
  const effectiveTarget = target.mode === 'fixed' ? target.language : config.translate.target;
  const languageName = LANGUAGES.find((l) => l.value === effectiveTarget)?.label ?? effectiveTarget;
  const available = projection.availableProviders.map((p) => ({ value: p.id, label: p.label }));
  if (provider.mode === 'fixed' && !available.some((p) => p.value === provider.providerId)) {
    available.push({ value: provider.providerId, label: m.video_subtitles_unavailable() });
  }
  const requestLabels: Record<keyof typeof SUBTITLE_REQUEST_LIMITS, () => string> = {
    maxConcurrent: m.video_subtitles_concurrent,
    requestsPerSecond: m.video_subtitles_rate,
    mtLookAheadSeconds: m.video_subtitles_mt_window,
    llmLookAheadSeconds: m.video_subtitles_llm_window,
    maxBatchItems: m.video_subtitles_items,
    maxBatchChars: m.video_subtitles_chars,
  };
  const previewLocale = resolveUiLang('auto', effectiveTarget);
  const source = (
    <div key="source" dir="auto">
      {m.video_subtitles_preview_original({}, { locale: previewLocale === 'en' ? 'zh' : 'en' })}
    </div>
  );
  const translation = (
    <div key="translation" dir="auto" style={{ fontWeight: 600 }}>
      {m.video_subtitles_preview_translation({}, { locale: previewLocale })}
    </div>
  );
  return (
    <SettingsSection title={m.video_subtitles_title()} description={m.video_subtitles_description()}>
      <Stack gap="md">
        <Switch
          label={m.video_subtitles_enabled()}
          checked={preferences.enabled}
          onChange={(e) => patch({ enabled: e.currentTarget.checked })}
        />
        <Paper withBorder p="md">
          <Stack gap="sm">
            <Switch
              label="YouTube"
              checked={preferences.platforms.youtube?.enabled ?? false}
              onChange={(e) => patch({ platforms: { youtube: { enabled: e.currentTarget.checked } } })}
            />
            <Switch
              label={m.video_subtitles_auto()}
              checked={preferences.platforms.youtube?.autoEnable ?? false}
              onChange={(e) => patch({ platforms: { youtube: { autoEnable: e.currentTarget.checked } } })}
            />
            <Text size="sm" c="dimmed">
              {m.video_subtitles_source()}
            </Text>
          </Stack>
        </Paper>
        <SimpleGrid type="container" cols={{ base: 1, '600px': 2 }}>
          <Select
            label={m.settings_target_label()}
            description={m.video_subtitles_effective({ value: languageName })}
            data={[{ value: INHERIT, label: m.video_subtitles_inherit() }, ...LANGUAGES]}
            value={target.mode === 'inherit' ? INHERIT : target.language}
            allowDeselect={false}
            searchable
            onChange={(v) =>
              v &&
              patch({ translation: { target: v === INHERIT ? { mode: 'inherit' } : { mode: 'fixed', language: v } } })
            }
          />
          <Select
            label={m.settings_default_provider()}
            description={m.video_subtitles_effective({
              value: projection.effectiveSubtitleProvider.label || m.video_subtitles_unavailable(),
            })}
            data={[{ value: INHERIT, label: m.video_subtitles_inherit() }, ...available]}
            value={provider.mode === 'inherit' ? INHERIT : provider.providerId}
            allowDeselect={false}
            onChange={(v) =>
              v &&
              patch({
                translation: { provider: v === INHERIT ? { mode: 'inherit' } : { mode: 'fixed', providerId: v } },
              })
            }
          />
        </SimpleGrid>
        <Switch
          label={m.video_subtitles_prefer_human()}
          checked={preferences.translation.preferHumanCaptions}
          onChange={(event) => patch({ translation: { preferHumanCaptions: event.currentTarget.checked } })}
        />
        {projection.effectiveSubtitleProvider.status === 'unavailable' && (
          <Alert color="yellow">{m.video_subtitles_unavailable()}</Alert>
        )}
        <Text fw={600} size="sm">
          {m.display_label()}
        </Text>
        <SegmentedControl
          aria-label={m.display_label()}
          value={appearance.displayMode}
          data={[
            { value: 'original', label: m.display_original() },
            { value: 'translation', label: m.display_translation() },
            { value: 'bilingual', label: m.display_bilingual() },
          ]}
          onChange={(v) => patch({ appearance: { displayMode: v as typeof appearance.displayMode } })}
        />
        <Select
          label={m.video_subtitles_order()}
          data={[
            { value: 'above', label: m.video_subtitles_above() },
            { value: 'below', label: m.video_subtitles_below() },
          ]}
          allowDeselect={false}
          value={appearance.translationPosition}
          onChange={(v) => v && patch({ appearance: { translationPosition: v as 'above' | 'below' } })}
        />
        <SimpleGrid type="container" cols={{ base: 1, '720px': 3 }}>
          <PreferenceNumberInput
            label={m.video_subtitles_font()}
            min={12}
            max={64}
            allowDecimal={false}
            value={appearance.fontSize}
            onCommit={(fontSize) => patch({ appearance: { fontSize } })}
          />
          <PreferenceNumberInput
            label={m.video_subtitles_position()}
            min={0}
            max={60}
            value={appearance.positionPercent}
            onCommit={(positionPercent) => patch({ appearance: { positionPercent } })}
          />
          <PreferenceNumberInput
            label={m.video_subtitles_opacity()}
            min={0}
            max={1}
            step={0.05}
            decimalScale={2}
            value={appearance.backgroundOpacity}
            onCommit={(backgroundOpacity) => patch({ appearance: { backgroundOpacity } })}
          />
        </SimpleGrid>
        <Box
          aria-label={m.video_subtitles_preview()}
          role="img"
          style={{
            position: 'relative',
            height: 220,
            overflow: 'hidden',
            background: 'linear-gradient(135deg,#334155,#0f172a)',
            borderRadius: 8,
          }}
        >
          <div
            style={{
              position: 'absolute',
              bottom: `${appearance.positionPercent}%`,
              width: '100%',
              textAlign: 'center',
              padding: '0 12px',
              boxSizing: 'border-box',
              color: '#fff',
              fontSize: appearance.fontSize,
              lineHeight: 1.45,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: `rgba(0,0,0,${appearance.backgroundOpacity})`,
                borderRadius: 4,
              }}
            >
              {appearance.displayMode === 'original'
                ? source
                : appearance.displayMode === 'translation'
                  ? translation
                  : appearance.translationPosition === 'above'
                    ? [translation, source]
                    : [source, translation]}
            </div>
          </div>
        </Box>
        <Accordion variant="separated">
          <Accordion.Item value="requests">
            <Accordion.Control>{m.video_subtitles_requests()}</Accordion.Control>
            <Accordion.Panel>
              <Stack gap="sm">
                <Text size="sm" c="dimmed">
                  {m.video_subtitles_requests_desc()}
                </Text>
                {(Object.keys(SUBTITLE_REQUEST_LIMITS) as Array<keyof typeof SUBTITLE_REQUEST_LIMITS>).map((key) => (
                  <PreferenceNumberInput
                    key={key}
                    label={requestLabels[key]()}
                    value={preferences.requests[key]}
                    min={SUBTITLE_REQUEST_LIMITS[key][0]}
                    max={SUBTITLE_REQUEST_LIMITS[key][1]}
                    allowDecimal={key === 'requestsPerSecond'}
                    step={key === 'requestsPerSecond' ? 0.1 : 1}
                    onCommit={(value) => patch({ requests: { [key]: value } })}
                  />
                ))}
                <Button
                  variant="light"
                  disabled={busy}
                  onClick={() => patch({ requests: defaultVideoSubtitles().requests })}
                >
                  {m.video_subtitles_reset_requests()}
                </Button>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Text size="sm" c="dimmed">
          {m.video_subtitles_clear_desc()}
        </Text>
        <Group>
          <Button
            variant="default"
            disabled={busy}
            onClick={() => {
              void run(async () => {
                const response = await browser.runtime.sendMessage({ type: 'subtitle:export-diagnostics', version: 1 });
                if (response?.version !== 1 || !Array.isArray(response.events))
                  throw new Error('Diagnostics unavailable');
                const url = URL.createObjectURL(
                  new Blob([JSON.stringify(response, null, 2)], { type: 'application/json' })
                );
                const anchor = document.createElement('a');
                anchor.href = url;
                anchor.download = 'interline-subtitle-diagnostics.json';
                anchor.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              });
            }}
          >
            {m.video_subtitles_export_diagnostics()}
          </Button>
          <Button
            variant="light"
            disabled={busy}
            onClick={() => {
              void run(async () => {
                const response = await browser.runtime.sendMessage({ type: 'subtitle:clear-cache', version: 1 });
                if (!response?.ok) throw new Error('Subtitle cache could not be cleared');
              });
            }}
          >
            {m.video_subtitles_clear()}
          </Button>
          <Button
            variant="default"
            disabled={busy}
            onClick={() => {
              void run(() => getConfigService().resetVideoSubtitles());
            }}
          >
            {m.video_subtitles_reset()}
          </Button>
        </Group>
        {status && (
          <Text role="status" size="sm" c={status === 'error' ? 'red' : 'dimmed'}>
            {status === 'error' ? m.video_subtitles_operation_failed() : m.video_subtitles_saved()}
          </Text>
        )}
      </Stack>
    </SettingsSection>
  );
}
