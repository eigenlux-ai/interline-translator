/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_PreviewInputs */

const zh_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕预览`)
};

const zh_tw2_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕預覽`)
};

const en_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Subtitle preview`)
};

const ja_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕プレビュー`)
};

const ko_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 미리보기`)
};

const fr_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aperçu des sous-titres`)
};

const de_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untertitelvorschau`)
};

const es_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vista previa de subtítulos`)
};

const ru_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Предпросмотр субтитров`)
};

const pt_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pré-visualização de legendas`)
};

const it_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anteprima sottotitoli`)
};

const ar_video_subtitles_preview = /** @type {(inputs: Video_Subtitles_PreviewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`معاينة الترجمة`)
};

/**
* | output |
* | --- |
* | "Subtitle preview" |
*
* @param {Video_Subtitles_PreviewInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_preview = /** @type {((inputs?: Video_Subtitles_PreviewInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_PreviewInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_preview(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_preview(inputs)
	if (locale === "en") return en_video_subtitles_preview(inputs)
	if (locale === "ja") return ja_video_subtitles_preview(inputs)
	if (locale === "ko") return ko_video_subtitles_preview(inputs)
	if (locale === "fr") return fr_video_subtitles_preview(inputs)
	if (locale === "de") return de_video_subtitles_preview(inputs)
	if (locale === "es") return es_video_subtitles_preview(inputs)
	if (locale === "ru") return ru_video_subtitles_preview(inputs)
	if (locale === "pt") return pt_video_subtitles_preview(inputs)
	if (locale === "it") return it_video_subtitles_preview(inputs)
	return ar_video_subtitles_preview(inputs)
});