/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_AddInputs */

const zh_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`添加术语`)
};

const zh_tw2_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新增術語`)
};

const en_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add term`)
};

const ja_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語を追加`)
};

const ko_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어 추가`)
};

const fr_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter un terme`)
};

const de_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Begriff hinzufügen`)
};

const es_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Añadir término`)
};

const ru_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Добавить термин`)
};

const pt_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adicionar termo`)
};

const it_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggiungi termine`)
};

const ar_glossary_add = /** @type {(inputs: Glossary_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة مصطلح`)
};

/**
* | output |
* | --- |
* | "Add term" |
*
* @param {Glossary_AddInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_add = /** @type {((inputs?: Glossary_AddInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_AddInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_add(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_add(inputs)
	if (locale === "en") return en_glossary_add(inputs)
	if (locale === "ja") return ja_glossary_add(inputs)
	if (locale === "ko") return ko_glossary_add(inputs)
	if (locale === "fr") return fr_glossary_add(inputs)
	if (locale === "de") return de_glossary_add(inputs)
	if (locale === "es") return es_glossary_add(inputs)
	if (locale === "ru") return ru_glossary_add(inputs)
	if (locale === "pt") return pt_glossary_add(inputs)
	if (locale === "it") return it_glossary_add(inputs)
	return ar_glossary_add(inputs)
});