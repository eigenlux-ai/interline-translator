/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Preview_OriginalInputs */

const zh_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`小小一步，打开新的世界。`)
};

const zh_tw2_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`小小一步，打開新的世界。`)
};

const en_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A small step opens a new world.`)
};

const ja_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`小さな一歩が新しい世界を開く。`)
};

const ko_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`작은 한 걸음이 새로운 세상을 엽니다.`)
};

const fr_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un petit pas ouvre un nouveau monde.`)
};

const de_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ein kleiner Schritt öffnet eine neue Welt.`)
};

const es_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un pequeño paso abre un mundo nuevo.`)
};

const ru_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Маленький шаг открывает новый мир.`)
};

const pt_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Um pequeno passo abre um novo mundo.`)
};

const it_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un piccolo passo apre un nuovo mondo.`)
};

const ar_video_subtitles_preview_original = /** @type {(inputs: Video_Subtitles_Preview_OriginalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطوة صغيرة تفتح عالمًا جديدًا.`)
};

/**
* | output |
* | --- |
* | "A small step opens a new world." |
*
* @param {Video_Subtitles_Preview_OriginalInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_preview_original = /** @type {((inputs?: Video_Subtitles_Preview_OriginalInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Preview_OriginalInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_preview_original(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_preview_original(inputs)
	if (locale === "en") return en_video_subtitles_preview_original(inputs)
	if (locale === "ja") return ja_video_subtitles_preview_original(inputs)
	if (locale === "ko") return ko_video_subtitles_preview_original(inputs)
	if (locale === "fr") return fr_video_subtitles_preview_original(inputs)
	if (locale === "de") return de_video_subtitles_preview_original(inputs)
	if (locale === "es") return es_video_subtitles_preview_original(inputs)
	if (locale === "ru") return ru_video_subtitles_preview_original(inputs)
	if (locale === "pt") return pt_video_subtitles_preview_original(inputs)
	if (locale === "it") return it_video_subtitles_preview_original(inputs)
	return ar_video_subtitles_preview_original(inputs)
});