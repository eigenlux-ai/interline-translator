/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_BufferingInputs */

const zh_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在准备接下来的译文…`)
};

const zh_tw2_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在準備接下來的譯文…`)
};

const en_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preparing upcoming translations…`)
};

const ja_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`次の字幕を翻訳しています…`)
};

const ko_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`다음 자막을 번역하는 중…`)
};

const fr_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Préparation des prochaines traductions…`)
};

const de_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nächste Übersetzungen werden vorbereitet…`)
};

const es_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preparando las siguientes traducciones…`)
};

const ru_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Подготовка следующих переводов…`)
};

const pt_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preparando as próximas traduções…`)
};

const it_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preparazione delle prossime traduzioni…`)
};

const ar_video_subtitles_buffering = /** @type {(inputs: Video_Subtitles_BufferingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ تحضير الترجمات التالية…`)
};

/**
* | output |
* | --- |
* | "Preparing upcoming translations…" |
*
* @param {Video_Subtitles_BufferingInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_buffering = /** @type {((inputs?: Video_Subtitles_BufferingInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_BufferingInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_buffering(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_buffering(inputs)
	if (locale === "en") return en_video_subtitles_buffering(inputs)
	if (locale === "ja") return ja_video_subtitles_buffering(inputs)
	if (locale === "ko") return ko_video_subtitles_buffering(inputs)
	if (locale === "fr") return fr_video_subtitles_buffering(inputs)
	if (locale === "de") return de_video_subtitles_buffering(inputs)
	if (locale === "es") return es_video_subtitles_buffering(inputs)
	if (locale === "ru") return ru_video_subtitles_buffering(inputs)
	if (locale === "pt") return pt_video_subtitles_buffering(inputs)
	if (locale === "it") return it_video_subtitles_buffering(inputs)
	return ar_video_subtitles_buffering(inputs)
});