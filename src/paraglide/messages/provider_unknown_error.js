/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Unknown_ErrorInputs */

const zh_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`发生未知错误`)
};

const zh_tw2_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`發生未知錯誤`)
};

const en_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An unknown error occurred`)
};

const ja_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`不明なエラーが発生しました`)
};

const ko_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`알 수 없는 오류가 발생했습니다`)
};

const fr_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Une erreur inconnue s'est produite`)
};

const de_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ein unbekannter Fehler ist aufgetreten`)
};

const es_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se ha producido un error desconocido`)
};

const ru_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Произошла неизвестная ошибка`)
};

const pt_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ocorreu um erro desconhecido`)
};

const it_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Si è verificato un errore sconosciuto`)
};

const ar_provider_unknown_error = /** @type {(inputs: Provider_Unknown_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حدث خطأ غير معروف`)
};

/**
* | output |
* | --- |
* | "An unknown error occurred" |
*
* @param {Provider_Unknown_ErrorInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_unknown_error = /** @type {((inputs?: Provider_Unknown_ErrorInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Unknown_ErrorInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_unknown_error(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_unknown_error(inputs)
	if (locale === "en") return en_provider_unknown_error(inputs)
	if (locale === "ja") return ja_provider_unknown_error(inputs)
	if (locale === "ko") return ko_provider_unknown_error(inputs)
	if (locale === "fr") return fr_provider_unknown_error(inputs)
	if (locale === "de") return de_provider_unknown_error(inputs)
	if (locale === "es") return es_provider_unknown_error(inputs)
	if (locale === "ru") return ru_provider_unknown_error(inputs)
	if (locale === "pt") return pt_provider_unknown_error(inputs)
	if (locale === "it") return it_provider_unknown_error(inputs)
	return ar_provider_unknown_error(inputs)
});