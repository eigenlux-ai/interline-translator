/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_DottedInputs */

const zh_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`点线`)
};

const zh_tw2_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`點線`)
};

const en_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dotted`)
};

const ja_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`点線`)
};

const ko_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`점선`)
};

const fr_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pointillés`)
};

const de_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gepunktet`)
};

const es_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Punteado`)
};

const ru_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пунктир`)
};

const pt_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pontilhado`)
};

const it_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Punteggiato`)
};

const ar_style_dotted = /** @type {(inputs: Style_DottedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`منقّط`)
};

/**
* | output |
* | --- |
* | "Dotted" |
*
* @param {Style_DottedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_dotted = /** @type {((inputs?: Style_DottedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_DottedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_dotted(inputs)
	if (locale === "zh-TW") return zh_tw2_style_dotted(inputs)
	if (locale === "en") return en_style_dotted(inputs)
	if (locale === "ja") return ja_style_dotted(inputs)
	if (locale === "ko") return ko_style_dotted(inputs)
	if (locale === "fr") return fr_style_dotted(inputs)
	if (locale === "de") return de_style_dotted(inputs)
	if (locale === "es") return es_style_dotted(inputs)
	if (locale === "ru") return ru_style_dotted(inputs)
	if (locale === "pt") return pt_style_dotted(inputs)
	if (locale === "it") return it_style_dotted(inputs)
	return ar_style_dotted(inputs)
});