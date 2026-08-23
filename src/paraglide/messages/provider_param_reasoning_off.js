/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_Reasoning_OffInputs */

const zh_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`关闭`)
};

const zh_tw2_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`關閉`)
};

const en_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Off`)
};

const ja_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`オフ`)
};

const ko_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`끄기`)
};

const fr_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Désactivé`)
};

const de_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aus`)
};

const es_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desactivado`)
};

const ru_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выключено`)
};

const pt_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Desativado`)
};

const it_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Disattivo`)
};

const ar_provider_param_reasoning_off = /** @type {(inputs: Provider_Param_Reasoning_OffInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إيقاف`)
};

/**
* | output |
* | --- |
* | "Off" |
*
* @param {Provider_Param_Reasoning_OffInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_param_reasoning_off = /** @type {((inputs?: Provider_Param_Reasoning_OffInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Param_Reasoning_OffInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_param_reasoning_off(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_param_reasoning_off(inputs)
	if (locale === "en") return en_provider_param_reasoning_off(inputs)
	if (locale === "ja") return ja_provider_param_reasoning_off(inputs)
	if (locale === "ko") return ko_provider_param_reasoning_off(inputs)
	if (locale === "fr") return fr_provider_param_reasoning_off(inputs)
	if (locale === "de") return de_provider_param_reasoning_off(inputs)
	if (locale === "es") return es_provider_param_reasoning_off(inputs)
	if (locale === "ru") return ru_provider_param_reasoning_off(inputs)
	if (locale === "pt") return pt_provider_param_reasoning_off(inputs)
	if (locale === "it") return it_provider_param_reasoning_off(inputs)
	return ar_provider_param_reasoning_off(inputs)
});