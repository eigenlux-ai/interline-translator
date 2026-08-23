/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Appearance_TitleInputs */

const zh_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`外观`)
};

const zh_tw2_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`外觀`)
};

const en_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Appearance`)
};

const ja_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`外観`)
};

const ko_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모양`)
};

const fr_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apparence`)
};

const de_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Darstellung`)
};

const es_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apariencia`)
};

const ru_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оформление`)
};

const pt_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aparência`)
};

const it_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aspetto`)
};

const ar_settings_appearance_title = /** @type {(inputs: Settings_Appearance_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المظهر`)
};

/**
* | output |
* | --- |
* | "Appearance" |
*
* @param {Settings_Appearance_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_appearance_title = /** @type {((inputs?: Settings_Appearance_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Appearance_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_appearance_title(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_appearance_title(inputs)
	if (locale === "en") return en_settings_appearance_title(inputs)
	if (locale === "ja") return ja_settings_appearance_title(inputs)
	if (locale === "ko") return ko_settings_appearance_title(inputs)
	if (locale === "fr") return fr_settings_appearance_title(inputs)
	if (locale === "de") return de_settings_appearance_title(inputs)
	if (locale === "es") return es_settings_appearance_title(inputs)
	if (locale === "ru") return ru_settings_appearance_title(inputs)
	if (locale === "pt") return pt_settings_appearance_title(inputs)
	if (locale === "it") return it_settings_appearance_title(inputs)
	return ar_settings_appearance_title(inputs)
});