/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Ui_LanguageInputs */

const zh_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`界面语言`)
};

const zh_tw2_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`介面語言`)
};

const en_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Interface language`)
};

const ja_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`表示言語`)
};

const ko_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`표시 언어`)
};

const fr_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue de l'interface`)
};

const de_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Oberflächensprache`)
};

const es_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma de la interfaz`)
};

const ru_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Язык интерфейса`)
};

const pt_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma da interface`)
};

const it_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lingua dell'interfaccia`)
};

const ar_settings_ui_language = /** @type {(inputs: Settings_Ui_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة الواجهة`)
};

/**
* | output |
* | --- |
* | "Interface language" |
*
* @param {Settings_Ui_LanguageInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_ui_language = /** @type {((inputs?: Settings_Ui_LanguageInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Ui_LanguageInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_ui_language(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_ui_language(inputs)
	if (locale === "en") return en_settings_ui_language(inputs)
	if (locale === "ja") return ja_settings_ui_language(inputs)
	if (locale === "ko") return ko_settings_ui_language(inputs)
	if (locale === "fr") return fr_settings_ui_language(inputs)
	if (locale === "de") return de_settings_ui_language(inputs)
	if (locale === "es") return es_settings_ui_language(inputs)
	if (locale === "ru") return ru_settings_ui_language(inputs)
	if (locale === "pt") return pt_settings_ui_language(inputs)
	if (locale === "it") return it_settings_ui_language(inputs)
	return ar_settings_ui_language(inputs)
});