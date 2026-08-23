/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Interleave_DescInputs */

const zh_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`多段落内容逐段插入译文，原文与译文相邻对照`)
};

const zh_tw2_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`多段落內容逐段插入譯文，原文與譯文相鄰對照`)
};

const en_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Place each translated paragraph right after its source paragraph in multi-paragraph blocks`)
};

const ja_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`複数段落のブロックで、各段落の直後に訳文を挿入します`)
};

const ko_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`여러 문단 블록에서 각 원문 문단 바로 아래에 번역을 배치합니다`)
};

const fr_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insérer chaque paragraphe traduit juste après son paragraphe source dans les blocs multi-paragraphes`)
};

const de_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jeden übersetzten Absatz direkt nach seinem Ausgangsabsatz einfügen`)
};

const es_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Colocar cada párrafo traducido justo después de su párrafo original en bloques de varios párrafos`)
};

const ru_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вставлять перевод каждого абзаца сразу после исходного абзаца`)
};

const pt_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inserir cada parágrafo traduzido logo após o parágrafo original em blocos com vários parágrafos`)
};

const it_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inserire ogni paragrafo tradotto subito dopo il paragrafo originale nei blocchi multi-paragrafo`)
};

const ar_interleave_desc = /** @type {(inputs: Interleave_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إدراج ترجمة كل فقرة مباشرة بعد فقرتها الأصلية في الكتل متعددة الفقرات`)
};

/**
* | output |
* | --- |
* | "Place each translated paragraph right after its source paragraph in multi-paragraph blocks" |
*
* @param {Interleave_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const interleave_desc = /** @type {((inputs?: Interleave_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Interleave_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_interleave_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_interleave_desc(inputs)
	if (locale === "en") return en_interleave_desc(inputs)
	if (locale === "ja") return ja_interleave_desc(inputs)
	if (locale === "ko") return ko_interleave_desc(inputs)
	if (locale === "fr") return fr_interleave_desc(inputs)
	if (locale === "de") return de_interleave_desc(inputs)
	if (locale === "es") return es_interleave_desc(inputs)
	if (locale === "ru") return ru_interleave_desc(inputs)
	if (locale === "pt") return pt_interleave_desc(inputs)
	if (locale === "it") return it_interleave_desc(inputs)
	return ar_interleave_desc(inputs)
});