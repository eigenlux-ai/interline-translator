/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_Hint_1Inputs */

const zh_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`以 `)
};

const zh_tw2_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`以 `)
};

const en_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` Start with `)
};

const ja_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先頭に `)
};

const ko_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`맨 앞에 `)
};

const fr_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` Commencez par `)
};

const de_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` Beginnen Sie mit `)
};

const es_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` Empieza con `)
};

const ru_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` Начните с `)
};

const pt_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` Comece com `)
};

const it_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` Inizia con `)
};

const ar_settings_input_hint_1 = /** @type {(inputs: Settings_Input_Hint_1Inputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` ابدأ بـ `)
};

/**
* | output |
* | --- |
* | "Start with" |
*
* @param {Settings_Input_Hint_1Inputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_hint_1 = /** @type {((inputs?: Settings_Input_Hint_1Inputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_Hint_1Inputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_hint_1(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_hint_1(inputs)
	if (locale === "en") return en_settings_input_hint_1(inputs)
	if (locale === "ja") return ja_settings_input_hint_1(inputs)
	if (locale === "ko") return ko_settings_input_hint_1(inputs)
	if (locale === "fr") return fr_settings_input_hint_1(inputs)
	if (locale === "de") return de_settings_input_hint_1(inputs)
	if (locale === "es") return es_settings_input_hint_1(inputs)
	if (locale === "ru") return ru_settings_input_hint_1(inputs)
	if (locale === "pt") return pt_settings_input_hint_1(inputs)
	if (locale === "it") return it_settings_input_hint_1(inputs)
	return ar_settings_input_hint_1(inputs)
});