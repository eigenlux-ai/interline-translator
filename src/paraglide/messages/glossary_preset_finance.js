/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Preset_FinanceInputs */

const zh_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`金融与商贸（英译简中）`)
};

const zh_tw2_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`金融與商務（英譯簡中）`)
};

const en_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finance & business (English → Simplified Chinese)`)
};

const ja_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`金融・ビジネス（英語 → 簡体字中国語）`)
};

const ko_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`금융·비즈니스(영어 → 중국어 간체)`)
};

const fr_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finance et commerce (anglais → chinois simplifié)`)
};

const de_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finanzen und Wirtschaft (Englisch → vereinfachtes Chinesisch)`)
};

const es_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finanzas y negocios (inglés → chino simplificado)`)
};

const ru_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Финансы и бизнес (английский → упрощённый китайский)`)
};

const pt_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finanças e negócios (inglês → chinês simplificado)`)
};

const it_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Finanza e commercio (inglese → cinese semplificato)`)
};

const ar_glossary_preset_finance = /** @type {(inputs: Glossary_Preset_FinanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المال والأعمال (إلى الصينية المبسطة)`)
};

/**
* | output |
* | --- |
* | "Finance & business (English → Simplified Chinese)" |
*
* @param {Glossary_Preset_FinanceInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_preset_finance = /** @type {((inputs?: Glossary_Preset_FinanceInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Preset_FinanceInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_preset_finance(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_preset_finance(inputs)
	if (locale === "en") return en_glossary_preset_finance(inputs)
	if (locale === "ja") return ja_glossary_preset_finance(inputs)
	if (locale === "ko") return ko_glossary_preset_finance(inputs)
	if (locale === "fr") return fr_glossary_preset_finance(inputs)
	if (locale === "de") return de_glossary_preset_finance(inputs)
	if (locale === "es") return es_glossary_preset_finance(inputs)
	if (locale === "ru") return ru_glossary_preset_finance(inputs)
	if (locale === "pt") return pt_glossary_preset_finance(inputs)
	if (locale === "it") return it_glossary_preset_finance(inputs)
	return ar_glossary_preset_finance(inputs)
});