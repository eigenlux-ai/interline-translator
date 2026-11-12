/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Video_Subtitles_Export_DiagnosticsInputs */

const zh_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导出字幕诊断`)
};

const zh_tw2_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯出字幕診斷`)
};

const en_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export subtitle diagnostics`)
};

const ja_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`字幕の診断情報をエクスポート`)
};

const ko_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자막 진단 내보내기`)
};

const fr_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporter le diagnostic des sous-titres`)
};

const de_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Untertitel-Diagnose exportieren`)
};

const es_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar diagnóstico de subtítulos`)
};

const ru_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспорт диагностики субтитров`)
};

const pt_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar diagnóstico de legendas`)
};

const it_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta diagnostica dei sottotitoli`)
};

const ar_video_subtitles_export_diagnostics = /** @type {(inputs: Video_Subtitles_Export_DiagnosticsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدير تشخيص الترجمة النصية`)
};

/**
* | output |
* | --- |
* | "Export subtitle diagnostics" |
*
* @param {Video_Subtitles_Export_DiagnosticsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const video_subtitles_export_diagnostics = /** @type {((inputs?: Video_Subtitles_Export_DiagnosticsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Video_Subtitles_Export_DiagnosticsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_video_subtitles_export_diagnostics(inputs)
	if (locale === "zh-TW") return zh_tw2_video_subtitles_export_diagnostics(inputs)
	if (locale === "en") return en_video_subtitles_export_diagnostics(inputs)
	if (locale === "ja") return ja_video_subtitles_export_diagnostics(inputs)
	if (locale === "ko") return ko_video_subtitles_export_diagnostics(inputs)
	if (locale === "fr") return fr_video_subtitles_export_diagnostics(inputs)
	if (locale === "de") return de_video_subtitles_export_diagnostics(inputs)
	if (locale === "es") return es_video_subtitles_export_diagnostics(inputs)
	if (locale === "ru") return ru_video_subtitles_export_diagnostics(inputs)
	if (locale === "pt") return pt_video_subtitles_export_diagnostics(inputs)
	if (locale === "it") return it_video_subtitles_export_diagnostics(inputs)
	return ar_video_subtitles_export_diagnostics(inputs)
});