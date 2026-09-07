/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_Rate_LimitedInputs */

const zh_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`请求过于频繁，请稍候再试。`)
};

const zh_tw2_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`請求過於頻繁，請稍候再試。`)
};

const en_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Too many requests. Please wait a moment and try again.`)
};

const ja_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`リクエストが多すぎます。しばらく待ってから再試行してください。`)
};

const ko_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`요청이 너무 많습니다. 잠시 후 다시 시도해 주세요.`)
};

const fr_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trop de requêtes. Veuillez patienter un instant et réessayer.`)
};

const de_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zu viele Anfragen. Bitte warten Sie einen Moment und versuchen Sie es erneut.`)
};

const es_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Demasiadas solicitudes. Espera un momento y vuelve a intentarlo.`)
};

const ru_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Слишком много запросов. Подождите немного и повторите.`)
};

const pt_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Muitas solicitações. Aguarde um momento e tente novamente.`)
};

const it_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Troppe richieste. Aspetta un momento e riprova.`)
};

const ar_error_rate_limited = /** @type {(inputs: Error_Rate_LimitedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات كثيرة جدًا. يرجى الانتظار لحظة والمحاولة مرة أخرى.`)
};

/**
* | output |
* | --- |
* | "Too many requests. Please wait a moment and try again." |
*
* @param {Error_Rate_LimitedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const error_rate_limited = /** @type {((inputs?: Error_Rate_LimitedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_Rate_LimitedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_error_rate_limited(inputs)
	if (locale === "zh-TW") return zh_tw2_error_rate_limited(inputs)
	if (locale === "en") return en_error_rate_limited(inputs)
	if (locale === "ja") return ja_error_rate_limited(inputs)
	if (locale === "ko") return ko_error_rate_limited(inputs)
	if (locale === "fr") return fr_error_rate_limited(inputs)
	if (locale === "de") return de_error_rate_limited(inputs)
	if (locale === "es") return es_error_rate_limited(inputs)
	if (locale === "ru") return ru_error_rate_limited(inputs)
	if (locale === "pt") return pt_error_rate_limited(inputs)
	if (locale === "it") return it_error_rate_limited(inputs)
	return ar_error_rate_limited(inputs)
});