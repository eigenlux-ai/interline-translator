/**
 * @module react-app/components/settings/SettingsSection
 *
 * Shared frame for every settings panel so all four read with one rhythm: a
 * serif section title (the manuscript heading), a one-line dimmed description,
 * an optional right-aligned action, a hairline rule, then the body. Keeps the
 * section components free of layout boilerplate — they pass title/description
 * and render their own controls as children.
 */

import type { ReactNode } from 'react';
import { Box, Divider, Group, Stack, Text, Title } from '@mantine/core';

export interface SettingsSectionProps {
  title: string;
  description?: string;
  /** Right-aligned control on the title row (e.g. an "Add" button). */
  action?: ReactNode;
  children: ReactNode;
}

export default function SettingsSection({ title, description, action, children }: SettingsSectionProps) {
  return (
    <Box maw={580}>
      <Group justify="space-between" align="flex-end" gap="sm" wrap="nowrap">
        <Box>
          <Title order={3} fz="h4" fw={600}>
            {title}
          </Title>
          {description && (
            <Text c="dimmed" size="sm" mt={2}>
              {description}
            </Text>
          )}
        </Box>
        {action}
      </Group>
      <Divider my="md" />
      <Stack gap="lg">{children}</Stack>
    </Box>
  );
}
