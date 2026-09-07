/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_TimeoutInputs */

const zh_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`引擎响应超时，请稍后重试。`)
};

const zh_tw2_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`引擎回應逾時，請稍後重試。`)
};

const en_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The engine took too long to respond. Please try again later.`)
};

const ja_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`エンジンの応答がタイムアウトしました。後でもう一度お試しください。`)
};

const ko_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`엔진 응답 시간이 초과되었습니다. 나중에 다시 시도해 주세요.`)
};

const fr_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le moteur a mis trop de temps à répondre. Veuillez réessayer plus tard.`)
};

const de_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die Engine hat nicht rechtzeitig geantwortet. Bitte versuchen Sie es später erneut.`)
};

const es_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El motor ha tardado demasiado en responder. Por favor, inténtalo de nuevo más tarde.`)
};

const ru_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Движок слишком долго не отвечал. Пожалуйста, попробуйте позже.`)
};

const pt_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O motor demorou muito para responder. Tente novamente mais tarde.`)
};

const it_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il motore ha impiegato troppo tempo per rispondere. Riprova più tardi.`)
};

const ar_error_timeout = /** @type {(inputs: Error_TimeoutInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استغرق المحرك وقتًا طويلاً للرد. يرجى المحاولة مرة أخرى لاحقًا.`)
};

/**
* | output |
* | --- |
* | "The engine took too long to respond. Please try again later." |
*
* @param {Error_TimeoutInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const error_timeout = /** @type {((inputs?: Error_TimeoutInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_TimeoutInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_error_timeout(inputs)
	if (locale === "zh-TW") return zh_tw2_error_timeout(inputs)
	if (locale === "en") return en_error_timeout(inputs)
	if (locale === "ja") return ja_error_timeout(inputs)
	if (locale === "ko") return ko_error_timeout(inputs)
	if (locale === "fr") return fr_error_timeout(inputs)
	if (locale === "de") return de_error_timeout(inputs)
	if (locale === "es") return es_error_timeout(inputs)
	if (locale === "ru") return ru_error_timeout(inputs)
	if (locale === "pt") return pt_error_timeout(inputs)
	if (locale === "it") return it_error_timeout(inputs)
	return ar_error_timeout(inputs)
});