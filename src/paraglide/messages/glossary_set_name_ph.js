/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Set_Name_PhInputs */

const zh_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`例如：AI 术语集、建筑术语集`)
};

const zh_tw2_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`例如：AI 術語集、建築術語集`)
};

const en_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`e.g. AI terms, Architecture terms`)
};

const ja_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`例：AI 用語集、建築用語集`)
};

const ko_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`예: AI 용어집, 건축 용어집`)
};

const fr_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ex. Termes IA, Termes d'architecture`)
};

const de_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`z. B. KI-Begriffe, Architektur-Begriffe`)
};

const es_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`p. ej. Términos de IA, de arquitectura`)
};

const ru_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`напр. Термины ИИ, архитектуры`)
};

const pt_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ex.: Termos de IA, de arquitetura`)
};

const it_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`es. Termini IA, di architettura`)
};

const ar_glossary_set_name_ph = /** @type {(inputs: Glossary_Set_Name_PhInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مثال: مصطلحات الذكاء الاصطناعي، العمارة`)
};

/**
* | output |
* | --- |
* | "e.g. AI terms, Architecture terms" |
*
* @param {Glossary_Set_Name_PhInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_set_name_ph = /** @type {((inputs?: Glossary_Set_Name_PhInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Set_Name_PhInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_set_name_ph(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_set_name_ph(inputs)
	if (locale === "en") return en_glossary_set_name_ph(inputs)
	if (locale === "ja") return ja_glossary_set_name_ph(inputs)
	if (locale === "ko") return ko_glossary_set_name_ph(inputs)
	if (locale === "fr") return fr_glossary_set_name_ph(inputs)
	if (locale === "de") return de_glossary_set_name_ph(inputs)
	if (locale === "es") return es_glossary_set_name_ph(inputs)
	if (locale === "ru") return ru_glossary_set_name_ph(inputs)
	if (locale === "pt") return pt_glossary_set_name_ph(inputs)
	if (locale === "it") return it_glossary_set_name_ph(inputs)
	return ar_glossary_set_name_ph(inputs)
});