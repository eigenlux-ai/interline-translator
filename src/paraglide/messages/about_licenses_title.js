/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_Licenses_TitleInputs */

const zh_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`开源许可证`)
};

const zh_tw2_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`開源授權`)
};

const en_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open-source licenses`)
};

const ja_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`オープンソースライセンス`)
};

const ko_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`오픈 소스 라이선스`)
};

const fr_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Licences open source`)
};

const de_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Open-Source-Lizenzen`)
};

const es_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Licencias de código abierto`)
};

const ru_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Лицензии открытого ПО`)
};

const pt_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Licenças de código aberto`)
};

const it_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Licenze open source`)
};

const ar_about_licenses_title = /** @type {(inputs: About_Licenses_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تراخيص المصادر المفتوحة`)
};

/**
* | output |
* | --- |
* | "Open-source licenses" |
*
* @param {About_Licenses_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const about_licenses_title = /** @type {((inputs?: About_Licenses_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_Licenses_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_about_licenses_title(inputs)
	if (locale === "zh-TW") return zh_tw2_about_licenses_title(inputs)
	if (locale === "en") return en_about_licenses_title(inputs)
	if (locale === "ja") return ja_about_licenses_title(inputs)
	if (locale === "ko") return ko_about_licenses_title(inputs)
	if (locale === "fr") return fr_about_licenses_title(inputs)
	if (locale === "de") return de_about_licenses_title(inputs)
	if (locale === "es") return es_about_licenses_title(inputs)
	if (locale === "ru") return ru_about_licenses_title(inputs)
	if (locale === "pt") return pt_about_licenses_title(inputs)
	if (locale === "it") return it_about_licenses_title(inputs)
	return ar_about_licenses_title(inputs)
});