/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_UnderlineInputs */

const zh_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`下划线`)
};

const zh_tw2_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`底線`)
};

const en_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Underline`)
};

const ja_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`下線`)
};

const ko_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`밑줄`)
};

const fr_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Souligné`)
};

const de_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unterstrichen`)
};

const es_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subrayado`)
};

const ru_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Подчёркивание`)
};

const pt_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sublinhado`)
};

const it_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sottolineato`)
};

const ar_style_underline = /** @type {(inputs: Style_UnderlineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تسطير`)
};

/**
* | output |
* | --- |
* | "Underline" |
*
* @param {Style_UnderlineInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_underline = /** @type {((inputs?: Style_UnderlineInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_UnderlineInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_underline(inputs)
	if (locale === "zh-TW") return zh_tw2_style_underline(inputs)
	if (locale === "en") return en_style_underline(inputs)
	if (locale === "ja") return ja_style_underline(inputs)
	if (locale === "ko") return ko_style_underline(inputs)
	if (locale === "fr") return fr_style_underline(inputs)
	if (locale === "de") return de_style_underline(inputs)
	if (locale === "es") return es_style_underline(inputs)
	if (locale === "ru") return ru_style_underline(inputs)
	if (locale === "pt") return pt_style_underline(inputs)
	if (locale === "it") return it_style_underline(inputs)
	return ar_style_underline(inputs)
});