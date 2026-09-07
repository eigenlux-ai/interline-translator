/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_TranslatingInputs */

const zh_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译中…`)
};

const zh_tw2_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯中…`)
};

const en_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translating…`)
};

const ja_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳中…`)
};

const ko_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 중…`)
};

const fr_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction en cours…`)
};

const de_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wird übersetzt…`)
};

const es_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduciendo…`)
};

const ru_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод…`)
};

const pt_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzindo…`)
};

const it_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione in corso…`)
};

const ar_common_translating = /** @type {(inputs: Common_TranslatingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمة جارية…`)
};

/**
* | output |
* | --- |
* | "Translating…" |
*
* @param {Common_TranslatingInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const common_translating = /** @type {((inputs?: Common_TranslatingInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_TranslatingInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_common_translating(inputs)
	if (locale === "zh-TW") return zh_tw2_common_translating(inputs)
	if (locale === "en") return en_common_translating(inputs)
	if (locale === "ja") return ja_common_translating(inputs)
	if (locale === "ko") return ko_common_translating(inputs)
	if (locale === "fr") return fr_common_translating(inputs)
	if (locale === "de") return de_common_translating(inputs)
	if (locale === "es") return es_common_translating(inputs)
	if (locale === "ru") return ru_common_translating(inputs)
	if (locale === "pt") return pt_common_translating(inputs)
	if (locale === "it") return it_common_translating(inputs)
	return ar_common_translating(inputs)
});