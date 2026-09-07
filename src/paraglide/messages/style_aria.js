/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ label: NonNullable<unknown> }} Style_AriaInputs */

const zh_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`译文样式：${i?.label}`)
};

const zh_tw2_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`譯文樣式：${i?.label}`)
};

const en_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Translation appearance: ${i?.label}`)
};

const ja_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`訳文の表示形式：${i?.label}`)
};

const ko_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`번역문 표시 방식: ${i?.label}`)
};

const fr_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Apparence de la traduction : ${i?.label}`)
};

const de_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Darstellung der Übersetzung: ${i?.label}`)
};

const es_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Apariencia de la traducción: ${i?.label}`)
};

const ru_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Оформление перевода: ${i?.label}`)
};

const pt_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Aparência da tradução: ${i?.label}`)
};

const it_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Aspetto della traduzione: ${i?.label}`)
};

const ar_style_aria = /** @type {(inputs: Style_AriaInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مظهر الترجمة: ${i?.label}`)
};

/**
* | output |
* | --- |
* | "Translation appearance: {label}" |
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