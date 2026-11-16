import path from 'node:path';
import { defineConfig, type WxtViteConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import checkPrefixSync from './vite-plugins/check-prefix-sync';
import inlineSurfaceCss, { SURFACE_CSS_DIR } from './vite-plugins/inline-surface-css';
import toUtf8 from './vite-plugins/to-utf8';

// See https://wxt.dev/api/config.html
export default defineConfig({
  // Override WXT's Firefox/Safari defaults for every build and dev command.
  manifestVersion: 3,
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  vite: () =>
    ({
      // to-utf8 keeps emitted chunks pure-ASCII to ensure reliable script loading
      // in Chrome when bundles contain CJK or emoji characters.
      // check-prefix-sync warns (dev) / fails (build) if global.css drifts from
      // PROJECT_PREFIX — the one prefix mirror CSS can't import.
      plugins: [tailwindcss(), inlineSurfaceCss(), toUtf8(), checkPrefixSync()],
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
            // Expose Mantine breakpoint/scheme mixins to every .scss module as `mantine.*`
            additionalData: `@use "${path
              .join(process.cwd(), 'src/react-app/styles/_mantine')
              .replace(/\\/g, '/')}" as mantine;`,
          },
        },
      },
    }) as WxtViteConfig,
  imports: {
    // Generate the auto-import globals file in ESLint 9 (flat-config) format —
    // consumed by eslint.config.mjs so lint knows WXT's auto-imported names.
    eslintrc: {
      enabled: 9,
    },
  },
  zip: {
    // Audit copies are embedded in content scripts and never loaded as resources.
    exclude: [`${SURFACE_CSS_DIR}/**`],
    // AMO reviewers need reproducible sources, without local captures or secrets.
    dotSources: true,
    includeSources: [
      'src/**',
      'public/**',
      'messages/**',
      'project.inlang/settings.json',
      'vite-plugins/**',
      'scripts/generate-notices.mjs',
      'scripts/compile-i18n.mjs',
      'scripts/check-firefox-reproducibility.mjs',
      'package.json',
      'pnpm-lock.yaml',
      '.npmrc',
      '.gitignore',
      'wxt.config.ts',
      'tsconfig.json',
      'prefix.cjs',
      'postcss.config.*',
      'assets/store/firefox/REVIEW.md',
      'LICENSE',
    ],
    excludeSources: ['**/.DS_Store', '**/.env*', '**/*.local.*'],
  },
  dev: {
    server: {
      port: 3012,
    },
  },
  webExt: {
    // NOTE: do NOT add --remote-debugging-port here — web-ext-run drives Chrome
    // over its own CDP pipe and an explicit port breaks Extensions.loadUnpacked.
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],
  },
  // Function-form manifest so it can read env vars: `.env` is not loaded yet
  // when this config module is first evaluated (https://wxt.dev/guide/essentials/config/environment-variables).
  manifest: ({ browser }) => ({
    ...(browser === 'firefox'
      ? {
          // Keep packaged-code restrictions without upgrading local HTTP providers to HTTPS.
          content_security_policy: { extension_pages: "script-src 'self'; object-src 'self';" },
          browser_specific_settings: {
            gecko: {
              id: 'interline@eigenlux.com',
              strict_min_version: '140.0',
              data_collection_permissions: {
                required: ['websiteContent', 'authenticationInfo', 'personalCommunications'],
              },
            },
          },
        }
      : {}),
    ...(browser === 'safari'
      ? {
          browser_specific_settings: {
            // MAIN-world scripts require Safari 18; about:blank frames require 18.4.
            safari: { strict_min_version: '18.4' },
          },
          web_accessible_resources: [
            {
              resources: ['youtube-main.js'],
              matches: ['https://*.youtube.com/*', 'https://*.youtube-nocookie.com/embed/*'],
            },
          ],
        }
      : {}),
    // The name is a BRAND MARK (identical in every locale), so it stays a
    // literal. Everything the BROWSER paints — this description, the command
    // label, the context-menu row (services/menus) — goes through
    // public/_locales, the only channel browser.i18n can reach; UI strings live
    // in src/i18n, where they follow translate.target at runtime.
    name: 'Interline · 行间',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    action: {
      default_title: '__MSG_extDescription__',
    },
    // AbortSignal.any (stream watchdog / execute timeout) needs Chrome 116+;
    // declare it so older Chromium gets a store gate instead of a TypeError.
    ...(browser === 'chrome' || browser === 'edge' ? { minimum_chrome_version: '116' } : {}),
    // storage: config/cache · contextMenus: page/selection entries · alarms:
    // 24h cache sweep and configuration-initialization retries. (No `tabs`: the only tab APIs we call — `tabs.query`
    // for the active tab's id, `tabs.onRemoved`, `tabs.sendMessage` — read no
    // permission-gated field, and messaging is already covered by
    // host_permissions. No `scripting`: all injection is via declared
    // content_scripts — re-add either only with a call that actually needs it.)
    permissions: ['storage', 'contextMenus', 'alarms'],
    // <all_urls>: translate any page + cross-origin LLM/MT fetches from the SW.
    host_permissions: ['<all_urls>'],
    commands: {
      'toggle-page-translation': {
        suggested_key: { default: 'Alt+T' },
        // Browser-rendered on chrome://extensions/shortcuts, so __MSG_*__.
        description: '__MSG_commandTogglePageTranslation__',
      },
    },
    // Stable extension ID via the `key` field. Set WXT_EXTENSION_KEY in `.env`
    // (see .env.example) — never hardcode it. Omitted from the manifest when unset.
    ...((browser === 'chrome' || browser === 'edge') && import.meta.env.WXT_EXTENSION_KEY
      ? { key: import.meta.env.WXT_EXTENSION_KEY }
      : {}),
  }),
  hooks: {
    // WXT auto-generates `options_ui` from the options/ entrypoint with
    // open_in_tab:false (the cramped embedded frame). Flip it AFTER generation so
    // our full-page, manuscript-style settings open as a real browser tab.
    'build:manifestGenerated': (wxt, manifest) => {
      if (manifest.options_ui && wxt.config.browser !== 'safari') manifest.options_ui.open_in_tab = true;
      // WXT auto-discovers public/icon/{size}.png into `icons` but leaves the
      // TOOLBAR icon unset; Chrome's fallback for a missing default_icon is
      // inconsistent across surfaces (extension menu vs pinned bar), so pin it.
      if (manifest.action && !manifest.action.default_icon && manifest.icons) {
        manifest.action.default_icon = manifest.icons;
      }
    },
  },
});
