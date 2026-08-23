/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_General_HintInputs */

const zh_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`语言 · 外观`)
};

const zh_tw2_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`語言 · 外觀`)
};

const en_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language · Appearance`)
};

const ja_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`言語 · 外観`)
};

const ko_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`언어 · 모양`)
};

const fr_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue · Apparence`)
};

const de_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sprache · Darstellung`)
};

const es_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma · Apariencia`)
};

const ru_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Язык · Оформление`)
};

const pt_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma · Aparência`)
};

const it_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lingua · Aspetto`)
};

const ar_options_nav_general_hint = /** @type {(inputs: Options_Nav_General_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللغة · المظهر`)
};

/**
* | output |
* | --- |
* | "Language · Appearance" |
*
* @param {Options_Nav_General_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_general_hint = /** @type {((inputs?: Options_Nav_General_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_General_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_general_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_general_hint(inputs)
	if (locale === "en") return en_options_nav_general_hint(inputs)
	if (locale === "ja") return ja_options_nav_general_hint(inputs)
	if (locale === "ko") return ko_options_nav_general_hint(inputs)
	if (locale === "fr") return fr_options_nav_general_hint(inputs)
	if (locale === "de") return de_options_nav_general_hint(inputs)
	if (locale === "es") return es_options_nav_general_hint(inputs)
	if (locale === "ru") return ru_options_nav_general_hint(inputs)
	if (locale === "pt") return pt_options_nav_general_hint(inputs)
	if (locale === "it") return it_options_nav_general_hint(inputs)
	return ar_options_nav_general_hint(inputs)
});