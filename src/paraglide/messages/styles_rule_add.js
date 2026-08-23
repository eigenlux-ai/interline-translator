/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Rule_AddInputs */

const zh_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`添加规则`)
};

const zh_tw2_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新增規則`)
};

const en_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add rule`)
};

const ja_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ルールを追加`)
};

const ko_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`규칙 추가`)
};

const fr_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une règle`)
};

const de_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regel hinzufügen`)
};

const es_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Añadir regla`)
};

const ru_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Добавить правило`)
};

const pt_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adicionar regra`)
};

const it_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggiungi regola`)
};

const ar_styles_rule_add = /** @type {(inputs: Styles_Rule_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة قاعدة`)
};

/**
* | output |
* | --- |
* | "Add rule" |
*
* @param {Styles_Rule_AddInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_rule_add = /** @type {((inputs?: Styles_Rule_AddInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Rule_AddInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_rule_add(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_rule_add(inputs)
	if (locale === "en") return en_styles_rule_add(inputs)
	if (locale === "ja") return ja_styles_rule_add(inputs)
	if (locale === "ko") return ko_styles_rule_add(inputs)
	if (locale === "fr") return fr_styles_rule_add(inputs)
	if (locale === "de") return de_styles_rule_add(inputs)
	if (locale === "es") return es_styles_rule_add(inputs)
	if (locale === "ru") return ru_styles_rule_add(inputs)
	if (locale === "pt") return pt_styles_rule_add(inputs)
	if (locale === "it") return it_styles_rule_add(inputs)
	return ar_styles_rule_add(inputs)
});