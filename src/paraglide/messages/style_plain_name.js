/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Plain_NameInputs */

const zh_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`忠实原文`)
};

const zh_tw2_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`忠於原文`)
};

const en_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faithful`)
};

const ja_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原文に忠実`)
};

const ko_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`충실 번역`)
};

const fr_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fidèle`)
};

const de_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Originalgetreu`)
};

const es_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fiel`)
};

const ru_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Точный`)
};

const pt_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fiel`)
};

const it_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fedele`)
};

const ar_style_plain_name = /** @type {(inputs: Style_Plain_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أمين`)
};

/**
* | output |
* | --- |
* | "Faithful" |
*
* @param {Style_Plain_NameInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_plain_name = /** @type {((inputs?: Style_Plain_NameInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Plain_NameInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_plain_name(inputs)
	if (locale === "zh-TW") return zh_tw2_style_plain_name(inputs)
	if (locale === "en") return en_style_plain_name(inputs)
	if (locale === "ja") return ja_style_plain_name(inputs)
	if (locale === "ko") return ko_style_plain_name(inputs)
	if (locale === "fr") return fr_style_plain_name(inputs)
	if (locale === "de") return de_style_plain_name(inputs)
	if (locale === "es") return es_style_plain_name(inputs)
	if (locale === "ru") return ru_style_plain_name(inputs)
	if (locale === "pt") return pt_style_plain_name(inputs)
	if (locale === "it") return it_style_plain_name(inputs)
	return ar_style_plain_name(inputs)
});