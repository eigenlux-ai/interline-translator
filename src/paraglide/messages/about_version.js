/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_VersionInputs */

const zh_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`版本`)
};

const zh_tw2_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`版本`)
};

const en_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Version`)
};

const ja_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`バージョン`)
};

const ko_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`버전`)
};

const fr_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Version`)
};

const de_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Version`)
};

const es_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versión`)
};

const ru_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Версия`)
};

const pt_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versão`)
};

const it_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versione`)
};

const ar_about_version = /** @type {(inputs: About_VersionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الإصدار`)
};

/**
* | output |
* | --- |
* | "Version" |
*
* @param {About_VersionInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const about_version = /** @type {((inputs?: About_VersionInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_VersionInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_about_version(inputs)
	if (locale === "zh-TW") return zh_tw2_about_version(inputs)
	if (locale === "en") return en_about_version(inputs)
	if (locale === "ja") return ja_about_version(inputs)
	if (locale === "ko") return ko_about_version(inputs)
	if (locale === "fr") return fr_about_version(inputs)
	if (locale === "de") return de_about_version(inputs)
	if (locale === "es") return es_about_version(inputs)
	if (locale === "ru") return ru_about_version(inputs)
	if (locale === "pt") return pt_about_version(inputs)
	if (locale === "it") return it_about_version(inputs)
	return ar_about_version(inputs)
});