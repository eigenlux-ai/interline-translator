import path from 'node:path';
import { defineConfig, type WxtViteConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';
import checkPrefixSync from './vite-plugins/check-prefix-sync';
import toUtf8 from './vite-plugins/to-utf8';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  vite: () =>
    ({
      // to-utf8 keeps emitted chunks pure-ASCII to ensure reliable script loading
      // in Chrome when bundles contain CJK or emoji characters.
      // check-prefix-sync warns (dev) / fails (build) if global.css drifts from
      // PROJECT_PREFIX — the one prefix mirror CSS can't import.
      plugins: [tailwindcss(), toUtf8(), checkPrefixSync()],
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
  manifest: () => ({
    // The name is a BRAND MARK (identical in every locale), so it stays a
    // literal. Everything the BROWSER paints — this description, the command
    // label, the context-menu row (services/menus) — goes through
    // public/_locales, the only channel browser.i18n can reach; UI strings live
    // in src/i18n, where they follow translate.target at runtime.
    name: 'Interline · 行间',
    description: '__MSG_extDescription__',
    default_locale: 'zh_CN',
    action: {
      default_title: '__MSG_extDescription__',
    },
    // AbortSignal.any (stream watchdog / execute timeout) needs Chrome 116+;
    // declare it so older Chromium gets a store gate instead of a TypeError.
    minimum_chrome_version: '116',
    // storage: config/cache · contextMenus: page/selection entries · alarms:
    // 24h cache sweep. (No `tabs`: the only tab APIs we call — `tabs.query`
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
    ...(import.meta.env.WXT_EXTENSION_KEY ? { key: import.meta.env.WXT_EXTENSION_KEY } : {}),
  }),
  hooks: {
    // WXT auto-generates `options_ui` from the options/ entrypoint with
    // open_in_tab:false (the cramped embedded frame). Flip it AFTER generation so
    // our full-page, manuscript-style settings open as a real browser tab.
    'build:manifestGenerated': (_wxt, manifest) => {
      if (manifest.options_ui) manifest.options_ui.open_in_tab = true;
      // WXT auto-discovers public/icon/{size}.png into `icons` but leaves the
      // TOOLBAR icon unset; Chrome's fallback for a missing default_icon is
      // inconsistent across surfaces (extension menu vs pinned bar), so pin it.
      if (manifest.action && !manifest.action.default_icon && manifest.icons) {
        manifest.action.default_icon = manifest.icons;
      }
    },
  },
});
