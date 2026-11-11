/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_EnabledInputs */

const zh_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`启用视频字幕`)
};

const zh_tw2_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`啟用影片字幕`)
};

const en_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable video subtitles`)
};

const ja_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`動画字幕を有効化`)
};

const ko_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`동영상 자막 사용`)
};

const fr_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer les sous-titres vidéo`)
};

const de_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Videountertitel aktivieren`)
};

const es_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activar subtítulos de vídeo`)
};

const ru_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включить субтитры видео`)
};

const pt_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ativar legendas de vídeo`)
};

const it_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attiva sottotitoli video`)
};

const ar_video_subtitles_enabled = /** @type {(inputs: Video_Subtitles_EnabledInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تفعيل ترجمة الفيديو`)
};

/**
* | output |
* | --- |
* | "Enable video subtitles" |
*
* @param {Video_Subtitles_EnabledInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_enabled = /** @type {((inputs?: Video_Subtitles_EnabledInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_EnabledInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_enabled(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_enabled(inputs)
	if (locale === "en") return en_video_subtitles_enabled(inputs)
	if (locale === "ja") return ja_video_subtitles_enabled(inputs)
	if (locale === "ko") return ko_video_subtitles_enabled(inputs)
	if (locale === "fr") return fr_video_subtitles_enabled(inputs)
	if (locale === "de") return de_video_subtitles_enabled(inputs)
	if (locale === "es") return es_video_subtitles_enabled(inputs)
	if (locale === "ru") return ru_video_subtitles_enabled(inputs)
	if (locale === "pt") return pt_video_subtitles_enabled(inputs)
	if (locale === "it") return it_video_subtitles_enabled(inputs)
	return ar_video_subtitles_enabled(inputs)
});