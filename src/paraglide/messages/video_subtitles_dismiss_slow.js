/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Dismiss_SlowInputs */

const zh_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`暂不处理`)
};

const zh_tw2_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`暫不處理`)
};

const en_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Not now`)
};

const ja_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`今はしない`)
};

const ko_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`나중에`)
};

const fr_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas maintenant`)
};

const de_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jetzt nicht`)
};

const es_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ahora no`)
};

const ru_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не сейчас`)
};

const pt_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Agora não`)
};

const it_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non ora`)
};

const ar_video_subtitles_dismiss_slow = /** @type {(inputs: Video_Subtitles_Dismiss_SlowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ليس الآن`)
};

/**
* | output |
* | --- |
* | "Not now" |
*
* @param {Video_Subtitles_Dismiss_SlowInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_dismiss_slow = /** @type {((inputs?: Video_Subtitles_Dismiss_SlowInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Dismiss_SlowInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_dismiss_slow(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_dismiss_slow(inputs)
	if (locale === "en") return en_video_subtitles_dismiss_slow(inputs)
	if (locale === "ja") return ja_video_subtitles_dismiss_slow(inputs)
	if (locale === "ko") return ko_video_subtitles_dismiss_slow(inputs)
	if (locale === "fr") return fr_video_subtitles_dismiss_slow(inputs)
	if (locale === "de") return de_video_subtitles_dismiss_slow(inputs)
	if (locale === "es") return es_video_subtitles_dismiss_slow(inputs)
	if (locale === "ru") return ru_video_subtitles_dismiss_slow(inputs)
	if (locale === "pt") return pt_video_subtitles_dismiss_slow(inputs)
	if (locale === "it") return it_video_subtitles_dismiss_slow(inputs)
	return ar_video_subtitles_dismiss_slow(inputs)
});