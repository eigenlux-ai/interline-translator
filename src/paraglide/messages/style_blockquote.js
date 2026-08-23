/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_BlockquoteInputs */

const zh_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`引用条`)
};

const zh_tw2_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`引用條`)
};

const en_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote bar`)
};

const ja_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`引用バー`)
};

const ko_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`인용 바`)
};

const fr_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Barre de citation`)
};

const de_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zitatbalken`)
};

const es_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Barra de cita`)
};

const ru_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Полоса цитаты`)
};

const pt_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Barra de citação`)
};

const it_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Barra di citazione`)
};

const ar_style_blockquote = /** @type {(inputs: Style_BlockquoteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`شريط اقتباس`)
};

/**
* | output |
* | --- |
* | "Quote bar" |
*
* @param {Style_BlockquoteInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_blockquote = /** @type {((inputs?: Style_BlockquoteInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_BlockquoteInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_blockquote(inputs)
	if (locale === "zh-TW") return zh_tw2_style_blockquote(inputs)
	if (locale === "en") return en_style_blockquote(inputs)
	if (locale === "ja") return ja_style_blockquote(inputs)
	if (locale === "ko") return ko_style_blockquote(inputs)
	if (locale === "fr") return fr_style_blockquote(inputs)
	if (locale === "de") return de_style_blockquote(inputs)
	if (locale === "es") return es_style_blockquote(inputs)
	if (locale === "ru") return ru_style_blockquote(inputs)
	if (locale === "pt") return pt_style_blockquote(inputs)
	if (locale === "it") return it_style_blockquote(inputs)
	return ar_style_blockquote(inputs)
});