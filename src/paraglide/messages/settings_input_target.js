/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_TargetInputs */

const zh_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译入`)
};

const zh_tw2_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯入`)
};

const en_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Into`)
};

const ja_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳先`)
};

const ko_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 언어`)
};

const fr_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vers`)
};

const de_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nach`)
};

const es_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A`)
};

const ru_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`На`)
};

const pt_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Para`)
};

const it_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`In`)
};

const ar_settings_input_target = /** @type {(inputs: Settings_Input_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إلى`)
};

/**
* | output |
* | --- |
* | "Into" |
*
* @param {Settings_Input_TargetInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_target = /** @type {((inputs?: Settings_Input_TargetInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_TargetInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_target(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_target(inputs)
	if (locale === "en") return en_settings_input_target(inputs)
	if (locale === "ja") return ja_settings_input_target(inputs)
	if (locale === "ko") return ko_settings_input_target(inputs)
	if (locale === "fr") return fr_settings_input_target(inputs)
	if (locale === "de") return de_settings_input_target(inputs)
	if (locale === "es") return es_settings_input_target(inputs)
	if (locale === "ru") return ru_settings_input_target(inputs)
	if (locale === "pt") return pt_settings_input_target(inputs)
	if (locale === "it") return it_settings_input_target(inputs)
	return ar_settings_input_target(inputs)
});