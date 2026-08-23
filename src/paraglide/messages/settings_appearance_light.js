/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Appearance_LightInputs */

const zh_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`浅色`)
};

const zh_tw2_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`淺色`)
};

const en_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Light`)
};

const ja_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ライト`)
};

const ko_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`밝게`)
};

const fr_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clair`)
};

const de_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hell`)
};

const es_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claro`)
};

const ru_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Светлое`)
};

const pt_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claro`)
};

const it_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Chiaro`)
};

const ar_settings_appearance_light = /** @type {(inputs: Settings_Appearance_LightInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فاتح`)
};

/**
* | output |
* | --- |
* | "Light" |
*
* @param {Settings_Appearance_LightInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_appearance_light = /** @type {((inputs?: Settings_Appearance_LightInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Appearance_LightInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_appearance_light(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_appearance_light(inputs)
	if (locale === "en") return en_settings_appearance_light(inputs)
	if (locale === "ja") return ja_settings_appearance_light(inputs)
	if (locale === "ko") return ko_settings_appearance_light(inputs)
	if (locale === "fr") return fr_settings_appearance_light(inputs)
	if (locale === "de") return de_settings_appearance_light(inputs)
	if (locale === "es") return es_settings_appearance_light(inputs)
	if (locale === "ru") return ru_settings_appearance_light(inputs)
	if (locale === "pt") return pt_settings_appearance_light(inputs)
	if (locale === "it") return it_settings_appearance_light(inputs)
	return ar_settings_appearance_light(inputs)
});