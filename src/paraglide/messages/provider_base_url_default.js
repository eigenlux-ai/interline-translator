/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Base_Url_DefaultInputs */

const zh_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`服务商默认`)
};

const zh_tw2_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`服務商預設`)
};

const en_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provider default`)
};

const ja_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`プロバイダーの既定`)
};

const ko_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`제공자 기본값`)
};

const fr_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valeur du fournisseur`)
};

const de_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anbieter-Standard`)
};

const es_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valor del proveedor`)
};

const ru_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По умолчанию у провайдера`)
};

const pt_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Predefinição do fornecedor`)
};

const it_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valore del provider`)
};

const ar_provider_base_url_default = /** @type {(inputs: Provider_Base_Url_DefaultInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`افتراضي المزوّد`)
};

/**
* | output |
* | --- |
* | "Provider default" |
*
* @param {Provider_Base_Url_DefaultInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_base_url_default = /** @type {((inputs?: Provider_Base_Url_DefaultInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Base_Url_DefaultInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_base_url_default(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_base_url_default(inputs)
	if (locale === "en") return en_provider_base_url_default(inputs)
	if (locale === "ja") return ja_provider_base_url_default(inputs)
	if (locale === "ko") return ko_provider_base_url_default(inputs)
	if (locale === "fr") return fr_provider_base_url_default(inputs)
	if (locale === "de") return de_provider_base_url_default(inputs)
	if (locale === "es") return es_provider_base_url_default(inputs)
	if (locale === "ru") return ru_provider_base_url_default(inputs)
	if (locale === "pt") return pt_provider_base_url_default(inputs)
	if (locale === "it") return it_provider_base_url_default(inputs)
	return ar_provider_base_url_default(inputs)
});