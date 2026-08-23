/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_ParamsInputs */

const zh_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`模型参数`)
};

const zh_tw2_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`模型參數`)
};

const en_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Model parameters`)
};

const ja_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`モデルのパラメーター`)
};

const ko_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모델 파라미터`)
};

const fr_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paramètres du modèle`)
};

const de_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modellparameter`)
};

const es_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Parámetros del modelo`)
};

const ru_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Параметры модели`)
};

const pt_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Parâmetros do modelo`)
};

const it_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Parametri del modello`)
};

const ar_provider_params = /** @type {(inputs: Provider_ParamsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معاملات النموذج`)
};

/**
* | output |
* | --- |
* | "Model parameters" |
*
* @param {Provider_ParamsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_params = /** @type {((inputs?: Provider_ParamsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_ParamsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_params(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_params(inputs)
	if (locale === "en") return en_provider_params(inputs)
	if (locale === "ja") return ja_provider_params(inputs)
	if (locale === "ko") return ko_provider_params(inputs)
	if (locale === "fr") return fr_provider_params(inputs)
	if (locale === "de") return de_provider_params(inputs)
	if (locale === "es") return es_provider_params(inputs)
	if (locale === "ru") return ru_provider_params(inputs)
	if (locale === "pt") return pt_provider_params(inputs)
	if (locale === "it") return it_provider_params(inputs)
	return ar_provider_params(inputs)
});