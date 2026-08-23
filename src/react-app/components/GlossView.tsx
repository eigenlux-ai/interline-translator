/**
 * @module react-app/components/GlossView
 *
 * The shared 译文 presentation — the same 朱批 identity used in-page: a cinnabar
 * start-tick, the kai brush font, on a faint warm ground. Carries an optional
 * provider chip + copy affordance. Used by the popup result and (visually
 * echoed by) the 划词 card, so all three surfaces read as one language.
 */

import { ActionIcon, Box, CopyButton, Group, Paper, Skeleton, Text, Tooltip, useMantineTheme } from '@mantine/core';
import { m } from '@/paraglide/messages.js';
import { CheckIcon, CopyIcon, VolumeIcon } from './icons';

export interface GlossViewProps {
  text: string;
  provider?: string;
  loading?: boolean;
}

export default function GlossView({ text, provider, loading }: GlossViewProps) {
  const theme = useMantineTheme();
  const kai = (theme.other as { fontKai?: string }).fontKai;

  const speak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && text) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <Paper
      radius="md"
      p="sm"
      style={{
        borderInlineStart: '3px solid var(--mantine-color-cinnabar-6)',
        // Scheme-agnostic 朱 wash: translucent, so it tints light AND dark grounds.
        background: 'color-mix(in srgb, var(--mantine-color-cinnabar-6) 7%, transparent)',
      }}
    >
      {loading && !text ? (
        <Box py={4}>
          <Skeleton height={14} radius="sm" mb={6} width="85%" />
          <Skeleton height={14} radius="sm" width="60%" />
        </Box>
      ) : (
        <Text
          style={{
            fontFamily: kai,
            fontSize: 14.5,
            lineHeight: 1.8,
            color: 'var(--mantine-color-text)',
            wordBreak: 'break-word',
          }}
        >
          {text}
        </Text>
      )}

      {(provider || text) && (
        <Group justify="space-between" align="center" mt={8} gap={6}>
          <Text size="xs" c="dimmed" tt="lowercase" style={{ fontFamily: 'var(--mantine-font-family-monospace)' }}>
            {provider ?? ''}
          </Text>
          {text && (
            <Group gap={4}>
              <Tooltip label="朗读 / Pronounce" withArrow>
                <ActionIcon size="sm" variant="subtle" color="gray" onClick={speak} aria-label="Pronounce">
                  <VolumeIcon width={14} height={14} />
                </ActionIcon>
              </Tooltip>
              <CopyButton value={text} timeout={1200}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? m.gloss_copied() : m.gloss_copy()} withArrow>
                    <ActionIcon size="sm" variant="subtle" color={copied ? 'teal' : 'gray'} onClick={copy} aria-label={m.gloss_copy()}>
                      {copied ? <CheckIcon width={14} height={14} /> : <CopyIcon width={14} height={14} />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
          )}
        </Group>
      )}
    </Paper>
  );
}
