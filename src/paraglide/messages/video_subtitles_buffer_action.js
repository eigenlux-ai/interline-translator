/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Buffer_ActionInputs */

const zh_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`暂停并缓冲`)
};

const zh_tw2_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`暫停並緩衝`)
};

const en_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pause and buffer`)
};

const ja_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`一時停止して準備`)
};

const ko_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`일시 정지하고 준비`)
};

const fr_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mettre en pause et préparer`)
};

const de_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pausieren und vorbereiten`)
};

const es_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pausar y preparar`)
};

const ru_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Приостановить и подготовить`)
};

const pt_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pausar e preparar`)
};

const it_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pausa e prepara`)
};

const ar_video_subtitles_buffer_action = /** @type {(inputs: Video_Subtitles_Buffer_ActionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إيقاف مؤقت وتحضير`)
};

/**
* | output |
* | --- |
* | "Pause and buffer" |
*
* @param {Video_Subtitles_Buffer_ActionInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_buffer_action = /** @type {((inputs?: Video_Subtitles_Buffer_ActionInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Buffer_ActionInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_buffer_action(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_buffer_action(inputs)
	if (locale === "en") return en_video_subtitles_buffer_action(inputs)
	if (locale === "ja") return ja_video_subtitles_buffer_action(inputs)
	if (locale === "ko") return ko_video_subtitles_buffer_action(inputs)
	if (locale === "fr") return fr_video_subtitles_buffer_action(inputs)
	if (locale === "de") return de_video_subtitles_buffer_action(inputs)
	if (locale === "es") return es_video_subtitles_buffer_action(inputs)
	if (locale === "ru") return ru_video_subtitles_buffer_action(inputs)
	if (locale === "pt") return pt_video_subtitles_buffer_action(inputs)
	if (locale === "it") return it_video_subtitles_buffer_action(inputs)
	return ar_video_subtitles_buffer_action(inputs)
});