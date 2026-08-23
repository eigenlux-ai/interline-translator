/**
 * @module react-app/components/settings/BackupSettings
 *
 * Export / import / reset the whole config (JSON). Import validates through the
 * same Zod schema + migration chain, so an old or hand-edited file is upgraded
 * or rejected cleanly — and its engines land as DRAFTS, because a file saying
 * `enabled: true` is no evidence that the key still works on this machine.
 */

import { useRef, useState } from 'react';
import { Alert, Badge, Button, Group, Paper, Popover, Stack, Text } from '@mantine/core';
import { ArchiveIcon, CheckCircleIcon } from '@/react-app/components/icons';
import type { Config } from '@/data/models';
import { m } from '@/paraglide/messages.js';
import { migrate } from '@/services/config/migrations/v001';
import { configSchema, defaultConfig } from '@/services/config/schema';
import SettingsSection from './SettingsSection';
export interface BackupSettingsProps {
  config: Config;
  onSave: (next: Config) => void;
}

/**
 * An imported engine has never been checked HERE: the key may be revoked, the
 * endpoint unreachable, the file someone else's. Put every gated engine back to
 * draft — exactly what editing a connection field does — so it stays listed
 * (keys and all) but is out of translation until Validate passes. `google-mt`
 * is keyless and has no validate gate, so drafting it would strand the one
 * engine that always works.
 */
export function draftImportedProviders(config: Config): Config {
  return {
    ...config,
    providers: config.providers.map((p) => (p.kind === 'google-mt' ? p : { ...p, draft: true, enabled: false })),
  };
}

export default function BackupSettings({ config, onSave }: BackupSettingsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);
  const [parsedPreview, setParsedPreview] = useState<{
    providers: number;
    rules: number;
    glossary: number;
    config: Config;
  } | null>(null);
  const [dragging, setDragging] = useState(false);

  const exportConfig = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interline-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const inspectConfig = async (file: File) => {
    try {
      const raw = JSON.parse(await file.text());
      const migrated = migrate(raw as Record<string, unknown>);
      const parsed = configSchema.parse(migrated);
      setParsedPreview({
        providers: parsed.providers.length,
        rules: parsed.siteControl.rules.length,
        glossary: parsed.glossary.length,
        config: draftImportedProviders(parsed),
      });
      setStatus(null);
    } catch (e) {
      setParsedPreview(null);
      setStatus({ ok: false, msg: m.backup_import_failed({ error: e instanceof Error ? e.message : String(e) }) });
    }
  };

  const applyImport = () => {
    if (!parsedPreview) return;
    onSave(parsedPreview.config);
    setParsedPreview(null);
    setStatus({ ok: true, msg: m.backup_imported() });
  };

  const [confirmingReset, setConfirmingReset] = useState(false);
  const reset = () => {
    onSave(defaultConfig());
    setConfirmingReset(false);
    setStatus({ ok: true, msg: m.backup_reset_done() });
  };

  return (
    <SettingsSection title={m.backup_section_title()} description={m.backup_section_desc()}>
      <Stack gap="md">
        {/* Export & Actions bar */}
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Button variant="light" onClick={exportConfig}>
              {m.backup_export()}
            </Button>
            <Button variant="default" onClick={() => fileRef.current?.click()}>
              {m.backup_import()}
            </Button>
          </Group>

          <Popover opened={confirmingReset} onChange={setConfirmingReset} withArrow position="bottom-end" shadow="md">
            <Popover.Target>
              <Button variant="subtle" color="danger" size="xs" onClick={() => setConfirmingReset(true)}>
                {m.backup_reset()}
              </Button>
            </Popover.Target>
            <Popover.Dropdown maw={280}>
              <Stack gap="xs">
                <Text size="sm">{m.backup_reset_confirm_text()}</Text>
                <Group gap="xs" justify="flex-end">
                  <Button size="compact-sm" variant="default" onClick={() => setConfirmingReset(false)}>
                    {m.common_cancel()}
                  </Button>
                  <Button size="compact-sm" color="danger" onClick={reset}>
                    {m.backup_reset_confirm()}
                  </Button>
                </Group>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Group>

        {/* Drag and Drop Zone */}
        <Paper
          p="lg"
          radius="md"
          withBorder
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void inspectConfig(file);
          }}
          onClick={() => fileRef.current?.click()}
          style={{
            borderStyle: 'dashed',
            borderColor: dragging ? 'var(--mantine-color-cinnabar-6)' : 'var(--mantine-color-default-border)',
            backgroundColor: dragging
              ? 'color-mix(in srgb, var(--mantine-color-cinnabar-6) 6%, var(--mantine-color-default))'
              : 'var(--mantine-color-default)',
            boxShadow: 'var(--mantine-shadow-xs)',
            transition: 'all 0.2s ease',
            textAlign: 'center',
          }}
        >
          <Stack gap={6} align="center">
            <ArchiveIcon width={24} height={24} style={{ color: 'var(--mantine-color-cinnabar-6)' }} />
            <Text size="sm" fw={600}>
              点击或拖拽备份 JSON 文件至此
            </Text>
            <Text size="xs" c="dimmed">
              支持从旧版本或其它设备导出的 interline-config.json
            </Text>
          </Stack>
        </Paper>

        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          hidden
          onChange={(e) => {
            const f = e.currentTarget.files?.[0];
            if (f) void inspectConfig(f);
            e.currentTarget.value = '';
          }}
        />

        {/* Parsed summary preview */}
        {parsedPreview && (
          <Paper p="md" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'var(--mantine-shadow-xs)' }}>
            <Stack gap="xs">
              <Group justify="space-between" align="center">
                <Group gap={6} align="center">
                  <CheckCircleIcon width={16} height={16} style={{ color: 'var(--mantine-color-teal-6)' }} />
                  <Text size="sm" fw={600}>
                    配置解析成功
                  </Text>
                </Group>
                <Button size="xs" color="cinnabar" onClick={applyImport}>
                  确认载入配置
                </Button>
              </Group>
              <Group gap="md">
                <Badge size="sm" variant="light" color="cinnabar">
                  AI 引擎: {parsedPreview.providers} 个
                </Badge>
                <Badge size="sm" variant="light" color="sand">
                  术语集: {parsedPreview.glossary} 个
                </Badge>
                <Badge size="sm" variant="light" color="sand">
                  站点规则: {parsedPreview.rules} 条
                </Badge>
              </Group>
            </Stack>
          </Paper>
        )}

        {status && (
          <Alert color={status.ok ? 'cinnabar' : 'danger'} variant="light">
            {status.msg}
          </Alert>
        )}
      </Stack>
    </SettingsSection>
  );
}
