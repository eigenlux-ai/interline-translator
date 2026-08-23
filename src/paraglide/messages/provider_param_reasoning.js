/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_ReasoningInputs */

const zh_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`推理`)
};

const zh_tw2_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`推理`)
};

const en_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reasoning`)
};

const ja_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`推論`)
};

const ko_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`추론`)
};

const fr_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Raisonnement`)
};

const de_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reasoning`)
};

const es_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Razonamiento`)
};

const ru_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рассуждение`)
};

const pt_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Raciocínio`)
};

const it_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ragionamento`)
};

const ar_provider_param_reasoning = /** @type {(inputs: Provider_Param_ReasoningInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستدلال`)
};

/**
* | output |
* | --- |
* | "Reasoning" |
*
* @param {Provider_Param_ReasoningInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_param_reasoning = /** @type {((inputs?: Provider_Param_ReasoningInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Param_ReasoningInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_param_reasoning(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_param_reasoning(inputs)
	if (locale === "en") return en_provider_param_reasoning(inputs)
	if (locale === "ja") return ja_provider_param_reasoning(inputs)
	if (locale === "ko") return ko_provider_param_reasoning(inputs)
	if (locale === "fr") return fr_provider_param_reasoning(inputs)
	if (locale === "de") return de_provider_param_reasoning(inputs)
	if (locale === "es") return es_provider_param_reasoning(inputs)
	if (locale === "ru") return ru_provider_param_reasoning(inputs)
	if (locale === "pt") return pt_provider_param_reasoning(inputs)
	if (locale === "it") return it_provider_param_reasoning(inputs)
	return ar_provider_param_reasoning(inputs)
});