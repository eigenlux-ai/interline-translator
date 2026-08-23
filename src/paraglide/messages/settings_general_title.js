/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_General_TitleInputs */

const zh_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`通用`)
};

const zh_tw2_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`一般`)
};

const en_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`General`)
};

const ja_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`一般`)
};

const ko_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`일반`)
};

const fr_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Général`)
};

const de_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Allgemein`)
};

const es_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`General`)
};

const ru_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Общие`)
};

const pt_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geral`)
};

const it_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Generale`)
};

const ar_settings_general_title = /** @type {(inputs: Settings_General_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عام`)
};

/**
* | output |
* | --- |
* | "General" |
*
* @param {Settings_General_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_general_title = /** @type {((inputs?: Settings_General_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_General_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_general_title(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_general_title(inputs)
	if (locale === "en") return en_settings_general_title(inputs)
	if (locale === "ja") return ja_settings_general_title(inputs)
	if (locale === "ko") return ko_settings_general_title(inputs)
	if (locale === "fr") return fr_settings_general_title(inputs)
	if (locale === "de") return de_settings_general_title(inputs)
	if (locale === "es") return es_settings_general_title(inputs)
	if (locale === "ru") return ru_settings_general_title(inputs)
	if (locale === "pt") return pt_settings_general_title(inputs)
	if (locale === "it") return it_settings_general_title(inputs)
	return ar_settings_general_title(inputs)
});