/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_RequestsInputs */

const zh_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`请求管理（高级）`)
};

const zh_tw2_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`請求管理（進階）`)
};

const en_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Request management (advanced)`)
};

const ja_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`リクエスト管理（詳細）`)
};

const ko_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`요청 관리 (고급)`)
};

const fr_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gestion des requêtes (avancé)`)
};

const de_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anfrageverwaltung (erweitert)`)
};

const es_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gestión de solicitudes (avanzado)`)
};

const ru_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Управление запросами (дополнительно)`)
};

const pt_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gestão de pedidos (avançado)`)
};

const it_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Gestione richieste (avanzate)`)
};

const ar_video_subtitles_requests = /** @type {(inputs: Video_Subtitles_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إدارة الطلبات (متقدم)`)
};

/**
* | output |
* | --- |
* | "Request management (advanced)" |
*
* @param {Video_Subtitles_RequestsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_requests = /** @type {((inputs?: Video_Subtitles_RequestsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_RequestsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_requests(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_requests(inputs)
	if (locale === "en") return en_video_subtitles_requests(inputs)
	if (locale === "ja") return ja_video_subtitles_requests(inputs)
	if (locale === "ko") return ko_video_subtitles_requests(inputs)
	if (locale === "fr") return fr_video_subtitles_requests(inputs)
	if (locale === "de") return de_video_subtitles_requests(inputs)
	if (locale === "es") return es_video_subtitles_requests(inputs)
	if (locale === "ru") return ru_video_subtitles_requests(inputs)
	if (locale === "pt") return pt_video_subtitles_requests(inputs)
	if (locale === "it") return it_video_subtitles_requests(inputs)
	return ar_video_subtitles_requests(inputs)
});