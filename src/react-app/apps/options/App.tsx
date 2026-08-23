/**
 * @module react-app/apps/options
 *
 * The settings surface, dressed as an annotated manuscript: a warm-paper canvas,
 * a serif masthead whose wordmark carries its own interlinear 译文, and a
 * table-of-contents index whose active row wears the 朱批 tick. Four sections;
 * every edit auto-saves to the shared config (and propagates live to the popup /
 * content via storage.watch).
 */

import { useState } from 'react';
import { Badge, Center, Group, Loader, Text } from '@mantine/core';
import { ArchiveIcon, BookIcon, BrushIcon, EngineIcon, GearIcon, GlobeIcon } from '@/react-app/components/icons';
import BackupSettings from '@/react-app/components/settings/BackupSettings';
import GeneralSettings from '@/react-app/components/settings/GeneralSettings';
import GlossarySettings from '@/react-app/components/settings/GlossarySettings';
import PromptStyleSettings from '@/react-app/components/settings/PromptStyleSettings';
import ProviderSettings from '@/react-app/components/settings/ProviderSettings';
import SiteSettings from '@/react-app/components/settings/SiteSettings';
import { useConfig } from '@/react-app/hooks/useConfig';
import { syncUiLocaleFrom } from '@/i18n';
import { m } from '@/paraglide/messages.js';
import cls from './Options.module.css';

type SectionId = 'general' | 'styles' | 'glossary' | 'providers' | 'sites' | 'backup';

// label/hint are message FUNCTIONS (called in render, so they follow the
// interface language) — a plain string here would freeze the compile-time locale.
const NAV: Array<{ id: SectionId; label: () => string; hint: () => string; Icon: typeof GearIcon }> = [
  { id: 'general', label: m.options_nav_general, hint: m.options_nav_general_hint, Icon: GearIcon },
  { id: 'styles', label: m.options_nav_styles, hint: m.options_nav_styles_hint, Icon: BrushIcon },
  { id: 'glossary', label: m.options_nav_glossary, hint: m.options_nav_glossary_hint, Icon: BookIcon },
  { id: 'providers', label: m.options_nav_providers, hint: m.options_nav_providers_hint, Icon: EngineIcon },
  { id: 'sites', label: m.options_nav_sites, hint: m.options_nav_sites_hint, Icon: GlobeIcon },
  { id: 'backup', label: m.options_nav_backup, hint: m.options_nav_backup_hint, Icon: ArchiveIcon },
];

export default function OptionsApp() {
  const { config, save, patch } = useConfig();
  const [active, setActive] = useState<SectionId>('general');

  if (!config) {
    return (
      <Center h="100vh">
        <Loader color="cinnabar" />
      </Center>
    );
  }

  // Push the resolved UI locale into the Paraglide runtime before any child
  // evaluates an m.*() — a config edit re-renders this root, re-syncing live.
  syncUiLocaleFrom(config);

  return (
    <div className={cls.page}>
      <div className={cls.shell}>
        <header className={cls.masthead}>
          <div className={cls.wordmark}>
            <span className={cls.gloss}>行间</span>
            <span className={cls.brand}>Interline</span>
          </div>
          <Text className={cls.tagline} c="dimmed" size="sm">
            {m.options_tagline()}
          </Text>
        </header>

        <div className={cls.body}>
          <nav className={cls.nav} aria-label={m.options_nav_aria()}>
            {NAV.map(({ id, label, hint, Icon }) => {
              let count: number | null = null;
              if (id === 'providers') {
                count = config.providers.filter((p) => p.enabled && !p.draft).length;
              } else if (id === 'glossary') {
                count = config.glossary.length;
              } else if (id === 'sites') {
                count = config.siteControl.rules.length;
              } else if (id === 'styles') {
                count = config.prompt.styles.length;
              }

              return (
                <button
                  key={id}
                  type="button"
                  className={`${cls.navItem} ${active === id ? cls.navItemActive : ''}`}
                  aria-current={active === id ? 'page' : undefined}
                  onClick={() => setActive(id)}
                >
                  <Icon width={16} height={16} />
                  <Group justify="space-between" align="center" flex={1} wrap="nowrap" gap="xs">
                    <span className={cls.navLabel}>
                      {label()}
                      <span className={cls.navHint}>{hint()}</span>
                    </span>
                    {count !== null && count > 0 && (
                      <Badge
                        size="xs"
                        variant={active === id ? 'light' : 'subtle'}
                        color={active === id ? 'cinnabar' : 'gray'}
                        styles={{ root: { paddingInline: 6, height: 18 } }}
                      >
                        {count}
                      </Badge>
                    )}
                  </Group>
                </button>
              );
            })}
          </nav>
          <main className={cls.content}>
            {active === 'general' && <GeneralSettings config={config} onPatch={patch} />}
            {active === 'styles' && <PromptStyleSettings config={config} onSave={save} />}
            {active === 'glossary' && <GlossarySettings config={config} onSave={save} />}
            {active === 'providers' && <ProviderSettings config={config} onSave={save} />}
            {active === 'sites' && <SiteSettings config={config} onSave={save} />}
            {active === 'backup' && <BackupSettings config={config} onSave={save} />}
          </main>
        </div>

        <footer className={cls.footer}>
          <Text size="xs" c="dimmed">
            Interline · 行间
          </Text>
          <Text size="xs" c="dimmed">
            {m.options_footer_autosave()}
          </Text>
        </footer>
      </div>
    </div>
  );
}
