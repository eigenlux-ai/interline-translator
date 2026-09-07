/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_RetryInputs */

const zh_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`重试`)
};

const zh_tw2_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`重試`)
};

const en_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Retry`)
};

const ja_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`再試行`)
};

const ko_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`다시 시도`)
};

const fr_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réessayer`)
};

const de_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erneut versuchen`)
};

const es_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reintentar`)
};

const ru_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Повторить`)
};

const pt_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tentar novamente`)
};

const it_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Riprova`)
};

const ar_common_retry = /** @type {(inputs: Common_RetryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة المحاولة`)
};

/**
* | output |
* | --- |
* | "Retry" |
*
* @param {Common_RetryInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const common_retry = /** @type {((inputs?: Common_RetryInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_RetryInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_common_retry(inputs)
	if (locale === "zh-TW") return zh_tw2_common_retry(inputs)
	if (locale === "en") return en_common_retry(inputs)
	if (locale === "ja") return ja_common_retry(inputs)
	if (locale === "ko") return ko_common_retry(inputs)
	if (locale === "fr") return fr_common_retry(inputs)
	if (locale === "de") return de_common_retry(inputs)
	if (locale === "es") return es_common_retry(inputs)
	if (locale === "ru") return ru_common_retry(inputs)
	if (locale === "pt") return pt_common_retry(inputs)
	if (locale === "it") return it_common_retry(inputs)
	return ar_common_retry(inputs)
});