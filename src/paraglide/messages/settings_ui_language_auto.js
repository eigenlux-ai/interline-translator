/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Ui_Language_AutoInputs */

const zh_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟随目标语言`)
};

const zh_tw2_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟隨目標語言`)
};

const en_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follow the target language`)
};

const ja_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳先の言語に従う`)
};

const ko_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 대상 언어 따르기`)
};

const fr_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivre la langue cible`)
};

const de_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Der Zielsprache folgen`)
};

const es_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seguir el idioma de destino`)
};

const ru_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Следовать за языком перевода`)
};

const pt_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seguir o idioma de destino`)
};

const it_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Segui la lingua di destinazione`)
};

const ar_settings_ui_language_auto = /** @type {(inputs: Settings_Ui_Language_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اتّباع لغة الهدف`)
};

/**
* | output |
* | --- |
* | "Follow the target language" |
*
* @param {Settings_Ui_Language_AutoInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_ui_language_auto = /** @type {((inputs?: Settings_Ui_Language_AutoInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Ui_Language_AutoInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_ui_language_auto(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_ui_language_auto(inputs)
	if (locale === "en") return en_settings_ui_language_auto(inputs)
	if (locale === "ja") return ja_settings_ui_language_auto(inputs)
	if (locale === "ko") return ko_settings_ui_language_auto(inputs)
	if (locale === "fr") return fr_settings_ui_language_auto(inputs)
	if (locale === "de") return de_settings_ui_language_auto(inputs)
	if (locale === "es") return es_settings_ui_language_auto(inputs)
	if (locale === "ru") return ru_settings_ui_language_auto(inputs)
	if (locale === "pt") return pt_settings_ui_language_auto(inputs)
	if (locale === "it") return it_settings_ui_language_auto(inputs)
	return ar_settings_ui_language_auto(inputs)
});