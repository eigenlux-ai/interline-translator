/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_LoadingInputs */

const zh_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在翻译字幕…`)
};

const zh_tw2_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在翻譯字幕…`)
};

const en_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translating subtitles…`)
};

const ja_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕を翻訳中…`)
};

const ko_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 번역 중…`)
};

const fr_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction des sous-titres…`)
};

const de_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untertitel werden übersetzt…`)
};

const es_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduciendo subtítulos…`)
};

const ru_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод субтитров…`)
};

const pt_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A traduzir legendas…`)
};

const it_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione sottotitoli…`)
};

const ar_video_subtitles_loading = /** @type {(inputs: Video_Subtitles_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ ترجمة الفيديو…`)
};

/**
* | output |
* | --- |
* | "Translating subtitles…" |
*
* @param {Video_Subtitles_LoadingInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_loading = /** @type {((inputs?: Video_Subtitles_LoadingInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_LoadingInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_loading(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_loading(inputs)
	if (locale === "en") return en_video_subtitles_loading(inputs)
	if (locale === "ja") return ja_video_subtitles_loading(inputs)
	if (locale === "ko") return ko_video_subtitles_loading(inputs)
	if (locale === "fr") return fr_video_subtitles_loading(inputs)
	if (locale === "de") return de_video_subtitles_loading(inputs)
	if (locale === "es") return es_video_subtitles_loading(inputs)
	if (locale === "ru") return ru_video_subtitles_loading(inputs)
	if (locale === "pt") return pt_video_subtitles_loading(inputs)
	if (locale === "it") return it_video_subtitles_loading(inputs)
	return ar_video_subtitles_loading(inputs)
});