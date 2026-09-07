/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_UnsetInputs */

const zh_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`默认`)
};

const zh_tw2_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`預設`)
};

const en_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default`)
};

const ja_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定`)
};

const ko_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본값`)
};

const fr_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Par défaut`)
};

const de_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Standard`)
};

const es_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Predeterminado`)
};

const ru_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По умолчанию`)
};

const pt_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Padrão`)
};

const it_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Predefinito`)
};

const ar_provider_param_unset = /** @type {(inputs: Provider_Param_UnsetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الافتراضي`)
};

/**
* | output |
* | --- |
* | "Default" |
*
* @param {Provider_Param_UnsetInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_param_unset = /** @type {((inputs?: Provider_Param_UnsetInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Param_UnsetInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_param_unset(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_param_unset(inputs)
	if (locale === "en") return en_provider_param_unset(inputs)
	if (locale === "ja") return ja_provider_param_unset(inputs)
	if (locale === "ko") return ko_provider_param_unset(inputs)
	if (locale === "fr") return fr_provider_param_unset(inputs)
	if (locale === "de") return de_provider_param_unset(inputs)
	if (locale === "es") return es_provider_param_unset(inputs)
	if (locale === "ru") return ru_provider_param_unset(inputs)
	if (locale === "pt") return pt_provider_param_unset(inputs)
	if (locale === "it") return it_provider_param_unset(inputs)
	return ar_provider_param_unset(inputs)
});