/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Remove_Rule_AriaInputs */

const zh_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`移除规则`)
};

const zh_tw2_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`移除規則`)
};

const en_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove rule`)
};

const ja_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ルールを削除`)
};

const ko_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`규칙 제거`)
};

const fr_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer la règle`)
};

const de_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regel entfernen`)
};

const es_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quitar la regla`)
};

const ru_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Удалить правило`)
};

const pt_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remover a regra`)
};

const it_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rimuovi la regola`)
};

const ar_site_remove_rule_aria = /** @type {(inputs: Site_Remove_Rule_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة القاعدة`)
};

/**
* | output |
* | --- |
* | "Remove rule" |
*
* @param {Site_Remove_Rule_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_remove_rule_aria = /** @type {((inputs?: Site_Remove_Rule_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Remove_Rule_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_remove_rule_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_site_remove_rule_aria(inputs)
	if (locale === "en") return en_site_remove_rule_aria(inputs)
	if (locale === "ja") return ja_site_remove_rule_aria(inputs)
	if (locale === "ko") return ko_site_remove_rule_aria(inputs)
	if (locale === "fr") return fr_site_remove_rule_aria(inputs)
	if (locale === "de") return de_site_remove_rule_aria(inputs)
	if (locale === "es") return es_site_remove_rule_aria(inputs)
	if (locale === "ru") return ru_site_remove_rule_aria(inputs)
	if (locale === "pt") return pt_site_remove_rule_aria(inputs)
	if (locale === "it") return it_site_remove_rule_aria(inputs)
	return ar_site_remove_rule_aria(inputs)
});