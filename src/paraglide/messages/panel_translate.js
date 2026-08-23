/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_TranslateInputs */

const zh_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译`)
};

const zh_tw2_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯`)
};

const en_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translate`)
};

const ja_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳`)
};

const ko_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역`)
};

const fr_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduire`)
};

const de_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzen`)
};

const es_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducir`)
};

const ru_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевести`)
};

const pt_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzir`)
};

const it_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduci`)
};

const ar_panel_translate = /** @type {(inputs: Panel_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة`)
};

/**
* | output |
* | --- |
* | "Translate" |
*
* @param {Panel_TranslateInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const panel_translate = /** @type {((inputs?: Panel_TranslateInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_TranslateInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_panel_translate(inputs)
	if (locale === "zh-TW") return zh_tw2_panel_translate(inputs)
	if (locale === "en") return en_panel_translate(inputs)
	if (locale === "ja") return ja_panel_translate(inputs)
	if (locale === "ko") return ko_panel_translate(inputs)
	if (locale === "fr") return fr_panel_translate(inputs)
	if (locale === "de") return de_panel_translate(inputs)
	if (locale === "es") return es_panel_translate(inputs)
	if (locale === "ru") return ru_panel_translate(inputs)
	if (locale === "pt") return pt_panel_translate(inputs)
	if (locale === "it") return it_panel_translate(inputs)
	return ar_panel_translate(inputs)
});