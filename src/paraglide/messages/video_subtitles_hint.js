/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_HintInputs */

const zh_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`播放 · 翻译`)
};

const zh_tw2_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`播放 · 翻譯`)
};

const en_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Playback · Translation`)
};

const ja_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`再生 · 翻訳`)
};

const ko_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`재생 · 번역`)
};

const fr_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lecture · Traduction`)
};

const de_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wiedergabe · Übersetzung`)
};

const es_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reproducción · Traducción`)
};

const ru_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Просмотр · Перевод`)
};

const pt_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reprodução · Tradução`)
};

const it_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Riproduzione · Traduzione`)
};

const ar_video_subtitles_hint = /** @type {(inputs: Video_Subtitles_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تشغيل · ترجمة`)
};

/**
* | output |
* | --- |
* | "Playback · Translation" |
*
* @param {Video_Subtitles_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_hint = /** @type {((inputs?: Video_Subtitles_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_hint(inputs)
	if (locale === "en") return en_video_subtitles_hint(inputs)
	if (locale === "ja") return ja_video_subtitles_hint(inputs)
	if (locale === "ko") return ko_video_subtitles_hint(inputs)
	if (locale === "fr") return fr_video_subtitles_hint(inputs)
	if (locale === "de") return de_video_subtitles_hint(inputs)
	if (locale === "es") return es_video_subtitles_hint(inputs)
	if (locale === "ru") return ru_video_subtitles_hint(inputs)
	if (locale === "pt") return pt_video_subtitles_hint(inputs)
	if (locale === "it") return it_video_subtitles_hint(inputs)
	return ar_video_subtitles_hint(inputs)
});