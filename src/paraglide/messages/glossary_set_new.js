/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Set_NewInputs */

const zh_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新建术语集`)
};

const zh_tw2_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新建術語集`)
};

const en_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New set`)
};

const ja_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語集を作成`)
};

const ko_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어집 만들기`)
};

const fr_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau jeu`)
};

const de_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Neues Set`)
};

const es_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nuevo conjunto`)
};

const ru_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Новый набор`)
};

const pt_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Novo conjunto`)
};

const it_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nuovo set`)
};

const ar_glossary_set_new = /** @type {(inputs: Glossary_Set_NewInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مجموعة جديدة`)
};

/**
* | output |
* | --- |
* | "New set" |
*
* @param {Glossary_Set_NewInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_set_new = /** @type {((inputs?: Glossary_Set_NewInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Set_NewInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_set_new(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_set_new(inputs)
	if (locale === "en") return en_glossary_set_new(inputs)
	if (locale === "ja") return ja_glossary_set_new(inputs)
	if (locale === "ko") return ko_glossary_set_new(inputs)
	if (locale === "fr") return fr_glossary_set_new(inputs)
	if (locale === "de") return de_glossary_set_new(inputs)
	if (locale === "es") return es_glossary_set_new(inputs)
	if (locale === "ru") return ru_glossary_set_new(inputs)
	if (locale === "pt") return pt_glossary_set_new(inputs)
	if (locale === "it") return it_glossary_set_new(inputs)
	return ar_glossary_set_new(inputs)
});