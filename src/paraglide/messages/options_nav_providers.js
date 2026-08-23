/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_ProvidersInputs */

const zh_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`引擎`)
};

const zh_tw2_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`引擎`)
};

const en_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Engines`)
};

const ja_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`エンジン`)
};

const ko_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`엔진`)
};

const fr_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moteurs`)
};

const de_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Engines`)
};

const es_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motores`)
};

const ru_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Движки`)
};

const pt_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motores`)
};

const it_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motori`)
};

const ar_options_nav_providers = /** @type {(inputs: Options_Nav_ProvidersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المحرّكات`)
};

/**
* | output |
* | --- |
* | "Engines" |
*
* @param {Options_Nav_ProvidersInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_providers = /** @type {((inputs?: Options_Nav_ProvidersInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_ProvidersInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_providers(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_providers(inputs)
	if (locale === "en") return en_options_nav_providers(inputs)
	if (locale === "ja") return ja_options_nav_providers(inputs)
	if (locale === "ko") return ko_options_nav_providers(inputs)
	if (locale === "fr") return fr_options_nav_providers(inputs)
	if (locale === "de") return de_options_nav_providers(inputs)
	if (locale === "es") return es_options_nav_providers(inputs)
	if (locale === "ru") return ru_options_nav_providers(inputs)
	if (locale === "pt") return pt_options_nav_providers(inputs)
	if (locale === "it") return it_options_nav_providers(inputs)
	return ar_options_nav_providers(inputs)
});