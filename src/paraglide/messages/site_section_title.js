/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Section_TitleInputs */

const zh_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`站点控制`)
};

const zh_tw2_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`網站控制`)
};

const en_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Site control`)
};

const ja_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サイトの制御`)
};

const ko_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사이트 제어`)
};

const fr_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Contrôle des sites`)
};

const de_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Website-Steuerung`)
};

const es_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Control de sitios`)
};

const ru_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Управление сайтами`)
};

const pt_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Controlo de sites`)
};

const it_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Controllo dei siti`)
};

const ar_site_section_title = /** @type {(inputs: Site_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التحكم في المواقع`)
};

/**
* | output |
* | --- |
* | "Site control" |
*
* @param {Site_Section_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_section_title = /** @type {((inputs?: Site_Section_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Section_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_section_title(inputs)
	if (locale === "zh-TW") return zh_tw2_site_section_title(inputs)
	if (locale === "en") return en_site_section_title(inputs)
	if (locale === "ja") return ja_site_section_title(inputs)
	if (locale === "ko") return ko_site_section_title(inputs)
	if (locale === "fr") return fr_site_section_title(inputs)
	if (locale === "de") return de_site_section_title(inputs)
	if (locale === "es") return es_site_section_title(inputs)
	if (locale === "ru") return ru_site_section_title(inputs)
	if (locale === "pt") return pt_site_section_title(inputs)
	if (locale === "it") return it_site_section_title(inputs)
	return ar_site_section_title(inputs)
});