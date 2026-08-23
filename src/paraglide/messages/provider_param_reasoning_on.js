/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_Reasoning_OnInputs */

const zh_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`开启`)
};

const zh_tw2_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`開啟`)
};

const en_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On`)
};

const ja_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`オン`)
};

const ko_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`켜기`)
};

const fr_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activé`)
};

const de_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ein`)
};

const es_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activado`)
};

const ru_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включено`)
};

const pt_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ativado`)
};

const it_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attivo`)
};

const ar_provider_param_reasoning_on = /** @type {(inputs: Provider_Param_Reasoning_OnInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تشغيل`)
};

/**
* | output |
* | --- |
* | "On" |
*
* @param {Provider_Param_Reasoning_OnInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_param_reasoning_on = /** @type {((inputs?: Provider_Param_Reasoning_OnInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Param_Reasoning_OnInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_param_reasoning_on(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_param_reasoning_on(inputs)
	if (locale === "en") return en_provider_param_reasoning_on(inputs)
	if (locale === "ja") return ja_provider_param_reasoning_on(inputs)
	if (locale === "ko") return ko_provider_param_reasoning_on(inputs)
	if (locale === "fr") return fr_provider_param_reasoning_on(inputs)
	if (locale === "de") return de_provider_param_reasoning_on(inputs)
	if (locale === "es") return es_provider_param_reasoning_on(inputs)
	if (locale === "ru") return ru_provider_param_reasoning_on(inputs)
	if (locale === "pt") return pt_provider_param_reasoning_on(inputs)
	if (locale === "it") return it_provider_param_reasoning_on(inputs)
	return ar_provider_param_reasoning_on(inputs)
});