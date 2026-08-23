import { describe, expect, it } from 'vitest';
import type { GlossarySet } from '@/data/models';
import { glossaryExportFilename, parseGlossaryImport, serializeGlossarySet } from './glossary-io';

describe('serialize → parse round-trip', () => {
  const set: GlossarySet = {
    id: 'x',
    name: 'AI 术语集',
    enabled: false,
    pattern: '*.k8s.io',
    entries: [
      { source: 'Pod', target: '容器组', note: 'k8s' },
      { source: 'thread', target: '线程' },
    ],
  };

  it('round-trips name/pattern/entries; id and enabled are NOT portable', () => {
    const text = serializeGlossarySet(set);
    expect(text).not.toContain('"id"');
    expect(text).not.toContain('"enabled"');
    const back = parseGlossaryImport(text, 'fallback');
    expect(back.name).toBe('AI 术语集');
    expect(back.pattern).toBe('*.k8s.io');
    expect(back.entries).toEqual(set.entries);
    expect(back.skipped).toBe(0);
  });

  it('export filename is filesystem-safe', () => {
    expect(glossaryExportFilename(set)).toBe('AI-术语集.json');
    expect(glossaryExportFilename({ ...set, name: 'a/b:c *?' })).toBe('a-b-c.json');
    expect(glossaryExportFilename({ ...set, name: '  ' })).toBe('glossary.json');
  });
});

describe('parseGlossaryImport — JSON shapes', () => {
  it('accepts a bare entries array', () => {
    const out = parseGlossaryImport('[{"source":"Pod","target":"容器组"}]', 'my-file');
    expect(out.name).toBe('my-file'); // no name in file → fallback (file name)
    expect(out.entries).toEqual([{ source: 'Pod', target: '容器组' }]);
  });

  it('skips invalid rows and dedupes by term (first wins), counting both', () => {
    const out = parseGlossaryImport(
      JSON.stringify([
        { source: 'Pod', target: '容器组' },
        { source: 'pod', target: '豆荚' }, // dup (case-insensitive)
        { source: '', target: 'x' }, // missing source
        { source: 'y' }, // missing target
      ]),
      'f'
    );
    expect(out.entries).toEqual([{ source: 'Pod', target: '容器组' }]);
    expect(out.skipped).toBe(3);
  });

  it('rejects unrecognized JSON and empty payloads with error CODES', () => {
    expect(() => parseGlossaryImport('{"foo":1}', 'f')).toThrow('unrecognized');
    expect(() => parseGlossaryImport('{broken json', 'f')).toThrow('unrecognized');
    expect(() => parseGlossaryImport('   ', 'f')).toThrow('empty');
    expect(() => parseGlossaryImport('[]', 'f')).toThrow('empty');
  });
});

describe('parseGlossaryImport — CSV/TSV', () => {
  it('parses comma rows with optional note', () => {
    const out = parseGlossaryImport('Pod,容器组,k8s 语境\nthread,线程', 'terms');
    expect(out.entries).toEqual([
      { source: 'Pod', target: '容器组', note: 'k8s 语境' },
      { source: 'thread', target: '线程' },
    ]);
  });

  it('sniffs TAB delimiter and skips a recognized header row', () => {
    const out = parseGlossaryImport('source\ttarget\tnote\nPod\t容器组\t\nSvc\t服务\t', 'terms');
    expect(out.entries).toEqual([
      { source: 'Pod', target: '容器组' },
      { source: 'Svc', target: '服务' },
    ]);
    expect(out.skipped).toBe(0); // header is dropped uncounted
  });

  it('skips a 术语 header too', () => {
    const out = parseGlossaryImport('术语,固定译法\nPod,容器组', 'terms');
    expect(out.entries).toEqual([{ source: 'Pod', target: '容器组' }]);
  });

  it('handles quoted fields containing the delimiter and doubled quotes', () => {
    const out = parseGlossaryImport('"large, language model",大语言模型,"so called ""LLM"""', 'terms');
    expect(out.entries).toEqual([{ source: 'large, language model', target: '大语言模型', note: 'so called "LLM"' }]);
  });

  it('a delimited file with only broken rows is empty, not a set of garbage', () => {
    expect(() => parseGlossaryImport('onlyonecolumn\nanother', 'f')).toThrow('empty');
  });
});
