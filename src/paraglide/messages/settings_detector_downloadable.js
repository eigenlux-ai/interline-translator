/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_DownloadableInputs */

const zh_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`可下载一个小型设备端模型,实现精确的翻译前跳过`)
};

const zh_tw2_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`可下載一個小型裝置端模型,做到精確的翻譯前略過`)
};

const en_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A small on-device model enables precise pre-translation skipping`)
};

const ja_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`小さな端末内モデルをダウンロードすると、翻訳前に正確にスキップできます`)
};

const ko_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`작은 기기 내 모델을 내려받으면 번역 전에 정확히 건너뛸 수 있습니다`)
};

const fr_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un petit modèle sur l'appareil permet d'ignorer précisément avant la traduction`)
};

const de_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ein kleines Modell auf dem Gerät ermöglicht präzises Überspringen vor dem Übersetzen`)
};

const es_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un pequeño modelo en el dispositivo permite omitir con precisión antes de traducir`)
};

const ru_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Небольшая модель на устройстве позволяет точно пропускать до перевода`)
};

const pt_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Um pequeno modelo no dispositivo permite ignorar com precisão antes de traduzir`)
};

const it_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un piccolo modello sul dispositivo consente di saltare con precisione prima di tradurre`)
};

const ar_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يتيح نموذج صغير على الجهاز تخطّيًا دقيقًا قبل الترجمة`)
};

/**
* | output |
* | --- |
* | "A small on-device model enables precise pre-translation skipping" |
*
* @param {Settings_Detector_DownloadableInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_detector_downloadable = /** @type {((inputs?: Settings_Detector_DownloadableInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Detector_DownloadableInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_detector_downloadable(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_detector_downloadable(inputs)
	if (locale === "en") return en_settings_detector_downloadable(inputs)
	if (locale === "ja") return ja_settings_detector_downloadable(inputs)
	if (locale === "ko") return ko_settings_detector_downloadable(inputs)
	if (locale === "fr") return fr_settings_detector_downloadable(inputs)
	if (locale === "de") return de_settings_detector_downloadable(inputs)
	if (locale === "es") return es_settings_detector_downloadable(inputs)
	if (locale === "ru") return ru_settings_detector_downloadable(inputs)
	if (locale === "pt") return pt_settings_detector_downloadable(inputs)
	if (locale === "it") return it_settings_detector_downloadable(inputs)
	return ar_settings_detector_downloadable(inputs)
});