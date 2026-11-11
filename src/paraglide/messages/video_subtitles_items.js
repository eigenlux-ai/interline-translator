/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_ItemsInputs */

const zh_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`每批最大片段数`)
};

const zh_tw2_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`每批最大片段數`)
};

const en_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maximum captions per batch`)
};

const ja_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`バッチごとの最大字幕数`)
};

const ko_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`일괄 최대 자막 수`)
};

const fr_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sous-titres maximum par lot`)
};

const de_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maximale Untertitel pro Stapel`)
};

const es_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Máximo de subtítulos por lote`)
};

const ru_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Максимум субтитров в пакете`)
};

const pt_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Máximo de legendas por lote`)
};

const it_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sottotitoli massimi per gruppo`)
};

const ar_video_subtitles_items = /** @type {(inputs: Video_Subtitles_ItemsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أقصى عدد للمقاطع في الدفعة`)
};

/**
* | output |
* | --- |
* | "Maximum captions per batch" |
*
* @param {Video_Subtitles_ItemsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_items = /** @type {((inputs?: Video_Subtitles_ItemsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_ItemsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_items(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_items(inputs)
	if (locale === "en") return en_video_subtitles_items(inputs)
	if (locale === "ja") return ja_video_subtitles_items(inputs)
	if (locale === "ko") return ko_video_subtitles_items(inputs)
	if (locale === "fr") return fr_video_subtitles_items(inputs)
	if (locale === "de") return de_video_subtitles_items(inputs)
	if (locale === "es") return es_video_subtitles_items(inputs)
	if (locale === "ru") return ru_video_subtitles_items(inputs)
	if (locale === "pt") return pt_video_subtitles_items(inputs)
	if (locale === "it") return it_video_subtitles_items(inputs)
	return ar_video_subtitles_items(inputs)
});