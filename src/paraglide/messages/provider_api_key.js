/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Api_KeyInputs */

const zh_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API 密钥`)
};

const zh_tw2_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API 金鑰`)
};

const en_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API key`)
};

const ja_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API キー`)
};

const ko_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API 키`)
};

const fr_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clé API`)
};

const de_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API-Schlüssel`)
};

const es_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clave API`)
};

const ru_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API-ключ`)
};

const pt_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chave de API`)
};

const it_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chiave API`)
};

const ar_provider_api_key = /** @type {(inputs: Provider_Api_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مفتاح API`)
};

/**
* | output |
* | --- |
* | "API key" |
*
* @param {Provider_Api_KeyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_api_key = /** @type {((inputs?: Provider_Api_KeyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Api_KeyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_api_key(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_api_key(inputs)
	if (locale === "en") return en_provider_api_key(inputs)
	if (locale === "ja") return ja_provider_api_key(inputs)
	if (locale === "ko") return ko_provider_api_key(inputs)
	if (locale === "fr") return fr_provider_api_key(inputs)
	if (locale === "de") return de_provider_api_key(inputs)
	if (locale === "es") return es_provider_api_key(inputs)
	if (locale === "ru") return ru_provider_api_key(inputs)
	if (locale === "pt") return pt_provider_api_key(inputs)
	if (locale === "it") return it_provider_api_key(inputs)
	return ar_provider_api_key(inputs)
});