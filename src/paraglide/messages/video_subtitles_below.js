/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_BelowInputs */

const zh_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译文在原文下方`)
};

const zh_tw2_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯文在原文下方`)
};

const en_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation below original`)
};

const ja_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文を原文の下に`)
};

const ko_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역을 원문 아래에`)
};

const fr_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction en dessous de l’original`)
};

const de_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung unter dem Original`)
};

const es_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción debajo del original`)
};

const ru_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод под оригиналом`)
};

const pt_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução abaixo do original`)
};

const it_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione sotto l’originale`)
};

const ar_video_subtitles_below = /** @type {(inputs: Video_Subtitles_BelowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمة أسفل الأصل`)
};

/**
* | output |
* | --- |
* | "Translation below original" |
*
* @param {Video_Subtitles_BelowInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_below = /** @type {((inputs?: Video_Subtitles_BelowInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_BelowInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_below(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_below(inputs)
	if (locale === "en") return en_video_subtitles_below(inputs)
	if (locale === "ja") return ja_video_subtitles_below(inputs)
	if (locale === "ko") return ko_video_subtitles_below(inputs)
	if (locale === "fr") return fr_video_subtitles_below(inputs)
	if (locale === "de") return de_video_subtitles_below(inputs)
	if (locale === "es") return es_video_subtitles_below(inputs)
	if (locale === "ru") return ru_video_subtitles_below(inputs)
	if (locale === "pt") return pt_video_subtitles_below(inputs)
	if (locale === "it") return it_video_subtitles_below(inputs)
	return ar_video_subtitles_below(inputs)
});