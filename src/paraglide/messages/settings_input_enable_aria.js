/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_Enable_AriaInputs */

const zh_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`启用输入框翻译`)
};

const zh_tw2_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`啟用輸入框翻譯`)
};

const en_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable input-box translation`)
};

const ja_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`入力欄の翻訳を有効にする`)
};

const ko_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`입력창 번역 켜기`)
};

const fr_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer la traduction dans les champs`)
};

const de_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung im Eingabefeld aktivieren`)
};

const es_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activar la traducción en campos de texto`)
};

const ru_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включить перевод в полях ввода`)
};

const pt_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ativar a tradução em campos de texto`)
};

const it_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attiva la traduzione nei campi di testo`)
};

const ar_settings_input_enable_aria = /** @type {(inputs: Settings_Input_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تفعيل ترجمة حقول الإدخال`)
};

/**
* | output |
* | --- |
* | "Enable input-box translation" |
*
* @param {Settings_Input_Enable_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_enable_aria = /** @type {((inputs?: Settings_Input_Enable_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_Enable_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_enable_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_enable_aria(inputs)
	if (locale === "en") return en_settings_input_enable_aria(inputs)
	if (locale === "ja") return ja_settings_input_enable_aria(inputs)
	if (locale === "ko") return ko_settings_input_enable_aria(inputs)
	if (locale === "fr") return fr_settings_input_enable_aria(inputs)
	if (locale === "de") return de_settings_input_enable_aria(inputs)
	if (locale === "es") return es_settings_input_enable_aria(inputs)
	if (locale === "ru") return ru_settings_input_enable_aria(inputs)
	if (locale === "pt") return pt_settings_input_enable_aria(inputs)
	if (locale === "it") return it_settings_input_enable_aria(inputs)
	return ar_settings_input_enable_aria(inputs)
});