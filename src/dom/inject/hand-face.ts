/**
 * @module dom/inject/hand-face
 *
 * The 'kai' translationFont, generalised: every target language gets the face
 * that holds 楷体's place in ITS own typographic culture — a written, bookish
 * hand set against the page's (usually sans) UI type:
 *
 *   - zh (Hans)       楷体          LXGW WenKai / Kaiti SC / KaiTi
 *   - zh (Hant)       楷書          LXGW WenKai TC / Kaiti TC / BiauKai / DFKai-SB
 *   - ja              教科書体      Klee / YuKyokasho / UD Digi Kyokasho
 *   - ko              명조체        NanumMyeongjo / AppleMyungjo / Batang
 *   - Latin/Cyrillic/Greek  serif italic — the Western interlinear-gloss convention
 *   - ar              Naskh (the book hand)
 *   - anything else   no override (the page font)
 *
 * SYSTEM FONTS ONLY, nothing bundled: we name local families and never ship a
 * font file, so there is no licensing surface and no network fetch from the
 * host page. Many of these are optional OS assets (macOS downloadable fonts,
 * Windows supplemental-font features) and may be absent; every stack therefore
 * ends in the SOURCE's own computed font (SRC_FAMILY_VAR, stamped per gloss),
 * so a machine without the face degrades to exactly the 跟随页面 look instead
 * of a browser-default serif.
 *
 * Family names are kept ASCII (the bundle audit forbids non-ASCII); Chromium
 * matches a font's English family name on every platform.
 */

export type HandFace = 'kai' | 'kai-tc' | 'kyokasho' | 'myeongjo' | 'italic' | 'naskh';

export interface HandFaceSpec {
  /** Local family names, most preferred first — deliberately NO generic family:
   *  the fallback is the page's own font, appended where the stack is used. */
  stack: string;
  /** The face is an italic (the Western equivalent of a written hand). */
  italic?: boolean;
}

export const HAND_FACES: Record<HandFace, HandFaceSpec> = {
  kai: { stack: '"LXGW WenKai", "Kaiti SC", "STKaiti", "KaiTi", "AR PL UKai CN"' },
  'kai-tc': { stack: '"LXGW WenKai TC", "Kaiti TC", "BiauKaiTC", "BiauKaiHK", "DFKai-SB", "AR PL UKai TW"' },
  // `Yoko` is YuKyokasho's horizontal-setting cut; "UD Digi Kyokasho N" is the
  // merged family Windows 11 24H2 reportedly ships instead of N-R/N-B.
  kyokasho: { stack: '"Klee One", "Klee", "YuKyokasho Yoko", "UD Digi Kyokasho N-R", "UD Digi Kyokasho N"' },
  // Not 궁서체: macOS only ships GungSeo in its fixed-pitch cut (Gungseouche),
  // which spaces Hangul out like a typewriter. The bookish Myeongjo serif is
  // the reading face against the Gothic UI type — the same move as the serif
  // italic for Latin. AppleMyungjo is preinstalled on macOS.
  myeongjo: {
    stack: '"NanumMyeongjo", "Nanum Myeongjo", "AppleMyungjo", "Batang", "Noto Serif KR", "Noto Serif CJK KR"',
  },
  // Preinstalled on both macOS and Windows, italics covering Latin, Cyrillic
  // and Greek — so this face is the one that almost never needs its fallback.
  italic: { stack: '"Palatino", "Palatino Linotype", "Georgia"', italic: true },
  naskh: { stack: '"DecoType Naskh", "Traditional Arabic", "Noto Naskh Arabic", "Amiri"' },
};

/** Languages written in Latin, Cyrillic or Greek whose glyphs the italic stack
 *  covers well. Others are left alone rather than mixing fonts mid-word. */
const ITALIC_LANGS = new Set([
  // Latin
  'en', 'fr', 'de', 'es', 'pt', 'it', 'nl', 'ca', 'gl', 'eu', 'oc', 'ro', 'sv', 'da', 'no', 'nb', 'nn', 'is', 'fi',
  'et', 'lv', 'lt', 'pl', 'cs', 'sk', 'sl', 'hr', 'bs', 'hu', 'tr', 'az', 'id', 'ms', 'tl', 'fil', 'sw', 'af', 'ga',
  'cy', 'mt', 'sq', 'vi', 'la', 'eo',
  // Cyrillic
  'ru', 'uk', 'be', 'bg', 'mk', 'sr',
  // Greek
  'el',
]); // prettier-ignore

/** Regions whose Chinese defaults to Traditional (an explicit script wins). */
const HANT_REGIONS = new Set(['tw', 'hk', 'mo']);

/** The hand face for a BCP 47 target (or UI) language, or null for "no override". */
export function handFaceFor(lang: string | undefined | null): HandFace | null {
  if (!lang) return null;
  const [primary, ...rest] = lang.toLowerCase().split(/[-_]/);
  switch (primary) {
    case 'zh':
      // The script subtag decides when present (zh-Hans-HK is Simplified);
      // otherwise the region does (zh-TW, zh-HK, zh-MO).
      if (rest.includes('hant')) return 'kai-tc';
      if (rest.includes('hans')) return 'kai';
      return rest.some((s) => HANT_REGIONS.has(s)) ? 'kai-tc' : 'kai';
    case 'ja':
      return 'kyokasho';
    case 'ko':
      return 'myeongjo';
    case 'ar':
      return 'naskh';
    default:
      return ITALIC_LANGS.has(primary!) ? 'italic' : null;
  }
}

/**
 * Inline-style form for previews (settings swatches). They have no source font
 * to fall back to, so a generic `serif` stands in for it; no face → the
 * preview's own font.
 */
export function handFaceStyle(face: HandFace | null): { fontFamily: string; fontStyle?: 'italic' } {
  if (!face) return { fontFamily: 'inherit' };
  const spec = HAND_FACES[face];
  return { fontFamily: `${spec.stack}, serif`, ...(spec.italic ? { fontStyle: 'italic' as const } : {}) };
}
