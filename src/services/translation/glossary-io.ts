/**
 * @module services/translation/glossary-io
 *
 * Import/export for glossary SETS. The portable file format is deliberately
 * minimal — people arrive with terminology lists, not with our config shapes:
 *
 *   - JSON set: `{ "name": "AI 术语集", "pattern": "*.x.com", "entries": [...] }`
 *     (our own export; `id`/`enabled` are NOT portable — the importer mints a
 *     fresh id and enables the set);
 *   - bare JSON array: `[{ "source": "Pod", "target": "容器组", "note": "…" }]`;
 *   - CSV / TSV: `source,target,note` rows — the format spreadsheets export.
 *     Delimiter is sniffed (tab wins when present), a header row is skipped
 *     when recognized, and minimally-quoted fields (`"a, b"`, doubled `""`)
 *     are unwrapped.
 *
 * Invalid rows are SKIPPED and counted, not fatal — a 500-row list with three
 * broken lines should import 497, then tell the user about the three.
 * Duplicate terms keep the FIRST occurrence (matching resolveGlossary's
 * first-wins semantics). Pure logic — unit-tested, no browser APIs.
 */

import type { GlossaryEntry, GlossarySet } from '@/data/models';

export interface GlossaryImport {
  name: string;
  pattern?: string;
  entries: GlossaryEntry[];
  /** Rows present in the file but dropped (missing source/target, duplicates). */
  skipped: number;
}

export type GlossaryImportError = 'empty' | 'unrecognized';

/** Sanity ceiling — a "terminology list" beyond this is almost certainly the wrong file. */
const MAX_IMPORT_ROWS = 5000;

/** Portable JSON for one set (id/enabled deliberately omitted — not portable). */
export function serializeGlossarySet(set: GlossarySet): string {
  return JSON.stringify(
    { name: set.name, ...(set.pattern ? { pattern: set.pattern } : {}), entries: set.entries },
    null,
    2
  );
}

/** A filesystem-safe download name for a set. */
export function glossaryExportFilename(set: GlossarySet): string {
  const safe = set.name.replace(/[\\/:*?"<>|\s]+/g, '-').replace(/^-+|-+$/g, '') || 'glossary';
  return `${safe}.json`;
}

/**
 * Parse an imported file into a new-set shape. Throws a `GlossaryImportError`
 * CODE (the UI maps codes to localized copy).
 */
export function parseGlossaryImport(text: string, fallbackName: string): GlossaryImport {
  const trimmed = text.trim();
  if (!trimmed) throw 'empty' satisfies GlossaryImportError;

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    let raw: unknown;
    try {
      raw = JSON.parse(trimmed);
    } catch {
      throw 'unrecognized' satisfies GlossaryImportError;
    }
    return fromJson(raw, fallbackName);
  }
  return fromDelimited(trimmed, fallbackName);
}

function fromJson(raw: unknown, fallbackName: string): GlossaryImport {
  const asSet = raw as { name?: unknown; pattern?: unknown; entries?: unknown };
  const list = Array.isArray(raw) ? raw : Array.isArray(asSet.entries) ? asSet.entries : null;
  if (!list) throw 'unrecognized' satisfies GlossaryImportError;

  const { entries, skipped } = collect(
    list.map((row) => {
      const e = row as { source?: unknown; target?: unknown; note?: unknown };
      return {
        source: typeof e?.source === 'string' ? e.source : '',
        target: typeof e?.target === 'string' ? e.target : '',
        note: typeof e?.note === 'string' ? e.note : undefined,
      };
    })
  );
  if (entries.length === 0) throw 'empty' satisfies GlossaryImportError;
  return {
    name: (typeof asSet.name === 'string' && asSet.name.trim()) || fallbackName,
    ...(typeof asSet.pattern === 'string' && asSet.pattern.trim() ? { pattern: asSet.pattern.trim() } : {}),
    entries,
    skipped,
  };
}

function fromDelimited(text: string, fallbackName: string): GlossaryImport {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  const delimiter = lines[0]?.includes('\t') ? '\t' : ',';

  const rows = lines.map((line) => {
    const cells = splitDelimited(line, delimiter).map(unquote);
    return { source: cells[0] ?? '', target: cells[1] ?? '', note: cells[2]?.trim() || undefined };
  });
  // Recognized header row (spreadsheet exports) — not a term, drop uncounted.
  if (rows.length && /^(source|term|术语|術語)$/i.test(rows[0].source.trim())) rows.shift();

  const { entries, skipped } = collect(rows);
  if (entries.length === 0) throw 'empty' satisfies GlossaryImportError;
  return { name: fallbackName, entries, skipped };
}

/** Validate, trim, dedupe (first wins), cap. */
function collect(rows: Array<{ source: string; target: string; note?: string }>): {
  entries: GlossaryEntry[];
  skipped: number;
} {
  const seen = new Set<string>();
  const entries: GlossaryEntry[] = [];
  let skipped = 0;
  for (const row of rows.slice(0, MAX_IMPORT_ROWS)) {
    const source = row.source.trim();
    const target = row.target.trim();
    const key = source.toLowerCase();
    if (!source || !target || seen.has(key)) {
      skipped++;
      continue;
    }
    seen.add(key);
    entries.push({ source, target, ...(row.note ? { note: row.note } : {}) });
  }
  skipped += Math.max(0, rows.length - MAX_IMPORT_ROWS);
  return { entries, skipped };
}

/** Split one line on `delimiter`, honoring minimal `"…"` quoting. */
function splitDelimited(line: string, delimiter: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
        cur += ch; // keep the quote; unquote() strips wrapping pairs
      }
    } else if (ch === delimiter && !inQuotes) {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function unquote(cell: string): string {
  const t = cell.trim();
  return t.startsWith('"') && t.endsWith('"') && t.length >= 2 ? t.slice(1, -1) : t;
}
