import { RECURSIVE_PSEUDO_CLASSES, tokenize, TOKENS, type Token } from 'parsel-js';

// Keep CSS nesting and comments as opaque tokens alongside Parsel's selector grammar.
const tokens = { comment: /\/\*[\s\S]*?\*\//g, ...TOKENS, nesting: /&/g };
const isRoot = (token: Token) => token.type === 'pseudo-class' && token.name.toLowerCase() === 'root';

function renderToken(token: Token): string {
  if (token.type !== 'pseudo-class' && token.type !== 'pseudo-element') return token.content;
  const name = token.name.toLowerCase();
  if (!token.argument || (!RECURSIVE_PSEUDO_CLASSES.has(name) && name !== 'slotted')) return token.content;
  // nth-child(An+B of S) has a non-selector prefix. Keep it outside the rewrite.
  const index = /^nth-(?:last-)?child$/.test(name) ? /^(.*?\bof\s+)/is.exec(token.argument)?.[0] : '';
  if (index === undefined) return token.content;
  const selector = token.argument.slice(index.length);
  return token.content.slice(0, token.content.indexOf('(') + 1) + index + rewriteSelector(selector) + ')';
}

// A shadow host only matches its qualifiers inside :host(...). Pseudo-elements
// are subjects in their own right and stay outside, e.g. :root.dark::before.
function renderCompound(compound: Token[]): string {
  if (!compound.some(isRoot)) return compound.map(renderToken).join('');
  const boundary = compound.findIndex(
    (token) => token.type === 'pseudo-element' || /^:(?:before|after|first-line|first-letter)$/i.test(token.content)
  );
  const end = boundary < 0 ? compound.length : boundary;
  const modifiers = compound.slice(0, end).filter((token) => !isRoot(token));
  const qualifiers = modifiers.map(renderToken).join('');
  const host = modifiers.some((token) => !token.content.startsWith('/*'))
    ? `:host(${qualifiers})`
    : ':host' + qualifiers;
  return host + compound.slice(end).map(renderToken).join('');
}

function rewriteSelector(selector: string): string {
  if (!/:root\b/i.test(selector)) return selector;
  const branches = new Set<string>();
  let result = '';
  let branch = '';
  let separator = '';
  let compound: Token[] = [];
  const finishBranch = () => {
    branch += renderCompound(compound);
    if (!branches.has(branch)) {
      branches.add(branch);
      result += separator + branch;
    }
    branch = '';
    compound = [];
  };
  for (const token of tokenize(selector, tokens)) {
    if (token.type === 'comma') {
      finishBranch();
      separator = selector.trim().slice(...token.pos);
    } else if (token.type === 'combinator') {
      branch += renderCompound(compound) + selector.trim().slice(...token.pos);
      compound = [];
    } else {
      compound.push(token);
    }
  }
  finishBranch();
  return result;
}

// Treat complete attributes as opaque too: a comment may occur between an
// attribute name and its operator, and comment delimiters may occur in strings.
const literal = /\\[\s\S]|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\/\*[\s\S]*?\*\//;
const attribute = String.raw`\[(?:${literal.source}|[^\]"'\\/]|\/(?!\*))*\]`;
const selectorLiterals = new RegExp(`${literal.source}|${attribute}`, 'g');

/** Shield comment contents from Parsel's string, escape and parenthesis preprocessing. */
export function shadowRootSelector(selector: string): string {
  if (!selector.includes('/*') || !/:root\b/i.test(selector)) return rewriteSelector(selector);
  const originals = new Map<string, string>();
  const masked = selector.replace(selectorLiterals, (value) => {
    if (!value.startsWith('/*') && !value.startsWith('[')) return value;
    const placeholder = value.startsWith('[') ? `[a${originals.size}]` : `/*${originals.size}*/`;
    originals.set(placeholder, value);
    return placeholder;
  });
  return rewriteSelector(masked).replace(selectorLiterals, (value) => originals.get(value) ?? value);
}
