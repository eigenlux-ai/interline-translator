/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Current_LanguageInputs */

const zh_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`当前字幕语言`)
};

const zh_tw2_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`目前字幕語言`)
};

const en_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Current subtitle language`)
};

const ja_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`現在の字幕言語`)
};

const ko_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`현재 자막 언어`)
};

const fr_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue actuelle des sous-titres`)
};

const de_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aktuelle Untertitelsprache`)
};

const es_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma actual de subtítulos`)
};

const ru_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Текущий язык субтитров`)
};

const pt_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma atual das legendas`)
};

const it_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lingua attuale dei sottotitoli`)
};

const ar_video_subtitles_current_language = /** @type {(inputs: Video_Subtitles_Current_LanguageInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة الترجمة الحالية`)
};

/**
* | output |
* | --- |
* | "Current subtitle language" |
*
* @param {Video_Subtitles_Current_LanguageInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_current_language = /** @type {((inputs?: Video_Subtitles_Current_LanguageInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Current_LanguageInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_current_language(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_current_language(inputs)
	if (locale === "en") return en_video_subtitles_current_language(inputs)
	if (locale === "ja") return ja_video_subtitles_current_language(inputs)
	if (locale === "ko") return ko_video_subtitles_current_language(inputs)
	if (locale === "fr") return fr_video_subtitles_current_language(inputs)
	if (locale === "de") return de_video_subtitles_current_language(inputs)
	if (locale === "es") return es_video_subtitles_current_language(inputs)
	if (locale === "ru") return ru_video_subtitles_current_language(inputs)
	if (locale === "pt") return pt_video_subtitles_current_language(inputs)
	if (locale === "it") return it_video_subtitles_current_language(inputs)
	return ar_video_subtitles_current_language(inputs)
});