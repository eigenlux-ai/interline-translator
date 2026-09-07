/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_DownloadingInputs */

const zh_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在下载模型…`)
};

const zh_tw2_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`正在下載模型…`)
};

const en_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Downloading the model…`)
};

const ja_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`モデルをダウンロードしています…`)
};

const ko_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모델을 내려받는 중…`)
};

const fr_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Téléchargement du modèle…`)
};

const de_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modell wird heruntergeladen…`)
};

const es_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Descargando el modelo…`)
};

const ru_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Загрузка модели…`)
};

const pt_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Baixando o modelo…`)
};

const it_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download del modello…`)
};

const ar_settings_detector_downloading = /** @type {(inputs: Settings_Detector_DownloadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ تنزيل النموذج…`)
};

/**
* | output |
* | --- |
* | "Downloading the model…" |
*
* @param {Settings_Detector_DownloadingInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_detector_downloading = /** @type {((inputs?: Settings_Detector_DownloadingInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Detector_DownloadingInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_detector_downloading(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_detector_downloading(inputs)
	if (locale === "en") return en_settings_detector_downloading(inputs)
	if (locale === "ja") return ja_settings_detector_downloading(inputs)
	if (locale === "ko") return ko_settings_detector_downloading(inputs)
	if (locale === "fr") return fr_settings_detector_downloading(inputs)
	if (locale === "de") return de_settings_detector_downloading(inputs)
	if (locale === "es") return es_settings_detector_downloading(inputs)
	if (locale === "ru") return ru_settings_detector_downloading(inputs)
	if (locale === "pt") return pt_settings_detector_downloading(inputs)
	if (locale === "it") return it_settings_detector_downloading(inputs)
	return ar_settings_detector_downloading(inputs)
});