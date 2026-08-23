/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_SwapInputs */

const zh_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`交换语言`)
};

const zh_tw2_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`交換語言`)
};

const en_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Swap languages`)
};

const ja_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`言語を入れ替える`)
};

const ko_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`언어 바꾸기`)
};

const fr_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inverser les langues`)
};

const de_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sprachen tauschen`)
};

const es_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Intercambiar idiomas`)
};

const ru_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Поменять языки местами`)
};

const pt_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trocar os idiomas`)
};

const it_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scambia le lingue`)
};

const ar_panel_swap = /** @type {(inputs: Panel_SwapInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تبديل اللغتين`)
};

/**
* | output |
* | --- |
* | "Swap languages" |
*
* @param {Panel_SwapInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const panel_swap = /** @type {((inputs?: Panel_SwapInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_SwapInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_panel_swap(inputs)
	if (locale === "zh-TW") return zh_tw2_panel_swap(inputs)
	if (locale === "en") return en_panel_swap(inputs)
	if (locale === "ja") return ja_panel_swap(inputs)
	if (locale === "ko") return ko_panel_swap(inputs)
	if (locale === "fr") return fr_panel_swap(inputs)
	if (locale === "de") return de_panel_swap(inputs)
	if (locale === "es") return es_panel_swap(inputs)
	if (locale === "ru") return ru_panel_swap(inputs)
	if (locale === "pt") return pt_panel_swap(inputs)
	if (locale === "it") return it_panel_swap(inputs)
	return ar_panel_swap(inputs)
});