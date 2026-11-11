/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_DomInputs */

const zh_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在翻译当前字幕`)
};

const zh_tw2_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在翻譯目前字幕`)
};

const en_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translating current captions`)
};

const ja_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`現在の字幕を翻訳中`)
};

const ko_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`현재 자막 번역 중`)
};

const fr_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction des sous-titres actuels`)
};

const de_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aktuelle Untertitel werden übersetzt`)
};

const es_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduciendo subtítulos actuales`)
};

const ru_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод текущих субтитров`)
};

const pt_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A traduzir legendas atuais`)
};

const it_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione sottotitoli attuali`)
};

const ar_video_subtitles_dom = /** @type {(inputs: Video_Subtitles_DomInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ ترجمة النص الحالي`)
};

/**
* | output |
* | --- |
* | "Translating current captions" |
*
* @param {Video_Subtitles_DomInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_dom = /** @type {((inputs?: Video_Subtitles_DomInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_DomInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_dom(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_dom(inputs)
	if (locale === "en") return en_video_subtitles_dom(inputs)
	if (locale === "ja") return ja_video_subtitles_dom(inputs)
	if (locale === "ko") return ko_video_subtitles_dom(inputs)
	if (locale === "fr") return fr_video_subtitles_dom(inputs)
	if (locale === "de") return de_video_subtitles_dom(inputs)
	if (locale === "es") return es_video_subtitles_dom(inputs)
	if (locale === "ru") return ru_video_subtitles_dom(inputs)
	if (locale === "pt") return pt_video_subtitles_dom(inputs)
	if (locale === "it") return it_video_subtitles_dom(inputs)
	return ar_video_subtitles_dom(inputs)
});