/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Style_TitleInputs */

const zh_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译文样式`)
};

const zh_tw2_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯文樣式`)
};

const en_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation appearance`)
};

const ja_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文の表示形式`)
};

const ko_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역문 표시 방식`)
};

const fr_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apparence des traductions`)
};

const de_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Darstellung der Übersetzung`)
};

const es_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apariencia de las traducciones`)
};

const ru_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оформление перевода`)
};

const pt_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aparência das traduções`)
};

const it_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aspetto delle traduzioni`)
};

const ar_settings_style_title = /** @type {(inputs: Settings_Style_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مظهر الترجمة`)
};

/**
* | output |
* | --- |
* | "Translation appearance" |
*
* @param {Settings_Style_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_style_title = /** @type {((inputs?: Settings_Style_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Style_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_style_title(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_style_title(inputs)
	if (locale === "en") return en_settings_style_title(inputs)
	if (locale === "ja") return ja_settings_style_title(inputs)
	if (locale === "ko") return ko_settings_style_title(inputs)
	if (locale === "fr") return fr_settings_style_title(inputs)
	if (locale === "de") return de_settings_style_title(inputs)
	if (locale === "es") return es_settings_style_title(inputs)
	if (locale === "ru") return ru_settings_style_title(inputs)
	if (locale === "pt") return pt_settings_style_title(inputs)
	if (locale === "it") return it_settings_style_title(inputs)
	return ar_settings_style_title(inputs)
});