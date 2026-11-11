/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_ToggleInputs */

const zh_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`本次播放翻译字幕`)
};

const zh_tw2_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`本次播放翻譯字幕`)
};

const en_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translate subtitles for this playback`)
};

const ja_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`今回の再生で字幕を翻訳`)
};

const ko_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이번 재생에서 자막 번역`)
};

const fr_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduire les sous-titres pour cette lecture`)
};

const de_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untertitel für diese Wiedergabe übersetzen`)
};

const es_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducir subtítulos en esta reproducción`)
};

const ru_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Переводить субтитры при этом просмотре`)
};

const pt_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzir legendas nesta reprodução`)
};

const it_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduci sottotitoli per questa riproduzione`)
};

const ar_video_subtitles_toggle = /** @type {(inputs: Video_Subtitles_ToggleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة الفيديو لهذا التشغيل`)
};

/**
* | output |
* | --- |
* | "Translate subtitles for this playback" |
*
* @param {Video_Subtitles_ToggleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_toggle = /** @type {((inputs?: Video_Subtitles_ToggleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_ToggleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_toggle(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_toggle(inputs)
	if (locale === "en") return en_video_subtitles_toggle(inputs)
	if (locale === "ja") return ja_video_subtitles_toggle(inputs)
	if (locale === "ko") return ko_video_subtitles_toggle(inputs)
	if (locale === "fr") return fr_video_subtitles_toggle(inputs)
	if (locale === "de") return de_video_subtitles_toggle(inputs)
	if (locale === "es") return es_video_subtitles_toggle(inputs)
	if (locale === "ru") return ru_video_subtitles_toggle(inputs)
	if (locale === "pt") return pt_video_subtitles_toggle(inputs)
	if (locale === "it") return it_video_subtitles_toggle(inputs)
	return ar_video_subtitles_toggle(inputs)
});