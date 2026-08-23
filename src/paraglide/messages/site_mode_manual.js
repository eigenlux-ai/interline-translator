/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Mode_ManualInputs */

const zh_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`手动`)
};

const zh_tw2_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`手動`)
};

const en_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manual`)
};

const ja_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`手動`)
};

const ko_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`수동`)
};

const fr_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manuel`)
};

const de_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manuell`)
};

const es_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manual`)
};

const ru_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вручную`)
};

const pt_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manual`)
};

const it_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manuale`)
};

const ar_site_mode_manual = /** @type {(inputs: Site_Mode_ManualInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يدوي`)
};

/**
* | output |
* | --- |
* | "Manual" |
*
* @param {Site_Mode_ManualInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_mode_manual = /** @type {((inputs?: Site_Mode_ManualInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Mode_ManualInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_mode_manual(inputs)
	if (locale === "zh-TW") return zh_tw2_site_mode_manual(inputs)
	if (locale === "en") return en_site_mode_manual(inputs)
	if (locale === "ja") return ja_site_mode_manual(inputs)
	if (locale === "ko") return ko_site_mode_manual(inputs)
	if (locale === "fr") return fr_site_mode_manual(inputs)
	if (locale === "de") return de_site_mode_manual(inputs)
	if (locale === "es") return es_site_mode_manual(inputs)
	if (locale === "ru") return ru_site_mode_manual(inputs)
	if (locale === "pt") return pt_site_mode_manual(inputs)
	if (locale === "it") return it_site_mode_manual(inputs)
	return ar_site_mode_manual(inputs)
});