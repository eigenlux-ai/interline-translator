/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Section_TitleInputs */

const zh_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`术语表`)
};

const zh_tw2_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`術語表`)
};

const en_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossary`)
};

const ja_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語集`)
};

const ko_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어집`)
};

const fr_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossaire`)
};

const de_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossar`)
};

const es_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glosario`)
};

const ru_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Глоссарий`)
};

const pt_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossário`)
};

const it_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossario`)
};

const ar_glossary_section_title = /** @type {(inputs: Glossary_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسرد`)
};

/**
* | output |
* | --- |
* | "Glossary" |
*
* @param {Glossary_Section_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_section_title = /** @type {((inputs?: Glossary_Section_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Section_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_section_title(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_section_title(inputs)
	if (locale === "en") return en_glossary_section_title(inputs)
	if (locale === "ja") return ja_glossary_section_title(inputs)
	if (locale === "ko") return ko_glossary_section_title(inputs)
	if (locale === "fr") return fr_glossary_section_title(inputs)
	if (locale === "de") return de_glossary_section_title(inputs)
	if (locale === "es") return es_glossary_section_title(inputs)
	if (locale === "ru") return ru_glossary_section_title(inputs)
	if (locale === "pt") return pt_glossary_section_title(inputs)
	if (locale === "it") return it_glossary_section_title(inputs)
	return ar_glossary_section_title(inputs)
});