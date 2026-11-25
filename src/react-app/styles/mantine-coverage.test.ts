import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Regression guard for the selective Mantine imports in shadow-surface.css,
 * the content-script stylesheet injected into each page. It loads the three
 * base sheets and the required component *.layer.css files, rather than the
 * complete styles.layer.css bundle. This suite checks that:
 *
 *  1. Every Mantine component imported in src/ has its required styles in the
 *     shadow entrypoint. Failures name the component and missing stylesheet.
 *  2. Dependencies precede their consumers (UnstyledButton before Button,
 *     Paper before Card), so base styles do not override derived components.
 *  3. The component-to-stylesheet map covers all installed *.layer.css files
 *     and matches @mantine/core's actual dependency graph. Dependency upgrades
 *     must fail visibly when the map needs to be rebuilt.
 *
 * Each mapping contains a dependency closure: traverse relative imports from
 * esm/components/<Name>/ and collect every referenced *.module.mjs. Each CSS
 * module corresponds to a styles/<name>.layer.css file. Compound components
 * such as Menu.Item and Table.Thead share their parent's module and are thus
 * included in the parent's closure.
 */

const REPO_ROOT = process.cwd();
const SHADOW_CSS_PATH = join(REPO_ROOT, 'src', 'react-app', 'styles', 'shadow-surface.css');
const DOCUMENT_CSS_PATH = join(REPO_ROOT, 'src', 'react-app', 'styles', 'document-surface.css');
const SRC_DIR = join(REPO_ROOT, 'src');
const MANTINE_ESM_DIR = join(REPO_ROOT, 'node_modules', '@mantine', 'core', 'esm');
const MANTINE_STYLES_DIR = join(REPO_ROOT, 'node_modules', '@mantine', 'core', 'styles');

/** Required base sheets: reset, global utilities, and theme variables, in bundle order. */
const BASE_STYLES = ['baseline', 'global', 'default-css-variables'];

/** Component styles in dependency order, matching styles.layer.css exactly. */
const DEPENDENCY_ORDER = [
  'ScrollArea',
  'UnstyledButton',
  'VisuallyHidden',
  'Paper',
  'Overlay',
  'Popover',
  'Loader',
  'ActionIcon',
  'CloseButton',
  'Group',
  'ModalBase',
  'Input',
  'FloatingIndicator',
  'Accordion',
  'Alert',
  'Text',
  'Anchor',
  'Combobox',
  'InlineInput',
  'Badge',
  'Button',
  'Card',
  'Center',
  'Code',
  'Divider',
  'Drawer',
  'Menu',
  'Modal',
  'Pill',
  'PillsInput',
  'Notification',
  'NumberInput',
  'PasswordInput',
  'RadioCard',
  'RadioIndicator',
  'Radio',
  'Tooltip',
  'SegmentedControl',
  'SimpleGrid',
  'Skeleton',
  'Stack',
  'Switch',
  'Table',
  'Title',
];

const EXPECTED_CORE_IMPORTS = [...BASE_STYLES, ...DEPENDENCY_ORDER];

/** Component name -> required styles/<X>.layer.css dependency closure, using installed filenames. */
const STYLE_FILE_MAP: Record<string, string[]> = {
  Accordion: ['Accordion', 'UnstyledButton'],
  ActionIcon: ['ActionIcon', 'Loader', 'UnstyledButton'],
  Affix: ['Affix'],
  Alert: ['Alert', 'CloseButton', 'UnstyledButton'],
  Anchor: ['Anchor', 'Text'],
  AngleSlider: ['AngleSlider'],
  AppShell: ['AppShell'],
  AspectRatio: ['AspectRatio'],
  Autocomplete: [
    'CloseButton',
    'Combobox',
    'Input',
    'Loader',
    'Overlay',
    'Popover',
    'ScrollArea',
    'UnstyledButton',
    'VisuallyHidden',
  ],
  Avatar: ['Avatar'],
  BackgroundImage: ['BackgroundImage'],
  Badge: ['Badge'],
  Blockquote: ['Blockquote'],
  Breadcrumbs: ['Breadcrumbs'],
  Burger: ['Burger', 'UnstyledButton'],
  Button: ['Button', 'Loader', 'UnstyledButton'],
  Card: ['Card', 'Paper'],
  Center: ['Center'],
  Checkbox: [
    'Checkbox',
    'CheckboxCard',
    'CheckboxIndicator',
    'CloseButton',
    'InlineInput',
    'Input',
    'Loader',
    'UnstyledButton',
  ],
  Chip: ['Chip'],
  CloseButton: ['CloseButton', 'UnstyledButton'],
  Code: ['Code'],
  ColorInput: [
    'ActionIcon',
    'CloseButton',
    'ColorInput',
    'ColorPicker',
    'ColorSwatch',
    'Input',
    'Loader',
    'Overlay',
    'Popover',
    'UnstyledButton',
    'VisuallyHidden',
  ],
  ColorPicker: ['ColorPicker', 'ColorSwatch'],
  ColorSwatch: ['ColorSwatch'],
  Combobox: [
    'CloseButton',
    'Combobox',
    'Input',
    'Loader',
    'Overlay',
    'Popover',
    'ScrollArea',
    'UnstyledButton',
    'VisuallyHidden',
  ],
  Container: ['Container'],
  Dialog: ['Affix', 'CloseButton', 'Dialog', 'Paper', 'UnstyledButton'],
  Divider: ['Divider'],
  Drawer: ['CloseButton', 'Drawer', 'ModalBase', 'Overlay', 'Paper', 'ScrollArea', 'UnstyledButton', 'VisuallyHidden'],
  Fieldset: ['Fieldset'],
  FileInput: ['CloseButton', 'Input', 'Loader', 'UnstyledButton'],
  Flex: ['Flex'],
  FloatingIndicator: ['FloatingIndicator'],
  FloatingWindow: ['FloatingWindow', 'Paper'],
  FocusTrap: ['VisuallyHidden'],
  Grid: ['Grid'],
  Group: ['Group'],
  Highlight: ['Mark', 'Text'],
  HoverCard: ['Overlay', 'Popover', 'VisuallyHidden'],
  Image: ['Image'],
  Indicator: ['Indicator'],
  Input: ['CloseButton', 'Input', 'Loader', 'UnstyledButton'],
  InputBase: ['CloseButton', 'Input', 'Loader', 'UnstyledButton'],
  JsonInput: ['CloseButton', 'Input', 'Loader', 'UnstyledButton'],
  Kbd: ['Kbd'],
  List: ['List'],
  Loader: ['Loader'],
  LoadingOverlay: ['Loader', 'LoadingOverlay', 'Overlay'],
  Mark: ['Mark'],
  Marquee: ['Marquee'],
  MaskInput: ['CloseButton', 'Input', 'Loader', 'UnstyledButton'],
  Menu: ['CloseButton', 'Input', 'Loader', 'Menu', 'Overlay', 'Popover', 'UnstyledButton', 'VisuallyHidden'],
  Modal: ['CloseButton', 'Modal', 'ModalBase', 'Overlay', 'Paper', 'ScrollArea', 'UnstyledButton', 'VisuallyHidden'],
  ModalBase: ['CloseButton', 'ModalBase', 'Overlay', 'Paper', 'UnstyledButton', 'VisuallyHidden'],
  MultiSelect: [
    'CloseButton',
    'Combobox',
    'Input',
    'Loader',
    'Overlay',
    'Pill',
    'PillsInput',
    'Popover',
    'ScrollArea',
    'UnstyledButton',
    'VisuallyHidden',
  ],
  NativeSelect: ['CloseButton', 'Combobox', 'Input', 'Loader', 'UnstyledButton'],
  NavLink: ['NavLink', 'UnstyledButton'],
  Notification: ['CloseButton', 'Loader', 'Notification', 'UnstyledButton'],
  NumberInput: ['CloseButton', 'Input', 'Loader', 'NumberInput', 'UnstyledButton'],
  OverflowList: ['OverflowList'],
  Overlay: ['Overlay'],
  Pagination: ['Group', 'Pagination', 'UnstyledButton'],
  Paper: ['Paper'],
  PasswordInput: ['ActionIcon', 'CloseButton', 'Input', 'Loader', 'PasswordInput', 'UnstyledButton'],
  Pill: ['CloseButton', 'Pill', 'UnstyledButton'],
  PillsInput: ['CloseButton', 'Input', 'Loader', 'PillsInput', 'UnstyledButton'],
  PinInput: ['CloseButton', 'Group', 'Input', 'Loader', 'PinInput', 'UnstyledButton'],
  Popover: ['Overlay', 'Popover', 'VisuallyHidden'],
  Progress: ['Progress'],
  Radio: ['CloseButton', 'InlineInput', 'Input', 'Loader', 'Radio', 'RadioCard', 'RadioIndicator', 'UnstyledButton'],
  Rating: ['Rating'],
  RingProgress: ['RingProgress', 'Tooltip'],
  RollingNumber: ['RollingNumber'],
  ScrollArea: ['ScrollArea'],
  Scroller: ['Scroller', 'UnstyledButton'],
  SegmentedControl: ['FloatingIndicator', 'SegmentedControl'],
  Select: [
    'CloseButton',
    'Combobox',
    'Input',
    'Loader',
    'Overlay',
    'Popover',
    'ScrollArea',
    'UnstyledButton',
    'VisuallyHidden',
  ],
  SemiCircleProgress: ['SemiCircleProgress'],
  SimpleGrid: ['SimpleGrid'],
  Skeleton: ['Skeleton'],
  Slider: ['Slider'],
  Splitter: ['Splitter'],
  Spoiler: ['Anchor', 'Spoiler', 'Text'],
  Stack: ['Stack'],
  Stepper: ['Loader', 'Stepper', 'UnstyledButton'],
  Switch: ['CloseButton', 'InlineInput', 'Input', 'Loader', 'Switch', 'UnstyledButton'],
  Table: ['ScrollArea', 'Table'],
  TableOfContents: ['TableOfContents', 'UnstyledButton'],
  Tabs: ['Tabs', 'UnstyledButton'],
  TagsInput: [
    'CloseButton',
    'Combobox',
    'Input',
    'Loader',
    'Overlay',
    'Pill',
    'PillsInput',
    'Popover',
    'ScrollArea',
    'UnstyledButton',
    'VisuallyHidden',
  ],
  Text: ['Text'],
  TextInput: ['CloseButton', 'Input', 'Loader', 'UnstyledButton'],
  Textarea: ['CloseButton', 'Input', 'Loader', 'UnstyledButton'],
  ThemeIcon: ['ThemeIcon'],
  Timeline: ['Timeline'],
  Title: ['Title'],
  Tooltip: ['Tooltip'],
  Tree: ['Loader', 'Tree'],
  TreeSelect: [
    'CheckboxCard',
    'CheckboxIndicator',
    'CloseButton',
    'Combobox',
    'Input',
    'Loader',
    'Overlay',
    'Pill',
    'PillsInput',
    'Popover',
    'ScrollArea',
    'TreeSelect',
    'UnstyledButton',
    'VisuallyHidden',
  ],
  Typography: ['Typography'],
  UnstyledButton: ['UnstyledButton'],
  VisuallyHidden: ['VisuallyHidden'],
};

/**
 * Exports with no CSS module of their own: layout primitives, render props,
 * and context providers. These need no stylesheet import. Any other PascalCase
 * export missing from STYLE_FILE_MAP fails so new components and utilities
 * must be explicitly classified.
 */
const STYLELESS_CORE_EXPORTS = new Set([
  'DEFAULT_THEME',
  'Box',
  'Collapse',
  'CopyButton',
  'DirectionContext',
  'FileButton',
  'MantineProvider',
  'NumberFormatter',
  'Portal',
  'Space',
  'Transition',
]);

/**
 * @mantine/modals and @mantine/notifications have no per-component stylesheets.
 * They require the core styles used by their rendered components:
 * ModalsProvider uses Modal/Button/Group, and Notifications uses Notification,
 * plus the notifications package's own stylesheet.
 */
const PACKAGE_STYLES: Record<'modals' | 'notifications', { own: string[]; core: string[] }> = {
  modals: {
    own: [],
    core: [
      'Button',
      'CloseButton',
      'Group',
      'Loader',
      'Modal',
      'ModalBase',
      'Overlay',
      'Paper',
      'ScrollArea',
      'UnstyledButton',
      'VisuallyHidden',
    ],
  },
  notifications: {
    own: ['@mantine/notifications/styles.layer.css'],
    core: ['CloseButton', 'Loader', 'Notification', 'UnstyledButton'],
  },
};

type Pkg = 'core' | 'modals' | 'notifications';

interface UsedImport {
  pkg: Pkg;
  name: string;
  isType: boolean;
  where: string;
}

const CORE_SPEC_PREFIX = '@mantine/core/styles/';
const LAYER_SUFFIX = '.layer.css';

function readShadowCss(): string {
  return readFileSync(SHADOW_CSS_PATH, 'utf8');
}

/** @import targets in shadow-surface.css, in source order. */
function cssImports(css: string): string[] {
  return [...css.matchAll(/@import\s+'([^']+)'/g)].map((m) => m[1]);
}

/** Map `@mantine/core/styles/<X>.layer.css` to `<X>`, preserving order. */
function coreStyleNames(specifiers: string[]): string[] {
  return specifiers
    .filter((s) => s.startsWith(CORE_SPEC_PREFIX))
    .map((s) => s.slice(CORE_SPEC_PREFIX.length).replace(LAYER_SUFFIX, ''));
}

function listSourceFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) listSourceFiles(full, acc);
    else if (/\.(ts|tsx)$/.test(entry.name)) acc.push(full);
  }
  return acc.sort();
}

/**
 * Scan .ts/.tsx files under src/ for imports from @mantine/core, modals, and
 * notifications. Compound components (Menu.Item, Table.Thead, etc.) arrive
 * through their parent import; their styles are already in its closure.
 */
function collectMantineImports(): UsedImport[] {
  const importRe =
    /import\s+(type\s+)?(\{[^}]*\}|\*\s+as\s+[\w$]+|(?:type\s+)?[\w$]+)\s+from\s+['"]@mantine\/(core|modals|notifications)['"]/g;
  const out: UsedImport[] = [];
  for (const file of listSourceFiles(SRC_DIR)) {
    const where = file.slice(REPO_ROOT.length + 1);
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(importRe)) {
      const stmtType = Boolean(match[1]);
      const clause = match[2].trim();
      const pkg = match[3] as Pkg;
      if (clause.startsWith('{')) {
        for (const raw of clause.slice(1, -1).split(',')) {
          const spec = raw.trim();
          if (!spec) continue;
          const isType = stmtType || /^type\s+/.test(spec);
          const name = spec
            .replace(/^type\s+/, '')
            .split(/\s+as\s+/)[0]
            .trim();
          if (name) out.push({ pkg, name, isType, where });
        }
      } else if (clause.startsWith('*')) {
        out.push({ pkg, name: clause, isType: stmtType, where });
      } else {
        const isType = stmtType || /^type\s+/.test(clause);
        const name = clause
          .replace(/^type\s+/, '')
          .split(/\s+as\s+/)[0]
          .trim();
        if (name) out.push({ pkg, name, isType, where });
      }
    }
  }
  return out;
}

/**
 * Derive each installed @mantine/core component's stylesheet dependencies by
 * traversing its esm/components/<Name>/ directory, including child components,
 * following relative imports and collecting *.module.mjs names.
 * Return null when the component directory does not exist.
 */
function deriveStyleClosure(component: string): string[] | null {
  const dir = join(MANTINE_ESM_DIR, 'components', component);
  if (!existsSync(dir)) return null;
  const modules = new Set<string>();
  const seen = new Set<string>();
  const walk = (file: string): void => {
    if (seen.has(file)) return;
    seen.add(file);
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/from\s+"([^"]+)"/g)) {
      const spec = match[1];
      if (spec.endsWith('.module.mjs')) {
        modules.add(spec.slice(spec.lastIndexOf('/') + 1).replace('.module.mjs', ''));
      } else if (spec.startsWith('.')) {
        const target = resolve(dirname(file), spec);
        walk(target.endsWith('.mjs') ? target : `${target}.mjs`);
      }
    }
  };
  const walkDir = (d: string): void => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) walkDir(full);
      else if (entry.name.endsWith('.mjs') && !entry.name.endsWith('.module.mjs')) walk(full);
    }
  };
  walkDir(dir);
  return [...modules].sort();
}

describe('Selective Mantine style imports in shadow-surface.css', () => {
  const imports = cssImports(readShadowCss());
  const importedCore = coreStyleNames(imports);
  const importedCoreSet = new Set(importedCore);

  it('matches the expected base, component, and notification import order without the full core bundle', () => {
    expect(
      importedCore,
      `shadow-surface.css core style imports or their order differ from EXPECTED_CORE_IMPORTS.\n` +
        `Add new components to DEPENDENCY_ORDER and STYLE_FILE_MAP, with dependencies first. ` +
        `Follow the order in @mantine/core/styles.layer.css.`
    ).toEqual(EXPECTED_CORE_IMPORTS);
    expect(imports, 'Missing @mantine/notifications/styles.layer.css').toContain(
      '@mantine/notifications/styles.layer.css'
    );
    expect(imports, "Missing @import 'tailwindcss'").toContain('tailwindcss');
    expect(
      imports.filter((s) => /^@mantine\/core\/styles(\.layer)?\.css$/.test(s)),
      'Do not load the full @mantine/core/styles(.layer).css bundle in the shadow entrypoint; @mantine/notifications has only one styles.layer.css file and still requires it.'
    ).toEqual([]);
  });

  it('loads dependencies before their consumers to preserve the cascade', () => {
    const pos = new Map(importedCore.map((name, i) => [name, i]));
    const problems: string[] = [];
    for (const [component, files] of Object.entries(STYLE_FILE_MAP)) {
      const self = pos.get(component);
      if (self === undefined) continue; // Unused components impose no ordering constraints.
      for (const dep of files) {
        if (dep === component) continue;
        const depPos = pos.get(dep);
        if (depPos === undefined)
          problems.push(`Missing dependency: ${component} requires ${dep}.layer.css, which is not imported`);
        else if (depPos > self) problems.push(`Invalid order: ${dep}.layer.css must precede ${component}.layer.css`);
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('includes styles for every Mantine component used in src/ and rejects unknown components', () => {
    const problems: string[] = [];
    for (const used of collectMantineImports()) {
      if (used.isType) continue;
      if (used.name.startsWith('*')) {
        problems.push(
          `${used.where}: namespace import ${used.name} prevents static component tracking; use named imports`
        );
        continue;
      }
      if (used.pkg === 'core') {
        const files = STYLE_FILE_MAP[used.name];
        if (!files) {
          if (STYLELESS_CORE_EXPORTS.has(used.name)) continue;
          // camelCase exports are hooks or factories (useMantineTheme, createTheme, etc.), not styled DOM components.
          if (!/^[A-Z]/.test(used.name)) continue;
          problems.push(
            `${used.where}: @mantine/core export ${used.name} is absent from STYLE_FILE_MAP and STYLELESS_CORE_EXPORTS. ` +
              `For a component, add its styles/<X>.layer.css dependency closure to STYLE_FILE_MAP and shadow-surface.css. ` +
              `For a styleless export, add it to STYLELESS_CORE_EXPORTS.`
          );
          continue;
        }
        const missing = files.filter((f) => !importedCoreSet.has(f));
        if (missing.length > 0) {
          problems.push(
            `${used.where}: component ${used.name} is missing ${missing.map((m) => `styles/${m}.layer.css`).join(', ')}; add these to shadow-surface.css in dependency order`
          );
        }
      } else {
        const need = PACKAGE_STYLES[used.pkg];
        const missing = [
          ...need.own.filter((s) => !imports.includes(s)),
          ...need.core.filter((f) => !importedCoreSet.has(f)).map((m) => `styles/${m}.layer.css`),
        ];
        if (missing.length > 0) {
          problems.push(
            `${used.where}: @mantine/${used.pkg} export ${used.name} is missing styles ${missing.join(', ')}`
          );
        }
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('covers every installed *.layer.css file and references only existing files', () => {
    const styleFiles = readdirSync(MANTINE_STYLES_DIR)
      .filter((f) => f.endsWith(LAYER_SUFFIX))
      .map((f) => f.slice(0, -LAYER_SUFFIX.length));
    const covered = new Set<string>([...BASE_STYLES, ...Object.values(STYLE_FILE_MAP).flat()]);
    const uncovered = styleFiles.filter((f) => !covered.has(f));
    expect(
      uncovered,
      `Styles missing from STYLE_FILE_MAP (added or renamed by @mantine/core?): ${uncovered.join(', ')}; update the map or explain the exclusion`
    ).toEqual([]);
    const dangling = [...covered].filter((f) => !styleFiles.includes(f));
    expect(dangling, `STYLE_FILE_MAP references missing files: ${dangling.join(', ')}`).toEqual([]);
  });

  it('matches the installed @mantine/core dependency graph and detects stale mappings after upgrades', () => {
    const problems: string[] = [];
    for (const [component, pinned] of Object.entries(STYLE_FILE_MAP)) {
      const derived = deriveStyleClosure(component);
      if (derived === null) {
        problems.push(
          `${component}: component directory missing from node_modules/@mantine/core/esm/components; the map is stale`
        );
        continue;
      }
      const missing = pinned.filter((f) => !derived.includes(f));
      const extra = derived.filter((f) => !pinned.includes(f));
      if (missing.length > 0 || extra.length > 0) {
        problems.push(
          `STYLE_FILE_MAP['${component}'] differs from @mantine/core dependencies; unnecessary: ${missing.join(', ') || 'none'}; missing: ${extra.join(', ') || 'none'}. ` +
            `Rebuild the closure from esm/components/${component}/*.module.mjs dependencies and update the map and shadow-surface.css`
        );
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('keeps PACKAGE_STYLES consistent with the Modal/Button/Group and Notification closures', () => {
    const union = (...names: string[]): string[] => [...new Set(names.flatMap((n) => STYLE_FILE_MAP[n] ?? []))].sort();
    expect(PACKAGE_STYLES.modals.core.slice().sort()).toEqual(union('Modal', 'Button', 'Group'));
    expect(PACKAGE_STYLES.notifications.core.slice().sort()).toEqual(union('Notification'));
  });
});

/**
 * The document entrypoint (options) deliberately uses the full rem-based
 * bundle. The selective component files use px, which would stop controls
 * from following the browser's default font size when theme.scale is 1.
 * This bundle loads only when settings open, so it adds no persistent page
 * cost. Its layer order must match the shadow entrypoint.
 */
describe('Full rem-based bundle in document-surface.css', () => {
  const docImports = cssImports(readFileSync(DOCUMENT_CSS_PATH, 'utf8'));
  const layerDecl = (css: string): string | undefined => css.match(/^@layer [^{;]+;/m)?.[0];

  it('imports the full @mantine/core/styles.layer.css bundle without selective component files', () => {
    expect(docImports).toContain('@mantine/core/styles.layer.css');
    expect(docImports).toContain('@mantine/notifications/styles.layer.css');
    expect(docImports.filter((s) => s.startsWith(CORE_SPEC_PREFIX))).toEqual([]);
    expect(docImports.slice(-2)).toEqual(['tailwindcss', './global.css']);
  });

  it('uses the same layer order in both entrypoints and ends shadow imports with tailwindcss and global.css', () => {
    expect(layerDecl(readFileSync(DOCUMENT_CSS_PATH, 'utf8'))).toBe(layerDecl(readShadowCss()));
    expect(layerDecl(readShadowCss())).toBeDefined();
    expect(cssImports(readShadowCss()).slice(-2)).toEqual(['tailwindcss', './global.css']);
  });
});
