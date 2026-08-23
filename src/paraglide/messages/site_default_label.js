/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Default_LabelInputs */

const zh_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`所有站点的默认行为`)
};

const zh_tw2_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`所有網站的預設行為`)
};

const en_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default for all sites`)
};

const ja_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`すべてのサイトの既定動作`)
};

const ko_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모든 사이트의 기본 동작`)
};

const fr_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Par défaut pour tous les sites`)
};

const de_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Standard für alle Websites`)
};

const es_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Por defecto para todos los sitios`)
};

const ru_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По умолчанию для всех сайтов`)
};

const pt_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Padrão para todos os sites`)
};

const it_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Predefinito per tutti i siti`)
};

const ar_site_default_label = /** @type {(inputs: Site_Default_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الافتراضي لجميع المواقع`)
};

/**
* | output |
* | --- |
* | "Default for all sites" |
*
* @param {Site_Default_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_default_label = /** @type {((inputs?: Site_Default_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Default_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_default_label(inputs)
	if (locale === "zh-TW") return zh_tw2_site_default_label(inputs)
	if (locale === "en") return en_site_default_label(inputs)
	if (locale === "ja") return ja_site_default_label(inputs)
	if (locale === "ko") return ko_site_default_label(inputs)
	if (locale === "fr") return fr_site_default_label(inputs)
	if (locale === "de") return de_site_default_label(inputs)
	if (locale === "es") return es_site_default_label(inputs)
	if (locale === "ru") return ru_site_default_label(inputs)
	if (locale === "pt") return pt_site_default_label(inputs)
	if (locale === "it") return it_site_default_label(inputs)
	return ar_site_default_label(inputs)
});