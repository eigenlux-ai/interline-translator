/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Translate_FailedInputs */

const zh_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译失败`)
};

const zh_tw2_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯失敗`)
};

const en_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation failed`)
};

const ja_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳に失敗しました`)
};

const ko_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 실패`)
};

const fr_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échec de la traduction`)
};

const de_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung fehlgeschlagen`)
};

const es_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Error de traducción`)
};

const ru_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось перевести`)
};

const pt_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Falha na tradução`)
};

const it_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione non riuscita`)
};

const ar_common_translate_failed = /** @type {(inputs: Common_Translate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فشلت الترجمة`)
};

/**
* | output |
* | --- |
* | "Translation failed" |
*
* @param {Common_Translate_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const common_translate_failed = /** @type {((inputs?: Common_Translate_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Translate_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_common_translate_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_common_translate_failed(inputs)
	if (locale === "en") return en_common_translate_failed(inputs)
	if (locale === "ja") return ja_common_translate_failed(inputs)
	if (locale === "ko") return ko_common_translate_failed(inputs)
	if (locale === "fr") return fr_common_translate_failed(inputs)
	if (locale === "de") return de_common_translate_failed(inputs)
	if (locale === "es") return es_common_translate_failed(inputs)
	if (locale === "ru") return ru_common_translate_failed(inputs)
	if (locale === "pt") return pt_common_translate_failed(inputs)
	if (locale === "it") return it_common_translate_failed(inputs)
	return ar_common_translate_failed(inputs)
});