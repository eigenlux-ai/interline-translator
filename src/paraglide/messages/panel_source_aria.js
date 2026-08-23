/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Source_AriaInputs */

const zh_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原文`)
};

const zh_tw2_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原文`)
};

const en_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source text`)
};

const ja_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原文`)
};

const ko_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`원문`)
};

const fr_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Texte source`)
};

const de_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ausgangstext`)
};

const es_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Texto de origen`)
};

const ru_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Исходный текст`)
};

const pt_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Texto de origem`)
};

const it_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Testo di partenza`)
};

const ar_panel_source_aria = /** @type {(inputs: Panel_Source_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النص المصدر`)
};

/**
* | output |
* | --- |
* | "Source text" |
*
* @param {Panel_Source_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const panel_source_aria = /** @type {((inputs?: Panel_Source_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Source_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_panel_source_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_panel_source_aria(inputs)
	if (locale === "en") return en_panel_source_aria(inputs)
	if (locale === "ja") return ja_panel_source_aria(inputs)
	if (locale === "ko") return ko_panel_source_aria(inputs)
	if (locale === "fr") return fr_panel_source_aria(inputs)
	if (locale === "de") return de_panel_source_aria(inputs)
	if (locale === "es") return es_panel_source_aria(inputs)
	if (locale === "ru") return ru_panel_source_aria(inputs)
	if (locale === "pt") return pt_panel_source_aria(inputs)
	if (locale === "it") return it_panel_source_aria(inputs)
	return ar_panel_source_aria(inputs)
});