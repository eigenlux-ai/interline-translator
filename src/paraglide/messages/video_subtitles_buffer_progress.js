/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ completed: NonNullable<unknown>, total: NonNullable<unknown> }} Video_Subtitles_Buffer_ProgressInputs */

const zh_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`已翻译 ${i?.completed} / ${i?.total} 条字幕`)
};

const zh_tw2_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`已翻譯 ${i?.completed} / ${i?.total} 條字幕`)
};

const en_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Translated ${i?.completed} / ${i?.total} captions`)
};

const ja_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`翻訳済み ${i?.completed} / ${i?.total} 字幕`)
};

const ko_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`번역 완료 ${i?.completed} / ${i?.total}개 자막`)
};

const fr_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.completed} / ${i?.total} sous-titres traduits`)
};

const de_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.completed} / ${i?.total} Untertitel übersetzt`)
};

const es_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.completed} / ${i?.total} subtítulos traducidos`)
};

const ru_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Переведено ${i?.completed} / ${i?.total} субтитров`)
};

const pt_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.completed} / ${i?.total} legendas traduzidas`)
};

const it_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.completed} / ${i?.total} sottotitoli tradotti`)
};

const ar_video_subtitles_buffer_progress = /** @type {(inputs: Video_Subtitles_Buffer_ProgressInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تمت ترجمة ${i?.completed} / ${i?.total} مقطعًا`)
};

/**
* | output |
* | --- |
* | "Translated {completed} / {total} captions" |
*
* @param {Video_Subtitles_Buffer_ProgressInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_buffer_progress = /** @type {((inputs: Video_Subtitles_Buffer_ProgressInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Buffer_ProgressInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_buffer_progress(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_buffer_progress(inputs)
	if (locale === "en") return en_video_subtitles_buffer_progress(inputs)
	if (locale === "ja") return ja_video_subtitles_buffer_progress(inputs)
	if (locale === "ko") return ko_video_subtitles_buffer_progress(inputs)
	if (locale === "fr") return fr_video_subtitles_buffer_progress(inputs)
	if (locale === "de") return de_video_subtitles_buffer_progress(inputs)
	if (locale === "es") return es_video_subtitles_buffer_progress(inputs)
	if (locale === "ru") return ru_video_subtitles_buffer_progress(inputs)
	if (locale === "pt") return pt_video_subtitles_buffer_progress(inputs)
	if (locale === "it") return it_video_subtitles_buffer_progress(inputs)
	return ar_video_subtitles_buffer_progress(inputs)
});