/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_Academic_DescInputs */

const zh_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`采用正式文体与准确术语，保留原文的限定条件和不确定性。`)
};

const zh_tw2_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`採用正式文體與精確術語，保留原文的限定條件與不確定性。`)
};

const en_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Formal language and precise terminology, preserving the original qualifications and uncertainty.`)
};

const ja_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正式な文体と正確な用語を使い、原文の留保や不確実性を保ちます。`)
};

const ko_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`격식 있는 문체와 정확한 용어를 사용하고, 원문의 조건과 불확실성을 유지합니다.`)
};

const fr_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un registre formel et des termes précis, en respectant les réserves et les incertitudes du texte source.`)
};

const de_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Formelle Sprache und präzise Begriffe; Einschränkungen und Unsicherheiten des Originals bleiben erhalten.`)
};

const es_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lenguaje formal y términos precisos, respetando los matices de cautela y las limitaciones del original.`)
};

const ru_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Формальный стиль, точная терминология, осторожные формулировки сохраняются.`)
};

const pt_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Linguagem formal e termos precisos, preservando as ressalvas e incertezas do original.`)
};

const it_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Registro formale e termini precisi, nel rispetto delle riserve e delle incertezze dell’originale.`)
};

const ar_style_builtin_academic_desc = /** @type {(inputs: Style_Builtin_Academic_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة رسمية ومصطلحات دقيقة مع الحفاظ على التحفّظات ودرجات اليقين في الأصل.`)
};

/**
* | output |
* | --- |
* | "Formal language and precise terminology, preserving the original qualifications and uncertainty." |
*
* @param {Style_Builtin_Academic_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_academic_desc = /** @type {((inputs?: Style_Builtin_Academic_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_Academic_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_academic_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_academic_desc(inputs)
	if (locale === "en") return en_style_builtin_academic_desc(inputs)
	if (locale === "ja") return ja_style_builtin_academic_desc(inputs)
	if (locale === "ko") return ko_style_builtin_academic_desc(inputs)
	if (locale === "fr") return fr_style_builtin_academic_desc(inputs)
	if (locale === "de") return de_style_builtin_academic_desc(inputs)
	if (locale === "es") return es_style_builtin_academic_desc(inputs)
	if (locale === "ru") return ru_style_builtin_academic_desc(inputs)
	if (locale === "pt") return pt_style_builtin_academic_desc(inputs)
	if (locale === "it") return it_style_builtin_academic_desc(inputs)
	return ar_style_builtin_academic_desc(inputs)
});