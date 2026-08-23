/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Appearance_AutoInputs */

const zh_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟随系统`)
};

const zh_tw2_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟隨系統`)
};

const en_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follow system`)
};

const ja_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`システムに合わせる`)
};

const ko_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`시스템 따르기`)
};

const fr_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Selon le système`)
};

const de_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wie das System`)
};

const es_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Según el sistema`)
};

const ru_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Как в системе`)
};

const pt_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conforme o sistema`)
};

const it_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Come il sistema`)
};

const ar_settings_appearance_auto = /** @type {(inputs: Settings_Appearance_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حسب النظام`)
};

/**
* | output |
* | --- |
* | "Follow system" |
*
* @param {Settings_Appearance_AutoInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_appearance_auto = /** @type {((inputs?: Settings_Appearance_AutoInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Appearance_AutoInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_appearance_auto(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_appearance_auto(inputs)
	if (locale === "en") return en_settings_appearance_auto(inputs)
	if (locale === "ja") return ja_settings_appearance_auto(inputs)
	if (locale === "ko") return ko_settings_appearance_auto(inputs)
	if (locale === "fr") return fr_settings_appearance_auto(inputs)
	if (locale === "de") return de_settings_appearance_auto(inputs)
	if (locale === "es") return es_settings_appearance_auto(inputs)
	if (locale === "ru") return ru_settings_appearance_auto(inputs)
	if (locale === "pt") return pt_settings_appearance_auto(inputs)
	if (locale === "it") return it_settings_appearance_auto(inputs)
	return ar_settings_appearance_auto(inputs)
});