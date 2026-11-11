/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Fetch_FailedInputs */

const zh_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕获取失败`)
};

const zh_tw2_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕取得失敗`)
};

const en_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not fetch subtitles`)
};

const ja_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕を取得できませんでした`)
};

const ko_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막을 가져오지 못했습니다`)
};

const fr_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de récupérer les sous-titres`)
};

const de_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untertitel konnten nicht geladen werden`)
};

const es_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No se pudieron obtener los subtítulos`)
};

const ru_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось получить субтитры`)
};

const pt_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Não foi possível obter legendas`)
};

const it_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossibile recuperare i sottotitoli`)
};

const ar_video_subtitles_fetch_failed = /** @type {(inputs: Video_Subtitles_Fetch_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذر جلب الترجمة`)
};

/**
* | output |
* | --- |
* | "Could not fetch subtitles" |
*
* @param {Video_Subtitles_Fetch_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_fetch_failed = /** @type {((inputs?: Video_Subtitles_Fetch_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Fetch_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_fetch_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_fetch_failed(inputs)
	if (locale === "en") return en_video_subtitles_fetch_failed(inputs)
	if (locale === "ja") return ja_video_subtitles_fetch_failed(inputs)
	if (locale === "ko") return ko_video_subtitles_fetch_failed(inputs)
	if (locale === "fr") return fr_video_subtitles_fetch_failed(inputs)
	if (locale === "de") return de_video_subtitles_fetch_failed(inputs)
	if (locale === "es") return es_video_subtitles_fetch_failed(inputs)
	if (locale === "ru") return ru_video_subtitles_fetch_failed(inputs)
	if (locale === "pt") return pt_video_subtitles_fetch_failed(inputs)
	if (locale === "it") return it_video_subtitles_fetch_failed(inputs)
	return ar_video_subtitles_fetch_failed(inputs)
});