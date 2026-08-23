/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_Hint_2Inputs */

const zh_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 或 `)
};

const zh_tw2_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 或 `)
};

const en_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` or `)
};

const ja_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` または `)
};

const ko_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` 또는 `)
};

const fr_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` ou `)
};

const de_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` oder `)
};

const es_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` o `)
};

const ru_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` или `)
};

const pt_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` ou `)
};

const it_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` oppure `)
};

const ar_settings_input_hint_2 = /** @type {(inputs: Settings_Input_Hint_2Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` أو `)
};

/**
* | output |
* | --- |
* | "or" |
*
* @param {Settings_Input_Hint_2Inputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_hint_2 = /** @type {((inputs?: Settings_Input_Hint_2Inputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_Hint_2Inputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_hint_2(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_hint_2(inputs)
	if (locale === "en") return en_settings_input_hint_2(inputs)
	if (locale === "ja") return ja_settings_input_hint_2(inputs)
	if (locale === "ko") return ko_settings_input_hint_2(inputs)
	if (locale === "fr") return fr_settings_input_hint_2(inputs)
	if (locale === "de") return de_settings_input_hint_2(inputs)
	if (locale === "es") return es_settings_input_hint_2(inputs)
	if (locale === "ru") return ru_settings_input_hint_2(inputs)
	if (locale === "pt") return pt_settings_input_hint_2(inputs)
	if (locale === "it") return it_settings_input_hint_2(inputs)
	return ar_settings_input_hint_2(inputs)
});