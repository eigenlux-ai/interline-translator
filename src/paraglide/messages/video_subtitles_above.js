/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_AboveInputs */

const zh_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译文在原文上方`)
};

const zh_tw2_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯文在原文上方`)
};

const en_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation above original`)
};

const ja_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文を原文の上に`)
};

const ko_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역을 원문 위에`)
};

const fr_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction au-dessus`)
};

const de_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung über dem Original`)
};

const es_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción encima del original`)
};

const ru_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод над оригиналом`)
};

const pt_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução acima do original`)
};

const it_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione sopra originale`)
};

const ar_video_subtitles_above = /** @type {(inputs: Video_Subtitles_AboveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمة فوق الأصل`)
};

/**
* | output |
* | --- |
* | "Translation above original" |
*
* @param {Video_Subtitles_AboveInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_above = /** @type {((inputs?: Video_Subtitles_AboveInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_AboveInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_above(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_above(inputs)
	if (locale === "en") return en_video_subtitles_above(inputs)
	if (locale === "ja") return ja_video_subtitles_above(inputs)
	if (locale === "ko") return ko_video_subtitles_above(inputs)
	if (locale === "fr") return fr_video_subtitles_above(inputs)
	if (locale === "de") return de_video_subtitles_above(inputs)
	if (locale === "es") return es_video_subtitles_above(inputs)
	if (locale === "ru") return ru_video_subtitles_above(inputs)
	if (locale === "pt") return pt_video_subtitles_above(inputs)
	if (locale === "it") return it_video_subtitles_above(inputs)
	return ar_video_subtitles_above(inputs)
});