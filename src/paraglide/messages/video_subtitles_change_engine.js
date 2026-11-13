/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Change_EngineInputs */

const zh_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`更换引擎`)
};

const zh_tw2_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`更換引擎`)
};

const en_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change engine`)
};

const ja_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`エンジンを変更`)
};

const ko_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`엔진 변경`)
};

const fr_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer de moteur`)
};

const de_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Engine wechseln`)
};

const es_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cambiar de motor`)
};

const ru_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сменить движок`)
};

const pt_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Trocar motor`)
};

const it_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cambia motore`)
};

const ar_video_subtitles_change_engine = /** @type {(inputs: Video_Subtitles_Change_EngineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تغيير المحرك`)
};

/**
* | output |
* | --- |
* | "Change engine" |
*
* @param {Video_Subtitles_Change_EngineInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_change_engine = /** @type {((inputs?: Video_Subtitles_Change_EngineInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Change_EngineInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_change_engine(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_change_engine(inputs)
	if (locale === "en") return en_video_subtitles_change_engine(inputs)
	if (locale === "ja") return ja_video_subtitles_change_engine(inputs)
	if (locale === "ko") return ko_video_subtitles_change_engine(inputs)
	if (locale === "fr") return fr_video_subtitles_change_engine(inputs)
	if (locale === "de") return de_video_subtitles_change_engine(inputs)
	if (locale === "es") return es_video_subtitles_change_engine(inputs)
	if (locale === "ru") return ru_video_subtitles_change_engine(inputs)
	if (locale === "pt") return pt_video_subtitles_change_engine(inputs)
	if (locale === "it") return it_video_subtitles_change_engine(inputs)
	return ar_video_subtitles_change_engine(inputs)
});