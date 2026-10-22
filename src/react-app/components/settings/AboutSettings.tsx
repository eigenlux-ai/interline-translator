import { browser } from 'wxt/browser';
import { Accordion, Anchor, Code, Group, Stack, Text, Title } from '@mantine/core';
import templateLicense from '@/data/licenses/aie-wxt-mantine-surface-template.txt?raw';
import notices from '@/data/third-party-notices.json';
import { m } from '@/paraglide/messages.js';
import projectLicense from '../../../../LICENSE?raw';
import SettingsSection from './SettingsSection';

const repository = 'https://github.com/eigenlux-ai/interline-translator';

export default function AboutSettings() {
  return (
    <SettingsSection title={m.options_nav_about()} description={m.about_description()}>
      <Stack gap="xs">
        <Title order={4}>Interline · 行间</Title>
        <Text size="sm">
          {m.about_version()} {browser.runtime.getManifest().version} · MIT · © 2026 Eigenlux
        </Text>
        <Group gap="md">
          <Anchor href={repository} target="_blank" rel="noreferrer">
            {m.about_source()}
          </Anchor>
          <Anchor href={`${repository}/issues`} target="_blank" rel="noreferrer">
            {m.about_feedback()}
          </Anchor>
        </Group>
      </Stack>
      <Stack gap="xs">
        <Title order={5}>{m.about_data_title()}</Title>
        <Text size="sm" c="dimmed">
          {m.about_data_description()}
        </Text>
      </Stack>
      <Stack gap="xs">
        <Title order={5}>{m.about_licenses_title()}</Title>
        <Text size="sm" c="dimmed">
          {m.about_licenses_description()}
        </Text>
        <Accordion variant="separated">
          {[
            {
              name: 'Interline',
              version: browser.runtime.getManifest().version,
              license: 'MIT',
              notices: projectLicense,
            },
            {
              name: 'aie-wxt-mantine-surface-template',
              version: '',
              license: 'MIT',
              notices: templateLicense,
              repository: 'https://github.com/AIEPhoenix/aie-wxt-mantine-surface-template',
            },
            ...notices,
          ].map((entry) => (
            <Accordion.Item key={`${entry.name}@${entry.version}`} value={`${entry.name}@${entry.version}`}>
              <Accordion.Control>
                <Text size="sm" fw={500}>
                  {entry.name}
                  {entry.version && ` · ${entry.version}`}
                </Text>
                <Text size="xs" c="dimmed">
                  {entry.license}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                {'repository' in entry && (
                  <Anchor href={entry.repository} target="_blank" rel="noreferrer" size="sm" mb="sm" display="block">
                    {m.about_source()}
                  </Anchor>
                )}
                <Code
                  block
                  style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', maxHeight: 320, overflowY: 'auto' }}
                >
                  {entry.notices || entry.license}
                </Code>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Stack>
    </SettingsSection>
  );
}
