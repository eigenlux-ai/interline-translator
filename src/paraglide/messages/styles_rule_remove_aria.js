/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Rule_Remove_AriaInputs */

const zh_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`删除该规则`)
};

const zh_tw2_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`刪除該規則`)
};

const en_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove this rule`)
};

const ja_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このルールを削除`)
};

const ko_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 규칙 삭제`)
};

const fr_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer cette règle`)
};

const de_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Diese Regel entfernen`)
};

const es_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Eliminar esta regla`)
};

const ru_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Удалить это правило`)
};

const pt_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remover esta regra`)
};

const it_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rimuovi questa regola`)
};

const ar_styles_rule_remove_aria = /** @type {(inputs: Styles_Rule_Remove_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة هذه القاعدة`)
};

/**
* | output |
* | --- |
* | "Remove this rule" |
*
* @param {Styles_Rule_Remove_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_rule_remove_aria = /** @type {((inputs?: Styles_Rule_Remove_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Rule_Remove_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_rule_remove_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_rule_remove_aria(inputs)
	if (locale === "en") return en_styles_rule_remove_aria(inputs)
	if (locale === "ja") return ja_styles_rule_remove_aria(inputs)
	if (locale === "ko") return ko_styles_rule_remove_aria(inputs)
	if (locale === "fr") return fr_styles_rule_remove_aria(inputs)
	if (locale === "de") return de_styles_rule_remove_aria(inputs)
	if (locale === "es") return es_styles_rule_remove_aria(inputs)
	if (locale === "ru") return ru_styles_rule_remove_aria(inputs)
	if (locale === "pt") return pt_styles_rule_remove_aria(inputs)
	if (locale === "it") return it_styles_rule_remove_aria(inputs)
	return ar_styles_rule_remove_aria(inputs)
});