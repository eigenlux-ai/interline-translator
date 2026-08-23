/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Copy_SuffixInputs */

const zh_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`（副本）`)
};

const zh_tw2_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`（副本）`)
};

const en_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (copy)`)
};

const ja_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`（コピー）`)
};

const ko_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (사본)`)
};

const fr_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (copie)`)
};

const de_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (Kopie)`)
};

const es_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (copia)`)
};

const ru_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (копия)`)
};

const pt_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (cópia)`)
};

const it_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (copia)`)
};

const ar_styles_copy_suffix = /** @type {(inputs: Styles_Copy_SuffixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (` (نسخة)`)
};

/**
* | output |
* | --- |
* | "(copy)" |
*
* @param {Styles_Copy_SuffixInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_copy_suffix = /** @type {((inputs?: Styles_Copy_SuffixInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Copy_SuffixInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_copy_suffix(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_copy_suffix(inputs)
	if (locale === "en") return en_styles_copy_suffix(inputs)
	if (locale === "ja") return ja_styles_copy_suffix(inputs)
	if (locale === "ko") return ko_styles_copy_suffix(inputs)
	if (locale === "fr") return fr_styles_copy_suffix(inputs)
	if (locale === "de") return de_styles_copy_suffix(inputs)
	if (locale === "es") return es_styles_copy_suffix(inputs)
	if (locale === "ru") return ru_styles_copy_suffix(inputs)
	if (locale === "pt") return pt_styles_copy_suffix(inputs)
	if (locale === "it") return it_styles_copy_suffix(inputs)
	return ar_styles_copy_suffix(inputs)
});