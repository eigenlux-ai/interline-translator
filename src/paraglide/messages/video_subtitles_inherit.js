/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_InheritInputs */

const zh_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟随全局设置`)
};

const zh_tw2_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`跟隨全域設定`)
};

const en_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follow global settings`)
};

const ja_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`全体設定に従う`)
};

const ko_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`전체 설정 따르기`)
};

const fr_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Suivre les réglages globaux`)
};

const de_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Globale Einstellungen verwenden`)
};

const es_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seguir ajustes globales`)
};

const ru_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Следовать общим настройкам`)
};

const pt_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seguir definições globais`)
};

const it_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Segui impostazioni globali`)
};

const ar_video_subtitles_inherit = /** @type {(inputs: Video_Subtitles_InheritInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اتباع الإعدادات العامة`)
};

/**
* | output |
* | --- |
* | "Follow global settings" |
*
* @param {Video_Subtitles_InheritInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_inherit = /** @type {((inputs?: Video_Subtitles_InheritInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_InheritInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_inherit(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_inherit(inputs)
	if (locale === "en") return en_video_subtitles_inherit(inputs)
	if (locale === "ja") return ja_video_subtitles_inherit(inputs)
	if (locale === "ko") return ko_video_subtitles_inherit(inputs)
	if (locale === "fr") return fr_video_subtitles_inherit(inputs)
	if (locale === "de") return de_video_subtitles_inherit(inputs)
	if (locale === "es") return es_video_subtitles_inherit(inputs)
	if (locale === "ru") return ru_video_subtitles_inherit(inputs)
	if (locale === "pt") return pt_video_subtitles_inherit(inputs)
	if (locale === "it") return it_video_subtitles_inherit(inputs)
	return ar_video_subtitles_inherit(inputs)
});