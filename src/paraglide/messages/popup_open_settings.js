/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Popup_Open_SettingsInputs */

const zh_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`打开设置`)
};

const zh_tw2_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`開啟設定`)
};

const en_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open settings`)
};

const ja_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定を開く`)
};

const ko_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정 열기`)
};

const fr_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ouvrir les réglages`)
};

const de_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Einstellungen öffnen`)
};

const es_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abrir los ajustes`)
};

const ru_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Открыть настройки`)
};

const pt_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Abrir as definições`)
};

const it_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apri le impostazioni`)
};

const ar_popup_open_settings = /** @type {(inputs: Popup_Open_SettingsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فتح الإعدادات`)
};

/**
* | output |
* | --- |
* | "Open settings" |
*
* @param {Popup_Open_SettingsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const popup_open_settings = /** @type {((inputs?: Popup_Open_SettingsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Popup_Open_SettingsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_popup_open_settings(inputs)
	if (locale === "zh-TW") return zh_tw2_popup_open_settings(inputs)
	if (locale === "en") return en_popup_open_settings(inputs)
	if (locale === "ja") return ja_popup_open_settings(inputs)
	if (locale === "ko") return ko_popup_open_settings(inputs)
	if (locale === "fr") return fr_popup_open_settings(inputs)
	if (locale === "de") return de_popup_open_settings(inputs)
	if (locale === "es") return es_popup_open_settings(inputs)
	if (locale === "ru") return ru_popup_open_settings(inputs)
	if (locale === "pt") return pt_popup_open_settings(inputs)
	if (locale === "it") return it_popup_open_settings(inputs)
	return ar_popup_open_settings(inputs)
});