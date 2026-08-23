/**
 * @module react-app/components/settings/SiteSettings
 *
 * Default translation behaviour + per-site rules (glob patterns). `always` =
 * auto-translate on load; `auto` = manual trigger; `never` = blocked.
 */

import { SegmentedControl, Stack, Text } from '@mantine/core';
import type { Config, SiteMode, SiteRule } from '@/data/models';
import { m } from '@/paraglide/messages.js';
import PatternRuleTable from './PatternRuleTable';
import SettingsSection from './SettingsSection';

/** Built per render — the labels follow the interface language. */
const modeOptions = (): Array<{ value: SiteMode; label: string }> => [
  { value: 'auto', label: m.site_mode_manual() },
  { value: 'always', label: m.site_mode_always() },
  { value: 'never', label: m.site_mode_never() },
];

export interface SiteSettingsProps {
  config: Config;
  onSave: (next: Config) => void;
}

export default function SiteSettings({ config, onSave }: SiteSettingsProps) {
  const sc = config.siteControl;

  const setDefault = (mode: SiteMode) => onSave({ ...config, siteControl: { ...sc, defaultMode: mode } });
  const setRules = (rules: SiteRule[]) => onSave({ ...config, siteControl: { ...sc, rules } });

  return (
    <SettingsSection title={m.site_section_title()} description={m.site_section_desc()}>
      <Stack gap={6}>
        <Text size="sm" fw={500}>
          {m.site_default_label()}
        </Text>
        <SegmentedControl data={modeOptions()} value={sc.defaultMode} onChange={(v) => setDefault(v as SiteMode)} />
      </Stack>

      <Stack gap={6}>
        <Text size="sm" fw={500}>
          {m.site_rules_label()}
        </Text>
        <PatternRuleTable
          rules={sc.rules}
          onChange={setRules}
          makeRule={(pattern) => ({ pattern, mode: 'always' as SiteMode })}
          addLabel={m.site_add_rule()}
          removeAria={m.site_remove_rule_aria()}
          renderControl={(r, replace) => (
            <SegmentedControl size="xs" data={modeOptions()} value={r.mode} onChange={(v) => replace({ ...r, mode: v as SiteMode })} />
          )}
        />
      </Stack>
    </SettingsSection>
  );
}
