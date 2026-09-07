/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_PresetsInputs */

const zh_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`预设术语集（英译简中）`)
};

const zh_tw2_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`預設術語集（英譯簡中）`)
};

const en_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Preset glossaries (English → Simplified Chinese)`)
};

const ja_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`プリセット用語集（英語 → 簡体字中国語）`)
};

const ko_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본 용어집(영어 → 중국어 간체)`)
};

const fr_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossaires prédéfinis (anglais → chinois simplifié)`)
};

const de_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossarvorlagen (Englisch → vereinfachtes Chinesisch)`)
};

const es_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glosarios predefinidos (inglés → chino simplificado)`)
};

const ru_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Готовые глоссарии (английский → упрощённый китайский)`)
};

const pt_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossários predefinidos (inglês → chinês simplificado)`)
};

const it_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossari predefiniti (inglese → cinese semplificato)`)
};

const ar_glossary_presets = /** @type {(inputs: Glossary_PresetsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مسارد جاهزة (من الإنجليزية إلى الصينية المبسطة)`)
};

/**
* | output |
* | --- |
* | "Preset glossaries (English → Simplified Chinese)" |
*
* @param {Glossary_PresetsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_presets = /** @type {((inputs?: Glossary_PresetsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_PresetsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_presets(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_presets(inputs)
	if (locale === "en") return en_glossary_presets(inputs)
	if (locale === "ja") return ja_glossary_presets(inputs)
	if (locale === "ko") return ko_glossary_presets(inputs)
	if (locale === "fr") return fr_glossary_presets(inputs)
	if (locale === "de") return de_glossary_presets(inputs)
	if (locale === "es") return es_glossary_presets(inputs)
	if (locale === "ru") return ru_glossary_presets(inputs)
	if (locale === "pt") return pt_glossary_presets(inputs)
	if (locale === "it") return it_glossary_presets(inputs)
	return ar_glossary_presets(inputs)
});