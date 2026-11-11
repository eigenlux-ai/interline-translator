/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_FontInputs */

const zh_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字号`)
};

const zh_tw2_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字型大小`)
};

const en_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Font size`)
};

const ja_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`文字サイズ`)
};

const ko_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`글자 크기`)
};

const fr_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taille du texte`)
};

const de_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Schriftgröße`)
};

const es_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tamaño de letra`)
};

const ru_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Размер шрифта`)
};

const pt_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tamanho da letra`)
};

const it_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dimensione carattere`)
};

const ar_video_subtitles_font = /** @type {(inputs: Video_Subtitles_FontInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حجم الخط`)
};

/**
* | output |
* | --- |
* | "Font size" |
*
* @param {Video_Subtitles_FontInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_font = /** @type {((inputs?: Video_Subtitles_FontInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_FontInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_font(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_font(inputs)
	if (locale === "en") return en_video_subtitles_font(inputs)
	if (locale === "ja") return ja_video_subtitles_font(inputs)
	if (locale === "ko") return ko_video_subtitles_font(inputs)
	if (locale === "fr") return fr_video_subtitles_font(inputs)
	if (locale === "de") return de_video_subtitles_font(inputs)
	if (locale === "es") return es_video_subtitles_font(inputs)
	if (locale === "ru") return ru_video_subtitles_font(inputs)
	if (locale === "pt") return pt_video_subtitles_font(inputs)
	if (locale === "it") return it_video_subtitles_font(inputs)
	return ar_video_subtitles_font(inputs)
});