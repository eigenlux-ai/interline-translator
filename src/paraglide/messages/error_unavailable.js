/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_UnavailableInputs */

const zh_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译服务暂时不可用，请稍后重试。`)
};

const zh_tw2_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯服務暫時不可用，請稍後重試。`)
};

const en_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The translation service is temporarily unavailable. Please try again.`)
};

const ja_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳サービスは現在利用できません。後でもう一度お試しください。`)
};

const ko_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 서비스를 일시적으로 사용할 수 없습니다. 나중에 다시 시도해 주세요.`)
};

const fr_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le service de traduction est temporairement indisponible. Veuillez réessayer.`)
};

const de_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Der Übersetzungsdienst ist vorübergehend nicht erreichbar. Bitte versuche es erneut.`)
};

const es_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El servicio de traducción no está disponible temporalmente. Por favor, inténtalo de nuevo.`)
};

const ru_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сервис перевода временно недоступен. Пожалуйста, попробуйте еще раз.`)
};

const pt_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`O serviço de tradução está temporariamente indisponível. Tente novamente.`)
};

const it_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il servizio di traduzione è temporaneamente non disponibile. Riprova.`)
};

const ar_error_unavailable = /** @type {(inputs: Error_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خدمة الترجمة غير متوفرة مؤقتًا. يرجى المحاولة مرة أخرى.`)
};

/**
* | output |
* | --- |
* | "The translation service is temporarily unavailable. Please try again." |
*
* @param {Error_UnavailableInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const error_unavailable = /** @type {((inputs?: Error_UnavailableInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_UnavailableInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_error_unavailable(inputs)
	if (locale === "zh-TW") return zh_tw2_error_unavailable(inputs)
	if (locale === "en") return en_error_unavailable(inputs)
	if (locale === "ja") return ja_error_unavailable(inputs)
	if (locale === "ko") return ko_error_unavailable(inputs)
	if (locale === "fr") return fr_error_unavailable(inputs)
	if (locale === "de") return de_error_unavailable(inputs)
	if (locale === "es") return es_error_unavailable(inputs)
	if (locale === "ru") return ru_error_unavailable(inputs)
	if (locale === "pt") return pt_error_unavailable(inputs)
	if (locale === "it") return it_error_unavailable(inputs)
	return ar_error_unavailable(inputs)
});