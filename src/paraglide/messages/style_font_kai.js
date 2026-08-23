/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Font_KaiInputs */

const zh_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`楷体`)
};

const zh_tw2_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`楷體`)
};

const en_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kai script`)
};

const ja_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`楷書体`)
};

const ko_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`해서체`)
};

const fr_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Écriture kai`)
};

const de_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Kai-Schrift`)
};

const es_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escritura kai`)
};

const ru_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шрифт кай`)
};

const pt_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escrita kai`)
};

const it_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scrittura kai`)
};

const ar_style_font_kai = /** @type {(inputs: Style_Font_KaiInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خط كاي`)
};

/**
* | output |
* | --- |
* | "Kai script" |
*
* @param {Style_Font_KaiInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_font_kai = /** @type {((inputs?: Style_Font_KaiInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Font_KaiInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_font_kai(inputs)
	if (locale === "zh-TW") return zh_tw2_style_font_kai(inputs)
	if (locale === "en") return en_style_font_kai(inputs)
	if (locale === "ja") return ja_style_font_kai(inputs)
	if (locale === "ko") return ko_style_font_kai(inputs)
	if (locale === "fr") return fr_style_font_kai(inputs)
	if (locale === "de") return de_style_font_kai(inputs)
	if (locale === "es") return es_style_font_kai(inputs)
	if (locale === "ru") return ru_style_font_kai(inputs)
	if (locale === "pt") return pt_style_font_kai(inputs)
	if (locale === "it") return it_style_font_kai(inputs)
	return ar_style_font_kai(inputs)
});