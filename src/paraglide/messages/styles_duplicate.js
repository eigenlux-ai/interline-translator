/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_DuplicateInputs */

const zh_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`复制为自建`)
};

const zh_tw2_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`複製為自建`)
};

const en_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplicate`)
};

const ja_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`複製`)
};

const ko_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`복제`)
};

const fr_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dupliquer`)
};

const de_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplizieren`)
};

const es_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplicar`)
};

const ru_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дублировать`)
};

const pt_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplicar`)
};

const it_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplica`)
};

const ar_styles_duplicate = /** @type {(inputs: Styles_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تكرار`)
};

/**
* | output |
* | --- |
* | "Duplicate" |
*
* @param {Styles_DuplicateInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_duplicate = /** @type {((inputs?: Styles_DuplicateInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_DuplicateInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_duplicate(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_duplicate(inputs)
	if (locale === "en") return en_styles_duplicate(inputs)
	if (locale === "ja") return ja_styles_duplicate(inputs)
	if (locale === "ko") return ko_styles_duplicate(inputs)
	if (locale === "fr") return fr_styles_duplicate(inputs)
	if (locale === "de") return de_styles_duplicate(inputs)
	if (locale === "es") return es_styles_duplicate(inputs)
	if (locale === "ru") return ru_styles_duplicate(inputs)
	if (locale === "pt") return pt_styles_duplicate(inputs)
	if (locale === "it") return it_styles_duplicate(inputs)
	return ar_styles_duplicate(inputs)
});