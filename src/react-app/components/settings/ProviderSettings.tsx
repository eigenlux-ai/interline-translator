/**
 * @module react-app/components/settings/ProviderSettings
 *
 * Manage translation engines: the built-in free MT (no key) plus any LLM
 * providers the user adds (BYO key / any openai-compatible endpoint). Edits are
 * auto-saved through onSave. API keys live in extension local storage and are
 * never logged.
 *
 * Per engine the fields read top-to-bottom: Name, Base URL, API key, Extra
 * headers, Model, then a folded Model-parameters block. The Model field is a
 * free-type + searchable combobox whose "Fetch list" button pulls the
 * provider's models via the API key (background cross-origin fetch — see
 * core/rpc/provider-models). The parameters block writes ProviderConfig.params
 * (temperature / maxOutputTokens / reasoning); every knob is unset by default
 * and an unset knob is never sent upstream.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Autocomplete,
  Badge,
  Box,
  Button,
  Card,
  Collapse,
  Group,
  Menu,
  NumberInput,
  Paper,
  PasswordInput,
  Popover,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getModelsService } from '@/core/rpc/provider-models';
import {
  providerModelsNeedKey,
  type Config,
  type LlmProviderKind,
  type ModelParams,
  type ProviderConfig,
} from '@/data/models';
import { m } from '@/paraglide/messages.js';
import { isSafeBaseURL } from '@/services/config/schema';
import { getTranslationService } from '@/services/translation/contract';
import { inferModelCapabilities } from '@/services/translation/model-capabilities';
import { CheckIcon, ChevronIcon, PlusIcon, SparklesIcon } from '../icons';
import SettingsSection from './SettingsSection';
const ADDABLE: Array<{ kind: LlmProviderKind; label: string; defaultModel: string }> = [
  { kind: 'openai', label: 'OpenAI', defaultModel: 'gpt-4o-mini' },
  { kind: 'anthropic', label: 'Anthropic', defaultModel: 'claude-haiku-4-5' },
  { kind: 'google', label: 'Google Gemini', defaultModel: 'gemini-2.0-flash' },
  { kind: 'openrouter', label: 'OpenRouter', defaultModel: 'openai/gpt-4o-mini' },
  { kind: 'openai-compatible', label: 'OpenAI-compatible (Ollama/custom)', defaultModel: 'llama3.1' },
  { kind: 'anthropic-compatible', label: 'Anthropic-compatible (Kimi/GLM/custom)', defaultModel: 'glm-4.6' },
];

/** Placeholder hint per kind — a suggestion only; new engines start with a blank model. */
const MODEL_HINT: Record<string, string> = Object.fromEntries(ADDABLE.map((a) => [a.kind, a.defaultModel]));

/** Real-world baseURL examples for the *-compatible kinds, where a custom endpoint is the point. */
const BASE_URL_HINT: Record<string, string> = {
  'openai-compatible': 'http://localhost:11434/v1',
  'anthropic-compatible': 'https://api.moonshot.cn/anthropic',
};

export interface ProviderSettingsProps {
  config: Config;
  onSave: (next: Config) => void;
}

let counter = 0;
function newId(kind: string): string {
  // crypto.randomUUID isn't guaranteed in every surface; a prefix+counter+time is plenty unique here.
  counter += 1;
  return `${kind}-${counter}-${Math.abs(hash(kind + counter))}`;
}
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

/** `{ "X-Foo": "bar" }` → "X-Foo: bar\n…" for the textarea. */
function headersToText(h?: Record<string, string>): string {
  return h
    ? Object.entries(h)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n')
    : '';
}
/** Parse "Header-Name: value" lines back to a record (undefined when empty). */
function parseHeaders(text: string): Record<string, string> | undefined {
  const out: Record<string, string> = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const i = line.indexOf(':');
    if (i <= 0) continue; // skip blanks and lines without a "name: value" split
    const k = line.slice(0, i).trim();
    if (k) out[k] = line.slice(i + 1).trim();
  }
  return Object.keys(out).length ? out : undefined;
}

/**
 * Write one sampling knob. An emptied field drops the key, and the last key
 * leaving drops the whole object back to `undefined` — a provider that never
 * set a knob must not carry `params: {}` into backups and cache keys.
 */
export function patchParams(
  current: ModelParams | undefined,
  key: keyof ModelParams,
  value: number | boolean | undefined
): ModelParams | undefined {
  const next: ModelParams = { ...current, [key]: value };
  for (const k of Object.keys(next) as Array<keyof ModelParams>) if (next[k] === undefined) delete next[k];
  return Object.keys(next).length ? next : undefined;
}

/** A NumberInput hands back `number | string`; '' and half-typed input mean "cleared". */
export function readNumberInput(raw: number | string): number | undefined {
  const text = (typeof raw === 'number' ? String(raw) : raw).trim();
  const n = Number(text);
  return text === '' || !Number.isFinite(n) ? undefined : n;
}

/** The reasoning Select is tri-state; '' is the untouched "model decides". */
const REASONING_VALUE = { on: true, off: false } as const;
export function readReasoning(raw: string | null): boolean | undefined {
  return raw === 'on' || raw === 'off' ? REASONING_VALUE[raw] : undefined;
}

/**
 * One-line recap shown while the params block is folded away. The reasoning
 * label is passed in already localized so this stays a pure, testable string
 * builder — and so an empty return still means "nothing set" either way.
 */
export function paramsSummary(p?: ModelParams, reasoningLabel?: string): string {
  const bits: string[] = [];
  if (p?.temperature !== undefined) bits.push(`T ${p.temperature}`);
  if (p?.maxOutputTokens !== undefined) bits.push(`${p.maxOutputTokens} tok`);
  if (p?.reasoning !== undefined) bits.push(reasoningLabel ?? String(p.reasoning));
  return bits.join(' · ');
}

/**
 * The fields whose edit invalidates a validation (what validate() proves).
 * params belong here because validate() now sends them — a result obtained
 * under a temperature the user changed mid-check proves nothing about the new one.
 */
function connFingerprint(x: ProviderConfig): string {
  return JSON.stringify([x.kind, x.baseURL, x.apiKeys, x.model, x.extraHeaders, x.params]);
}

function ProviderCard({
  p,
  onUpdate,
  onRemove,
}: {
  p: ProviderConfig;
  onUpdate: (partial: Partial<ProviderConfig>) => void;
  onRemove: () => void;
}) {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [lastLatency, setLastLatency] = useState<number | null>(null);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  // Drafts (need configuring) start expanded; validated engines start collapsed.
  const [open, setOpen] = useState(p.draft ?? false);
  // users never touch them, and an engine card is long enough already.
  const [paramsOpen, setParamsOpen] = useState(() => paramsSummary(p.params) !== '');
  // "推理 开启" reads on its own in the folded chip; a bare "开启" would not.
  const summary = paramsSummary(
    p.params,
    p.params?.reasoning === undefined
      ? undefined
      : `${m.provider_param_reasoning()} ${p.params.reasoning ? m.provider_param_reasoning_on() : m.provider_param_reasoning_off()}`
  );
  // The headers textarea is edited as raw text; config gets the parsed record.
  const [headerText, setHeaderText] = useState(() => headersToText(p.extraHeaders));
  // Render-phase adjustment (the React "state from props" pattern): while
  // typing HERE, config always equals the parse of the local draft — so a
  // parsed-form mismatch can only be an EXTERNAL change (backup import,
  // another surface). Adopt it; otherwise the stale draft would overwrite it
  // on the next keystroke.
  const [seenHeaders, setSeenHeaders] = useState(() => headersToText(p.extraHeaders));
  const externalHeaders = headersToText(p.extraHeaders);
  if (externalHeaders !== seenHeaders) {
    setSeenHeaders(externalHeaders);
    if (externalHeaders !== headersToText(parseHeaders(headerText))) setHeaderText(externalHeaders);
  }
  // Same treatment for Base URL, for the same reason: the schema keeps only a
  // SAFE endpoint (https, or http on a local host) and drops anything else, so
  // without a text mirror the box would erase itself on the first half-typed
  // "http" the moment the write chain settled.
  const [baseURLText, setBaseURLText] = useState(() => p.baseURL ?? '');
  const [seenBaseURL, setSeenBaseURL] = useState(() => p.baseURL ?? '');
  const externalBaseURL = p.baseURL ?? '';
  if (externalBaseURL !== seenBaseURL) {
    setSeenBaseURL(externalBaseURL);
    if (externalBaseURL !== (isSafeBaseURL(baseURLText) ? baseURLText : '')) setBaseURLText(externalBaseURL);
  }
  // A rejected endpoint is not saved, so validating would silently prove the
  // vendor default instead — say why, and hold the button.
  const baseURLError = baseURLText !== '' && !isSafeBaseURL(baseURLText);
  /** Latest props for async validate() to re-check against (its `p` goes stale). */
  const latestConn = useRef(p);
  useEffect(() => {
    latestConn.current = p;
  });

  // OpenRouter's /models is public and Ollama is local → no key needed to list.
  const fetchNeedsKey = providerModelsNeedKey(p.kind) && !p.apiKeys[0];

  // Editing anything that affects the connection invalidates a prior validation:
  // drop back to draft (and off) so the engine must be re-validated before use.
  const editConn = (partial: Partial<ProviderConfig>) => onUpdate({ ...partial, draft: true, enabled: false });

  // Keep the current value in the option list so it always shows as selected.
  const modelOptions = useMemo(
    () => Array.from(new Set([...(p.model ? [p.model] : []), ...models])),
    [p.model, models]
  );

  async function fetchModels() {
    setLoading(true);
    try {
      const list = await getModelsService().list({
        kind: p.kind as LlmProviderKind,
        baseURL: p.baseURL || undefined,
        apiKey: p.apiKeys[0],
        extraHeaders: p.extraHeaders,
      });
      setModels(list);
      notifications.show(
        list.length
          ? { color: 'cinnabar', message: m.provider_models_loaded({ count: list.length }) }
          : { color: 'sand', message: m.provider_models_empty() }
      );
    } catch (e) {
      notifications.show({
        color: 'danger',
        title: m.provider_models_failed(),
        message: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setLoading(false);
    }
  }

  async function validate() {
    const snapshot = connFingerprint(p);
    setValidating(true);
    const start = performance.now();
    try {
      const res = await getTranslationService().validateProvider(p);
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        // The user edited the connection while we validated — the result
        // proves the OLD config; marking the new one Validated would lie.
        if (connFingerprint(latestConn.current) !== snapshot) {
          notifications.show({ color: 'sand', message: m.provider_conn_changed() });
          return;
        }
        setLastLatency(latency);
        onUpdate({ draft: false, enabled: true }); // validated → usable + switched on
        notifications.show({
          color: 'cinnabar',
          message: res.sample
            ? `${m.provider_validate_passed_sample({ sample: res.sample })} (${latency}ms)`
            : `${m.provider_validate_passed()} (${latency}ms)`,
        });
      } else {
        notifications.show({
          color: 'danger',
          title: m.provider_validate_failed(),
          message: res.error ?? m.provider_unknown_error(),
        });
      }
    } catch (e) {
      notifications.show({
        color: 'danger',
        title: m.provider_validate_failed(),
        message: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setValidating(false);
    }
  }

  if (p.kind === 'google-mt') {
    return (
      <Card withBorder radius="md" padding="md" style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'var(--mantine-shadow-xs)' }}>
        <Stack gap="sm">
          <Group justify="space-between">
            <Group gap="xs">
              <Text fw={600}>{p.label ?? p.id}</Text>
              <Badge variant="light" color="sand" size="sm">
                {p.kind}
              </Badge>
            </Group>
            <Switch
              size="sm"
              checked={p.enabled}
              onChange={(e) => onUpdate({ enabled: e.currentTarget.checked })}
              aria-label={m.provider_enable_aria()}
            />
          </Group>
          <Text size="xs" c="dimmed">
            {m.provider_free_desc()}
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card withBorder radius="md" padding="md" style={{ backgroundColor: 'var(--mantine-color-default)', boxShadow: 'var(--mantine-shadow-xs)' }}>
      <Stack gap="sm">
        <Group justify="space-between" wrap="nowrap">
          <UnstyledButton onClick={() => setOpen((o) => !o)} aria-expanded={open} style={{ flex: 1, minWidth: 0 }}>
            <Group gap="xs" wrap="nowrap">
              <ChevronIcon
                width={13}
                height={13}
                style={{
                  transform: open ? 'rotate(90deg)' : 'none',
                  transition: 'transform .15s',
                  flexShrink: 0,
                  opacity: 0.5,
                }}
              />
              <Text fw={600} truncate>
                {p.label ?? p.id}
              </Text>
              <Badge variant="light" color="cinnabar" size="sm" style={{ flexShrink: 0 }}>
                {p.kind}
              </Badge>
              {inferModelCapabilities(p.kind, p.model).reasoning === 'mandatory' && (
                <Badge variant="light" color="cinnabar" size="sm" style={{ flexShrink: 0 }}>
                  原生思考
                </Badge>
              )}
              <Badge
                variant={p.draft ? 'light' : 'outline'}
                color={p.draft ? 'sand' : 'cinnabar'}
                size="sm"
                style={{ flexShrink: 0 }}
              >
                {p.draft ? m.provider_badge_draft() : m.provider_badge_validated()}
              </Badge>
              {!open && p.model.trim() && (
                <Text size="xs" c="dimmed" truncate>
                  {p.model}
                </Text>
              )}
            </Group>
          </UnstyledButton>
          <Group gap="xs" wrap="nowrap">
            {/* Can't enable an unvalidated engine. Box wrapper lets the tooltip
                show over the disabled switch (which itself swallows pointer events). */}
            <Tooltip label={m.provider_enable_after_validate()} disabled={!p.draft} withArrow>
              <Box>
                <Switch
                  size="sm"
                  checked={p.enabled}
                  disabled={p.draft}
                  onChange={(e) => onUpdate({ enabled: e.currentTarget.checked })}
                  aria-label={m.provider_enable_aria()}
                />
              </Box>
            </Tooltip>
            {/* A draft holds nothing of value — delete freely. A validated
                engine carries a working key: one mis-click must not eat it. */}
            {p.draft ? (
              <Button size="compact-xs" variant="subtle" color="danger" onClick={onRemove}>
                {m.provider_remove()}
              </Button>
            ) : (
              <Popover
                opened={confirmingRemove}
                onChange={setConfirmingRemove}
                withArrow
                position="bottom-end"
                shadow="md"
              >
                <Popover.Target>
                  <Button size="compact-xs" variant="subtle" color="danger" onClick={() => setConfirmingRemove(true)}>
                    {m.provider_remove()}
                  </Button>
                </Popover.Target>
                <Popover.Dropdown maw={240}>
                  <Stack gap="xs">
                    <Text size="sm">{m.provider_remove_confirm_text()}</Text>
                    <Group gap="xs" justify="flex-end">
                      <Button size="compact-sm" variant="default" onClick={() => setConfirmingRemove(false)}>
                        {m.common_cancel()}
                      </Button>
                      <Button size="compact-sm" color="danger" onClick={onRemove}>
                        {m.provider_remove_confirm()}
                      </Button>
                    </Group>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            )}
          </Group>
        </Group>

        <Collapse expanded={open}>
          <Stack gap="sm" pt={4}>
            <TextInput
              label={m.provider_name()}
              size="xs"
              value={p.label ?? ''}
              onChange={(e) => onUpdate({ label: e.currentTarget.value })}
            />
            <TextInput
              label={m.provider_base_url()}
              size="xs"
              placeholder={BASE_URL_HINT[p.kind] ?? m.provider_base_url_default()}
              value={baseURLText}
              error={baseURLError ? m.provider_base_url_insecure() : undefined}
              onChange={(e) => {
                const text = e.currentTarget.value;
                setBaseURLText(text);
                editConn({ baseURL: isSafeBaseURL(text) ? text : undefined });
              }}
            />
            <PasswordInput
              label="API key"
              size="xs"
              placeholder="sk-…"
              value={p.apiKeys[0] ?? ''}
              onChange={(e) => editConn({ apiKeys: e.currentTarget.value ? [e.currentTarget.value] : [] })}
            />
            <Textarea
              label={m.provider_headers()}
              description={m.provider_headers_desc()}
              size="xs"
              autosize
              minRows={2}
              maxRows={5}
              placeholder="X-Org-Id: abc123"
              value={headerText}
              onChange={(e) => {
                const text = e.currentTarget.value;
                setHeaderText(text);
                editConn({ extraHeaders: parseHeaders(text) });
              }}
            />
            <Stack gap={4}>
              <Group justify="space-between" align="center" gap="xs" wrap="nowrap">
                <Text size="xs" fw={500}>
                  {m.provider_model()}
                </Text>
                <Tooltip label={m.provider_fill_key_first()} disabled={!fetchNeedsKey} withArrow>
                  {/* data-disabled (not `disabled`) keeps pointer events so the tooltip still shows */}
                  <Button
                    size="compact-xs"
                    variant="subtle"
                    loading={loading}
                    data-disabled={fetchNeedsKey || undefined}
                    onClick={(e) => {
                      if (fetchNeedsKey) {
                        e.preventDefault();
                        return;
                      }
                      void fetchModels();
                    }}
                  >
                    {m.provider_fetch_models()}
                  </Button>
                </Tooltip>
              </Group>
              <Autocomplete
                size="xs"
                placeholder={MODEL_HINT[p.kind] ?? m.provider_model_placeholder()}
                aria-label={m.provider_model()}
                data={modelOptions}
                value={p.model}
                onChange={(val) => editConn({ model: val })}
              />
            </Stack>

            {/* Sampling knobs. Folded by default and unset by default — an
                omitted knob is never sent, so this block changes nothing until
                the user deliberately fills a field. */}
            <Stack gap={4}>
              <UnstyledButton onClick={() => setParamsOpen((o) => !o)} aria-expanded={paramsOpen}>
                <Group gap={6} wrap="nowrap">
                  <ChevronIcon
                    width={11}
                    height={11}
                    style={{
                      transform: paramsOpen ? 'rotate(90deg)' : 'none',
                      transition: 'transform .15s',
                      flexShrink: 0,
                      opacity: 0.5,
                    }}
                  />
                  <Text size="xs" fw={500}>
                    {m.provider_params()}
                  </Text>
                  {!paramsOpen && summary && (
                    <Text size="xs" c="dimmed" truncate>
                      {summary}
                    </Text>
                  )}
                </Group>
              </UnstyledButton>
              <Collapse expanded={paramsOpen}>
                <Stack gap="xs" pt={4}>
                  <Text size="xs" c="dimmed">
                    {m.provider_params_desc()}
                  </Text>
                  <Group grow align="flex-start" gap="xs">
                    <NumberInput
                      label={m.provider_param_temperature()}
                      size="xs"
                      min={0}
                      max={2}
                      step={0.1}
                      decimalScale={2}
                      placeholder={m.provider_param_unset()}
                      value={p.params?.temperature ?? ''}
                      onChange={(v) => onUpdate({ params: patchParams(p.params, 'temperature', readNumberInput(v)) })}
                    />
                    <NumberInput
                      label={m.provider_param_max_tokens()}
                      size="xs"
                      min={1}
                      step={256}
                      allowDecimal={false}
                      placeholder={m.provider_param_unset()}
                      value={p.params?.maxOutputTokens ?? ''}
                      onChange={(v) =>
                        onUpdate({ params: patchParams(p.params, 'maxOutputTokens', readNumberInput(v)) })
                      }
                    />
                    <Select
                      label={m.provider_param_reasoning()}
                      size="xs"
                      allowDeselect={false}
                      data={[
                        { value: '', label: m.provider_param_unset() },
                        { value: 'on', label: m.provider_param_reasoning_on() },
                        { value: 'off', label: m.provider_param_reasoning_off() },
                      ]}
                      value={p.params?.reasoning === undefined ? '' : p.params.reasoning ? 'on' : 'off'}
                      onChange={(v) => onUpdate({ params: patchParams(p.params, 'reasoning', readReasoning(v)) })}
                    />
                  </Group>
                  <Text size="xs" c="dimmed">
                    {m.provider_param_max_tokens_desc()}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {m.provider_param_reasoning_desc()}
                  </Text>
                  {inferModelCapabilities(p.kind, p.model).reasoning === 'mandatory' && (
                    <Text size="xs" c="cinnabar" fw={500}>
                      💡 该模型为原生深度思考模型，思考过程由服务商强制开启。
                    </Text>
                  )}
                  {inferModelCapabilities(p.kind, p.model).fixedTemperature && (
                    <Text size="xs" c="dimmed">
                      💡 该模型由服务商锁定采样温度，自定义温度将被安全忽略。
                    </Text>
                  )}
                </Stack>
              </Collapse>
            </Stack>

            {/* Validation gate: a draft engine must pass a live check before it can be
                enabled. Editing the connection above drops it back to draft. */}
            {p.draft ? (
              <Group justify="space-between" align="center" gap="sm" wrap="nowrap">
                <Text size="xs" c="dimmed">
                  {p.model.trim() ? m.provider_validate_hint_ready() : m.provider_validate_hint_model()}
                </Text>
                <Button
                  size="xs"
                  variant="light"
                  loading={validating}
                  disabled={!p.model.trim() || baseURLError}
                  onClick={validate}
                >
                  {m.provider_validate()}
                </Button>
              </Group>
            ) : (
              <Group justify="space-between" align="center" gap="sm" wrap="nowrap">
                <Group gap={6} align="center" c="cinnabar">
                  <CheckIcon width={14} height={14} />
                  <Text size="xs" c="dimmed">
                    {m.provider_validated_usable()}
                  </Text>
                  {lastLatency !== null && (
                    <Badge size="xs" variant="light" color="teal">
                      {lastLatency}ms
                    </Badge>
                  )}
                </Group>
                <Button size="compact-xs" variant="subtle" loading={validating} onClick={validate}>
                  {m.provider_revalidate()}
                </Button>
              </Group>
            )}
          </Stack>
        </Collapse>
      </Stack>
    </Card>
  );
}

export default function ProviderSettings({ config, onSave }: ProviderSettingsProps) {
  const update = (id: string, partial: Partial<ProviderConfig>) =>
    onSave({ ...config, providers: config.providers.map((p) => (p.id === id ? { ...p, ...partial } : p)) });

  const remove = (id: string) => {
    const next = config.providers.filter((p) => p.id !== id);
    const translate =
      config.translate.defaultProviderId === id
        ? { ...config.translate, defaultProviderId: next.find((p) => p.enabled)?.id }
        : config.translate;
    onSave({ ...config, providers: next, translate });
  };

  const add = (kind: LlmProviderKind, label: string) => {
    const provider: ProviderConfig = {
      id: newId(kind),
      kind,
      label,
      apiKeys: [],
      model: '', // no default — the user fills it in (Fetch list / type)
      enabled: false, // can't be switched on until "Validate" passes
      draft: true,
      ...(kind === 'openai-compatible' ? { baseURL: 'http://localhost:11434/v1' } : {}),
    };
    onSave({ ...config, providers: [...config.providers, provider] });
  };

  const addMenu = (
    <Menu position="bottom-end">
      <Menu.Target>
        <Button size="xs" variant="light">
          {m.provider_add()}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {ADDABLE.map((a) => (
          <Menu.Item key={a.kind} onClick={() => add(a.kind, a.label)}>
            {a.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
  const customCount = config.providers.filter((p) => p.kind !== 'google-mt').length;

  return (
    <SettingsSection title={m.provider_section_title()} description={m.provider_section_desc()} action={addMenu}>
      <Stack gap="md">
        {customCount === 0 && (
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
            <Stack gap="xs">
              <Group gap={6} align="center">
                <SparklesIcon width={14} height={14} style={{ color: 'var(--mantine-color-cinnabar-6)' }} />
                <Text size="xs" fw={600} c="cinnabar">
                  {m.provider_add()} · 快捷添加
                </Text>
              </Group>
              <Text size="xs" c="dimmed">
                Interline 支持主流大模型服务商与任何 OpenAI 兼容的本地/云端端点：
              </Text>
              <Group gap="xs" wrap="wrap">
                {ADDABLE.map((a) => (
                  <Button
                    key={a.kind}
                    size="xs"
                    variant="default"
                    leftSection={<PlusIcon width={12} height={12} />}
                    onClick={() => add(a.kind, a.label)}
                  >
                    {a.label}
                  </Button>
                ))}
              </Group>
            </Stack>
          </Paper>
        )}

        {config.providers.map((p) => (
          <ProviderCard key={p.id} p={p} onUpdate={(partial) => update(p.id, partial)} onRemove={() => remove(p.id)} />
        ))}
      </Stack>
    </SettingsSection>
  );
}
