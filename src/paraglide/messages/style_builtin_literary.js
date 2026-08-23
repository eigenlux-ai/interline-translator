/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_LiteraryInputs */

const zh_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`文学润色`)
};

const zh_tw2_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`文學潤飾`)
};

const en_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Literary`)
};

const ja_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`文芸的`)
};

const ko_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`문학체`)
};

const fr_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Littéraire`)
};

const de_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Literarisch`)
};

const es_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Literario`)
};

const ru_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Литературный`)
};

const pt_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Literário`)
};

const it_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Letterario`)
};

const ar_style_builtin_literary = /** @type {(inputs: Style_Builtin_LiteraryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أدبي`)
};

/**
* | output |
* | --- |
* | "Literary" |
*
* @param {Style_Builtin_LiteraryInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_literary = /** @type {((inputs?: Style_Builtin_LiteraryInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_LiteraryInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_literary(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_literary(inputs)
	if (locale === "en") return en_style_builtin_literary(inputs)
	if (locale === "ja") return ja_style_builtin_literary(inputs)
	if (locale === "ko") return ko_style_builtin_literary(inputs)
	if (locale === "fr") return fr_style_builtin_literary(inputs)
	if (locale === "de") return de_style_builtin_literary(inputs)
	if (locale === "es") return es_style_builtin_literary(inputs)
	if (locale === "ru") return ru_style_builtin_literary(inputs)
	if (locale === "pt") return pt_style_builtin_literary(inputs)
	if (locale === "it") return it_style_builtin_literary(inputs)
	return ar_style_builtin_literary(inputs)
});