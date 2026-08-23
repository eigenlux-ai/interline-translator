/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Param_TemperatureInputs */

const zh_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`温度`)
};

const zh_tw2_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`溫度`)
};

const en_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Temperature`)
};

const ja_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`温度`)
};

const ko_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`온도`)
};

const fr_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Température`)
};

const de_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Temperatur`)
};

const es_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Temperatura`)
};

const ru_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Температура`)
};

const pt_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Temperatura`)
};

const it_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Temperatura`)
};

const ar_provider_param_temperature = /** @type {(inputs: Provider_Param_TemperatureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`درجة الحرارة`)
};

/**
* | output |
* | --- |
* | "Temperature" |
*
* @param {Provider_Param_TemperatureInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_param_temperature = /** @type {((inputs?: Provider_Param_TemperatureInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Param_TemperatureInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_param_temperature(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_param_temperature(inputs)
	if (locale === "en") return en_provider_param_temperature(inputs)
	if (locale === "ja") return ja_provider_param_temperature(inputs)
	if (locale === "ko") return ko_provider_param_temperature(inputs)
	if (locale === "fr") return fr_provider_param_temperature(inputs)
	if (locale === "de") return de_provider_param_temperature(inputs)
	if (locale === "es") return es_provider_param_temperature(inputs)
	if (locale === "ru") return ru_provider_param_temperature(inputs)
	if (locale === "pt") return pt_provider_param_temperature(inputs)
	if (locale === "it") return it_provider_param_temperature(inputs)
	return ar_provider_param_temperature(inputs)
});