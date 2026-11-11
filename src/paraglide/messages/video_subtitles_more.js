/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_MoreInputs */

const zh_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`更多字幕设置`)
};

const zh_tw2_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`更多字幕設定`)
};

const en_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`More subtitle settings`)
};

const ja_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕の詳細設定`)
};

const ko_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 추가 설정`)
};

const fr_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Plus de réglages des sous-titres`)
};

const de_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Weitere Untertiteleinstellungen`)
};

const es_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Más ajustes de subtítulos`)
};

const ru_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Другие настройки субтитров`)
};

const pt_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mais definições de legendas`)
};

const it_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Altre impostazioni sottotitoli`)
};

const ar_video_subtitles_more = /** @type {(inputs: Video_Subtitles_MoreInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المزيد من إعدادات الترجمة`)
};

/**
* | output |
* | --- |
* | "More subtitle settings" |
*
* @param {Video_Subtitles_MoreInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_more = /** @type {((inputs?: Video_Subtitles_MoreInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_MoreInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_more(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_more(inputs)
	if (locale === "en") return en_video_subtitles_more(inputs)
	if (locale === "ja") return ja_video_subtitles_more(inputs)
	if (locale === "ko") return ko_video_subtitles_more(inputs)
	if (locale === "fr") return fr_video_subtitles_more(inputs)
	if (locale === "de") return de_video_subtitles_more(inputs)
	if (locale === "es") return es_video_subtitles_more(inputs)
	if (locale === "ru") return ru_video_subtitles_more(inputs)
	if (locale === "pt") return pt_video_subtitles_more(inputs)
	if (locale === "it") return it_video_subtitles_more(inputs)
	return ar_video_subtitles_more(inputs)
});