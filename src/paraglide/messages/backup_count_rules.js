/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Backup_Count_RulesInputs */

const zh_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`网站规则：${i?.count}`)
};

const zh_tw2_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`網站規則：${i?.count}`)
};

const en_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Site rules: ${i?.count}`)
};

const ja_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`サイトルール：${i?.count}`)
};

const ko_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`사이트 규칙: ${i?.count}`)
};

const fr_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Règles de site : ${i?.count}`)
};

const de_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Website-Regeln: ${i?.count}`)
};

const es_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Reglas de sitios: ${i?.count}`)
};

const ru_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Правил сайтов: ${i?.count}`)
};

const pt_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Regras de sites: ${i?.count}`)
};

const it_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Regole dei siti: ${i?.count}`)
};

const ar_backup_count_rules = /** @type {(inputs: Backup_Count_RulesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`قواعد المواقع: ${i?.count}`)
};

/**
* | output |
* | --- |
* | "Site rules: {count}" |
*
* @param {Backup_Count_RulesInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_count_rules = /** @type {((inputs: Backup_Count_RulesInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Count_RulesInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_count_rules(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_count_rules(inputs)
	if (locale === "en") return en_backup_count_rules(inputs)
	if (locale === "ja") return ja_backup_count_rules(inputs)
	if (locale === "ko") return ko_backup_count_rules(inputs)
	if (locale === "fr") return fr_backup_count_rules(inputs)
	if (locale === "de") return de_backup_count_rules(inputs)
	if (locale === "es") return es_backup_count_rules(inputs)
	if (locale === "ru") return ru_backup_count_rules(inputs)
	if (locale === "pt") return pt_backup_count_rules(inputs)
	if (locale === "it") return it_backup_count_rules(inputs)
	return ar_backup_count_rules(inputs)
});