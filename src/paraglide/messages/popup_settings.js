/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Popup_SettingsInputs */

const zh_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`设置`)
};

const zh_tw2_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定`)
};

const en_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings`)
};

const ja_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定`)
};

const ko_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정`)
};

const fr_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réglages`)
};

const de_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Einstellungen`)
};

const es_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajustes`)
};

const ru_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Настройки`)
};

const pt_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Definições`)
};

const it_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impostazioni`)
};

const ar_popup_settings = /** @type {(inputs: Popup_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإعدادات`)
};

/**
* | output |
* | --- |
* | "Settings" |
*
* @param {Popup_SettingsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const popup_settings = /** @type {((inputs?: Popup_SettingsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Popup_SettingsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_popup_settings(inputs)
	if (locale === "zh-TW") return zh_tw2_popup_settings(inputs)
	if (locale === "en") return en_popup_settings(inputs)
	if (locale === "ja") return ja_popup_settings(inputs)
	if (locale === "ko") return ko_popup_settings(inputs)
	if (locale === "fr") return fr_popup_settings(inputs)
	if (locale === "de") return de_popup_settings(inputs)
	if (locale === "es") return es_popup_settings(inputs)
	if (locale === "ru") return ru_popup_settings(inputs)
	if (locale === "pt") return pt_popup_settings(inputs)
	if (locale === "it") return it_popup_settings(inputs)
	return ar_popup_settings(inputs)
});