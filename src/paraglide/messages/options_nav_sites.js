/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_SitesInputs */

const zh_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`站点`)
};

const zh_tw2_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`網站`)
};

const en_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sites`)
};

const ja_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サイト`)
};

const ko_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사이트`)
};

const fr_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sites`)
};

const de_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Websites`)
};

const es_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sitios`)
};

const ru_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сайты`)
};

const pt_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sites`)
};

const it_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Siti`)
};

const ar_options_nav_sites = /** @type {(inputs: Options_Nav_SitesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المواقع`)
};

/**
* | output |
* | --- |
* | "Sites" |
*
* @param {Options_Nav_SitesInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_sites = /** @type {((inputs?: Options_Nav_SitesInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_SitesInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_sites(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_sites(inputs)
	if (locale === "en") return en_options_nav_sites(inputs)
	if (locale === "ja") return ja_options_nav_sites(inputs)
	if (locale === "ko") return ko_options_nav_sites(inputs)
	if (locale === "fr") return fr_options_nav_sites(inputs)
	if (locale === "de") return de_options_nav_sites(inputs)
	if (locale === "es") return es_options_nav_sites(inputs)
	if (locale === "ru") return ru_options_nav_sites(inputs)
	if (locale === "pt") return pt_options_nav_sites(inputs)
	if (locale === "it") return it_options_nav_sites(inputs)
	return ar_options_nav_sites(inputs)
});