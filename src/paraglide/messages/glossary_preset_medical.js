/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Preset_MedicalInputs */

const zh_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`医学与临床（英译简中）`)
};

const zh_tw2_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`醫學與臨床（英譯簡中）`)
};

const en_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Medicine & clinical practice (English → Simplified Chinese)`)
};

const ja_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`医学・臨床（英語 → 簡体字中国語）`)
};

const ko_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`의학·임상(영어 → 중국어 간체)`)
};

const fr_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Médecine clinique (anglais → chinois simplifié)`)
};

const de_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Medizin und Klinik (Englisch → vereinfachtes Chinesisch)`)
};

const es_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Medicina clínica (inglés → chino simplificado)`)
};

const ru_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Медицина и клиника (английский → упрощённый китайский)`)
};

const pt_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Medicina clínica (inglês → chinês simplificado)`)
};

const it_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Medicina clinica (inglese → cinese semplificato)`)
};

const ar_glossary_preset_medical = /** @type {(inputs: Glossary_Preset_MedicalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الطب السريري (إلى الصينية المبسطة)`)
};

/**
* | output |
* | --- |
* | "Medicine & clinical practice (English → Simplified Chinese)" |
*
* @param {Glossary_Preset_MedicalInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_preset_medical = /** @type {((inputs?: Glossary_Preset_MedicalInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Preset_MedicalInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_preset_medical(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_preset_medical(inputs)
	if (locale === "en") return en_glossary_preset_medical(inputs)
	if (locale === "ja") return ja_glossary_preset_medical(inputs)
	if (locale === "ko") return ko_glossary_preset_medical(inputs)
	if (locale === "fr") return fr_glossary_preset_medical(inputs)
	if (locale === "de") return de_glossary_preset_medical(inputs)
	if (locale === "es") return es_glossary_preset_medical(inputs)
	if (locale === "ru") return ru_glossary_preset_medical(inputs)
	if (locale === "pt") return pt_glossary_preset_medical(inputs)
	if (locale === "it") return it_glossary_preset_medical(inputs)
	return ar_glossary_preset_medical(inputs)
});