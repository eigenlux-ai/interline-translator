import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * 防退化守卫：shadow-surface.css（注入每个网页的 content-script 样式入口）的 Mantine 样式是「按需引入」的（base 三件套 + 用到的
 * 组件 `*.layer.css`），不是全量 `styles.layer.css`。这个文件钉死三件事：
 *
 *  1. src/ 里 import 了的每个 Mantine 组件，其所需样式文件都已在 shadow-surface.css 引入
 *     —— 新组件忘了引样式会直接红，并说清缺哪个组件的哪个文件；
 *  2. 引入顺序符合 Mantine 官方要求的「依赖在前」（Button 晚于 UnstyledButton、
 *     Card 晚于 Paper ……），否则依赖样式会覆盖派生组件；
 *  3. 组件名 → 样式文件名的映射表按 node_modules 里的实际文件名钉死：覆盖
 *     styles/ 下所有 `*.layer.css`，并与安装的 @mantine/core 的真实内部依赖图
 *     一致 —— 升级 @mantine/core 后映射过期会直接红，提示重新推导。
 *
 * 映射值 = 「依赖闭包」：从 esm/components/<Name>/ 整个组件目录出发，沿相对
 * import 传递收集到的所有 `*.module.mjs`（每个 CSS module 对应
 * styles/<name>.layer.css，子组件如 Menu.Item / Table.Thead 与父组件共用同一个
 * module，因此天然包含在父组件的闭包里）。
 */

const REPO_ROOT = process.cwd();
const SHADOW_CSS_PATH = join(REPO_ROOT, 'src', 'react-app', 'styles', 'shadow-surface.css');
const DOCUMENT_CSS_PATH = join(REPO_ROOT, 'src', 'react-app', 'styles', 'document-surface.css');
const SRC_DIR = join(REPO_ROOT, 'src');
const MANTINE_ESM_DIR = join(REPO_ROOT, 'node_modules', '@mantine', 'core', 'esm');
const MANTINE_STYLES_DIR = join(REPO_ROOT, 'node_modules', '@mantine', 'core', 'styles');

/** 必引的基础三件套：reset / 全局工具类 / 全部主题变量（顺序 = 全量包内顺序）。 */
const BASE_STYLES = ['baseline', 'global', 'default-css-variables'];

/** 组件样式清单，按依赖顺序排列（依赖在前），与 styles.layer.css 内部顺序 1:1 对应。 */
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

/** 组件名 → 所需 styles/<X>.layer.css（依赖闭包，文件名与 node_modules 一致）。 */
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
 * 无样式导出：渲染结果没有自己的 CSS module（布局原语 / render-prop / context）。
 * 出现在这里的名字不需要引样式；其它没进 STYLE_FILE_MAP 的 PascalCase 导出一律
 * 报错，逼着人确认「是新组件还是新工具」。
 */
const STYLELESS_CORE_EXPORTS = new Set([
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
 * @mantine/modals / @mantine/notifications 没有 per-component 样式文件：用到它们
 * 就等于用到这些 @mantine/core 样式（ModalsProvider 渲染 Modal/Button/Group，
 * <Notifications> 渲染 core 的 Notification），外加 notifications 自己那份。
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

/** shadow-surface.css 里的 @import 目标，按出现顺序。 */
function cssImports(css: string): string[] {
  return [...css.matchAll(/@import\s+'([^']+)'/g)].map((m) => m[1]);
}

/** `@mantine/core/styles/<X>.layer.css` → 样式名 `<X>`（顺序不变）。 */
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
 * 扫描 src/ 下所有 .ts/.tsx 里从 @mantine/core | modals | notifications 的 import。
 * 子组件（Menu.Item、Table.Thead …）随父组件 import，不在这里出现；它们的样式
 * 已包含在父组件的依赖闭包里。
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
 * 从安装的 @mantine/core 反推组件的真实样式依赖：走 esm/components/<Name>/ 的
 * 整个目录树（含子组件文件），沿相对 import 传递，收集所有 *.module.mjs 的名字。
 * 组件目录不存在时返回 null。
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

describe('Mantine 样式按需引入（shadow-surface.css）防退化', () => {
  const imports = cssImports(readShadowCss());
  const importedCore = coreStyleNames(imports);
  const importedCoreSet = new Set(importedCore);

  it('shadow-surface.css 的引入清单与顺序 == 钉死的清单（base + 依赖顺序 + notifications），且不含全量包', () => {
    expect(
      importedCore,
      `shadow-surface.css 的 @mantine/core 样式清单/顺序与 EXPECTED_CORE_IMPORTS 不一致。\n` +
        `新增组件请在 DEPENDENCY_ORDER 与 STYLE_FILE_MAP 里补（依赖排在前面），` +
        `顺序即 @mantine/core/styles.layer.css 的内部顺序。`
    ).toEqual(EXPECTED_CORE_IMPORTS);
    expect(imports, '缺少 @mantine/notifications/styles.layer.css').toContain(
      '@mantine/notifications/styles.layer.css'
    );
    expect(imports, "缺少 @import 'tailwindcss'").toContain('tailwindcss');
    expect(
      imports.filter((s) => /^@mantine\/core\/styles(\.layer)?\.css$/.test(s)),
      '禁止回到全量 @mantine/core/styles(.layer).css — 全量引入正是这次瘦身要消灭的（@mantine/notifications 只有一份 styles.layer.css，照常引入）'
    ).toEqual([]);
  });

  it('引入顺序满足「依赖在前」（Mantine 官方要求，反了会互相覆盖）', () => {
    const pos = new Map(importedCore.map((name, i) => [name, i]));
    const problems: string[] = [];
    for (const [component, files] of Object.entries(STYLE_FILE_MAP)) {
      const self = pos.get(component);
      if (self === undefined) continue; // 未使用的组件不参与顺序约束
      for (const dep of files) {
        if (dep === component) continue;
        const depPos = pos.get(dep);
        if (depPos === undefined) problems.push(`依赖缺失：${component} 需要 ${dep}.layer.css，但它没有被引入`);
        else if (depPos > self) problems.push(`顺序错误：依赖 ${dep}.layer.css 必须排在 ${component}.layer.css 之前`);
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('src/ 用到的每个 Mantine 组件都引了样式；未知组件名直接报错', () => {
    const problems: string[] = [];
    for (const used of collectMantineImports()) {
      if (used.isType) continue;
      if (used.name.startsWith('*')) {
        problems.push(`${used.where}: 不支持 namespace 导入（${used.name}）— 静态追踪不到组件名，请改为具名导入`);
        continue;
      }
      if (used.pkg === 'core') {
        const files = STYLE_FILE_MAP[used.name];
        if (!files) {
          if (STYLELESS_CORE_EXPORTS.has(used.name)) continue;
          // camelCase 导出是 hooks / 工厂函数（useMantineTheme、createTheme …），不渲染带样式的 DOM。
          if (!/^[A-Z]/.test(used.name)) continue;
          problems.push(
            `${used.where}: @mantine/core 的 ${used.name} 既不在 STYLE_FILE_MAP 也不在 STYLELESS_CORE_EXPORTS。` +
              `若是组件：把它的依赖闭包（styles/<X>.layer.css 清单）补进 STYLE_FILE_MAP 并在 shadow-surface.css 引入；` +
              `若是无样式导出：加入 STYLELESS_CORE_EXPORTS。`
          );
          continue;
        }
        const missing = files.filter((f) => !importedCoreSet.has(f));
        if (missing.length > 0) {
          problems.push(
            `${used.where}: 组件 ${used.name} 缺样式 ${missing.map((m) => `styles/${m}.layer.css`).join(', ')} — 在 shadow-surface.css 按依赖顺序补引`
          );
        }
      } else {
        const need = PACKAGE_STYLES[used.pkg];
        const missing = [
          ...need.own.filter((s) => !imports.includes(s)),
          ...need.core.filter((f) => !importedCoreSet.has(f)).map((m) => `styles/${m}.layer.css`),
        ];
        if (missing.length > 0) {
          problems.push(`${used.where}: @mantine/${used.pkg} 的 ${used.name} 缺样式 ${missing.join(', ')}`);
        }
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('STYLE_FILE_MAP 覆盖 styles/ 下所有 *.layer.css，且引用的文件都存在', () => {
    const styleFiles = readdirSync(MANTINE_STYLES_DIR)
      .filter((f) => f.endsWith(LAYER_SUFFIX))
      .map((f) => f.slice(0, -LAYER_SUFFIX.length));
    const covered = new Set<string>([...BASE_STYLES, ...Object.values(STYLE_FILE_MAP).flat()]);
    const uncovered = styleFiles.filter((f) => !covered.has(f));
    expect(
      uncovered,
      `以下样式文件没被 STYLE_FILE_MAP 覆盖（@mantine/core 新增/改名？）：${uncovered.join(', ')} — 补上映射或说明原因`
    ).toEqual([]);
    const dangling = [...covered].filter((f) => !styleFiles.includes(f));
    expect(dangling, `STYLE_FILE_MAP 引用了不存在的样式文件：${dangling.join(', ')}`).toEqual([]);
  });

  it('STYLE_FILE_MAP 与安装的 @mantine/core 内部依赖图一致（升级后需重新推导）', () => {
    const problems: string[] = [];
    for (const [component, pinned] of Object.entries(STYLE_FILE_MAP)) {
      const derived = deriveStyleClosure(component);
      if (derived === null) {
        problems.push(`${component}: node_modules/@mantine/core/esm/components 下已无此组件目录 — 映射表过期`);
        continue;
      }
      const missing = pinned.filter((f) => !derived.includes(f));
      const extra = derived.filter((f) => !pinned.includes(f));
      if (missing.length > 0 || extra.length > 0) {
        problems.push(
          `STYLE_FILE_MAP['${component}'] 与 @mantine/core 实际依赖不符 — 多引 ${missing.join(', ') || '无'}；漏引 ${extra.join(', ') || '无'}。` +
            `请照 esm/components/${component} 的 *.module.mjs 依赖重新推导并更新映射与 shadow-surface.css`
        );
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  it('PACKAGE_STYLES 与组件映射自洽（modals = Modal/Button/Group 闭包，notifications = Notification 闭包）', () => {
    const union = (...names: string[]): string[] => [...new Set(names.flatMap((n) => STYLE_FILE_MAP[n] ?? []))].sort();
    expect(PACKAGE_STYLES.modals.core.slice().sort()).toEqual(union('Modal', 'Button', 'Group'));
    expect(PACKAGE_STYLES.notifications.core.slice().sort()).toEqual(union('Notification'));
  });
});

/**
 * document 入口（options 页）刻意用全量 rem 包：按组件文件把尺寸折成了 px，在
 * theme.scale = 1 的 document surface 上会让组件尺寸不再跟随浏览器默认字号。
 * 它只在打开设置页时加载，体积不是常驻成本。层顺序必须与 shadow 入口一致。
 */
describe('document-surface.css 使用全量 rem 包', () => {
  const docImports = cssImports(readFileSync(DOCUMENT_CSS_PATH, 'utf8'));
  const layerDecl = (css: string): string | undefined => css.match(/^@layer [^{;]+;/m)?.[0];

  it('引入 @mantine/core 全量 styles.layer.css，且不混入按组件文件', () => {
    expect(docImports).toContain('@mantine/core/styles.layer.css');
    expect(docImports).toContain('@mantine/notifications/styles.layer.css');
    expect(docImports.filter((s) => s.startsWith(CORE_SPEC_PREFIX))).toEqual([]);
    expect(docImports.slice(-2)).toEqual(['tailwindcss', './global.css']);
  });

  it('两个入口的 @layer 顺序声明一致，且 shadow 入口同样以 tailwindcss + global.css 收尾', () => {
    expect(layerDecl(readFileSync(DOCUMENT_CSS_PATH, 'utf8'))).toBe(layerDecl(readShadowCss()));
    expect(layerDecl(readShadowCss())).toBeDefined();
    expect(cssImports(readShadowCss()).slice(-2)).toEqual(['tailwindcss', './global.css']);
  });
});
