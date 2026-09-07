/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Style_Font_AriaInputs */

const zh_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`译文字体：${i?.label}`)
};

const zh_tw2_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`譯文字型：${i?.label}`)
};

const en_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Translation typeface: ${i?.label}`)
};

const ja_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`訳文の書体：${i?.label}`)
};

const ko_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`번역 글꼴: ${i?.label}`)
};

const fr_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Police de traduction : ${i?.label}`)
};

const de_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Übersetzungsschrift: ${i?.label}`)
};

const es_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tipografía de traducción: ${i?.label}`)
};

const ru_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Шрифт перевода: ${i?.label}`)
};

const pt_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fonte da tradução: ${i?.label}`)
};

const it_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Carattere della traduzione: ${i?.label}`)
};

const ar_style_font_aria = /** @type {(inputs: Style_Font_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`خط الترجمة: ${i?.label}`)
};

/**
* | output |
* | --- |
* | "Translation typeface: {label}" |
*
* @param {Style_Font_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_font_aria = /** @type {((inputs: Style_Font_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_Font_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_font_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_style_font_aria(inputs)
	if (locale === "en") return en_style_font_aria(inputs)
	if (locale === "ja") return ja_style_font_aria(inputs)
	if (locale === "ko") return ko_style_font_aria(inputs)
	if (locale === "fr") return fr_style_font_aria(inputs)
	if (locale === "de") return de_style_font_aria(inputs)
	if (locale === "es") return es_style_font_aria(inputs)
	if (locale === "ru") return ru_style_font_aria(inputs)
	if (locale === "pt") return pt_style_font_aria(inputs)
	if (locale === "it") return it_style_font_aria(inputs)
	return ar_style_font_aria(inputs)
});