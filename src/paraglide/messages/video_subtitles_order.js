/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_OrderInputs */

const zh_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`语言顺序`)
};

const zh_tw2_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`語言順序`)
};

const en_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language order`)
};

const ja_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`言語の順序`)
};

const ko_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`언어 순서`)
};

const fr_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ordre des langues`)
};

const de_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sprachreihenfolge`)
};

const es_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Orden de idiomas`)
};

const ru_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Порядок языков`)
};

const pt_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ordem dos idiomas`)
};

const it_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ordine delle lingue`)
};

const ar_video_subtitles_order = /** @type {(inputs: Video_Subtitles_OrderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترتيب اللغات`)
};

/**
* | output |
* | --- |
* | "Language order" |
*
* @param {Video_Subtitles_OrderInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_order = /** @type {((inputs?: Video_Subtitles_OrderInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_OrderInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_order(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_order(inputs)
	if (locale === "en") return en_video_subtitles_order(inputs)
	if (locale === "ja") return ja_video_subtitles_order(inputs)
	if (locale === "ko") return ko_video_subtitles_order(inputs)
	if (locale === "fr") return fr_video_subtitles_order(inputs)
	if (locale === "de") return de_video_subtitles_order(inputs)
	if (locale === "es") return es_video_subtitles_order(inputs)
	if (locale === "ru") return ru_video_subtitles_order(inputs)
	if (locale === "pt") return pt_video_subtitles_order(inputs)
	if (locale === "it") return it_video_subtitles_order(inputs)
	return ar_video_subtitles_order(inputs)
});