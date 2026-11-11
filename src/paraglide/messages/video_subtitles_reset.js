/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_ResetInputs */

const zh_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`恢复视频字幕设置`)
};

const zh_tw2_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`還原影片字幕設定`)
};

const en_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restore video subtitle settings`)
};

const ja_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`動画字幕設定を初期化`)
};

const ko_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`동영상 자막 설정 초기화`)
};

const fr_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restaurer les réglages des sous-titres`)
};

const de_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untertiteleinstellungen zurücksetzen`)
};

const es_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restaurar ajustes de subtítulos`)
};

const ru_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сбросить настройки субтитров`)
};

const pt_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Repor definições de legendas`)
};

const it_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ripristina impostazioni sottotitoli`)
};

const ar_video_subtitles_reset = /** @type {(inputs: Video_Subtitles_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استعادة إعدادات ترجمة الفيديو`)
};

/**
* | output |
* | --- |
* | "Restore video subtitle settings" |
*
* @param {Video_Subtitles_ResetInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_reset = /** @type {((inputs?: Video_Subtitles_ResetInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_ResetInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_reset(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_reset(inputs)
	if (locale === "en") return en_video_subtitles_reset(inputs)
	if (locale === "ja") return ja_video_subtitles_reset(inputs)
	if (locale === "ko") return ko_video_subtitles_reset(inputs)
	if (locale === "fr") return fr_video_subtitles_reset(inputs)
	if (locale === "de") return de_video_subtitles_reset(inputs)
	if (locale === "es") return es_video_subtitles_reset(inputs)
	if (locale === "ru") return ru_video_subtitles_reset(inputs)
	if (locale === "pt") return pt_video_subtitles_reset(inputs)
	if (locale === "it") return it_video_subtitles_reset(inputs)
	return ar_video_subtitles_reset(inputs)
});