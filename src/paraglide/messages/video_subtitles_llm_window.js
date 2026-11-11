/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Llm_WindowInputs */

const zh_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI 翻译预取时长（秒）`)
};

const zh_tw2_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI 翻譯預取時間（秒）`)
};

const en_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI translation look-ahead (seconds)`)
};

const ja_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI 翻訳の先読み（秒）`)
};

const ko_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI 번역 미리 읽기 (초)`)
};

const fr_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anticipation IA (secondes)`)
};

const de_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vorlauf für KI-Übersetzung (Sekunden)`)
};

const es_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anticipación de traducción IA (segundos)`)
};

const ru_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Опережение ИИ-перевода (секунды)`)
};

const pt_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Antecipação de tradução IA (segundos)`)
};

const it_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anticipo traduzione IA (secondi)`)
};

const ar_video_subtitles_llm_window = /** @type {(inputs: Video_Subtitles_Llm_WindowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة الذكاء الاصطناعي المسبقة (ثوانٍ)`)
};

/**
* | output |
* | --- |
* | "AI translation look-ahead (seconds)" |
*
* @param {Video_Subtitles_Llm_WindowInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_llm_window = /** @type {((inputs?: Video_Subtitles_Llm_WindowInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Llm_WindowInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_llm_window(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_llm_window(inputs)
	if (locale === "en") return en_video_subtitles_llm_window(inputs)
	if (locale === "ja") return ja_video_subtitles_llm_window(inputs)
	if (locale === "ko") return ko_video_subtitles_llm_window(inputs)
	if (locale === "fr") return fr_video_subtitles_llm_window(inputs)
	if (locale === "de") return de_video_subtitles_llm_window(inputs)
	if (locale === "es") return es_video_subtitles_llm_window(inputs)
	if (locale === "ru") return ru_video_subtitles_llm_window(inputs)
	if (locale === "pt") return pt_video_subtitles_llm_window(inputs)
	if (locale === "it") return it_video_subtitles_llm_window(inputs)
	return ar_video_subtitles_llm_window(inputs)
});