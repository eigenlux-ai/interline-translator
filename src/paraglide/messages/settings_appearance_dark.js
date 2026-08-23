/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Appearance_DarkInputs */

const zh_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`深色`)
};

const zh_tw2_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`深色`)
};

const en_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dark`)
};

const ja_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ダーク`)
};

const ko_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`어둡게`)
};

const fr_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sombre`)
};

const de_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dunkel`)
};

const es_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Oscuro`)
};

const ru_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тёмное`)
};

const pt_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escuro`)
};

const it_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scuro`)
};

const ar_settings_appearance_dark = /** @type {(inputs: Settings_Appearance_DarkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`داكن`)
};

/**
* | output |
* | --- |
* | "Dark" |
*
* @param {Settings_Appearance_DarkInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_appearance_dark = /** @type {((inputs?: Settings_Appearance_DarkInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Appearance_DarkInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_appearance_dark(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_appearance_dark(inputs)
	if (locale === "en") return en_settings_appearance_dark(inputs)
	if (locale === "ja") return ja_settings_appearance_dark(inputs)
	if (locale === "ko") return ko_settings_appearance_dark(inputs)
	if (locale === "fr") return fr_settings_appearance_dark(inputs)
	if (locale === "de") return de_settings_appearance_dark(inputs)
	if (locale === "es") return es_settings_appearance_dark(inputs)
	if (locale === "ru") return ru_settings_appearance_dark(inputs)
	if (locale === "pt") return pt_settings_appearance_dark(inputs)
	if (locale === "it") return it_settings_appearance_dark(inputs)
	return ar_settings_appearance_dark(inputs)
});