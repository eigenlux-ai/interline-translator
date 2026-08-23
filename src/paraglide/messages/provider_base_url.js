/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Base_UrlInputs */

const zh_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL(可选)`)
};

const zh_tw2_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL(選填)`)
};

const en_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL (optional)`)
};

const ja_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL(任意)`)
};

const ko_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL(선택)`)
};

const fr_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL (facultatif)`)
};

const de_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL (optional)`)
};

const es_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL (opcional)`)
};

const ru_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL (необязательно)`)
};

const pt_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL (opcional)`)
};

const it_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL (facoltativo)`)
};

const ar_provider_base_url = /** @type {(inputs: Provider_Base_UrlInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Base URL (اختياري)`)
};

/**
* | output |
* | --- |
* | "Base URL (optional)" |
*
* @param {Provider_Base_UrlInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_base_url = /** @type {((inputs?: Provider_Base_UrlInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Base_UrlInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_base_url(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_base_url(inputs)
	if (locale === "en") return en_provider_base_url(inputs)
	if (locale === "ja") return ja_provider_base_url(inputs)
	if (locale === "ko") return ko_provider_base_url(inputs)
	if (locale === "fr") return fr_provider_base_url(inputs)
	if (locale === "de") return de_provider_base_url(inputs)
	if (locale === "es") return es_provider_base_url(inputs)
	if (locale === "ru") return ru_provider_base_url(inputs)
	if (locale === "pt") return pt_provider_base_url(inputs)
	if (locale === "it") return it_provider_base_url(inputs)
	return ar_provider_base_url(inputs)
});