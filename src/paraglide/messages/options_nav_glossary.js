/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_GlossaryInputs */

const zh_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`术语表`)
};

const zh_tw2_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`術語表`)
};

const en_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossary`)
};

const ja_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語集`)
};

const ko_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어집`)
};

const fr_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossaire`)
};

const de_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossar`)
};

const es_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glosario`)
};

const ru_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Глоссарий`)
};

const pt_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossário`)
};

const it_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossario`)
};

const ar_options_nav_glossary = /** @type {(inputs: Options_Nav_GlossaryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المسرد`)
};

/**
* | output |
* | --- |
* | "Glossary" |
*
* @param {Options_Nav_GlossaryInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_glossary = /** @type {((inputs?: Options_Nav_GlossaryInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_GlossaryInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_glossary(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_glossary(inputs)
	if (locale === "en") return en_options_nav_glossary(inputs)
	if (locale === "ja") return ja_options_nav_glossary(inputs)
	if (locale === "ko") return ko_options_nav_glossary(inputs)
	if (locale === "fr") return fr_options_nav_glossary(inputs)
	if (locale === "de") return de_options_nav_glossary(inputs)
	if (locale === "es") return es_options_nav_glossary(inputs)
	if (locale === "ru") return ru_options_nav_glossary(inputs)
	if (locale === "pt") return pt_options_nav_glossary(inputs)
	if (locale === "it") return it_options_nav_glossary(inputs)
	return ar_options_nav_glossary(inputs)
});