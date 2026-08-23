/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_GeneralInputs */

const zh_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`通用`)
};

const zh_tw2_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`一般`)
};

const en_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`General`)
};

const ja_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`一般`)
};

const ko_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`일반`)
};

const fr_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Général`)
};

const de_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Allgemein`)
};

const es_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`General`)
};

const ru_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Общие`)
};

const pt_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geral`)
};

const it_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Generale`)
};

const ar_options_nav_general = /** @type {(inputs: Options_Nav_GeneralInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عام`)
};

/**
* | output |
* | --- |
* | "General" |
*
* @param {Options_Nav_GeneralInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_general = /** @type {((inputs?: Options_Nav_GeneralInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_GeneralInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_general(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_general(inputs)
	if (locale === "en") return en_options_nav_general(inputs)
	if (locale === "ja") return ja_options_nav_general(inputs)
	if (locale === "ko") return ko_options_nav_general(inputs)
	if (locale === "fr") return fr_options_nav_general(inputs)
	if (locale === "de") return de_options_nav_general(inputs)
	if (locale === "es") return es_options_nav_general(inputs)
	if (locale === "ru") return ru_options_nav_general(inputs)
	if (locale === "pt") return pt_options_nav_general(inputs)
	if (locale === "it") return it_options_nav_general(inputs)
	return ar_options_nav_general(inputs)
});