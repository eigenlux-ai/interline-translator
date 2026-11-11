/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_CharsInputs */

const zh_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`每批最大字符数`)
};

const zh_tw2_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`每批最大字元數`)
};

const en_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maximum characters per batch`)
};

const ja_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`バッチごとの最大文字数`)
};

const ko_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`일괄 최대 글자 수`)
};

const fr_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Caractères maximum par lot`)
};

const de_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maximale Zeichen pro Stapel`)
};

const es_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Máximo de caracteres por lote`)
};

const ru_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Максимум символов в пакете`)
};

const pt_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Máximo de caracteres por lote`)
};

const it_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Caratteri massimi per gruppo`)
};

const ar_video_subtitles_chars = /** @type {(inputs: Video_Subtitles_CharsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أقصى عدد للأحرف في الدفعة`)
};

/**
* | output |
* | --- |
* | "Maximum characters per batch" |
*
* @param {Video_Subtitles_CharsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_chars = /** @type {((inputs?: Video_Subtitles_CharsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_CharsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_chars(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_chars(inputs)
	if (locale === "en") return en_video_subtitles_chars(inputs)
	if (locale === "ja") return ja_video_subtitles_chars(inputs)
	if (locale === "ko") return ko_video_subtitles_chars(inputs)
	if (locale === "fr") return fr_video_subtitles_chars(inputs)
	if (locale === "de") return de_video_subtitles_chars(inputs)
	if (locale === "es") return es_video_subtitles_chars(inputs)
	if (locale === "ru") return ru_video_subtitles_chars(inputs)
	if (locale === "pt") return pt_video_subtitles_chars(inputs)
	if (locale === "it") return it_video_subtitles_chars(inputs)
	return ar_video_subtitles_chars(inputs)
});