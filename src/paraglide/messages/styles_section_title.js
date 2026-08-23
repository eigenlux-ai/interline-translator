/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Section_TitleInputs */

const zh_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译风格`)
};

const zh_tw2_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯風格`)
};

const en_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation styles`)
};

const ja_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳スタイル`)
};

const ko_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 스타일`)
};

const fr_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Styles de traduction`)
};

const de_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzungsstile`)
};

const es_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estilos de traducción`)
};

const ru_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Стили перевода`)
};

const pt_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estilos de tradução`)
};

const it_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stili di traduzione`)
};

const ar_styles_section_title = /** @type {(inputs: Styles_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أنماط الترجمة`)
};

/**
* | output |
* | --- |
* | "Translation styles" |
*
* @param {Styles_Section_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_section_title = /** @type {((inputs?: Styles_Section_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Section_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_section_title(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_section_title(inputs)
	if (locale === "en") return en_styles_section_title(inputs)
	if (locale === "ja") return ja_styles_section_title(inputs)
	if (locale === "ko") return ko_styles_section_title(inputs)
	if (locale === "fr") return fr_styles_section_title(inputs)
	if (locale === "de") return de_styles_section_title(inputs)
	if (locale === "es") return es_styles_section_title(inputs)
	if (locale === "ru") return ru_styles_section_title(inputs)
	if (locale === "pt") return pt_styles_section_title(inputs)
	if (locale === "it") return it_styles_section_title(inputs)
	return ar_styles_section_title(inputs)
});