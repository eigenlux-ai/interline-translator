/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sel_Translate_AriaInputs */

const zh_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译所选文本`)
};

const zh_tw2_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯所選文字`)
};

const en_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translate selection`)
};

const ja_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`選択した文章を翻訳`)
};

const ko_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`선택한 텍스트 번역`)
};

const fr_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduire la sélection`)
};

const de_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Auswahl übersetzen`)
};

const es_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducir la selección`)
};

const ru_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевести выделенное`)
};

const pt_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzir a seleção`)
};

const it_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduci la selezione`)
};

const ar_sel_translate_aria = /** @type {(inputs: Sel_Translate_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة النص المحدد`)
};

/**
* | output |
* | --- |
* | "Translate selection" |
*
* @param {Sel_Translate_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const sel_translate_aria = /** @type {((inputs?: Sel_Translate_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sel_Translate_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_sel_translate_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_sel_translate_aria(inputs)
	if (locale === "en") return en_sel_translate_aria(inputs)
	if (locale === "ja") return ja_sel_translate_aria(inputs)
	if (locale === "ko") return ko_sel_translate_aria(inputs)
	if (locale === "fr") return fr_sel_translate_aria(inputs)
	if (locale === "de") return de_sel_translate_aria(inputs)
	if (locale === "es") return es_sel_translate_aria(inputs)
	if (locale === "ru") return ru_sel_translate_aria(inputs)
	if (locale === "pt") return pt_sel_translate_aria(inputs)
	if (locale === "it") return it_sel_translate_aria(inputs)
	return ar_sel_translate_aria(inputs)
});