/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Preview_TranslationInputs */

const zh_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`迈出一小步，发现全新的世界。`)
};

const zh_tw2_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`邁出一小步，發現全新的世界。`)
};

const en_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One small step reveals a whole new world.`)
};

const ja_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`一歩踏み出すと、新しい世界が見える。`)
};

const ko_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`한 걸음을 내딛으면 새로운 세상이 보입니다.`)
};

const fr_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un simple pas révèle tout un monde.`)
};

const de_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ein einziger Schritt zeigt eine ganz neue Welt.`)
};

const es_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un solo paso revela un mundo nuevo.`)
};

const ru_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Один шаг позволяет увидеть целый мир.`)
};

const pt_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Um só passo revela todo um novo mundo.`)
};

const it_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un solo passo rivela un mondo nuovo.`)
};

const ar_video_subtitles_preview_translation = /** @type {(inputs: Video_Subtitles_Preview_TranslationInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خطوة واحدة تكشف عالمًا جديدًا بالكامل.`)
};

/**
* | output |
* | --- |
* | "One small step reveals a whole new world." |
*
* @param {Video_Subtitles_Preview_TranslationInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_preview_translation = /** @type {((inputs?: Video_Subtitles_Preview_TranslationInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Preview_TranslationInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_preview_translation(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_preview_translation(inputs)
	if (locale === "en") return en_video_subtitles_preview_translation(inputs)
	if (locale === "ja") return ja_video_subtitles_preview_translation(inputs)
	if (locale === "ko") return ko_video_subtitles_preview_translation(inputs)
	if (locale === "fr") return fr_video_subtitles_preview_translation(inputs)
	if (locale === "de") return de_video_subtitles_preview_translation(inputs)
	if (locale === "es") return es_video_subtitles_preview_translation(inputs)
	if (locale === "ru") return ru_video_subtitles_preview_translation(inputs)
	if (locale === "pt") return pt_video_subtitles_preview_translation(inputs)
	if (locale === "it") return it_video_subtitles_preview_translation(inputs)
	return ar_video_subtitles_preview_translation(inputs)
});