// Audit: enumerate EVERY custom-property declaration in the built
// surface CSS and classify its selector against the iron law —
// "all root-level plugin CSS variables are anchored on .<prefix>-surface-root".
//
// Usage: node scripts/audit-css-vars.mjs <file.css | dir> [...more] [--document-assets dir] [--allow-empty]
//   - a DIRECTORY expands to every *.css inside it (so e.g. content.css AND
//     float-ui.css are both audited — never miss a new content-script's
//     stylesheet as surfaces are added).
//   - one or more FILE paths audit exactly those.
//   - --allow-empty accepts finding NO css at all (see the exit below).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import postcss from 'postcss';
import selectorParser from 'postcss-selector-parser';
import { PROJECT_PREFIX } from '../prefix.cjs';

/** Resolve argv into a flat list of .css files (expanding any directories). */
function resolveCssFiles(args) {
  const files = [];
  for (const arg of args) {
    let st;
    try {
      st = statSync(arg);
    } catch {
      console.error(`audit:css — path not found: ${arg}`);
      process.exit(1);
    }
    if (st.isDirectory()) {
      for (const name of readdirSync(arg)) if (name.endsWith('.css')) files.push(join(arg, name));
    } else {
      files.push(arg);
    }
  }
  return files;
}

// A "root-level" selector is one that targets the document/shadow root or
// every element — i.e. where a custom property becomes a design token for the
// whole subtree. These are the ONLY ones the iron law governs.
const surfaceClass = `${PROJECT_PREFIX}-surface-root`;
const SURFACE = `.${surfaceClass}`;
const TW_PREFIX = `--${PROJECT_PREFIX}-tw-`;

function atRuleChain(node) {
  const chain = [];
  let p = node.parent;
  while (p && p.type === 'atrule') {
    chain.unshift(`@${p.name} ${p.params}`.trim());
    p = p.parent;
  }
  return chain.join(' > ');
}

// Only the subject (the final compound) receives the declarations. :is() and
// :where() offer alternative subjects; :not() and :has() only filter them.
function subjectMatches(selector, predicate, allowUniversal = true, requireAllAlternatives = false) {
  const start = selector.nodes.findLastIndex((node) => node.type === 'combinator') + 1;
  const subject = selector.nodes.slice(start).filter((node) => node.type !== 'comment');
  if (
    subject.some(
      (node) => node.type === 'pseudo' && /^(?:::|:(before|after|first-line|first-letter)$)/i.test(node.value)
    )
  ) {
    return false;
  }
  const universal = allowUniversal && start === 0 && subject.length === 1;
  return subject.some((node) =>
    node.type === 'pseudo' && /^:(is|where)$/i.test(node.value)
      ? node.nodes[requireAllAlternatives ? 'every' : 'some']((branch) =>
          subjectMatches(branch, predicate, universal, requireAllAlternatives)
        )
      : predicate(node, universal)
  );
}

const rootToken = (node, universal) =>
  (node.type === 'universal' && universal) ||
  (node.type === 'tag' && /^(html|body)$/i.test(node.value)) ||
  (node.type === 'pseudo' && /^:(root|host)$/i.test(node.value));
const surfaceToken = (node) => node.type === 'class' && node.value === surfaceClass;
const schemeAttribute = (node) => node.type === 'attribute' && node.attribute === 'data-mantine-color-scheme';

// Mantine's static defaults qualify the root itself or the argument of :host().
const schemeToken = (node) =>
  schemeAttribute(node) ||
  (node.type === 'pseudo' &&
    node.value.toLowerCase() === ':host' &&
    node.nodes.length > 0 &&
    node.nodes.every((branch) => subjectMatches(branch, schemeAttribute, true, true)));

function auditProperties(root) {
  let propertyCount = 0;
  const propertyNames = new Set();
  root.walkAtRules('property', (at) => {
    propertyCount++;
    propertyNames.add(at.params);
  });

  console.log(`\n=== @property registrations (Tailwind names must be prefixed): ${propertyCount} ===`);
  const unprefixed = [...propertyNames].filter((n) => n.startsWith('--tw-'));
  const prefixed = [...propertyNames].filter((n) => n.startsWith(TW_PREFIX));
  const otherProp = [...propertyNames].filter((n) => !n.startsWith('--tw-') && !n.startsWith(TW_PREFIX));
  console.log(`  ${TW_PREFIX}* (namespaced): ${prefixed.length}`);
  console.log(
    `  --tw-* (UNNAMESPACED — would collide!): ${unprefixed.length}${unprefixed.length ? ' → ' + unprefixed.join(', ') : ''}`
  );
  console.log(`  other: ${otherProp.length}${otherProp.length ? ' → ' + otherProp.slice(0, 10).join(', ') : ''}`);

  return unprefixed.length === 0;
}

function auditFile(file, propertiesOnly = false) {
  const root = postcss.parse(readFileSync(file, 'utf8'));
  console.log(`\n##### ${file}`);
  const propertiesOk = auditProperties(root);
  if (propertiesOnly) return propertiesOk;
  const buckets = {
    rootCompliant: [], // design tokens on root AND includes .<prefix>-surface-root → GOOD
    rootViolation: [], // design tokens on root but MISSING .<prefix>-surface-root  → VIOLATION
    schemeStatic: [], // Host-qualified scheme defaults. Mantine sets the scheme on the inner surface root.
    twTransient: [], // `*`-scoped --<prefix>-tw-* per-element fallback (Tailwind's initial values, namespaced) — not a design token
    scoped: new Map(), // component/utility selectors (local scope, out of law)
  };

  const onlyTwVars = (props) => props.every((p) => p.startsWith(TW_PREFIX));
  const parser = selectorParser();

  root.walkRules((rule) => {
    const customProps = rule.nodes?.filter((n) => n.type === 'decl' && n.prop.startsWith('--')) ?? [];
    if (customProps.length === 0) return;
    const props = customProps.map((d) => d.prop);
    const chain = atRuleChain(rule);
    const entry = { selector: rule.selector, chain, count: customProps.length, sample: props.slice(0, 3) };
    // Keyframe offsets aren't element selectors.
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    const selectors = parser.astSync(rule.selector).nodes;
    const roots = selectors.filter((selector) => subjectMatches(selector, rootToken));
    if (roots.length > 0) {
      const includesSurface = selectors.some((selector) => subjectMatches(selector, surfaceToken));
      if (!includesSurface && roots.every((selector) => subjectMatches(selector, schemeToken, true, true)))
        buckets.schemeStatic.push(entry);
      else if (onlyTwVars(props)) buckets.twTransient.push(entry);
      else if (includesSurface) buckets.rootCompliant.push(entry);
      else buckets.rootViolation.push(entry);
    } else {
      const key = rule.selector.length > 60 ? rule.selector.slice(0, 60) + '…' : rule.selector;
      buckets.scoped.set(key, (buckets.scoped.get(key) || 0) + customProps.length);
    }
  });

  console.log('=== DESIGN-TOKEN root rules (governed by the iron law) ===');
  console.log(`COMPLIANT (include ${SURFACE}): ${buckets.rootCompliant.length} rule(s)`);
  for (const e of buckets.rootCompliant)
    console.log(`  ✓ [${e.chain || 'top'}] "${e.selector}" (${e.count} vars, e.g. ${e.sample.join(', ')})`);
  console.log(`\nVIOLATIONS (design tokens on root, MISSING ${SURFACE}): ${buckets.rootViolation.length} rule(s)`);
  for (const e of buckets.rootViolation)
    console.log(`  ✗ [${e.chain || 'top'}] "${e.selector}" (${e.count} vars, e.g. ${e.sample.join(', ')})`);

  console.log(
    `\n=== Mantine color-scheme STATIC defaults (inert in shadow; real values via runtime <style> on ${SURFACE} — verify at runtime): ${buckets.schemeStatic.length} ===`
  );
  for (const e of buckets.schemeStatic) console.log(`  ~ "${e.selector.slice(0, 70)}" (${e.count} vars)`);

  console.log(
    `\n=== Tailwind ${TW_PREFIX}* per-element transient fallback (initial values, namespaced): ${buckets.twTransient.length} rule(s) ===`
  );
  for (const e of buckets.twTransient)
    console.log(`  ~ [${e.chain ? e.chain.slice(0, 40) + '…' : 'top'}] "${e.selector}" (${e.count} vars)`);

  console.log(
    `\n=== SCOPED (component/utility, local — outside the law): ${buckets.scoped.size} distinct selectors ===`
  );
  let scopedTotal = 0;
  for (const [, c] of buckets.scoped) scopedTotal += c;
  console.log(`  total scoped custom-prop decls: ${scopedTotal} (these are element-local, not root tokens)`);
  // show any scoped selector that looks suspiciously root-ish or unprefixed-leaky
  const suspicious = [...buckets.scoped.keys()].filter((s) => /^(:root|:host|html|body|\*)/.test(s));
  console.log(
    `  suspicious root-ish scoped selectors: ${suspicious.length}${suspicious.length ? ' → ' + suspicious.join(' | ') : ''}`
  );

  console.log(`\n=== VERDICT ===`);
  const ok = buckets.rootViolation.length === 0 && propertiesOk;
  console.log(
    ok
      ? `✅ Iron law holds: every root-level var rule includes ${SURFACE}; Tailwind @property registrations namespaced.`
      : '❌ Violations found above.'
  );
  return ok;
}

// `--allow-empty` is the opt-out for the one legitimate empty run: a build whose
// content scripts ship every style via adoptedStyleSheets emits no CSS, so the
// iron law has nothing to govern. It must be asked for BY NAME, because the
// other way to get here — a style-pipeline change that moves the emitted CSS
// elsewhere — silently turns this audit into a no-op, which is precisely what it
// exists to catch.
const ALLOW_EMPTY = '--allow-empty';
const args = process.argv.slice(2);
const allowEmpty = args.includes(ALLOW_EMPTY);
const documentIndex = args.indexOf('--document-assets');
const documentPath = documentIndex < 0 ? undefined : args.splice(documentIndex, 2)[1];
if (documentIndex >= 0 && (!documentPath || documentPath.startsWith('--'))) {
  console.error('--document-assets requires a CSS file or directory');
  process.exit(1);
}
const paths = args.filter((a) => a !== ALLOW_EMPTY);
if (paths.length === 0) {
  console.error(
    `Usage: node scripts/audit-css-vars.mjs <file.css | dir> [...more] [--document-assets dir] [${ALLOW_EMPTY}]`
  );
  process.exit(1);
}
const files = resolveCssFiles(paths);
if (files.length === 0 && !(allowEmpty && documentPath)) {
  const where = paths.join(', ');
  if (allowEmpty) {
    console.log(`audit:css — no content-script CSS under ${where}; ${ALLOW_EMPTY} given, nothing to audit.`);
    process.exit(0);
  }
  console.error(
    `audit:css FAILED — no .css found under ${where}. Either the build did not run, or the style pipeline` +
      ` changed and this audit no longer sees the content-script CSS. If the build genuinely emits none,` +
      ` re-run with ${ALLOW_EMPTY}.`
  );
  process.exit(1);
}
const documentFiles = documentPath ? resolveCssFiles([documentPath]) : [];
let allOk = !documentPath || documentFiles.length > 0;
for (const f of documentFiles) allOk = auditFile(f, true) && allOk;
for (const f of files) allOk = auditFile(f) && allOk;

console.log(`\n=== VERDICT (${files.length} file(s)) ===`);
console.log(
  allOk
    ? `✅ Iron law holds across all content-script CSS; every root-level var rule includes ${SURFACE}.`
    : '❌ Violations found above.'
);
process.exit(allOk ? 0 : 1);
