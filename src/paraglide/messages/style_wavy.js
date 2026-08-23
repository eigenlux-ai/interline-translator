/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_WavyInputs */

const zh_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`波浪`)
};

const zh_tw2_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`波浪`)
};

const en_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wavy`)
};

const ja_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`波線`)
};

const ko_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`물결선`)
};

const fr_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ondulé`)
};

const de_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wellenlinie`)
};

const es_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ondulado`)
};

const ru_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Волна`)
};

const pt_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ondulado`)
};

const it_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ondulato`)
};

const ar_style_wavy = /** @type {(inputs: Style_WavyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متموّج`)
};

/**
* | output |
* | --- |
* | "Wavy" |
*
* @param {Style_WavyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_wavy = /** @type {((inputs?: Style_WavyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_WavyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_wavy(inputs)
	if (locale === "zh-TW") return zh_tw2_style_wavy(inputs)
	if (locale === "en") return en_style_wavy(inputs)
	if (locale === "ja") return ja_style_wavy(inputs)
	if (locale === "ko") return ko_style_wavy(inputs)
	if (locale === "fr") return fr_style_wavy(inputs)
	if (locale === "de") return de_style_wavy(inputs)
	if (locale === "es") return es_style_wavy(inputs)
	if (locale === "ru") return ru_style_wavy(inputs)
	if (locale === "pt") return pt_style_wavy(inputs)
	if (locale === "it") return it_style_wavy(inputs)
	return ar_style_wavy(inputs)
});