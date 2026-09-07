/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_DownloadableInputs */

const zh_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`下载小型本地模型，更准确地识别无需翻译的文本。`)
};

const zh_tw2_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`下載小型本機模型，更準確地辨識不需翻譯的文字。`)
};

const en_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Download a small local model to better identify text that does not need translation.`)
};

const ja_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`小型のローカルモデルをダウンロードすると、翻訳が不要な文章をより正確に判別できます。`)
};

const ko_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`작은 로컬 모델을 다운로드하면 번역이 필요 없는 글을 더 정확하게 식별할 수 있습니다.`)
};

const fr_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Téléchargez un petit modèle local pour mieux repérer les textes qui n’ont pas besoin de traduction.`)
};

const de_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Laden Sie ein kleines lokales Modell herunter, um Texte ohne Übersetzungsbedarf besser zu erkennen.`)
};

const es_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Descarga un pequeño modelo local para identificar mejor el texto que no necesita traducción.`)
};

const ru_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Загрузите небольшую локальную модель, чтобы точнее определять текст, которому не нужен перевод.`)
};

const pt_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Baixe um pequeno modelo local para identificar melhor os textos que não precisam de tradução.`)
};

const it_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scarica un piccolo modello locale per riconoscere meglio i testi che non richiedono traduzione.`)
};

const ar_settings_detector_downloadable = /** @type {(inputs: Settings_Detector_DownloadableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نزّل نموذجًا محليًا صغيرًا للتعرّف بدقة أكبر على النصوص التي لا تحتاج إلى ترجمة.`)
};

/**
* | output |
* | --- |
* | "Download a small local model to better identify text that does not need translation." |
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