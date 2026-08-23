/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_TriggerInputs */

const zh_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`触发空格数`)
};

const zh_tw2_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`觸發空白鍵數`)
};

const en_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Spaces to trigger`)
};

const ja_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`起動に必要なスペース数`)
};

const ko_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`실행에 필요한 스페이스 수`)
};

const fr_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Espaces pour déclencher`)
};

const de_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leertasten zum Auslösen`)
};

const es_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Espacios para activar`)
};

const ru_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Пробелов для запуска`)
};

const pt_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Espaços para acionar`)
};

const it_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Spazi per attivare`)
};

const ar_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عدد المسافات للتفعيل`)
};

/**
* | output |
* | --- |
* | "Spaces to trigger" |
*
* @param {Settings_Input_TriggerInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_trigger = /** @type {((inputs?: Settings_Input_TriggerInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_TriggerInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_trigger(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_trigger(inputs)
	if (locale === "en") return en_settings_input_trigger(inputs)
	if (locale === "ja") return ja_settings_input_trigger(inputs)
	if (locale === "ko") return ko_settings_input_trigger(inputs)
	if (locale === "fr") return fr_settings_input_trigger(inputs)
	if (locale === "de") return de_settings_input_trigger(inputs)
	if (locale === "es") return es_settings_input_trigger(inputs)
	if (locale === "ru") return ru_settings_input_trigger(inputs)
	if (locale === "pt") return pt_settings_input_trigger(inputs)
	if (locale === "it") return it_settings_input_trigger(inputs)
	return ar_settings_input_trigger(inputs)
});