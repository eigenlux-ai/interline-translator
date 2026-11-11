/**
 * @module react-app/components/settings/BackupSettings
 *
 * Export / import / reset the whole config (JSON). Import validates through the
 * same Zod schema + migration chain, so an old or hand-edited file is upgraded
 * or rejected cleanly — and its engines land as DRAFTS, because a file saying
 * `enabled: true` is no evidence that the key still works on this machine.
 *
 * Export leaves `apiKeys` OUT by default (see {@link exportableConfig}): a
 * downloaded file is exactly the kind of artifact that ends up in a chat log or
 * a sync folder, and the imported engine is a draft that needs re-validation
 * anyway. Carrying secrets along is an explicit, confirmed escape hatch for
 * users moving machines on purpose.
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
  onSave: (next: Config) => void | Promise<void>;
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

/**
 * The payload written to `interline-config.json`. API keys are STRIPPED by
 * default — the file is a shareable artifact and a plaintext key inside it is a
 * secret the user never meant to hand over. Everything else (kind, model, base
 * URL, headers, params, rules, glossary) is kept verbatim, and an imported
 * engine re-enters through the validation gate as a draft either way
 * ({@link draftImportedProviders}), so the keys would have to be re-typed and
 * re-proven regardless. `includeApiKeys` is the one deliberate way out, and the
 * caller must have warned the user in plain words before passing it.
 */
export function exportableConfig(config: Config, includeApiKeys = false): Config {
  return includeApiKeys ? config : { ...config, providers: config.providers.map((p) => ({ ...p, apiKeys: [] })) };
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
  const [saving, setSaving] = useState(false);
  /** Open state of the "export WITH keys" confirmation popover. */
  const [confirmingExportKeys, setConfirmingExportKeys] = useState(false);
  const savingRef = useRef(false);
  const inspection = useRef(0);

  const download = (payload: Config) => {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'interline-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  /** Default export: everything except the API keys (see {@link exportableConfig}). */
  const exportConfig = () => download(exportableConfig(config));
  /** The confirmed escape hatch: keys in plaintext, after the user opts in. */
  const exportConfigWithKeys = () => {
    setConfirmingExportKeys(false);
    download(exportableConfig(config, true));
  };

  const inspectConfig = async (file: File) => {
    if (savingRef.current) return;
    const id = ++inspection.current;
    setParsedPreview(null);
    setStatus(null);
    try {
      const text = await file.text();
      if (id !== inspection.current || savingRef.current) return;
      const raw = JSON.parse(text);
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
      if (id !== inspection.current) return;
      setParsedPreview(null);
      setStatus({ ok: false, msg: m.backup_import_failed({ error: e instanceof Error ? e.message : String(e) }) });
    }
  };

  const [confirmingReset, setConfirmingReset] = useState(false);
  const persist = async (next: Config, importing: boolean) => {
    if (savingRef.current) return;
    savingRef.current = true;
    inspection.current++; // reset/import invalidates any older file read
    setSaving(true);
    setStatus(null);
    try {
      await onSave(next);
      setParsedPreview(null);
      setConfirmingReset(false);
      setStatus({ ok: true, msg: importing ? m.backup_imported() : m.backup_reset_done() });
    } catch (e) {
      setStatus({ ok: false, msg: m.backup_save_failed({ error: e instanceof Error ? e.message : String(e) }) });
    } finally {
      savingRef.current = false;
      setSaving(false);
    }
  };
  const applyImport = () => {
    if (parsedPreview) void persist(parsedPreview.config, true);
  };
  const reset = () => {
    void persist(defaultConfig(), false);
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
            {/* The one path that writes keys into the file — behind an explicit
                confirmation that says so in plain words, same Popover-confirm
                pattern as Restore defaults below. */}
            <Popover
              opened={confirmingExportKeys}
              onChange={setConfirmingExportKeys}
              withArrow
              position="bottom-start"
              shadow="md"
            >
              <Popover.Target>
                <Button variant="subtle" size="xs" onClick={() => setConfirmingExportKeys(true)}>
                  {m.backup_export_keys()}
                </Button>
              </Popover.Target>
              <Popover.Dropdown maw={280}>
                <Stack gap="xs">
                  <Text size="sm">{m.backup_export_keys_confirm_text()}</Text>
                  <Group gap="xs" justify="flex-end">
                    <Button size="compact-sm" variant="default" onClick={() => setConfirmingExportKeys(false)}>
                      {m.common_cancel()}
                    </Button>
                    <Button size="compact-sm" color="danger" onClick={exportConfigWithKeys}>
                      {m.backup_export_keys_confirm()}
                    </Button>
                  </Group>
                </Stack>
              </Popover.Dropdown>
            </Popover>
            <Button variant="default" disabled={saving} onClick={() => fileRef.current?.click()}>
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
                  <Button size="compact-sm" color="danger" loading={saving} onClick={reset}>
                    {m.backup_reset_confirm()}
                  </Button>
                </Group>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Group>

        {/* Drag and Drop Zone */}
        <Paper
          component="button"
          type="button"
          p={24}
          radius={12}
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
            transition: 'border-color 160ms ease, background-color 160ms ease',
            textAlign: 'center',
            width: '100%',
            cursor: 'pointer',
            color: 'inherit',
            font: 'inherit',
          }}
        >
          <Stack gap={8} align="center">
            <ArchiveIcon width={24} height={24} style={{ color: 'var(--mantine-color-dimmed)' }} />
            <Text size="sm" fw={600}>
              {m.backup_drop_label()}
            </Text>
            <Text size="xs" c="dimmed">
              {m.backup_drop_hint()}
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
          <Paper
            p="md"
            radius="md"
            withBorder
            style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'none' }}
          >
            <Stack gap="xs">
              <Group justify="space-between" align="center">
                <Group gap={8} align="center">
                  <CheckCircleIcon width={16} height={16} style={{ color: 'var(--mantine-color-teal-6)' }} />
                  <Text size="sm" fw={600}>
                    {m.backup_preview_ready()}
                  </Text>
                </Group>
                <Button size="xs" color="cinnabar" loading={saving} onClick={applyImport}>
                  {m.backup_apply_import()}
                </Button>
              </Group>
              <Group gap="md">
                <Badge size="sm" variant="light" color="cinnabar">
                  {m.backup_count_providers({ count: String(parsedPreview.providers) })}
                </Badge>
                <Badge size="sm" variant="light" color="sand">
                  {m.backup_count_glossaries({ count: String(parsedPreview.glossary) })}
                </Badge>
                <Badge size="sm" variant="light" color="sand">
                  {m.backup_count_rules({ count: String(parsedPreview.rules) })}
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
