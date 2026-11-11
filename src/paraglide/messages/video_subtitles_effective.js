/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ value: NonNullable<unknown> }} Video_Subtitles_EffectiveInputs */

const zh_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`当前生效：${i?.value}`)
};

const zh_tw2_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`目前生效：${i?.value}`)
};

const en_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Effective: ${i?.value}`)
};

const ja_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`現在の設定：${i?.value}`)
};

const ko_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`적용 중: ${i?.value}`)
};

const fr_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Actif : ${i?.value}`)
};

const de_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Wirksam: ${i?.value}`)
};

const es_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Efectivo: ${i?.value}`)
};

const ru_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Действует: ${i?.value}`)
};

const pt_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Efetivo: ${i?.value}`)
};

const it_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Effettivo: ${i?.value}`)
};

const ar_video_subtitles_effective = /** @type {(inputs: Video_Subtitles_EffectiveInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`الفعلي: ${i?.value}`)
};

/**
* | output |
* | --- |
* | "Effective: {value}" |
*
* @param {Video_Subtitles_EffectiveInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_effective = /** @type {((inputs: Video_Subtitles_EffectiveInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_EffectiveInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_effective(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_effective(inputs)
	if (locale === "en") return en_video_subtitles_effective(inputs)
	if (locale === "ja") return ja_video_subtitles_effective(inputs)
	if (locale === "ko") return ko_video_subtitles_effective(inputs)
	if (locale === "fr") return fr_video_subtitles_effective(inputs)
	if (locale === "de") return de_video_subtitles_effective(inputs)
	if (locale === "es") return es_video_subtitles_effective(inputs)
	if (locale === "ru") return ru_video_subtitles_effective(inputs)
	if (locale === "pt") return pt_video_subtitles_effective(inputs)
	if (locale === "it") return it_video_subtitles_effective(inputs)
	return ar_video_subtitles_effective(inputs)
});