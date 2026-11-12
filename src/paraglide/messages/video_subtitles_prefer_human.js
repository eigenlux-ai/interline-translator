/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Prefer_HumanInputs */

const zh_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`优先使用目标语言人工字幕`)
};

const zh_tw2_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`優先使用目標語言人工字幕`)
};

const en_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prefer human subtitles in the target language`)
};

const ja_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`対象言語の手動字幕を優先`)
};

const ko_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`대상 언어의 수동 자막 우선 사용`)
};

const fr_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Privilégier les sous-titres humains dans la langue cible`)
};

const de_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manuelle Untertitel in der Zielsprache bevorzugen`)
};

const es_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preferir subtítulos humanos en el idioma de destino`)
};

const ru_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Предпочитать ручные субтитры на целевом языке`)
};

const pt_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preferir legendas humanas no idioma de destino`)
};

const it_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preferisci i sottotitoli umani nella lingua di destinazione`)
};

const ar_video_subtitles_prefer_human = /** @type {(inputs: Video_Subtitles_Prefer_HumanInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تفضيل الترجمة البشرية باللغة المستهدفة`)
};

/**
* | output |
* | --- |
* | "Prefer human subtitles in the target language" |
*
* @param {Video_Subtitles_Prefer_HumanInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_prefer_human = /** @type {((inputs?: Video_Subtitles_Prefer_HumanInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Prefer_HumanInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_prefer_human(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_prefer_human(inputs)
	if (locale === "en") return en_video_subtitles_prefer_human(inputs)
	if (locale === "ja") return ja_video_subtitles_prefer_human(inputs)
	if (locale === "ko") return ko_video_subtitles_prefer_human(inputs)
	if (locale === "fr") return fr_video_subtitles_prefer_human(inputs)
	if (locale === "de") return de_video_subtitles_prefer_human(inputs)
	if (locale === "es") return es_video_subtitles_prefer_human(inputs)
	if (locale === "ru") return ru_video_subtitles_prefer_human(inputs)
	if (locale === "pt") return pt_video_subtitles_prefer_human(inputs)
	if (locale === "it") return it_video_subtitles_prefer_human(inputs)
	return ar_video_subtitles_prefer_human(inputs)
});