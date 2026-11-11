/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_FetchingInputs */

const zh_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在获取字幕…`)
};

const zh_tw2_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在取得字幕…`)
};

const en_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fetching subtitles…`)
};

const ja_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕を取得中…`)
};

const ko_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 가져오는 중…`)
};

const fr_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Récupération des sous-titres…`)
};

const de_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untertitel werden geladen…`)
};

const es_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Obteniendo subtítulos…`)
};

const ru_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Загрузка субтитров…`)
};

const pt_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A obter legendas…`)
};

const it_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recupero sottotitoli…`)
};

const ar_video_subtitles_fetching = /** @type {(inputs: Video_Subtitles_FetchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ جلب الترجمة…`)
};

/**
* | output |
* | --- |
* | "Fetching subtitles…" |
*
* @param {Video_Subtitles_FetchingInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_fetching = /** @type {((inputs?: Video_Subtitles_FetchingInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_FetchingInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_fetching(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_fetching(inputs)
	if (locale === "en") return en_video_subtitles_fetching(inputs)
	if (locale === "ja") return ja_video_subtitles_fetching(inputs)
	if (locale === "ko") return ko_video_subtitles_fetching(inputs)
	if (locale === "fr") return fr_video_subtitles_fetching(inputs)
	if (locale === "de") return de_video_subtitles_fetching(inputs)
	if (locale === "es") return es_video_subtitles_fetching(inputs)
	if (locale === "ru") return ru_video_subtitles_fetching(inputs)
	if (locale === "pt") return pt_video_subtitles_fetching(inputs)
	if (locale === "it") return it_video_subtitles_fetching(inputs)
	return ar_video_subtitles_fetching(inputs)
});