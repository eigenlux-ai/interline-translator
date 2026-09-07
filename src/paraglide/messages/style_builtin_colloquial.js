/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Builtin_ColloquialInputs */

const zh_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`口语自然`)
};

const zh_tw2_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`口語自然`)
};

const en_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Colloquial`)
};

const ja_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`話し言葉`)
};

const ko_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`구어체`)
};

const fr_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Familier`)
};

const de_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Umgangssprachlich`)
};

const es_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coloquial`)
};

const ru_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разговорный`)
};

const pt_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coloquial`)
};

const it_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Colloquiale`)
};

const ar_style_builtin_colloquial = /** @type {(inputs: Style_Builtin_ColloquialInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محادثة`)
};

/**
* | output |
* | --- |
* | "Colloquial" |
*
* @param {Style_Builtin_ColloquialInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_builtin_colloquial = /** @type {((inputs?: Style_Builtin_ColloquialInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Builtin_ColloquialInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_builtin_colloquial(inputs)
	if (locale === "zh-TW") return zh_tw2_style_builtin_colloquial(inputs)
	if (locale === "en") return en_style_builtin_colloquial(inputs)
	if (locale === "ja") return ja_style_builtin_colloquial(inputs)
	if (locale === "ko") return ko_style_builtin_colloquial(inputs)
	if (locale === "fr") return fr_style_builtin_colloquial(inputs)
	if (locale === "de") return de_style_builtin_colloquial(inputs)
	if (locale === "es") return es_style_builtin_colloquial(inputs)
	if (locale === "ru") return ru_style_builtin_colloquial(inputs)
	if (locale === "pt") return pt_style_builtin_colloquial(inputs)
	if (locale === "it") return it_style_builtin_colloquial(inputs)
	return ar_style_builtin_colloquial(inputs)
});