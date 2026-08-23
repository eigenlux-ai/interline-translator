/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_Sites_HintInputs */

const zh_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`按站规则`)
};

const zh_tw2_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`逐站規則`)
};

const en_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per-site rules`)
};

const ja_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サイトごとのルール`)
};

const ko_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사이트별 규칙`)
};

const fr_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Règles par site`)
};

const de_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regeln pro Website`)
};

const es_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reglas por sitio`)
};

const ru_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Правила по сайтам`)
};

const pt_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regras por site`)
};

const it_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regole per sito`)
};

const ar_options_nav_sites_hint = /** @type {(inputs: Options_Nav_Sites_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قواعد لكل موقع`)
};

/**
* | output |
* | --- |
* | "Per-site rules" |
*
* @param {Options_Nav_Sites_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_sites_hint = /** @type {((inputs?: Options_Nav_Sites_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_Sites_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_sites_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_sites_hint(inputs)
	if (locale === "en") return en_options_nav_sites_hint(inputs)
	if (locale === "ja") return ja_options_nav_sites_hint(inputs)
	if (locale === "ko") return ko_options_nav_sites_hint(inputs)
	if (locale === "fr") return fr_options_nav_sites_hint(inputs)
	if (locale === "de") return de_options_nav_sites_hint(inputs)
	if (locale === "es") return es_options_nav_sites_hint(inputs)
	if (locale === "ru") return ru_options_nav_sites_hint(inputs)
	if (locale === "pt") return pt_options_nav_sites_hint(inputs)
	if (locale === "it") return it_options_nav_sites_hint(inputs)
	return ar_options_nav_sites_hint(inputs)
});