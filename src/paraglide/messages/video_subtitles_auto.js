/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_AutoInputs */

const zh_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`在 YouTube 自动开启`)
};

const zh_tw2_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`在 YouTube 自動開啟`)
};

const en_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start automatically on YouTube`)
};

const ja_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`YouTube で自動開始`)
};

const ko_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`YouTube에서 자동 시작`)
};

const fr_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Démarrer automatiquement sur YouTube`)
};

const de_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Auf YouTube automatisch starten`)
};

const es_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iniciar automáticamente en YouTube`)
};

const ru_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Автозапуск на YouTube`)
};

const pt_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Iniciar automaticamente no YouTube`)
};

const it_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avvia automaticamente su YouTube`)
};

const ar_video_subtitles_auto = /** @type {(inputs: Video_Subtitles_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البدء تلقائيًا على YouTube`)
};

/**
* | output |
* | --- |
* | "Start automatically on YouTube" |
*
* @param {Video_Subtitles_AutoInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_auto = /** @type {((inputs?: Video_Subtitles_AutoInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_AutoInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_auto(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_auto(inputs)
	if (locale === "en") return en_video_subtitles_auto(inputs)
	if (locale === "ja") return ja_video_subtitles_auto(inputs)
	if (locale === "ko") return ko_video_subtitles_auto(inputs)
	if (locale === "fr") return fr_video_subtitles_auto(inputs)
	if (locale === "de") return de_video_subtitles_auto(inputs)
	if (locale === "es") return es_video_subtitles_auto(inputs)
	if (locale === "ru") return ru_video_subtitles_auto(inputs)
	if (locale === "pt") return pt_video_subtitles_auto(inputs)
	if (locale === "it") return it_video_subtitles_auto(inputs)
	return ar_video_subtitles_auto(inputs)
});