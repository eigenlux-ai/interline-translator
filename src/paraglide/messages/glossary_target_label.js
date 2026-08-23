/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Target_LabelInputs */

const zh_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`固定译法`)
};

const zh_tw2_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`固定譯法`)
};

const en_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translation`)
};

const ja_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳語`)
};

const ko_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역어`)
};

const fr_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction`)
};

const de_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung`)
};

const es_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción`)
};

const ru_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевод`)
};

const pt_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução`)
};

const it_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione`)
};

const ar_glossary_target_label = /** @type {(inputs: Glossary_Target_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمة`)
};

/**
* | output |
* | --- |
* | "Translation" |
*
* @param {Glossary_Target_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_target_label = /** @type {((inputs?: Glossary_Target_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Target_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_target_label(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_target_label(inputs)
	if (locale === "en") return en_glossary_target_label(inputs)
	if (locale === "ja") return ja_glossary_target_label(inputs)
	if (locale === "ko") return ko_glossary_target_label(inputs)
	if (locale === "fr") return fr_glossary_target_label(inputs)
	if (locale === "de") return de_glossary_target_label(inputs)
	if (locale === "es") return es_glossary_target_label(inputs)
	if (locale === "ru") return ru_glossary_target_label(inputs)
	if (locale === "pt") return pt_glossary_target_label(inputs)
	if (locale === "it") return it_glossary_target_label(inputs)
	return ar_glossary_target_label(inputs)
});