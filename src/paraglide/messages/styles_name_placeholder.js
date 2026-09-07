/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Name_PlaceholderInputs */

const zh_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`例如：新闻报道`)
};

const zh_tw2_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`例如：新聞報導`)
};

const en_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. Newsroom voice`)
};

const ja_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`例：報道翻訳調`)
};

const ko_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`예: 뉴스 번역체`)
};

const fr_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ex. Ton journalistique`)
};

const de_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`z. B. Journalistisch`)
};

const es_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`p. ej. Tono periodístico`)
};

const ru_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`напр. Новостной тон`)
};

const pt_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ex.: Tom jornalístico`)
};

const it_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`es. Tono giornalistico`)
};

const ar_styles_name_placeholder = /** @type {(inputs: Styles_Name_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال: أسلوب صحفي`)
};

/**
* | output |
* | --- |
* | "e.g. Newsroom voice" |
*
* @param {Styles_Name_PlaceholderInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_name_placeholder = /** @type {((inputs?: Styles_Name_PlaceholderInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Name_PlaceholderInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_name_placeholder(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_name_placeholder(inputs)
	if (locale === "en") return en_styles_name_placeholder(inputs)
	if (locale === "ja") return ja_styles_name_placeholder(inputs)
	if (locale === "ko") return ko_styles_name_placeholder(inputs)
	if (locale === "fr") return fr_styles_name_placeholder(inputs)
	if (locale === "de") return de_styles_name_placeholder(inputs)
	if (locale === "es") return es_styles_name_placeholder(inputs)
	if (locale === "ru") return ru_styles_name_placeholder(inputs)
	if (locale === "pt") return pt_styles_name_placeholder(inputs)
	if (locale === "it") return it_styles_name_placeholder(inputs)
	return ar_styles_name_placeholder(inputs)
});