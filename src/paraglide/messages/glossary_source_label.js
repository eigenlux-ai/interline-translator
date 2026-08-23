/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Source_LabelInputs */

const zh_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`术语`)
};

const zh_tw2_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`術語`)
};

const en_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Term`)
};

const ja_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語`)
};

const ko_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어`)
};

const fr_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terme`)
};

const de_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Begriff`)
};

const es_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Término`)
};

const ru_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Термин`)
};

const pt_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Termo`)
};

const it_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Termine`)
};

const ar_glossary_source_label = /** @type {(inputs: Glossary_Source_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المصطلح`)
};

/**
* | output |
* | --- |
* | "Term" |
*
* @param {Glossary_Source_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_source_label = /** @type {((inputs?: Glossary_Source_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Source_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_source_label(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_source_label(inputs)
	if (locale === "en") return en_glossary_source_label(inputs)
	if (locale === "ja") return ja_glossary_source_label(inputs)
	if (locale === "ko") return ko_glossary_source_label(inputs)
	if (locale === "fr") return fr_glossary_source_label(inputs)
	if (locale === "de") return de_glossary_source_label(inputs)
	if (locale === "es") return es_glossary_source_label(inputs)
	if (locale === "ru") return ru_glossary_source_label(inputs)
	if (locale === "pt") return pt_glossary_source_label(inputs)
	if (locale === "it") return it_glossary_source_label(inputs)
	return ar_glossary_source_label(inputs)
});