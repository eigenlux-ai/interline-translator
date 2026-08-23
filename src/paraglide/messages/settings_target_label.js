/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Target_LabelInputs */

const zh_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`目标语言`)
};

const zh_tw2_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`目標語言`)
};

const en_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Target language`)
};

const ja_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳先の言語`)
};

const ko_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`대상 언어`)
};

const fr_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue cible`)
};

const de_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zielsprache`)
};

const es_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma de destino`)
};

const ru_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Язык перевода`)
};

const pt_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma de destino`)
};

const it_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lingua di destinazione`)
};

const ar_settings_target_label = /** @type {(inputs: Settings_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة الهدف`)
};

/**
* | output |
* | --- |
* | "Target language" |
*
* @param {Settings_Target_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_target_label = /** @type {((inputs?: Settings_Target_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Target_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_target_label(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_target_label(inputs)
	if (locale === "en") return en_settings_target_label(inputs)
	if (locale === "ja") return ja_settings_target_label(inputs)
	if (locale === "ko") return ko_settings_target_label(inputs)
	if (locale === "fr") return fr_settings_target_label(inputs)
	if (locale === "de") return de_settings_target_label(inputs)
	if (locale === "es") return es_settings_target_label(inputs)
	if (locale === "ru") return ru_settings_target_label(inputs)
	if (locale === "pt") return pt_settings_target_label(inputs)
	if (locale === "it") return it_settings_target_label(inputs)
	return ar_settings_target_label(inputs)
});