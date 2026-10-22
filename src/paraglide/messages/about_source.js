/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_SourceInputs */

const zh_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`源代码`)
};

const zh_tw2_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`原始碼`)
};

const en_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Source code`)
};

const ja_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ソースコード`)
};

const ko_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`소스 코드`)
};

const fr_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Code source`)
};

const de_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quellcode`)
};

const es_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Código fuente`)
};

const ru_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Исходный код`)
};

const pt_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Código-fonte`)
};

const it_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Codice sorgente`)
};

const ar_about_source = /** @type {(inputs: About_SourceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الشيفرة المصدرية`)
};

/**
* | output |
* | --- |
* | "Source code" |
*
* @param {About_SourceInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const about_source = /** @type {((inputs?: About_SourceInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_SourceInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_about_source(inputs)
	if (locale === "zh-TW") return zh_tw2_about_source(inputs)
	if (locale === "en") return en_about_source(inputs)
	if (locale === "ja") return ja_about_source(inputs)
	if (locale === "ko") return ko_about_source(inputs)
	if (locale === "fr") return fr_about_source(inputs)
	if (locale === "de") return de_about_source(inputs)
	if (locale === "es") return es_about_source(inputs)
	if (locale === "ru") return ru_about_source(inputs)
	if (locale === "pt") return pt_about_source(inputs)
	if (locale === "it") return it_about_source(inputs)
	return ar_about_source(inputs)
});