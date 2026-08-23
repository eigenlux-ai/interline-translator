/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Mode_NeverInputs */

const zh_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`从不`)
};

const zh_tw2_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`從不`)
};

const en_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Never`)
};

const ja_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`しない`)
};

const ko_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`안 함`)
};

const fr_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jamais`)
};

const de_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nie`)
};

const es_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nunca`)
};

const ru_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Никогда`)
};

const pt_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nunca`)
};

const it_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mai`)
};

const ar_site_mode_never = /** @type {(inputs: Site_Mode_NeverInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أبدًا`)
};

/**
* | output |
* | --- |
* | "Never" |
*
* @param {Site_Mode_NeverInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_mode_never = /** @type {((inputs?: Site_Mode_NeverInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Mode_NeverInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_mode_never(inputs)
	if (locale === "zh-TW") return zh_tw2_site_mode_never(inputs)
	if (locale === "en") return en_site_mode_never(inputs)
	if (locale === "ja") return ja_site_mode_never(inputs)
	if (locale === "ko") return ko_site_mode_never(inputs)
	if (locale === "fr") return fr_site_mode_never(inputs)
	if (locale === "de") return de_site_mode_never(inputs)
	if (locale === "es") return es_site_mode_never(inputs)
	if (locale === "ru") return ru_site_mode_never(inputs)
	if (locale === "pt") return pt_site_mode_never(inputs)
	if (locale === "it") return it_site_mode_never(inputs)
	return ar_site_mode_never(inputs)
});