/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_PositionInputs */

const zh_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`距底部高度（%）`)
};

const zh_tw2_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`距底部高度（%）`)
};

const en_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Height from bottom (%)`)
};

const ja_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`下端からの高さ（%）`)
};

const ko_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`아래쪽에서 높이 (%)`)
};

const fr_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hauteur depuis le bas (%)`)
};

const de_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Höhe vom unteren Rand (%)`)
};

const es_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Altura desde abajo (%)`)
};

const ru_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Высота от нижнего края (%)`)
};

const pt_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Altura a partir do fundo (%)`)
};

const it_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Altezza dal basso (%)`)
};

const ar_video_subtitles_position = /** @type {(inputs: Video_Subtitles_PositionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الارتفاع من الأسفل (%)`)
};

/**
* | output |
* | --- |
* | "Height from bottom (%)" |
*
* @param {Video_Subtitles_PositionInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_position = /** @type {((inputs?: Video_Subtitles_PositionInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_PositionInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_position(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_position(inputs)
	if (locale === "en") return en_video_subtitles_position(inputs)
	if (locale === "ja") return ja_video_subtitles_position(inputs)
	if (locale === "ko") return ko_video_subtitles_position(inputs)
	if (locale === "fr") return fr_video_subtitles_position(inputs)
	if (locale === "de") return de_video_subtitles_position(inputs)
	if (locale === "es") return es_video_subtitles_position(inputs)
	if (locale === "ru") return ru_video_subtitles_position(inputs)
	if (locale === "pt") return pt_video_subtitles_position(inputs)
	if (locale === "it") return it_video_subtitles_position(inputs)
	return ar_video_subtitles_position(inputs)
});