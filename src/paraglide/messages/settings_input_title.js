/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_TitleInputs */

const zh_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`输入框翻译`)
};

const zh_tw2_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`輸入框翻譯`)
};

const en_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Input-box translation`)
};

const ja_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`入力欄の翻訳`)
};

const ko_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`입력창 번역`)
};

const fr_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction dans les champs`)
};

const de_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung im Eingabefeld`)
};

const es_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción en campos de texto`)
};

const ru_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод в полях ввода`)
};

const pt_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução em campos de texto`)
};

const it_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione nei campi di testo`)
};

const ar_settings_input_title = /** @type {(inputs: Settings_Input_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة حقول الإدخال`)
};

/**
* | output |
* | --- |
* | "Input-box translation" |
*
* @param {Settings_Input_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_title = /** @type {((inputs?: Settings_Input_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_title(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_title(inputs)
	if (locale === "en") return en_settings_input_title(inputs)
	if (locale === "ja") return ja_settings_input_title(inputs)
	if (locale === "ko") return ko_settings_input_title(inputs)
	if (locale === "fr") return fr_settings_input_title(inputs)
	if (locale === "de") return de_settings_input_title(inputs)
	if (locale === "es") return es_settings_input_title(inputs)
	if (locale === "ru") return ru_settings_input_title(inputs)
	if (locale === "pt") return pt_settings_input_title(inputs)
	if (locale === "it") return it_settings_input_title(inputs)
	return ar_settings_input_title(inputs)
});