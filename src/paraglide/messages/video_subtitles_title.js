/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_TitleInputs */

const zh_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`视频字幕`)
};

const zh_tw2_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`影片字幕`)
};

const en_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Video subtitles`)
};

const ja_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`動画字幕`)
};

const ko_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`동영상 자막`)
};

const fr_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sous-titres vidéo`)
};

const de_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Videountertitel`)
};

const es_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subtítulos de vídeo`)
};

const ru_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Субтитры видео`)
};

const pt_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Legendas de vídeo`)
};

const it_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sottotitoli video`)
};

const ar_video_subtitles_title = /** @type {(inputs: Video_Subtitles_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة الفيديو`)
};

/**
* | output |
* | --- |
* | "Video subtitles" |
*
* @param {Video_Subtitles_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_title = /** @type {((inputs?: Video_Subtitles_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_title(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_title(inputs)
	if (locale === "en") return en_video_subtitles_title(inputs)
	if (locale === "ja") return ja_video_subtitles_title(inputs)
	if (locale === "ko") return ko_video_subtitles_title(inputs)
	if (locale === "fr") return fr_video_subtitles_title(inputs)
	if (locale === "de") return de_video_subtitles_title(inputs)
	if (locale === "es") return es_video_subtitles_title(inputs)
	if (locale === "ru") return ru_video_subtitles_title(inputs)
	if (locale === "pt") return pt_video_subtitles_title(inputs)
	if (locale === "it") return it_video_subtitles_title(inputs)
	return ar_video_subtitles_title(inputs)
});