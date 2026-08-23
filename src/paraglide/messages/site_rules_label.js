/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Rules_LabelInputs */

const zh_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`按站规则`)
};

const zh_tw2_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`逐站規則`)
};

const en_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per-site rules`)
};

const ja_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サイトごとのルール`)
};

const ko_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사이트별 규칙`)
};

const fr_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Règles par site`)
};

const de_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regeln pro Website`)
};

const es_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reglas por sitio`)
};

const ru_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Правила по сайтам`)
};

const pt_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regras por site`)
};

const it_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regole per sito`)
};

const ar_site_rules_label = /** @type {(inputs: Site_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قواعد لكل موقع`)
};

/**
* | output |
* | --- |
* | "Per-site rules" |
*
* @param {Site_Rules_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_rules_label = /** @type {((inputs?: Site_Rules_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Rules_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_rules_label(inputs)
	if (locale === "zh-TW") return zh_tw2_site_rules_label(inputs)
	if (locale === "en") return en_site_rules_label(inputs)
	if (locale === "ja") return ja_site_rules_label(inputs)
	if (locale === "ko") return ko_site_rules_label(inputs)
	if (locale === "fr") return fr_site_rules_label(inputs)
	if (locale === "de") return de_site_rules_label(inputs)
	if (locale === "es") return es_site_rules_label(inputs)
	if (locale === "ru") return ru_site_rules_label(inputs)
	if (locale === "pt") return pt_site_rules_label(inputs)
	if (locale === "it") return it_site_rules_label(inputs)
	return ar_site_rules_label(inputs)
});