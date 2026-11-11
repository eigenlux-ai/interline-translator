/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_RateInputs */

const zh_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`每秒请求数`)
};

const zh_tw2_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`每秒請求數`)
};

const en_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requests per second`)
};

const ja_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`毎秒のリクエスト数`)
};

const ko_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`초당 요청 수`)
};

const fr_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requêtes par seconde`)
};

const de_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anfragen pro Sekunde`)
};

const es_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solicitudes por segundo`)
};

const ru_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Запросов в секунду`)
};

const pt_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pedidos por segundo`)
};

const it_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Richieste al secondo`)
};

const ar_video_subtitles_rate = /** @type {(inputs: Video_Subtitles_RateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`طلبات في الثانية`)
};

/**
* | output |
* | --- |
* | "Requests per second" |
*
* @param {Video_Subtitles_RateInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_rate = /** @type {((inputs?: Video_Subtitles_RateInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_RateInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_rate(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_rate(inputs)
	if (locale === "en") return en_video_subtitles_rate(inputs)
	if (locale === "ja") return ja_video_subtitles_rate(inputs)
	if (locale === "ko") return ko_video_subtitles_rate(inputs)
	if (locale === "fr") return fr_video_subtitles_rate(inputs)
	if (locale === "de") return de_video_subtitles_rate(inputs)
	if (locale === "es") return es_video_subtitles_rate(inputs)
	if (locale === "ru") return ru_video_subtitles_rate(inputs)
	if (locale === "pt") return pt_video_subtitles_rate(inputs)
	if (locale === "it") return it_video_subtitles_rate(inputs)
	return ar_video_subtitles_rate(inputs)
});