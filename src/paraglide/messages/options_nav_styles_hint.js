/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_Styles_HintInputs */

const zh_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`语气与文风`)
};

const zh_tw2_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`語氣與文風`)
};

const en_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tone & register`)
};

const ja_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`語調と文体`)
};

const ko_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`어조와 문체`)
};

const fr_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ton et registre`)
};

const de_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ton & Register`)
};

const es_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tono y registro`)
};

const ru_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Тон и стиль`)
};

const pt_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tom e registro`)
};

const it_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tono e registro`)
};

const ar_options_nav_styles_hint = /** @type {(inputs: Options_Nav_Styles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النبرة والأسلوب`)
};

/**
* | output |
* | --- |
* | "Tone & register" |
*
* @param {Options_Nav_Styles_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_styles_hint = /** @type {((inputs?: Options_Nav_Styles_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_Styles_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_styles_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_styles_hint(inputs)
	if (locale === "en") return en_options_nav_styles_hint(inputs)
	if (locale === "ja") return ja_options_nav_styles_hint(inputs)
	if (locale === "ko") return ko_options_nav_styles_hint(inputs)
	if (locale === "fr") return fr_options_nav_styles_hint(inputs)
	if (locale === "de") return de_options_nav_styles_hint(inputs)
	if (locale === "es") return es_options_nav_styles_hint(inputs)
	if (locale === "ru") return ru_options_nav_styles_hint(inputs)
	if (locale === "pt") return pt_options_nav_styles_hint(inputs)
	if (locale === "it") return it_options_nav_styles_hint(inputs)
	return ar_options_nav_styles_hint(inputs)
});