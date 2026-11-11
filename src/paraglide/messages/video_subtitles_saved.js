/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_SavedInputs */

const zh_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已完成`)
};

const zh_tw2_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已完成`)
};

const en_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Done`)
};

const ja_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`完了`)
};

const ko_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`완료`)
};

const fr_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terminé`)
};

const de_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erledigt`)
};

const es_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hecho`)
};

const ru_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Готово`)
};

const pt_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Concluído`)
};

const it_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fatto`)
};

const ar_video_subtitles_saved = /** @type {(inputs: Video_Subtitles_SavedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم`)
};

/**
* | output |
* | --- |
* | "Done" |
*
* @param {Video_Subtitles_SavedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_saved = /** @type {((inputs?: Video_Subtitles_SavedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_SavedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_saved(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_saved(inputs)
	if (locale === "en") return en_video_subtitles_saved(inputs)
	if (locale === "ja") return ja_video_subtitles_saved(inputs)
	if (locale === "ko") return ko_video_subtitles_saved(inputs)
	if (locale === "fr") return fr_video_subtitles_saved(inputs)
	if (locale === "de") return de_video_subtitles_saved(inputs)
	if (locale === "es") return es_video_subtitles_saved(inputs)
	if (locale === "ru") return ru_video_subtitles_saved(inputs)
	if (locale === "pt") return pt_video_subtitles_saved(inputs)
	if (locale === "it") return it_video_subtitles_saved(inputs)
	return ar_video_subtitles_saved(inputs)
});