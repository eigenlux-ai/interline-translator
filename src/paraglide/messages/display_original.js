/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Display_OriginalInputs */

const zh_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`仅原文`)
};

const zh_tw2_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`僅原文`)
};

const en_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Original only`)
};

const ja_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原文のみ`)
};

const ko_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`원문만`)
};

const fr_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Original seul`)
};

const de_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nur Original`)
};

const es_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solo original`)
};

const ru_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Только оригинал`)
};

const pt_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apenas original`)
};

const it_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solo originale`)
};

const ar_display_original = /** @type {(inputs: Display_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأصل فقط`)
};

/**
* | output |
* | --- |
* | "Original only" |
*
* @param {Display_OriginalInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const display_original = /** @type {((inputs?: Display_OriginalInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Display_OriginalInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_display_original(inputs)
	if (locale === "zh-TW") return zh_tw2_display_original(inputs)
	if (locale === "en") return en_display_original(inputs)
	if (locale === "ja") return ja_display_original(inputs)
	if (locale === "ko") return ko_display_original(inputs)
	if (locale === "fr") return fr_display_original(inputs)
	if (locale === "de") return de_display_original(inputs)
	if (locale === "es") return es_display_original(inputs)
	if (locale === "ru") return ru_display_original(inputs)
	if (locale === "pt") return pt_display_original(inputs)
	if (locale === "it") return it_display_original(inputs)
	return ar_display_original(inputs)
});