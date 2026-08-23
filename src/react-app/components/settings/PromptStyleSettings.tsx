/**
 * @module react-app/components/settings/PromptStyleSettings
 *
 * 「翻译风格」— the PromptStyle system's management surface: the global style
 * picker, the style editor, per-site rules, and the expert escape hatch.
 *
 * Selection auto-saves like every other section. The expert templates are the
 * one deliberate exception (draft + explicit save): an invalid intermediate
 * state must never hit storage — validateExpertTemplates gates the write and
 * its error CODES map to localized copy here.
 */

import { useMemo, useState } from 'react';
import { Badge, Button, Code, Collapse, Group, Modal, Radio, Select, Stack, Switch, Text, Textarea, TextInput } from '@mantine/core';
import type { Config, PromptExpertConfig, PromptStyle } from '@/data/models';
import { randomId } from '@/core/uid';
import { BUILTIN_STYLES, isBuiltinStyleId } from '@/services/translation/prompts/builtin-styles';
import { buildTranslatePrompt, validateExpertTemplates, type ExpertTemplateError } from '@/services/translation/prompts';
import { m } from '@/paraglide/messages.js';
import PatternRuleTable from './PatternRuleTable';
import SettingsSection from './SettingsSection';
import { PLAIN_STYLE as PLAIN, builtinCopy, fromStyleSelectValue, styleDisplayName, styleSelectData, toStyleSelectValue } from './style-options';

// Paraglide parses `{name}` in the catalog as message parameters — but these
// braces ARE the copy (we're documenting the placeholder syntax itself), so we
// feed identity inputs to render them back literally.
const PH = { target: '{target}', source: '{source}', title: '{title}', text: '{text}', salt: '{salt}' } as const;

const expertError: Record<ExpertTemplateError, () => string> = {
  'batch-marker-missing': () => m.expert_error_batch_marker(PH),
  'single-text-missing': () => m.expert_error_single_text(PH),
};


export interface PromptStyleSettingsProps {
  config: Config;
  onSave: (next: Config) => void;
}

export default function PromptStyleSettings({ config, onSave }: PromptStyleSettingsProps) {
  const prompt = config.prompt;
  const [editing, setEditing] = useState<PromptStyle | null>(null); // modal draft ('new' = id not yet in styles)

  const setActive = (id: string) =>
    onSave({ ...config, prompt: { ...prompt, activeStyleId: fromStyleSelectValue(id) } });

  const upsertStyle = (style: PromptStyle) => {
    if (isBuiltinStyleId(style.id)) return; // builtins are read-only (duplicate mints a fresh id)
    const exists = prompt.styles.some((s) => s.id === style.id);
    const styles = exists ? prompt.styles.map((s) => (s.id === style.id ? style : s)) : [...prompt.styles, style];
    // Creating a style activates it (you made it, you meant to use it) —
    // EDITING must not: fixing a typo in a dormant style is not selecting it.
    onSave({ ...config, prompt: { ...prompt, styles, ...(exists ? {} : { activeStyleId: style.id }) } });
    setEditing(null);
  };

  const removeStyle = (id: string) => {
    const styles = prompt.styles.filter((s) => s.id !== id);
    const activeStyleId = prompt.activeStyleId === id ? undefined : prompt.activeStyleId;
    onSave({ ...config, prompt: { ...prompt, styles, activeStyleId } });
  };

  const duplicate = (src: PromptStyle, localizedName: string) =>
    setEditing({ id: randomId(), name: localizedName + m.styles_copy_suffix(), directives: src.directives });

  return (
    <SettingsSection title={m.styles_section_title()} description={m.styles_section_desc()}>
      <Radio.Group value={toStyleSelectValue(prompt.activeStyleId)} onChange={setActive}>
        <Stack gap="xs">
          <StyleRow value={PLAIN} name={m.style_plain_name()} desc={m.style_plain_desc()} />
          {BUILTIN_STYLES.map((s) => (
            <StyleRow
              key={s.id}
              value={s.id}
              name={styleDisplayName(prompt, s.id)}
              desc={builtinCopy[s.id]?.desc() ?? ''}
              actions={
                <Button size="compact-xs" variant="subtle" onClick={() => duplicate(s, styleDisplayName(prompt, s.id))}>
                  {m.styles_duplicate()}
                </Button>
              }
            />
          ))}

          {prompt.styles.length > 0 && (
            <Text size="xs" c="dimmed" mt={4}>
              {m.styles_custom_group()}
            </Text>
          )}
          {prompt.styles.map((s) => (
            <StyleRow
              key={s.id}
              value={s.id}
              name={s.name}
              desc={s.directives.split('\n')[0]}
              actions={
                <Group gap={4} wrap="nowrap">
                  <Button size="compact-xs" variant="subtle" onClick={() => setEditing(s)}>
                    {m.styles_edit()}
                  </Button>
                  <Button size="compact-xs" variant="subtle" color="danger" onClick={() => removeStyle(s.id)}>
                    {m.styles_delete()}
                  </Button>
                </Group>
              }
            />
          ))}
        </Stack>
      </Radio.Group>

      <Group>
        <Button variant="light" onClick={() => setEditing({ id: randomId(), name: '', directives: '' })}>
          {m.styles_new()}
        </Button>
      </Group>

      <SiteRules config={config} onSave={onSave} />

      <ExpertMode
        expert={prompt.expert}
        onSave={(expert) => onSave({ ...config, prompt: { ...prompt, ...(expert ? { expert } : { expert: undefined }) } })}
      />

      <Modal
        opened={editing !== null}
        onClose={() => setEditing(null)}
        title={editing && prompt.styles.some((s) => s.id === editing.id) ? m.styles_editor_title_edit() : m.styles_editor_title_new()}
        lockScroll={false}
        size="lg"
      >
        {editing && (
          <StyleEditor key={editing.id} draft={editing} target={config.translate.target} onSave={upsertStyle} onCancel={() => setEditing(null)} />
        )}
      </Modal>
    </SettingsSection>
  );
}

function StyleRow({ value, name, desc, actions }: { value: string; name: string; desc: string; actions?: React.ReactNode }) {
  return (
    <Group gap="xs" wrap="nowrap" align="flex-start">
      <Radio
        value={value}
        style={{ flex: 1 }}
        label={name}
        description={desc}
      />
      {actions}
    </Group>
  );
}

function StyleEditor({
  draft,
  target,
  onSave,
  onCancel,
}: {
  draft: PromptStyle;
  target: Config['translate']['target'];
  onSave: (s: PromptStyle) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(draft.name);
  const [directives, setDirectives] = useState(draft.directives);

  // Live assembled preview — the REAL builder, so what you see is what ships.
  const preview = useMemo(
    () =>
      buildTranslatePrompt('…', 'auto', target, { styles: [], siteRules: [] }, undefined, {
        id: draft.id,
        name,
        directives,
      }).system,
    [draft.id, name, directives, target]
  );

  return (
    <Stack gap="sm">
      <TextInput
        label={m.styles_name_label()}
        placeholder={m.styles_name_placeholder()}
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        data-autofocus
      />
      <Stack gap={4}>
        <Group justify="space-between" align="center">
          <Text size="xs" fw={500}>
            {m.styles_directives_label()}
          </Text>
          <Group gap={4} align="center">
            <Text size="10px" c="dimmed">
              插入变量:
            </Text>
            {['{target}', '{source}', '{text}', '{title}'].map((variable) => (
              <Button
                key={variable}
                size="compact-xs"
                variant="subtle"
                color="cinnabar"
                style={{ fontFamily: 'var(--mantine-font-family-monospace)', fontSize: 10 }}
                onClick={() => setDirectives((d) => `${d} ${variable}`.trim())}
              >
                {variable}
              </Button>
            ))}
          </Group>
        </Group>
        <Text size="xs" c="dimmed">
          {m.styles_directives_hint()}
        </Text>
        <Textarea
          value={directives}
          onChange={(e) => setDirectives(e.currentTarget.value)}
          autosize
          minRows={4}
          maxRows={10}
        />
      </Stack>
      <Stack gap={4}>
        <Text size="xs" c="dimmed">
          {m.styles_preview_label()}
        </Text>
        <Code block style={{ whiteSpace: 'pre-wrap', maxHeight: 220, overflow: 'auto' }}>
          {preview}
        </Code>
      </Stack>
      <Group justify="flex-end" gap="xs">
        <Button variant="subtle" onClick={onCancel}>
          {m.styles_cancel()}
        </Button>
        <Button disabled={!name.trim() || !directives.trim()} onClick={() => onSave({ id: draft.id, name: name.trim(), directives: directives.trim() })}>
          {m.styles_save()}
        </Button>
      </Group>
    </Stack>
  );
}

function SiteRules({ config, onSave }: PromptStyleSettingsProps) {
  const prompt = config.prompt;
  // New rules default to the first builtin — a rule always names a REAL style
  // (pinning 素译 per site is not a thing; that's just "no rule").
  const [styleId, setStyleId] = useState(BUILTIN_STYLES[0].id);
  const selectData = styleSelectData(prompt, { includePlain: false });

  const saveRules = (siteRules: typeof prompt.siteRules) => onSave({ ...config, prompt: { ...prompt, siteRules } });

  return (
    <Stack gap={6}>
      <Text size="sm" fw={500}>
        {m.styles_rules_label()}
      </Text>
      <Text size="xs" c="dimmed">
        {m.styles_rules_desc()}
      </Text>
      <PatternRuleTable
        rules={prompt.siteRules}
        onChange={saveRules}
        makeRule={(pattern) => ({ pattern, styleId })}
        addLabel={m.styles_rule_add()}
        removeAria={m.styles_rule_remove_aria()}
        controlWidth={200}
        addExtra={<Select data={selectData} value={styleId} onChange={(v) => v && setStyleId(v)} w={160} allowDeselect={false} />}
        renderControl={(r, replace) => (
          <Select size="xs" data={selectData} value={r.styleId} allowDeselect={false} onChange={(v) => v && replace({ ...r, styleId: v })} />
        )}
      />
    </Stack>
  );
}

function ExpertMode({ expert, onSave }: { expert: PromptExpertConfig | undefined; onSave: (e: PromptExpertConfig | undefined) => void }) {
  // Drafts live in ExpertForm, remounted (via key) whenever the STORED expert
  // changes: an edit saved in another window/context resets these drafts to
  // the new truth instead of being silently clobbered by our stale copies on
  // the next save. Mid-typing external saves discard local typing — the
  // honest resolution of a two-writer conflict.
  return <ExpertForm key={JSON.stringify(expert ?? null)} expert={expert} onSave={onSave} />;
}

function ExpertForm({ expert, onSave }: { expert: PromptExpertConfig | undefined; onSave: (e: PromptExpertConfig | undefined) => void }) {
  const [open, setOpen] = useState(Boolean(expert));
  const [singleSystem, setSingleSystem] = useState(expert?.single?.system ?? '');
  const [singleUser, setSingleUser] = useState(expert?.single?.user ?? '');
  const [batchSystem, setBatchSystem] = useState(expert?.batch?.system ?? '');
  const [error, setError] = useState<ExpertTemplateError | null>(null);
  const [saved, setSaved] = useState(false);

  const save = () => {
    const next: PromptExpertConfig = {
      ...(singleSystem.trim() || singleUser.trim()
        ? { single: { ...(singleSystem.trim() ? { system: singleSystem.trim() } : {}), ...(singleUser.trim() ? { user: singleUser.trim() } : {}) } }
        : {}),
      ...(batchSystem.trim() ? { batch: { system: batchSystem.trim() } } : {}),
    };
    const problem = validateExpertTemplates(next);
    setError(problem);
    if (problem) return;
    const empty = !next.single && !next.batch;
    onSave(empty ? undefined : next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const reset = () => {
    setSingleSystem('');
    setSingleUser('');
    setBatchSystem('');
    setError(null);
    onSave(undefined);
  };

  return (
    <Stack gap="xs">
      <Switch
        checked={open}
        onChange={(e) => setOpen(e.currentTarget.checked)}
        label={m.expert_toggle()}
        description={m.expert_desc()}
      />
      <Collapse expanded={open}>
        <Stack gap="sm" pt={4}>
          <Text size="xs" c="dimmed">
            {m.expert_placeholders_hint(PH)}
          </Text>
          <Textarea label={m.expert_single_system_label()} value={singleSystem} onChange={(e) => setSingleSystem(e.currentTarget.value)} autosize minRows={2} maxRows={8} />
          <Textarea label={m.expert_single_user_label(PH)} value={singleUser} onChange={(e) => setSingleUser(e.currentTarget.value)} autosize minRows={2} maxRows={6} />
          <Textarea label={m.expert_batch_system_label(PH)} value={batchSystem} onChange={(e) => setBatchSystem(e.currentTarget.value)} autosize minRows={2} maxRows={8} />
          {error && (
            <Text size="sm" c="danger">
              {expertError[error]()}
            </Text>
          )}
          <Group gap="xs">
            <Button variant="light" onClick={save}>
              {m.expert_save()}
            </Button>
            <Button variant="subtle" onClick={reset}>
              {m.expert_reset()}
            </Button>
            {saved && <Badge variant="light">{m.expert_saved()}</Badge>}
          </Group>
        </Stack>
      </Collapse>
    </Stack>
  );
}
