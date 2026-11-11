/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Translation_FailedInputs */

const zh_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕翻译失败`)
};

const zh_tw2_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕翻譯失敗`)
};

const en_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subtitle translation failed`)
};

const ja_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕の翻訳に失敗しました`)
};

const ko_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 번역 실패`)
};

const fr_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échec de traduction des sous-titres`)
};

const de_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untertitelübersetzung fehlgeschlagen`)
};

const es_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Error de traducción de subtítulos`)
};

const ru_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ошибка перевода субтитров`)
};

const pt_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Falha na tradução das legendas`)
};

const it_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione sottotitoli non riuscita`)
};

const ar_video_subtitles_translation_failed = /** @type {(inputs: Video_Subtitles_Translation_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فشلت ترجمة الفيديو`)
};

/**
* | output |
* | --- |
* | "Subtitle translation failed" |
*
* @param {Video_Subtitles_Translation_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_translation_failed = /** @type {((inputs?: Video_Subtitles_Translation_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Translation_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_translation_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_translation_failed(inputs)
	if (locale === "en") return en_video_subtitles_translation_failed(inputs)
	if (locale === "ja") return ja_video_subtitles_translation_failed(inputs)
	if (locale === "ko") return ko_video_subtitles_translation_failed(inputs)
	if (locale === "fr") return fr_video_subtitles_translation_failed(inputs)
	if (locale === "de") return de_video_subtitles_translation_failed(inputs)
	if (locale === "es") return es_video_subtitles_translation_failed(inputs)
	if (locale === "ru") return ru_video_subtitles_translation_failed(inputs)
	if (locale === "pt") return pt_video_subtitles_translation_failed(inputs)
	if (locale === "it") return it_video_subtitles_translation_failed(inputs)
	return ar_video_subtitles_translation_failed(inputs)
});