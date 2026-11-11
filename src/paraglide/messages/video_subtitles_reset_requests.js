/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Reset_RequestsInputs */

const zh_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`重置请求预算`)
};

const zh_tw2_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`重設請求預算`)
};

const en_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reset request budgets`)
};

const ja_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`リクエスト設定をリセット`)
};

const ko_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`요청 설정 초기화`)
};

const fr_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réinitialiser les limites`)
};

const de_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anfragelimits zurücksetzen`)
};

const es_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restablecer límites`)
};

const ru_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сбросить лимиты запросов`)
};

const pt_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Repor limites de pedidos`)
};

const it_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ripristina limiti richieste`)
};

const ar_video_subtitles_reset_requests = /** @type {(inputs: Video_Subtitles_Reset_RequestsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة ضبط حدود الطلبات`)
};

/**
* | output |
* | --- |
* | "Reset request budgets" |
*
* @param {Video_Subtitles_Reset_RequestsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_reset_requests = /** @type {((inputs?: Video_Subtitles_Reset_RequestsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Reset_RequestsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_reset_requests(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_reset_requests(inputs)
	if (locale === "en") return en_video_subtitles_reset_requests(inputs)
	if (locale === "ja") return ja_video_subtitles_reset_requests(inputs)
	if (locale === "ko") return ko_video_subtitles_reset_requests(inputs)
	if (locale === "fr") return fr_video_subtitles_reset_requests(inputs)
	if (locale === "de") return de_video_subtitles_reset_requests(inputs)
	if (locale === "es") return es_video_subtitles_reset_requests(inputs)
	if (locale === "ru") return ru_video_subtitles_reset_requests(inputs)
	if (locale === "pt") return pt_video_subtitles_reset_requests(inputs)
	if (locale === "it") return it_video_subtitles_reset_requests(inputs)
	return ar_video_subtitles_reset_requests(inputs)
});