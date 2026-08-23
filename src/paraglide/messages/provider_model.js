/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_ModelInputs */

const zh_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`模型`)
};

const zh_tw2_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`模型`)
};

const en_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Model`)
};

const ja_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`モデル`)
};

const ko_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모델`)
};

const fr_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modèle`)
};

const de_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modell`)
};

const es_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modelo`)
};

const ru_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Модель`)
};

const pt_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modelo`)
};

const it_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modello`)
};

const ar_provider_model = /** @type {(inputs: Provider_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النموذج`)
};

/**
* | output |
* | --- |
* | "Model" |
*
* @param {Provider_ModelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_model = /** @type {((inputs?: Provider_ModelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_ModelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_model(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_model(inputs)
	if (locale === "en") return en_provider_model(inputs)
	if (locale === "ja") return ja_provider_model(inputs)
	if (locale === "ko") return ko_provider_model(inputs)
	if (locale === "fr") return fr_provider_model(inputs)
	if (locale === "de") return de_provider_model(inputs)
	if (locale === "es") return es_provider_model(inputs)
	if (locale === "ru") return ru_provider_model(inputs)
	if (locale === "pt") return pt_provider_model(inputs)
	if (locale === "it") return it_provider_model(inputs)
	return ar_provider_model(inputs)
});