/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Site_Add_RuleInputs */

const zh_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`添加规则`)
};

const zh_tw2_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新增規則`)
};

const en_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add rule`)
};

const ja_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ルールを追加`)
};

const ko_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`규칙 추가`)
};

const fr_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une règle`)
};

const de_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regel hinzufügen`)
};

const es_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Añadir regla`)
};

const ru_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Добавить правило`)
};

const pt_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adicionar regra`)
};

const it_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggiungi regola`)
};

const ar_site_add_rule = /** @type {(inputs: Site_Add_RuleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة قاعدة`)
};

/**
* | output |
* | --- |
* | "Add rule" |
*
* @param {Site_Add_RuleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const site_add_rule = /** @type {((inputs?: Site_Add_RuleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Site_Add_RuleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_site_add_rule(inputs)
	if (locale === "zh-TW") return zh_tw2_site_add_rule(inputs)
	if (locale === "en") return en_site_add_rule(inputs)
	if (locale === "ja") return ja_site_add_rule(inputs)
	if (locale === "ko") return ko_site_add_rule(inputs)
	if (locale === "fr") return fr_site_add_rule(inputs)
	if (locale === "de") return de_site_add_rule(inputs)
	if (locale === "es") return es_site_add_rule(inputs)
	if (locale === "ru") return ru_site_add_rule(inputs)
	if (locale === "pt") return pt_site_add_rule(inputs)
	if (locale === "it") return it_site_add_rule(inputs)
	return ar_site_add_rule(inputs)
});