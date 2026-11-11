/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_OpacityInputs */

const zh_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`背景不透明度`)
};

const zh_tw2_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`背景不透明度`)
};

const en_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Background opacity`)
};

const ja_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`背景の不透明度`)
};

const ko_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`배경 불투명도`)
};

const fr_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opacité du fond`)
};

const de_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deckkraft des Hintergrunds`)
};

const es_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opacidad del fondo`)
};

const ru_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Непрозрачность фона`)
};

const pt_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opacidade do fundo`)
};

const it_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Opacità dello sfondo`)
};

const ar_video_subtitles_opacity = /** @type {(inputs: Video_Subtitles_OpacityInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عتامة الخلفية`)
};

/**
* | output |
* | --- |
* | "Background opacity" |
*
* @param {Video_Subtitles_OpacityInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_opacity = /** @type {((inputs?: Video_Subtitles_OpacityInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_OpacityInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_opacity(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_opacity(inputs)
	if (locale === "en") return en_video_subtitles_opacity(inputs)
	if (locale === "ja") return ja_video_subtitles_opacity(inputs)
	if (locale === "ko") return ko_video_subtitles_opacity(inputs)
	if (locale === "fr") return fr_video_subtitles_opacity(inputs)
	if (locale === "de") return de_video_subtitles_opacity(inputs)
	if (locale === "es") return es_video_subtitles_opacity(inputs)
	if (locale === "ru") return ru_video_subtitles_opacity(inputs)
	if (locale === "pt") return pt_video_subtitles_opacity(inputs)
	if (locale === "it") return it_video_subtitles_opacity(inputs)
	return ar_video_subtitles_opacity(inputs)
});