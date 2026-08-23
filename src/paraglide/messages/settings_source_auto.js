/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Source_AutoInputs */

const zh_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自动检测`)
};

const zh_tw2_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自動偵測`)
};

const en_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Auto-detect`)
};

const ja_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自動検出`)
};

const ko_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자동 감지`)
};

const fr_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détection automatique`)
};

const de_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Automatisch erkennen`)
};

const es_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Detección automática`)
};

const ru_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Определять автоматически`)
};

const pt_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deteção automática`)
};

const it_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rilevamento automatico`)
};

const ar_settings_source_auto = /** @type {(inputs: Settings_Source_AutoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`كشف تلقائي`)
};

/**
* | output |
* | --- |
* | "Auto-detect" |
*
* @param {Settings_Source_AutoInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_source_auto = /** @type {((inputs?: Settings_Source_AutoInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Source_AutoInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_source_auto(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_source_auto(inputs)
	if (locale === "en") return en_settings_source_auto(inputs)
	if (locale === "ja") return ja_settings_source_auto(inputs)
	if (locale === "ko") return ko_settings_source_auto(inputs)
	if (locale === "fr") return fr_settings_source_auto(inputs)
	if (locale === "de") return de_settings_source_auto(inputs)
	if (locale === "es") return es_settings_source_auto(inputs)
	if (locale === "ru") return ru_settings_source_auto(inputs)
	if (locale === "pt") return pt_settings_source_auto(inputs)
	if (locale === "it") return it_settings_source_auto(inputs)
	return ar_settings_source_auto(inputs)
});