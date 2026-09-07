/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expert_Insert_VariableInputs */

const zh_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`插入变量：`)
};

const zh_tw2_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`插入變數：`)
};

const en_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insert variable:`)
};

const ja_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`変数を挿入：`)
};

const ko_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`변수 삽입:`)
};

const fr_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insérer une variable :`)
};

const de_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Variable einfügen:`)
};

const es_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insertar variable:`)
};

const ru_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вставить переменную:`)
};

const pt_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inserir variável:`)
};

const it_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inserisci variabile:`)
};

const ar_expert_insert_variable = /** @type {(inputs: Expert_Insert_VariableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إدراج متغيّر:`)
};

/**
* | output |
* | --- |
* | "Insert variable:" |
*
* @param {Expert_Insert_VariableInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_insert_variable = /** @type {((inputs?: Expert_Insert_VariableInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_Insert_VariableInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_insert_variable(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_insert_variable(inputs)
	if (locale === "en") return en_expert_insert_variable(inputs)
	if (locale === "ja") return ja_expert_insert_variable(inputs)
	if (locale === "ko") return ko_expert_insert_variable(inputs)
	if (locale === "fr") return fr_expert_insert_variable(inputs)
	if (locale === "de") return de_expert_insert_variable(inputs)
	if (locale === "es") return es_expert_insert_variable(inputs)
	if (locale === "ru") return ru_expert_insert_variable(inputs)
	if (locale === "pt") return pt_expert_insert_variable(inputs)
	if (locale === "it") return it_expert_insert_variable(inputs)
	return ar_expert_insert_variable(inputs)
});