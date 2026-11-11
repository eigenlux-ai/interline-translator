/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Pattern_Rule_LabelInputs */

const zh_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`网站匹配规则`)
};

const zh_tw2_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`網站比對規則`)
};

const en_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Site pattern`)
};

const ja_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サイトパターン`)
};

const ko_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사이트 패턴`)
};

const fr_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motif du site`)
};

const de_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Website-Muster`)
};

const es_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Patrón del sitio`)
};

const ru_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Шаблон сайта`)
};

const pt_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Padrão do site`)
};

const it_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pattern del sito`)
};

const ar_pattern_rule_label = /** @type {(inputs: Pattern_Rule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نمط الموقع`)
};

/**
* | output |
* | --- |
* | "Site pattern" |
*
* @param {Pattern_Rule_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const pattern_rule_label = /** @type {((inputs?: Pattern_Rule_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Pattern_Rule_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_pattern_rule_label(inputs)
	if (locale === "zh-TW") return zh_tw2_pattern_rule_label(inputs)
	if (locale === "en") return en_pattern_rule_label(inputs)
	if (locale === "ja") return ja_pattern_rule_label(inputs)
	if (locale === "ko") return ko_pattern_rule_label(inputs)
	if (locale === "fr") return fr_pattern_rule_label(inputs)
	if (locale === "de") return de_pattern_rule_label(inputs)
	if (locale === "es") return es_pattern_rule_label(inputs)
	if (locale === "ru") return ru_pattern_rule_label(inputs)
	if (locale === "pt") return pt_pattern_rule_label(inputs)
	if (locale === "it") return it_pattern_rule_label(inputs)
	return ar_pattern_rule_label(inputs)
});