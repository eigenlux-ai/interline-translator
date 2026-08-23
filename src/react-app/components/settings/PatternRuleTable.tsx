/**
 * @module react-app/components/settings/PatternRuleTable
 *
 * THE per-site rule table — one implementation for every "glob pattern → some
 * control" list in settings (site modes, style rules). Owns the add-row
 * (pattern input, Enter-to-add, duplicate-pattern rejection) and the table
 * scaffold (mono pattern cell, per-row control slot, remove button); callers
 * provide what a rule IS (`makeRule`) and how its value is edited
 * (`renderControl`). Fixes to this machinery land in every rule table at once.
 */

import { useState, type ReactNode } from 'react';
import { ActionIcon, Button, Code, Group, Table, TextInput } from '@mantine/core';
import { PlusIcon, TrashIcon } from '@/react-app/components/icons';
export interface PatternRuleTableProps<T extends { pattern: string }> {
  rules: T[];
  onChange: (rules: T[]) => void;
  /** Build the rule to append for a freshly typed pattern. */
  makeRule: (pattern: string) => T;
  /** Per-row value editor (SegmentedControl, Select, …). */
  renderControl: (rule: T, replace: (next: T) => void) => ReactNode;
  addLabel: string;
  removeAria: string;
  /** Optional extra control rendered between the pattern input and the add button. */
  addExtra?: ReactNode;
  /** Width of the per-row control column. */
  controlWidth?: number;
}

export default function PatternRuleTable<T extends { pattern: string }>({
  rules,
  onChange,
  makeRule,
  renderControl,
  addLabel,
  removeAria,
  addExtra,
  controlWidth = 240,
}: PatternRuleTableProps<T>) {
  const [pattern, setPattern] = useState('');

  const add = () => {
    const p = pattern.trim();
    if (!p || rules.some((r) => r.pattern === p)) return;
    onChange([...rules, makeRule(p)]);
    setPattern('');
  };

  return (
    <>
      <Group gap="xs">
        <TextInput
          placeholder="*.example.com"
          value={pattern}
          onChange={(e) => setPattern(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          style={{ flex: 1 }}
        />
        {addExtra}
        <Button variant="light" onClick={add} disabled={!pattern.trim()} leftSection={<PlusIcon width={12} height={12} />}>
          {addLabel}
        </Button>
      </Group>

      {rules.length > 0 && (
        <Table verticalSpacing="xs">
          <Table.Tbody>
            {rules.map((r) => (
              <Table.Tr key={r.pattern}>
                <Table.Td>
                  <Code style={{ fontSize: 12, padding: '3px 6px', fontWeight: 600 }}>
                    {r.pattern}
                  </Code>
                </Table.Td>
                <Table.Td w={controlWidth}>
                  {renderControl(r, (next) => onChange(rules.map((x) => (x.pattern === r.pattern ? next : x))))}
                </Table.Td>
                <Table.Td w={40}>
                  <ActionIcon
                    variant="subtle"
                    color="danger"
                    size="sm"
                    onClick={() => onChange(rules.filter((x) => x.pattern !== r.pattern))}
                    aria-label={removeAria}
                  >
                    <TrashIcon width={13} height={13} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </>
  );
}
