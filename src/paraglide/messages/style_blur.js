/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_BlurInputs */

const zh_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`模糊`)
};

const zh_tw2_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`模糊`)
};

const en_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Blur`)
};

const ja_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ぼかし`)
};

const ko_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`블러`)
};

const fr_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Flou`)
};

const de_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Unschärfe`)
};

const es_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desenfoque`)
};

const ru_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Размытие`)
};

const pt_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desfoque`)
};

const it_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sfocatura`)
};

const ar_style_blur = /** @type {(inputs: Style_BlurInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تمويه`)
};

/**
* | output |
* | --- |
* | "Blur" |
*
* @param {Style_BlurInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_blur = /** @type {((inputs?: Style_BlurInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_BlurInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_blur(inputs)
	if (locale === "zh-TW") return zh_tw2_style_blur(inputs)
	if (locale === "en") return en_style_blur(inputs)
	if (locale === "ja") return ja_style_blur(inputs)
	if (locale === "ko") return ko_style_blur(inputs)
	if (locale === "fr") return fr_style_blur(inputs)
	if (locale === "de") return de_style_blur(inputs)
	if (locale === "es") return es_style_blur(inputs)
	if (locale === "ru") return ru_style_blur(inputs)
	if (locale === "pt") return pt_style_blur(inputs)
	if (locale === "it") return it_style_blur(inputs)
	return ar_style_blur(inputs)
});