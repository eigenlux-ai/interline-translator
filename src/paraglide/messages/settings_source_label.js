/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Source_LabelInputs */

const zh_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`源语言`)
};

const zh_tw2_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`來源語言`)
};

const en_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source language`)
};

const ja_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`元の言語`)
};

const ko_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`원본 언어`)
};

const fr_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue source`)
};

const de_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ausgangssprache`)
};

const es_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma de origen`)
};

const ru_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Исходный язык`)
};

const pt_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idioma de origem`)
};

const it_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lingua di partenza`)
};

const ar_settings_source_label = /** @type {(inputs: Settings_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لغة المصدر`)
};

/**
* | output |
* | --- |
* | "Source language" |
*
* @param {Settings_Source_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_source_label = /** @type {((inputs?: Settings_Source_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Source_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_source_label(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_source_label(inputs)
	if (locale === "en") return en_settings_source_label(inputs)
	if (locale === "ja") return ja_settings_source_label(inputs)
	if (locale === "ko") return ko_settings_source_label(inputs)
	if (locale === "fr") return fr_settings_source_label(inputs)
	if (locale === "de") return de_settings_source_label(inputs)
	if (locale === "es") return es_settings_source_label(inputs)
	if (locale === "ru") return ru_settings_source_label(inputs)
	if (locale === "pt") return pt_settings_source_label(inputs)
	if (locale === "it") return it_settings_source_label(inputs)
	return ar_settings_source_label(inputs)
});