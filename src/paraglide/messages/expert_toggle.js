/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expert_ToggleInputs */

const zh_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`专家模式`)
};

const zh_tw2_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`專家模式`)
};

const en_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expert mode`)
};

const ja_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`エキスパートモード`)
};

const ko_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`전문가 모드`)
};

const fr_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mode expert`)
};

const de_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expertenmodus`)
};

const es_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modo experto`)
};

const ru_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Режим эксперта`)
};

const pt_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modo especialista`)
};

const it_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modalità esperto`)
};

const ar_expert_toggle = /** @type {(inputs: Expert_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`وضع الخبير`)
};

/**
* | output |
* | --- |
* | "Expert mode" |
*
* @param {Expert_ToggleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_toggle = /** @type {((inputs?: Expert_ToggleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_ToggleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_toggle(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_toggle(inputs)
	if (locale === "en") return en_expert_toggle(inputs)
	if (locale === "ja") return ja_expert_toggle(inputs)
	if (locale === "ko") return ko_expert_toggle(inputs)
	if (locale === "fr") return fr_expert_toggle(inputs)
	if (locale === "de") return de_expert_toggle(inputs)
	if (locale === "es") return es_expert_toggle(inputs)
	if (locale === "ru") return ru_expert_toggle(inputs)
	if (locale === "pt") return pt_expert_toggle(inputs)
	if (locale === "it") return it_expert_toggle(inputs)
	return ar_expert_toggle(inputs)
});