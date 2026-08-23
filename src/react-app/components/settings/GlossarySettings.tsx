/**
 * @module react-app/components/settings/GlossarySettings
 *
 * 「术语表」— named glossary SETS (「AI 术语集」,「建筑术语集」…), each an
 * accordion item: header carries the name, entry count and the enable switch;
 * the panel holds the set's identity (rename / site scope / delete) and its
 * entry table. Set order matters (earlier set wins duplicate terms), so new
 * sets and entries append. Resolution semantics live in
 * services/translation/glossary — this surface only edits config.
 */

import { useRef, useState } from 'react';
import {
  Accordion,
  ActionIcon,
  Alert,
  Badge,
  Button,
  Group,
  Menu,
  Paper,
  Stack,
  Switch,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { BookIcon, PlusIcon, SearchIcon, TrashIcon } from '@/react-app/components/icons';
import type { Config, GlossaryEntry, GlossarySet } from '@/data/models';
import { randomId } from '@/core/uid';
import {
  glossaryExportFilename,
  parseGlossaryImport,
  serializeGlossarySet,
  type GlossaryImportError,
} from '@/services/translation/glossary-io';
import { m } from '@/paraglide/messages.js';
import SettingsSection from './SettingsSection';
const importError: Record<GlossaryImportError, () => string> = {
  empty: m.glossary_import_err_empty,
  unrecognized: m.glossary_import_err_unrecognized,
};

const GLOSSARY_PRESETS: Array<{ name: string; entries: GlossaryEntry[] }> = [
  {
    name: '计算机与前沿技术',
    entries: [
      { source: 'Token', target: '标记 / 词元', note: 'LLM 计量单位' },
      { source: 'Prompt', target: '提示词', note: '指令' },
      { source: 'Context window', target: '上下文窗口' },
      { source: 'Hallucination', target: '幻觉' },
      { source: 'Embedding', target: '嵌入向量' },
      { source: 'Fine-tuning', target: '微调' },
      { source: 'Zero-shot', target: '零样本' },
      { source: 'Few-shot', target: '少样本' },
      { source: 'Inference', target: '推理' },
      { source: 'Throughput', target: '吞吐量' },
    ],
  },
  {
    name: '金融经济与商贸',
    entries: [
      { source: 'Gross margin', target: '毛利率' },
      { source: 'Operating income', target: '营业利润' },
      { source: 'Cash flow', target: '现金流' },
      { source: 'Bull market', target: '牛市' },
      { source: 'Bear market', target: '熊市' },
      { source: 'Due diligence', target: '尽职调查' },
      { source: 'Arbitrage', target: '套利' },
      { source: 'Liquidity', target: '流动性' },
    ],
  },
  {
    name: '生物医药与临床',
    entries: [
      { source: 'Placebo', target: '安慰剂' },
      { source: 'Double-blind', target: '双盲试验' },
      { source: 'Biomarker', target: '生物标志物' },
      { source: 'Efficacy', target: '疗效 / 药效' },
      { source: 'In vitro', target: '体外试验' },
      { source: 'In vivo', target: '体内试验' },
    ],
  },
];

function download(text: string, filename: string) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface GlossarySettingsProps {
  config: Config;
  onSave: (next: Config) => void;
}

export default function GlossarySettings({ config, onSave }: GlossarySettingsProps) {
  const [newName, setNewName] = useState('');
  const [openSet, setOpenSet] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const save = (glossary: GlossarySet[]) => onSave({ ...config, glossary });

  const importFile = async (file: File) => {
    try {
      const fallbackName = file.name.replace(/\.[^.]+$/, '') || m.glossary_section_title();
      const parsed = parseGlossaryImport(await file.text(), fallbackName);
      const id = randomId();
      save([
        ...config.glossary,
        { id, name: parsed.name, enabled: true, ...(parsed.pattern ? { pattern: parsed.pattern } : {}), entries: parsed.entries },
      ]);
      setOpenSet(id);
      setStatus({
        ok: true,
        msg:
          m.glossary_import_done({ name: parsed.name, count: String(parsed.entries.length) }) +
          (parsed.skipped > 0 ? m.glossary_import_skipped({ skipped: String(parsed.skipped) }) : ''),
      });
    } catch (e) {
      const msg = typeof e === 'string' && e in importError ? importError[e as GlossaryImportError]() : String(e);
      setStatus({ ok: false, msg });
    }
  };
  const patchSet = (id: string, patch: Partial<GlossarySet>) =>
    save(config.glossary.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addSet = () => {
    const name = newName.trim();
    if (!name) return;
    const id = randomId();
    save([...config.glossary, { id, name, enabled: true, entries: [] }]);
    setNewName('');
    setOpenSet(id);
  };

  const addPreset = (preset: { name: string; entries: GlossaryEntry[] }) => {
    const id = randomId();
    save([...config.glossary, { id, name: preset.name, enabled: true, entries: [...preset.entries] }]);
    setOpenSet(id);
  };

  return (
    <SettingsSection title={m.glossary_section_title()} description={m.glossary_section_desc()}>
      <Group gap="xs" wrap="wrap">
        <TextInput
          placeholder={m.glossary_set_name_ph()}
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSet()}
          style={{ flex: '1 1 200px' }}
        />
        <Button variant="light" onClick={addSet} disabled={!newName.trim()} leftSection={<PlusIcon width={12} height={12} />}>
          {m.glossary_set_new()}
        </Button>
        <Menu position="bottom-end">
          <Menu.Target>
            <Button variant="default">
              预设模板
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {GLOSSARY_PRESETS.map((gp) => (
              <Menu.Item key={gp.name} onClick={() => addPreset(gp)}>
                {gp.name} ({gp.entries.length})
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <Button variant="default" onClick={() => fileRef.current?.click()}>
          {m.glossary_import()}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,.csv,.tsv,.txt,application/json,text/csv,text/tab-separated-values,text/plain"
          hidden
          onChange={(e) => {
            const f = e.currentTarget.files?.[0];
            if (f) void importFile(f);
            e.currentTarget.value = '';
          }}
        />
      </Group>

      {status && (
        <Alert color={status.ok ? 'cinnabar' : 'danger'} variant="light">
          {status.msg}
        </Alert>
      )}

      {config.glossary.length === 0 ? (
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            borderStyle: 'dashed',
            borderColor: 'color-mix(in srgb, var(--mantine-color-cinnabar-6) 30%, var(--mantine-color-default-border))',
            backgroundColor: 'color-mix(in srgb, var(--mantine-color-cinnabar-6) 3%, var(--mantine-color-default))',
          }}
        >
          <Stack gap="xs" align="center" py="sm">
            <BookIcon width={24} height={24} style={{ color: 'var(--mantine-color-cinnabar-6)' }} />
            <Text size="sm" fw={600}>
              暂无术语集
            </Text>
            <Text size="xs" c="dimmed" ta="center">
              您可以新建术语集、导入 CSV/JSON 文件，或载入常用专业预设：
            </Text>
            <Group gap="xs" mt={4}>
              {GLOSSARY_PRESETS.map((gp) => (
                <Button key={gp.name} size="xs" variant="light" onClick={() => addPreset(gp)}>
                  + {gp.name}
                </Button>
              ))}
            </Group>
          </Stack>
        </Paper>
      ) : (
        <Accordion value={openSet} onChange={setOpenSet} variant="separated">
          {config.glossary.map((set) => (
            <Accordion.Item key={set.id} value={set.id} style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'var(--mantine-shadow-xs)' }}>
              <Accordion.Control>
                <Group gap="sm" wrap="nowrap">
                  <Text size="sm" fw={500} style={{ flex: 1 }}>
                    {set.name}
                  </Text>
                  {set.pattern && (
                    <Text size="xs" ff="monospace" c="dimmed">
                      {set.pattern}
                    </Text>
                  )}
                  <Badge variant="light" color={set.enabled ? 'cinnabar' : 'gray'}>
                    {set.entries.length}
                  </Badge>
                  <Switch
                    size="sm"
                    checked={set.enabled}
                    onChange={(e) => patchSet(set.id, { enabled: e.currentTarget.checked })}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={m.glossary_set_enabled_aria()}
                  />
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <SetPanel
                  set={set}
                  onPatch={(patch) => patchSet(set.id, patch)}
                  onDelete={() => save(config.glossary.filter((s) => s.id !== set.id))}
                />
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </SettingsSection>
  );
}

function SetPanel({
  set,
  onPatch,
  onDelete,
}: {
  set: GlossarySet;
  onPatch: (patch: Partial<GlossarySet>) => void;
  onDelete: () => void;
}) {
  const [source, setSource] = useState('');
  const [target, setTarget] = useState('');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');

  const addEntry = () => {
    const s = source.trim();
    const t = target.trim();
    if (!s || !t) return;
    const entry: GlossaryEntry = { source: s, target: t, ...(note.trim() ? { note: note.trim() } : {}) };
    onPatch({ entries: [...set.entries, entry] });
    setSource('');
    setTarget('');
    setNote('');
  };

  const removeEntry = (index: number) => onPatch({ entries: set.entries.filter((_, i) => i !== index) });

  const filteredEntries = search.trim()
    ? set.entries
        .map((entry, originalIndex) => ({ entry, originalIndex }))
        .filter(
          ({ entry }) =>
            entry.source.toLowerCase().includes(search.toLowerCase()) ||
            entry.target.toLowerCase().includes(search.toLowerCase()) ||
            (entry.note && entry.note.toLowerCase().includes(search.toLowerCase()))
        )
    : set.entries.map((entry, originalIndex) => ({ entry, originalIndex }));

  return (
    <Stack gap="sm">
      <Group gap="xs" align="flex-end" wrap="wrap">
        <TextInput
          label={m.glossary_set_name_label()}
          value={set.name}
          onChange={(e) => onPatch({ name: e.currentTarget.value })}
          style={{ flex: '1 1 140px' }}
        />
        <TextInput
          label={m.glossary_pattern_label()}
          placeholder="*.example.com"
          value={set.pattern ?? ''}
          onChange={(e) => onPatch({ pattern: e.currentTarget.value || undefined })}
          onBlur={(e) => {
            const v = e.currentTarget.value.trim();
            onPatch(v ? { pattern: v } : { pattern: undefined });
          }}
          style={{ flex: '1 1 160px' }}
        />
        <Button variant="subtle" onClick={() => download(serializeGlossarySet(set), glossaryExportFilename(set))}>
          {m.glossary_export()}
        </Button>
        <Button variant="subtle" color="danger" onClick={onDelete}>
          {m.glossary_set_delete()}
        </Button>
      </Group>

      <Group gap="xs" align="flex-end" wrap="wrap">
        <TextInput
          label={m.glossary_source_label()}
          placeholder="Pod"
          value={source}
          onChange={(e) => setSource(e.currentTarget.value)}
          style={{ flex: '1 1 110px' }}
        />
        <TextInput
          label={m.glossary_target_label()}
          placeholder={m.glossary_target_ph()}
          value={target}
          onChange={(e) => setTarget(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && addEntry()}
          style={{ flex: '1 1 110px' }}
        />
        <TextInput
          label={m.glossary_note_label()}
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && addEntry()}
          style={{ flex: '1 1 130px' }}
        />
        <Button variant="light" onClick={addEntry} disabled={!source.trim() || !target.trim()} leftSection={<PlusIcon width={12} height={12} />}>
          {m.glossary_add()}
        </Button>
      </Group>

      {set.entries.length > 5 && (
        <TextInput
          size="xs"
          placeholder="搜索术语或释义…"
          leftSection={<SearchIcon width={12} height={12} />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
        />
      )}

      {set.entries.length > 0 && (
        <Table verticalSpacing="xs">
          <Table.Tbody>
            {filteredEntries.map(({ entry: r, originalIndex: i }) => (
              <Table.Tr key={`${r.source}-${i}`}>
                <Table.Td>
                  <Text size="sm" fw={500}>
                    {r.source}
                  </Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{r.target}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="xs" c="dimmed">
                    {r.note ?? ''}
                  </Text>
                </Table.Td>
                <Table.Td w={40}>
                  <ActionIcon variant="subtle" color="danger" size="sm" onClick={() => removeEntry(i)} aria-label={m.glossary_remove_aria()}>
                    <TrashIcon width={13} height={13} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}
