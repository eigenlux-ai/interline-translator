/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_DownloadInputs */

const zh_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`下载模型`)
};

const zh_tw2_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`下載模型`)
};

const en_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download model`)
};

const ja_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`モデルをダウンロード`)
};

const ko_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모델 내려받기`)
};

const fr_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Télécharger le modèle`)
};

const de_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modell herunterladen`)
};

const es_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Descargar el modelo`)
};

const ru_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Загрузить модель`)
};

const pt_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Baixar modelo`)
};

const it_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scarica il modello`)
};

const ar_settings_detector_download = /** @type {(inputs: Settings_Detector_DownloadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تنزيل النموذج`)
};

/**
* | output |
* | --- |
* | "Download model" |
*
* @param {Settings_Detector_DownloadInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_detector_download = /** @type {((inputs?: Settings_Detector_DownloadInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Detector_DownloadInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_detector_download(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_detector_download(inputs)
	if (locale === "en") return en_settings_detector_download(inputs)
	if (locale === "ja") return ja_settings_detector_download(inputs)
	if (locale === "ko") return ko_settings_detector_download(inputs)
	if (locale === "fr") return fr_settings_detector_download(inputs)
	if (locale === "de") return de_settings_detector_download(inputs)
	if (locale === "es") return es_settings_detector_download(inputs)
	if (locale === "ru") return ru_settings_detector_download(inputs)
	if (locale === "pt") return pt_settings_detector_download(inputs)
	if (locale === "it") return it_settings_detector_download(inputs)
	return ar_settings_detector_download(inputs)
});