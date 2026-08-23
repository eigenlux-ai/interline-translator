/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_HighlightInputs */

const zh_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`高亮`)
};

const zh_tw2_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`標明`)
};

const en_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Highlight`)
};

const ja_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ハイライト`)
};

const ko_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`형광펜`)
};

const fr_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Surligné`)
};

const de_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Markiert`)
};

const es_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Resaltado`)
};

const ru_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выделение`)
};

const pt_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Destaque`)
};

const it_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Evidenziato`)
};

const ar_style_highlight = /** @type {(inputs: Style_HighlightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تظليل`)
};

/**
* | output |
* | --- |
* | "Highlight" |
*
* @param {Style_HighlightInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_highlight = /** @type {((inputs?: Style_HighlightInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_HighlightInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_highlight(inputs)
	if (locale === "zh-TW") return zh_tw2_style_highlight(inputs)
	if (locale === "en") return en_style_highlight(inputs)
	if (locale === "ja") return ja_style_highlight(inputs)
	if (locale === "ko") return ko_style_highlight(inputs)
	if (locale === "fr") return fr_style_highlight(inputs)
	if (locale === "de") return de_style_highlight(inputs)
	if (locale === "es") return es_style_highlight(inputs)
	if (locale === "ru") return ru_style_highlight(inputs)
	if (locale === "pt") return pt_style_highlight(inputs)
	if (locale === "it") return it_style_highlight(inputs)
	return ar_style_highlight(inputs)
});