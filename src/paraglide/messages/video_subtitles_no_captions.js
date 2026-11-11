/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_No_CaptionsInputs */

const zh_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`没有可用字幕`)
};

const zh_tw2_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`沒有可用字幕`)
};

const en_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No subtitles available`)
};

const ja_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕がありません`)
};

const ko_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사용 가능한 자막 없음`)
};

const fr_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun sous-titre disponible`)
};

const de_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keine Untertitel verfügbar`)
};

const es_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No hay subtítulos disponibles`)
};

const ru_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Субтитры недоступны`)
};

const pt_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sem legendas disponíveis`)
};

const it_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nessun sottotitolo disponibile`)
};

const ar_video_subtitles_no_captions = /** @type {(inputs: Video_Subtitles_No_CaptionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا تتوفر ترجمة`)
};

/**
* | output |
* | --- |
* | "No subtitles available" |
*
* @param {Video_Subtitles_No_CaptionsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_no_captions = /** @type {((inputs?: Video_Subtitles_No_CaptionsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_No_CaptionsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_no_captions(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_no_captions(inputs)
	if (locale === "en") return en_video_subtitles_no_captions(inputs)
	if (locale === "ja") return ja_video_subtitles_no_captions(inputs)
	if (locale === "ko") return ko_video_subtitles_no_captions(inputs)
	if (locale === "fr") return fr_video_subtitles_no_captions(inputs)
	if (locale === "de") return de_video_subtitles_no_captions(inputs)
	if (locale === "es") return es_video_subtitles_no_captions(inputs)
	if (locale === "ru") return ru_video_subtitles_no_captions(inputs)
	if (locale === "pt") return pt_video_subtitles_no_captions(inputs)
	if (locale === "it") return it_video_subtitles_no_captions(inputs)
	return ar_video_subtitles_no_captions(inputs)
});