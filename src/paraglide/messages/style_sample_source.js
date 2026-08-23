/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Sample_SourceInputs */

const zh_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const zh_tw2_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const en_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原文示例`)
};

const ja_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const ko_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const fr_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const de_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const es_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const ru_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const pt_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const it_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const ar_style_sample_source = /** @type {(inputs: Style_Sample_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

/**
* | output |
* | --- |
* | "原文示例" |
*
* @param {Style_Sample_SourceInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_sample_source = /** @type {((inputs?: Style_Sample_SourceInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Sample_SourceInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_sample_source(inputs)
	if (locale === "zh-TW") return zh_tw2_style_sample_source(inputs)
	if (locale === "en") return en_style_sample_source(inputs)
	if (locale === "ja") return ja_style_sample_source(inputs)
	if (locale === "ko") return ko_style_sample_source(inputs)
	if (locale === "fr") return fr_style_sample_source(inputs)
	if (locale === "de") return de_style_sample_source(inputs)
	if (locale === "es") return es_style_sample_source(inputs)
	if (locale === "ru") return ru_style_sample_source(inputs)
	if (locale === "pt") return pt_style_sample_source(inputs)
	if (locale === "it") return it_style_sample_source(inputs)
	return ar_style_sample_source(inputs)
});