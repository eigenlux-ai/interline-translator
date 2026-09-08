import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import eslintConfigPrettier from 'eslint-config-prettier';
import autoImports from './.wxt/eslint-auto-imports.mjs';

// Shared "engine internals" denylist for the bundle boundary: importing any of
// these from content/UI would drag the heavy background engine (ai-sdk/dexie/
// queue/provider) into the content bundle and blow the size red line. Defined
// once and spread into both the react-app and the (stricter) dom rule, so the
// two stay in sync.
const ENGINE_INTERNALS = [
  {
    group: [
      '@/services/*/impl',
      '@/services/**/impl',
      '@/services/index',
      '@/services/index.ts',
      // the stream servers pull ai-sdk; UI must use @/services/stream/client
      // (or batch-client).
      '@/services/stream/server',
      '@/services/stream/batch-server',
    ],
    message:
      'content/UI must not import a service implementation — import its contract.ts (or @/services/stream/client) instead.',
  },
  {
    group: [
      '@/services/**/provider',
      '@/services/**/provider/**',
      '@/services/**/queue',
      '@/services/**/queue/**',
      '@/services/**/cache',
      '@/services/**/cache/**',
      '@/services/**/execute',
      '@/services/**/preflight',
    ],
    message:
      'content/UI must not import engine internals (provider/queue/cache/execute) — these are background-only.',
  },
  {
    group: ['ai', '@ai-sdk/*', '@ai-sdk/**', '@openrouter/ai-sdk-provider', 'dexie'],
    message:
      'ai-sdk/dexie are background-only — content/UI must reach the engine through @/services/translation/contract (proxy-service).',
  },
];

export default defineConfig(
  {
    ignores: [
      '**/node_modules/**',
      '.output/**',
      '.wxt/**',
      '.cache/**',
      'public/**',
      // vendored third-party test fixtures (tw3-play.js)
      'test-pages/**',
      // Local-only scratch dirs (gitignored, never project source). Kept here so
      // a contributor's local notes/vendored material can't break their lint run.
      'references/**',
      'docs/**',
      // Paraglide-compiled message catalog (pnpm i18n) — generated, committed.
      'src/paraglide/**',
    ],
  },
  autoImports,
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    // Register the plugin object explicitly and take only its rules —
    // robust against the plugin's prepackaged-config format (flat vs
    // legacy) shifting between versions.
    plugins: {
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
        ...globals.webextensions,
        ...globals.node,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // Downgrade from the recommended 'error' to 'warn': the template itself is
      // any-free, but downstream code should be able to prototype with `any`
      // without breaking the build.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Off for downstream comfort: the common `interface Props extends Base {}`
      // (extend with nothing added) pattern trips this rule. The template never
      // triggers it.
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
  {
    // Surface isomorphism guard: UI code must not assume its mount point.
    // document.body / document.documentElement differ per surface (popup vs
    // shadow DOM) — always go through useSurface(). The surface/ kernel and
    // entrypoints are exempt (they BUILD the env).
    files: ['src/react-app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "MemberExpression[object.name='document'][property.name='body']",
          message: 'Surface UI must not assume its mount point — use useSurface().portalTarget instead.',
        },
        {
          selector: "MemberExpression[object.name='document'][property.name='documentElement']",
          message: 'Surface UI must not assume its mount point — use useSurface().rootElement instead.',
        },
      ],
    },
  },
  {
    // ── Bundle boundary (the contract/impl red line) ──
    // content/UI code (dom/** + react-app/**) may import ONLY a service's
    // `contract.ts` (proxy getter + types) and `data/models` (pure types).
    // Importing impl/provider/queue/cache — or ai-sdk/dexie directly — would
    // drag the heavy background engine into the content bundle and blow the
    // size red line. Background entrypoint + services/** themselves are exempt.
    // This lint is the first line of defence; the gzip size assertion in CI is
    // the backstop (lint can be silenced, the byte budget cannot).
    files: ['src/react-app/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: ENGINE_INTERNALS }],
    },
  },
  {
    // dom/** (content scripts) are STRICTER than react-app: beyond the shared
    // engine-internal block they must not reach ANY background or persistence
    // service either. A content script needs exactly two service surfaces —
    // `@/services/translation/contract` (proxy) and `@/services/keep-alive` —
    // and gets its config from the entrypoint as plain options, never by
    // importing config/storage itself. (react-app's options page legitimately
    // reads config, which is why this block is dom-only.) flat-config overrides
    // the rule per file, so this list re-includes ENGINE_INTERNALS.
    files: ['src/dom/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...ENGINE_INTERNALS,
            {
              group: [
                '@/services/config',
                '@/services/config/**',
                '@/services/menus',
                '@/services/request',
                '@/services/**/storage',
                '@/services/**/storage/**',
                '@/services/**/db',
                '@/services/**/db/**',
                '@/services/**/migrations/**',
              ],
              message:
                'content scripts must not import background/persistence services — dom/** may use only @/services/translation/contract and @/services/keep-alive.',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier
);
