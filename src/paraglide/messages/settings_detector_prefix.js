/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_PrefixInputs */

const zh_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`设备端语言检测:`)
};

const zh_tw2_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`裝置端語言偵測:`)
};

const en_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`On-device language detection:`)
};

const ja_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`端末内の言語検出:`)
};

const ko_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기기 내 언어 감지:`)
};

const fr_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détection de langue sur l'appareil :`)
};

const de_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Spracherkennung auf dem Gerät:`)
};

const es_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Detección de idioma en el dispositivo:`)
};

const ru_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Определение языка на устройстве:`)
};

const pt_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deteção de idioma no dispositivo:`)
};

const it_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rilevamento della lingua sul dispositivo:`)
};

const ar_settings_detector_prefix = /** @type {(inputs: Settings_Detector_PrefixInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كشف اللغة على الجهاز:`)
};

/**
* | output |
* | --- |
* | "On-device language detection:" |
*
* @param {Settings_Detector_PrefixInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_detector_prefix = /** @type {((inputs?: Settings_Detector_PrefixInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Detector_PrefixInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_detector_prefix(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_detector_prefix(inputs)
	if (locale === "en") return en_settings_detector_prefix(inputs)
	if (locale === "ja") return ja_settings_detector_prefix(inputs)
	if (locale === "ko") return ko_settings_detector_prefix(inputs)
	if (locale === "fr") return fr_settings_detector_prefix(inputs)
	if (locale === "de") return de_settings_detector_prefix(inputs)
	if (locale === "es") return es_settings_detector_prefix(inputs)
	if (locale === "ru") return ru_settings_detector_prefix(inputs)
	if (locale === "pt") return pt_settings_detector_prefix(inputs)
	if (locale === "it") return it_settings_detector_prefix(inputs)
	return ar_settings_detector_prefix(inputs)
});