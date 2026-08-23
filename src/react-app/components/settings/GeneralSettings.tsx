/**
 * @module react-app/components/settings/GeneralSettings
 *
 * Language pair, default provider, and appearance.
 */

import { useEffect, useState } from 'react';
import {
  Anchor,
  Badge,
  Group,
  MultiSelect,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Text,
} from '@mantine/core';
import { CheckCircleIcon, SparklesIcon, TranslateIcon } from '@/react-app/components/icons';
import { langOptions, sourceOptions, type Config, type DisplayMode } from '@/data/models';
import { UI_LANG_NAMES, UI_LANGS, type UiLangSetting } from '@/data/models/lang';
import { m } from '@/paraglide/messages.js';
import { useVisual } from '@/react-app/managers/VisualManager/context';
import type { VisualColorScheme } from '@/react-app/managers/VisualManager/defs';
import { detectorStatus, downloadDetectorModel, type DetectorStatus } from '@/services/detect/model';
import SettingsSection from './SettingsSection';
import StylePreview, { FontPreview } from './StylePreview';
const TARGETS = langOptions();

const DETECTOR_COPY: Record<DetectorStatus | 'checking', () => string> = {
  available: m.settings_detector_ready,
  downloading: m.settings_detector_downloading,
  unavailable: m.settings_detector_unavailable,
  checking: m.settings_detector_checking,
  downloadable: m.settings_detector_downloadable,
};

export interface GeneralSettingsProps {
  config: Config;
  onPatch: (partial: Partial<Config>) => void;
}

export default function GeneralSettings({ config, onPatch }: GeneralSettingsProps) {
  // Through the VisualManager wrapper, NOT raw useMantineColorScheme(): the
  // wrapper pins keepTransitions:true (no transition-killing <style> appended
  // to document.head — the registry's documented invariant) and keeps the
  // VisualManager persistence in sync.
  const { colorScheme, setColorScheme } = useVisual();
  const [detector, setDetector] = useState<DetectorStatus | 'checking'>('checking');
  useEffect(() => {
    void detectorStatus().then(setDetector);
  }, []);
  const downloadModel = async () => {
    setDetector('downloading');
    try {
      await downloadDetectorModel(); // this click is the required user gesture
      setDetector('available');
    } catch {
      setDetector(await detectorStatus());
    }
  };

  const sources = sourceOptions(m.settings_source_auto());

  const providerOptions = config.providers
    .filter((p) => p.enabled && !p.draft)
    .map((p) => ({ value: p.id, label: p.label ?? p.id }));

  const setTranslate = (partial: Partial<Config['translate']>) =>
    onPatch({ translate: { ...config.translate, ...partial } });
  const setAppearance = (partial: Partial<Config['appearance']>) =>
    onPatch({ appearance: { ...config.appearance, ...partial } });
  const setInput = (partial: Partial<Config['inputTranslation']>) =>
    onPatch({ inputTranslation: { ...config.inputTranslation, ...partial } });
  const input = config.inputTranslation;

  return (
    <SettingsSection title={m.settings_general_title()} description={m.settings_general_desc()}>
      <Stack gap="lg">
        {/* Card 1: 翻译与目标语言 */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'var(--mantine-shadow-xs)' }}>
          <Stack gap="md">
            <Group gap={6} align="center">
              <TranslateIcon width={16} height={16} style={{ color: 'var(--mantine-color-cinnabar-6)' }} />
              <Text size="sm" fw={600}>
                {m.settings_source_label()} / {m.settings_target_label()}
              </Text>
            </Group>

            <Group grow>
              <Select
                label={m.settings_source_label()}
                data={sources}
                value={config.translate.source}
                onChange={(v) => v && setTranslate({ source: v })}
                allowDeselect={false}
              />
              <Select
                label={m.settings_target_label()}
                data={TARGETS}
                value={config.translate.target}
                onChange={(v) => v && setTranslate({ target: v })}
                allowDeselect={false}
              />
            </Group>

            <Select
              label={m.settings_ui_language()}
              description={m.settings_ui_language_desc()}
              data={[
                { value: 'auto', label: m.settings_ui_language_auto() },
                ...UI_LANGS.map((l) => ({ value: l, label: UI_LANG_NAMES[l] })),
              ]}
              value={config.language.ui}
              onChange={(v) => v && onPatch({ language: { ui: v as UiLangSetting } })}
              allowDeselect={false}
            />

            <Select
              label={m.settings_default_provider()}
              description={m.settings_default_provider_desc()}
              data={providerOptions}
              value={config.translate.defaultProviderId ?? null}
              onChange={(v) => v && setTranslate({ defaultProviderId: v })}
              allowDeselect={false}
            />

            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div>
                <Text size="sm" fw={500}>
                  {m.settings_page_context_label()}
                </Text>
                <Text size="xs" c="dimmed" maw={460}>
                  {m.settings_page_context_desc()}
                </Text>
              </div>
              <Switch
                checked={config.translate.pageContext ?? false}
                onChange={(e) => setTranslate({ pageContext: e.currentTarget.checked })}
                aria-label={m.settings_page_context_label()}
              />
            </Group>

            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div>
                <Text size="sm" fw={500}>
                  {m.settings_rich_text_label()}
                </Text>
                <Text size="xs" c="dimmed" maw={460}>
                  {m.settings_rich_text_desc()}
                </Text>
              </div>
              <Switch
                checked={config.translate.richText ?? true}
                onChange={(e) => setTranslate({ richText: e.currentTarget.checked })}
                aria-label={m.settings_rich_text_label()}
              />
            </Group>

            <MultiSelect
              label={m.settings_skip_langs()}
              description={m.settings_skip_langs_desc()}
              placeholder={config.translate.skipLanguages.length ? undefined : m.settings_skip_langs_none()}
              data={TARGETS}
              value={config.translate.skipLanguages}
              onChange={(v) => setTranslate({ skipLanguages: v })}
              clearable
              searchable
            />
          </Stack>
        </Paper>

        {/* Card 2: 排版与呈现预览 */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'var(--mantine-shadow-xs)' }}>
          <Stack gap="md">
            <Group gap={6} align="center">
              <SparklesIcon width={16} height={16} style={{ color: 'var(--mantine-color-cinnabar-6)' }} />
              <Text size="sm" fw={600}>
                {m.settings_style_title()}
              </Text>
            </Group>

            <Stack gap={8}>
              <div>
                <Text size="sm" fw={500}>
                  {m.settings_style_title()}
                </Text>
                <Text size="xs" c="dimmed">
                  {m.settings_style_desc()}
                </Text>
              </div>
              <StylePreview
                value={config.appearance.bilingualStyle}
                onChange={(v) => setAppearance({ bilingualStyle: v })}
                font={config.appearance.translationFont}
              />
            </Stack>

            <Stack gap={8}>
              <Text size="sm" fw={500}>
                {m.settings_font_title()}
              </Text>
              <FontPreview
                value={config.appearance.translationFont}
                onChange={(v) => setAppearance({ translationFont: v })}
              />
            </Stack>

            <Stack gap={6}>
              <Text size="sm" fw={500}>
                {m.display_label()}
              </Text>
              <SegmentedControl
                data={[
                  { value: 'bilingual', label: m.display_bilingual() },
                  { value: 'translation', label: m.display_translation() },
                  { value: 'original', label: m.display_original() },
                ]}
                value={config.appearance.displayMode ?? 'bilingual'}
                onChange={(v) => setAppearance({ displayMode: v as DisplayMode })}
              />
            </Stack>

            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div>
                <Text size="sm" fw={500}>
                  {m.interleave_label()}
                </Text>
                <Text size="xs" c="dimmed">
                  {m.interleave_desc()}
                </Text>
              </div>
              <Switch
                checked={config.appearance.paragraphInterleave ?? true}
                onChange={(e) => setAppearance({ paragraphInterleave: e.currentTarget.checked })}
              />
            </Group>

            <Stack gap={6}>
              <Text size="sm" fw={500}>
                {m.settings_appearance_title()}
              </Text>
              <SegmentedControl
                data={[
                  { value: 'light', label: m.settings_appearance_light() },
                  { value: 'dark', label: m.settings_appearance_dark() },
                  { value: 'auto', label: m.settings_appearance_auto() },
                ]}
                value={colorScheme}
                onChange={(v) => setColorScheme(v as VisualColorScheme)}
              />
            </Stack>
          </Stack>
        </Paper>

        {/* Card 3: 输入框就地翻译 */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'var(--mantine-shadow-xs)' }}>
          <Stack gap="sm">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <div>
                <Text size="sm" fw={600}>
                  {m.settings_input_title()}
                </Text>
                <Text size="xs" c="dimmed">
                  {m.settings_input_desc({ count: input.triggerCount })}
                  {m.settings_input_hint_1()}
                  <Text span ff="monospace">
                    /en
                  </Text>
                  {m.settings_input_hint_2()}
                  <Text span ff="monospace">
                    en:
                  </Text>
                  {m.settings_input_hint_3()}
                </Text>
              </div>
              <Switch
                checked={input.enabled}
                onChange={(e) => setInput({ enabled: e.currentTarget.checked })}
                aria-label={m.settings_input_enable_aria()}
              />
            </Group>
            {input.enabled && (
              <Group gap="md" align="flex-end" pt={4}>
                <Select
                  label={m.settings_input_target()}
                  description={m.settings_input_target_desc()}
                  data={TARGETS}
                  value={input.target}
                  onChange={(v) => v && setInput({ target: v })}
                  allowDeselect={false}
                  w={160}
                />
                <Stack gap={4}>
                  <Text size="sm" fw={500}>
                    {m.settings_input_trigger()}
                  </Text>
                  <SegmentedControl
                    size="xs"
                    data={['2', '3', '4', '5']}
                    value={String(input.triggerCount)}
                    onChange={(v) => setInput({ triggerCount: Number(v) })}
                  />
                </Stack>
              </Group>
            )}
          </Stack>
        </Paper>

        {/* Card 4: 端侧语言检测 */}
        <Paper p="md" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'var(--mantine-shadow-xs)' }}>
          <Group justify="space-between" align="center" wrap="nowrap">
            <Stack gap={2}>
              <Text size="sm" fw={600}>
                {m.settings_detector_prefix().replace(/[:：\s]+$/, '')}
              </Text>
              <Group gap="xs" align="center">
                <Badge
                  size="sm"
                  variant="light"
                  color={detector === 'available' ? 'teal' : detector === 'checking' ? 'gray' : 'cinnabar'}
                  leftSection={detector === 'available' ? <CheckCircleIcon width={12} height={12} /> : undefined}
                >
                  {DETECTOR_COPY[detector]()}
                </Badge>
              </Group>
            </Stack>
            {(detector === 'downloadable' || detector === 'downloading') && (
              <Anchor component="button" type="button" size="xs" onClick={downloadModel} fw={600}>
                {detector === 'downloading' ? '…' : m.settings_detector_download()}
              </Anchor>
            )}
          </Group>
        </Paper>
      </Stack>
    </SettingsSection>
  );
}
