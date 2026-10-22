/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_AboutInputs */

const zh_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`关于`)
};

const zh_tw2_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`關於`)
};

const en_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`About`)
};

const ja_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`この拡張機能について`)
};

const ko_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`정보`)
};

const fr_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À propos`)
};

const de_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Über`)
};

const es_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Acerca de`)
};

const ru_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`О расширении`)
};

const pt_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sobre`)
};

const it_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Informazioni`)
};

const ar_options_nav_about = /** @type {(inputs: Options_Nav_AboutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حول`)
};

/**
* | output |
* | --- |
* | "About" |
*
* @param {Options_Nav_AboutInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_about = /** @type {((inputs?: Options_Nav_AboutInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_AboutInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_about(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_about(inputs)
	if (locale === "en") return en_options_nav_about(inputs)
	if (locale === "ja") return ja_options_nav_about(inputs)
	if (locale === "ko") return ko_options_nav_about(inputs)
	if (locale === "fr") return fr_options_nav_about(inputs)
	if (locale === "de") return de_options_nav_about(inputs)
	if (locale === "es") return es_options_nav_about(inputs)
	if (locale === "ru") return ru_options_nav_about(inputs)
	if (locale === "pt") return pt_options_nav_about(inputs)
	if (locale === "it") return it_options_nav_about(inputs)
	return ar_options_nav_about(inputs)
});