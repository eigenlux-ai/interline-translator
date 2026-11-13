/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_ResumeInputs */

const zh_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`继续播放`)
};

const zh_tw2_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`繼續播放`)
};

const en_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Continue playing`)
};

const ja_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`再生を続ける`)
};

const ko_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`계속 재생`)
};

const fr_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Continuer la lecture`)
};

const de_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wiedergabe fortsetzen`)
};

const es_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seguir reproduciendo`)
};

const ru_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Продолжить воспроизведение`)
};

const pt_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Continuar reprodução`)
};

const it_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Continua riproduzione`)
};

const ar_video_subtitles_resume = /** @type {(inputs: Video_Subtitles_ResumeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`متابعة التشغيل`)
};

/**
* | output |
* | --- |
* | "Continue playing" |
*
* @param {Video_Subtitles_ResumeInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_resume = /** @type {((inputs?: Video_Subtitles_ResumeInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_ResumeInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_resume(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_resume(inputs)
	if (locale === "en") return en_video_subtitles_resume(inputs)
	if (locale === "ja") return ja_video_subtitles_resume(inputs)
	if (locale === "ko") return ko_video_subtitles_resume(inputs)
	if (locale === "fr") return fr_video_subtitles_resume(inputs)
	if (locale === "de") return de_video_subtitles_resume(inputs)
	if (locale === "es") return es_video_subtitles_resume(inputs)
	if (locale === "ru") return ru_video_subtitles_resume(inputs)
	if (locale === "pt") return pt_video_subtitles_resume(inputs)
	if (locale === "it") return it_video_subtitles_resume(inputs)
	return ar_video_subtitles_resume(inputs)
});