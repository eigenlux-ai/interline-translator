/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Section_TitleInputs */

const zh_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译引擎`)
};

const zh_tw2_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯引擎`)
};

const en_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation engines`)
};

const ja_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳エンジン`)
};

const ko_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 엔진`)
};

const fr_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moteurs de traduction`)
};

const de_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzungs-Engines`)
};

const es_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motores de traducción`)
};

const ru_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Движки перевода`)
};

const pt_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motores de tradução`)
};

const it_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motori di traduzione`)
};

const ar_provider_section_title = /** @type {(inputs: Provider_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`محرّكات الترجمة`)
};

/**
* | output |
* | --- |
* | "Translation engines" |
*
* @param {Provider_Section_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_section_title = /** @type {((inputs?: Provider_Section_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Section_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_section_title(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_section_title(inputs)
	if (locale === "en") return en_provider_section_title(inputs)
	if (locale === "ja") return ja_provider_section_title(inputs)
	if (locale === "ko") return ko_provider_section_title(inputs)
	if (locale === "fr") return fr_provider_section_title(inputs)
	if (locale === "de") return de_provider_section_title(inputs)
	if (locale === "es") return es_provider_section_title(inputs)
	if (locale === "ru") return ru_provider_section_title(inputs)
	if (locale === "pt") return pt_provider_section_title(inputs)
	if (locale === "it") return it_provider_section_title(inputs)
	return ar_provider_section_title(inputs)
});