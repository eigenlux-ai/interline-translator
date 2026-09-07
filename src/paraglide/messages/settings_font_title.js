/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Font_TitleInputs */

const zh_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译文字体`)
};

const zh_tw2_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯文字型`)
};

const en_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation typeface`)
};

const ja_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文の書体`)
};

const ko_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 글꼴`)
};

const fr_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Police de traduction`)
};

const de_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzungsschrift`)
};

const es_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tipografía de traducción`)
};

const ru_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шрифт перевода`)
};

const pt_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fonte da tradução`)
};

const it_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Carattere della traduzione`)
};

const ar_settings_font_title = /** @type {(inputs: Settings_Font_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خط الترجمة`)
};

/**
* | output |
* | --- |
* | "Translation typeface" |
*
* @param {Settings_Font_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_font_title = /** @type {((inputs?: Settings_Font_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Font_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_font_title(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_font_title(inputs)
	if (locale === "en") return en_settings_font_title(inputs)
	if (locale === "ja") return ja_settings_font_title(inputs)
	if (locale === "ko") return ko_settings_font_title(inputs)
	if (locale === "fr") return fr_settings_font_title(inputs)
	if (locale === "de") return de_settings_font_title(inputs)
	if (locale === "es") return es_settings_font_title(inputs)
	if (locale === "ru") return ru_settings_font_title(inputs)
	if (locale === "pt") return pt_settings_font_title(inputs)
	if (locale === "it") return it_settings_font_title(inputs)
	return ar_settings_font_title(inputs)
});