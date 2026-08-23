/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Set_Name_LabelInputs */

const zh_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`集合名称`)
};

const zh_tw2_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`集合名稱`)
};

const en_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set name`)
};

const ja_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語集名`)
};

const ko_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어집 이름`)
};

const fr_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom du jeu`)
};

const de_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set-Name`)
};

const es_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nombre del conjunto`)
};

const ru_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Название набора`)
};

const pt_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nome do conjunto`)
};

const it_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nome del set`)
};

const ar_glossary_set_name_label = /** @type {(inputs: Glossary_Set_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اسم المجموعة`)
};

/**
* | output |
* | --- |
* | "Set name" |
*
* @param {Glossary_Set_Name_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_set_name_label = /** @type {((inputs?: Glossary_Set_Name_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Set_Name_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_set_name_label(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_set_name_label(inputs)
	if (locale === "en") return en_glossary_set_name_label(inputs)
	if (locale === "ja") return ja_glossary_set_name_label(inputs)
	if (locale === "ko") return ko_glossary_set_name_label(inputs)
	if (locale === "fr") return fr_glossary_set_name_label(inputs)
	if (locale === "de") return de_glossary_set_name_label(inputs)
	if (locale === "es") return es_glossary_set_name_label(inputs)
	if (locale === "ru") return ru_glossary_set_name_label(inputs)
	if (locale === "pt") return pt_glossary_set_name_label(inputs)
	if (locale === "it") return it_glossary_set_name_label(inputs)
	return ar_glossary_set_name_label(inputs)
});