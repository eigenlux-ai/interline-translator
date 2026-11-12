/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_ClearInputs */

const zh_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`清除字幕译文缓存`)
};

const zh_tw2_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`清除字幕譯文快取`)
};

const en_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clear subtitle translation cache`)
};

const ja_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕翻訳キャッシュを削除`)
};

const ko_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 번역 캐시 삭제`)
};

const fr_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vider le cache des traductions de sous-titres`)
};

const de_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cache für Untertitelübersetzungen löschen`)
};

const es_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Borrar caché de traducciones de subtítulos`)
};

const ru_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Очистить кеш переводов субтитров`)
};

const pt_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Limpar cache de traduções de legendas`)
};

const it_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Svuota la cache delle traduzioni dei sottotitoli`)
};

const ar_video_subtitles_clear = /** @type {(inputs: Video_Subtitles_ClearInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسح ذاكرة التخزين المؤقت لترجمات الفيديو`)
};

/**
* | output |
* | --- |
* | "Clear subtitle translation cache" |
*
* @param {Video_Subtitles_ClearInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_clear = /** @type {((inputs?: Video_Subtitles_ClearInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_ClearInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_clear(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_clear(inputs)
	if (locale === "en") return en_video_subtitles_clear(inputs)
	if (locale === "ja") return ja_video_subtitles_clear(inputs)
	if (locale === "ko") return ko_video_subtitles_clear(inputs)
	if (locale === "fr") return fr_video_subtitles_clear(inputs)
	if (locale === "de") return de_video_subtitles_clear(inputs)
	if (locale === "es") return es_video_subtitles_clear(inputs)
	if (locale === "ru") return ru_video_subtitles_clear(inputs)
	if (locale === "pt") return pt_video_subtitles_clear(inputs)
	if (locale === "it") return it_video_subtitles_clear(inputs)
	return ar_video_subtitles_clear(inputs)
});