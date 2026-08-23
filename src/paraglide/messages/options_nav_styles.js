/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_StylesInputs */

const zh_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译风格`)
};

const zh_tw2_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯風格`)
};

const en_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Styles`)
};

const ja_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳スタイル`)
};

const ko_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 스타일`)
};

const fr_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Styles`)
};

const de_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stile`)
};

const es_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estilos`)
};

const ru_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Стили`)
};

const pt_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estilos`)
};

const it_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stili`)
};

const ar_options_nav_styles = /** @type {(inputs: Options_Nav_StylesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الأنماط`)
};

/**
* | output |
* | --- |
* | "Styles" |
*
* @param {Options_Nav_StylesInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_styles = /** @type {((inputs?: Options_Nav_StylesInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_StylesInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_styles(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_styles(inputs)
	if (locale === "en") return en_options_nav_styles(inputs)
	if (locale === "ja") return ja_options_nav_styles(inputs)
	if (locale === "ko") return ko_options_nav_styles(inputs)
	if (locale === "fr") return fr_options_nav_styles(inputs)
	if (locale === "de") return de_options_nav_styles(inputs)
	if (locale === "es") return es_options_nav_styles(inputs)
	if (locale === "ru") return ru_options_nav_styles(inputs)
	if (locale === "pt") return pt_options_nav_styles(inputs)
	if (locale === "it") return it_options_nav_styles(inputs)
	return ar_options_nav_styles(inputs)
});