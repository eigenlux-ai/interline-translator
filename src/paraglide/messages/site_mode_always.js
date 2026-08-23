/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Mode_AlwaysInputs */

const zh_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`总是`)
};

const zh_tw2_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`總是`)
};

const en_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Always`)
};

const ja_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`常に`)
};

const ko_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`항상`)
};

const fr_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toujours`)
};

const de_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Immer`)
};

const es_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Siempre`)
};

const ru_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Всегда`)
};

const pt_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sempre`)
};

const it_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sempre`)
};

const ar_site_mode_always = /** @type {(inputs: Site_Mode_AlwaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`دائمًا`)
};

/**
* | output |
* | --- |
* | "Always" |
*
* @param {Site_Mode_AlwaysInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_mode_always = /** @type {((inputs?: Site_Mode_AlwaysInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Mode_AlwaysInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_mode_always(inputs)
	if (locale === "zh-TW") return zh_tw2_site_mode_always(inputs)
	if (locale === "en") return en_site_mode_always(inputs)
	if (locale === "ja") return ja_site_mode_always(inputs)
	if (locale === "ko") return ko_site_mode_always(inputs)
	if (locale === "fr") return fr_site_mode_always(inputs)
	if (locale === "de") return de_site_mode_always(inputs)
	if (locale === "es") return es_site_mode_always(inputs)
	if (locale === "ru") return ru_site_mode_always(inputs)
	if (locale === "pt") return pt_site_mode_always(inputs)
	if (locale === "it") return it_site_mode_always(inputs)
	return ar_site_mode_always(inputs)
});