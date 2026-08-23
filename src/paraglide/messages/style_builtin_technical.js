/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_TechnicalInputs */

const zh_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`技术文档`)
};

const zh_tw2_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`技術文件`)
};

const en_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Technical docs`)
};

const ja_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`技術文書`)
};

const ko_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기술 문서`)
};

const fr_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Docs techniques`)
};

const de_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Technische Doku`)
};

const es_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Docs técnicos`)
};

const ru_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Техдокументация`)
};

const pt_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Docs técnicos`)
};

const it_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Doc tecnica`)
};

const ar_style_builtin_technical = /** @type {(inputs: Style_Builtin_TechnicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وثائق تقنية`)
};

/**
* | output |
* | --- |
* | "Technical docs" |
*
* @param {Style_Builtin_TechnicalInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_technical = /** @type {((inputs?: Style_Builtin_TechnicalInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_TechnicalInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_technical(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_technical(inputs)
	if (locale === "en") return en_style_builtin_technical(inputs)
	if (locale === "ja") return ja_style_builtin_technical(inputs)
	if (locale === "ko") return ko_style_builtin_technical(inputs)
	if (locale === "fr") return fr_style_builtin_technical(inputs)
	if (locale === "de") return de_style_builtin_technical(inputs)
	if (locale === "es") return es_style_builtin_technical(inputs)
	if (locale === "ru") return ru_style_builtin_technical(inputs)
	if (locale === "pt") return pt_style_builtin_technical(inputs)
	if (locale === "it") return it_style_builtin_technical(inputs)
	return ar_style_builtin_technical(inputs)
});