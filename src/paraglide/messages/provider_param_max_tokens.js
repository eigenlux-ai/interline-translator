/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_Max_TokensInputs */

const zh_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`最大输出 token 数`)
};

const zh_tw2_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`輸出 token 上限`)
};

const en_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Max output tokens`)
};

const ja_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`最大出力トークン数`)
};

const ko_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`최대 출력 토큰 수`)
};

const fr_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tokens de sortie max`)
};

const de_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maximale Ausgabe-Tokens`)
};

const es_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Máximo de tokens de salida`)
};

const ru_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Максимум токенов в ответе`)
};

const pt_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Máximo de tokens de saída`)
};

const it_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Token massimi in output`)
};

const ar_provider_param_max_tokens = /** @type {(inputs: Provider_Param_Max_TokensInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحد الأقصى لتوكنات الإخراج`)
};

/**
* | output |
* | --- |
* | "Max output tokens" |
*
* @param {Provider_Param_Max_TokensInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_param_max_tokens = /** @type {((inputs?: Provider_Param_Max_TokensInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Param_Max_TokensInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_param_max_tokens(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_param_max_tokens(inputs)
	if (locale === "en") return en_provider_param_max_tokens(inputs)
	if (locale === "ja") return ja_provider_param_max_tokens(inputs)
	if (locale === "ko") return ko_provider_param_max_tokens(inputs)
	if (locale === "fr") return fr_provider_param_max_tokens(inputs)
	if (locale === "de") return de_provider_param_max_tokens(inputs)
	if (locale === "es") return es_provider_param_max_tokens(inputs)
	if (locale === "ru") return ru_provider_param_max_tokens(inputs)
	if (locale === "pt") return pt_provider_param_max_tokens(inputs)
	if (locale === "it") return it_provider_param_max_tokens(inputs)
	return ar_provider_param_max_tokens(inputs)
});