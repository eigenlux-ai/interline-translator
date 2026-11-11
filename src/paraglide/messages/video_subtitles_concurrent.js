/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_ConcurrentInputs */

const zh_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`最大并发请求数`)
};

const zh_tw2_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`最大並行請求數`)
};

const en_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maximum simultaneous requests`)
};

const ja_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`最大同時リクエスト数`)
};

const ko_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`최대 동시 요청 수`)
};

const fr_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Requêtes simultanées maximales`)
};

const de_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maximale gleichzeitige Anfragen`)
};

const es_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Máximo de solicitudes simultáneas`)
};

const ru_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Максимум одновременных запросов`)
};

const pt_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Máximo de pedidos simultâneos`)
};

const it_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Richieste simultanee massime`)
};

const ar_video_subtitles_concurrent = /** @type {(inputs: Video_Subtitles_ConcurrentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أقصى عدد للطلبات المتزامنة`)
};

/**
* | output |
* | --- |
* | "Maximum simultaneous requests" |
*
* @param {Video_Subtitles_ConcurrentInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_concurrent = /** @type {((inputs?: Video_Subtitles_ConcurrentInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_ConcurrentInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_concurrent(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_concurrent(inputs)
	if (locale === "en") return en_video_subtitles_concurrent(inputs)
	if (locale === "ja") return ja_video_subtitles_concurrent(inputs)
	if (locale === "ko") return ko_video_subtitles_concurrent(inputs)
	if (locale === "fr") return fr_video_subtitles_concurrent(inputs)
	if (locale === "de") return de_video_subtitles_concurrent(inputs)
	if (locale === "es") return es_video_subtitles_concurrent(inputs)
	if (locale === "ru") return ru_video_subtitles_concurrent(inputs)
	if (locale === "pt") return pt_video_subtitles_concurrent(inputs)
	if (locale === "it") return it_video_subtitles_concurrent(inputs)
	return ar_video_subtitles_concurrent(inputs)
});