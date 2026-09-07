/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_Font_InheritInputs */

const zh_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟随页面`)
};

const zh_tw2_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`沿用頁面字型`)
};

const en_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Page font`)
};

const ja_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ページに合わせる`)
};

const ko_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`페이지에 맞춤`)
};

const fr_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Police de la page`)
};

const de_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Schrift der Seite`)
};

const es_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fuente de la página`)
};

const ru_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Как на странице`)
};

const pt_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fonte da página`)
};

const it_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Carattere della pagina`)
};

const ar_style_font_inherit = /** @type {(inputs: Style_Font_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة الصفحة`)
};

/**
* | output |
* | --- |
* | "Page font" |
*
* @param {Style_Font_InheritInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_font_inherit = /** @type {((inputs?: Style_Font_InheritInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Font_InheritInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_font_inherit(inputs)
	if (locale === "zh-TW") return zh_tw2_style_font_inherit(inputs)
	if (locale === "en") return en_style_font_inherit(inputs)
	if (locale === "ja") return ja_style_font_inherit(inputs)
	if (locale === "ko") return ko_style_font_inherit(inputs)
	if (locale === "fr") return fr_style_font_inherit(inputs)
	if (locale === "de") return de_style_font_inherit(inputs)
	if (locale === "es") return es_style_font_inherit(inputs)
	if (locale === "ru") return ru_style_font_inherit(inputs)
	if (locale === "pt") return pt_style_font_inherit(inputs)
	if (locale === "it") return it_style_font_inherit(inputs)
	return ar_style_font_inherit(inputs)
});