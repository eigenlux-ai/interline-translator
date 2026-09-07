/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Swap_DisabledInputs */

const zh_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先选定源语言才能交换`)
};

const zh_tw2_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先選定來源語言才能交換`)
};

const en_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose a source language before swapping.`)
};

const ja_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`入れ替えるには元の言語を指定してください`)
};

const ko_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`바꾸려면 원본 언어를 지정하세요`)
};

const fr_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez une langue source précise pour inverser`)
};

const de_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zum Tauschen eine konkrete Ausgangssprache wählen`)
};

const es_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Elige un idioma de origen concreto para intercambiar`)
};

const ru_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Чтобы поменять, выберите конкретный исходный язык`)
};

const pt_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escolha um idioma de origem concreto para trocar`)
};

const it_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scegli una lingua di partenza precisa per scambiare`)
};

const ar_panel_swap_disabled = /** @type {(inputs: Panel_Swap_DisabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر لغة مصدر محددة لإجراء التبديل`)
};

/**
* | output |
* | --- |
* | "Choose a source language before swapping." |
*
* @param {Panel_Swap_DisabledInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const panel_swap_disabled = /** @type {((inputs?: Panel_Swap_DisabledInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Swap_DisabledInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_panel_swap_disabled(inputs)
	if (locale === "zh-TW") return zh_tw2_panel_swap_disabled(inputs)
	if (locale === "en") return en_panel_swap_disabled(inputs)
	if (locale === "ja") return ja_panel_swap_disabled(inputs)
	if (locale === "ko") return ko_panel_swap_disabled(inputs)
	if (locale === "fr") return fr_panel_swap_disabled(inputs)
	if (locale === "de") return de_panel_swap_disabled(inputs)
	if (locale === "es") return es_panel_swap_disabled(inputs)
	if (locale === "ru") return ru_panel_swap_disabled(inputs)
	if (locale === "pt") return pt_panel_swap_disabled(inputs)
	if (locale === "it") return it_panel_swap_disabled(inputs)
	return ar_panel_swap_disabled(inputs)
});