/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Sample_Gloss_CompactInputs */

const zh_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译文`)
};

const zh_tw2_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯文`)
};

const en_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation`)
};

const ja_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文`)
};

const ko_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역`)
};

const fr_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction`)
};

const de_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung`)
};

const es_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción`)
};

const ru_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод`)
};

const pt_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução`)
};

const it_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione`)
};

const ar_style_sample_gloss_compact = /** @type {(inputs: Style_Sample_Gloss_CompactInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمة`)
};

/**
* | output |
* | --- |
* | "Translation" |
*
* @param {Style_Sample_Gloss_CompactInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_sample_gloss_compact = /** @type {((inputs?: Style_Sample_Gloss_CompactInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Sample_Gloss_CompactInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_sample_gloss_compact(inputs)
	if (locale === "zh-TW") return zh_tw2_style_sample_gloss_compact(inputs)
	if (locale === "en") return en_style_sample_gloss_compact(inputs)
	if (locale === "ja") return ja_style_sample_gloss_compact(inputs)
	if (locale === "ko") return ko_style_sample_gloss_compact(inputs)
	if (locale === "fr") return fr_style_sample_gloss_compact(inputs)
	if (locale === "de") return de_style_sample_gloss_compact(inputs)
	if (locale === "es") return es_style_sample_gloss_compact(inputs)
	if (locale === "ru") return ru_style_sample_gloss_compact(inputs)
	if (locale === "pt") return pt_style_sample_gloss_compact(inputs)
	if (locale === "it") return it_style_sample_gloss_compact(inputs)
	return ar_style_sample_gloss_compact(inputs)
});