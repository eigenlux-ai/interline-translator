/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Style_AriaInputs */

const zh_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`译文样式:${i?.label}`)
};

const zh_tw2_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`譯文樣式:${i?.label}`)
};

const en_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Translation style: ${i?.label}`)
};

const ja_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`翻訳スタイル:${i?.label}`)
};

const ko_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`번역 스타일: ${i?.label}`)
};

const fr_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Style de traduction : ${i?.label}`)
};

const de_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Übersetzungsstil: ${i?.label}`)
};

const es_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Estilo de traducción: ${i?.label}`)
};

const ru_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Стиль перевода: ${i?.label}`)
};

const pt_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Estilo da tradução: ${i?.label}`)
};

const it_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Stile della traduzione: ${i?.label}`)
};

const ar_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`نمط الترجمة: ${i?.label}`)
};

/**
* | output |
* | --- |
* | "Translation style: {label}" |
*
* @param {Style_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_aria = /** @type {((inputs: Style_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_style_aria(inputs)
	if (locale === "en") return en_style_aria(inputs)
	if (locale === "ja") return ja_style_aria(inputs)
	if (locale === "ko") return ko_style_aria(inputs)
	if (locale === "fr") return fr_style_aria(inputs)
	if (locale === "de") return de_style_aria(inputs)
	if (locale === "es") return es_style_aria(inputs)
	if (locale === "ru") return ru_style_aria(inputs)
	if (locale === "pt") return pt_style_aria(inputs)
	if (locale === "it") return it_style_aria(inputs)
	return ar_style_aria(inputs)
});