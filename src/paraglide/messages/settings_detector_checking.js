/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Detector_CheckingInputs */

const zh_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`检查中…`)
};

const zh_tw2_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`檢查中…`)
};

const en_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Checking…`)
};

const ja_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`確認中…`)
};

const ko_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`확인 중…`)
};

const fr_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérification…`)
};

const de_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wird geprüft…`)
};

const es_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Comprobando…`)
};

const ru_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверка…`)
};

const pt_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verificando…`)
};

const it_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Controllo…`)
};

const ar_settings_detector_checking = /** @type {(inputs: Settings_Detector_CheckingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ التحقق…`)
};

/**
* | output |
* | --- |
* | "Checking…" |
*
* @param {Settings_Detector_CheckingInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_detector_checking = /** @type {((inputs?: Settings_Detector_CheckingInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Detector_CheckingInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_detector_checking(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_detector_checking(inputs)
	if (locale === "en") return en_settings_detector_checking(inputs)
	if (locale === "ja") return ja_settings_detector_checking(inputs)
	if (locale === "ko") return ko_settings_detector_checking(inputs)
	if (locale === "fr") return fr_settings_detector_checking(inputs)
	if (locale === "de") return de_settings_detector_checking(inputs)
	if (locale === "es") return es_settings_detector_checking(inputs)
	if (locale === "ru") return ru_settings_detector_checking(inputs)
	if (locale === "pt") return pt_settings_detector_checking(inputs)
	if (locale === "it") return it_settings_detector_checking(inputs)
	return ar_settings_detector_checking(inputs)
});