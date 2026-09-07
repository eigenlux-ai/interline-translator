/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Preset_TechInputs */

const zh_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`计算机与 AI（英译简中）`)
};

const zh_tw2_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`電腦與 AI（英譯簡中）`)
};

const en_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Computing & AI (English → Simplified Chinese)`)
};

const ja_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`コンピューター・AI（英語 → 簡体字中国語）`)
};

const ko_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`컴퓨터·AI(영어 → 중국어 간체)`)
};

const fr_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Informatique et IA (anglais → chinois simplifié)`)
};

const de_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Informatik und KI (Englisch → vereinfachtes Chinesisch)`)
};

const es_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Informática e IA (inglés → chino simplificado)`)
};

const ru_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ИТ и ИИ (английский → упрощённый китайский)`)
};

const pt_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Computação e IA (inglês → chinês simplificado)`)
};

const it_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Informatica e IA (inglese → cinese semplificato)`)
};

const ar_glossary_preset_tech = /** @type {(inputs: Glossary_Preset_TechInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الحوسبة والذكاء الاصطناعي (إلى الصينية المبسطة)`)
};

/**
* | output |
* | --- |
* | "Computing & AI (English → Simplified Chinese)" |
*
* @param {Glossary_Preset_TechInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_preset_tech = /** @type {((inputs?: Glossary_Preset_TechInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Preset_TechInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_preset_tech(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_preset_tech(inputs)
	if (locale === "en") return en_glossary_preset_tech(inputs)
	if (locale === "ja") return ja_glossary_preset_tech(inputs)
	if (locale === "ko") return ko_glossary_preset_tech(inputs)
	if (locale === "fr") return fr_glossary_preset_tech(inputs)
	if (locale === "de") return de_glossary_preset_tech(inputs)
	if (locale === "es") return es_glossary_preset_tech(inputs)
	if (locale === "ru") return ru_glossary_preset_tech(inputs)
	if (locale === "pt") return pt_glossary_preset_tech(inputs)
	if (locale === "it") return it_glossary_preset_tech(inputs)
	return ar_glossary_preset_tech(inputs)
});