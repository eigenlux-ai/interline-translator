/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_Glossary_HintInputs */

const zh_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`固定译法`)
};

const zh_tw2_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`固定譯法`)
};

const en_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pinned terms`)
};

const ja_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳語の固定`)
};

const ko_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`고정 번역어`)
};

const fr_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Termes épinglés`)
};

const de_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Feste Begriffe`)
};

const es_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Términos fijados`)
};

const ru_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Закреплённые термины`)
};

const pt_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Termos fixados`)
};

const it_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Termini fissati`)
};

const ar_options_nav_glossary_hint = /** @type {(inputs: Options_Nav_Glossary_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مصطلحات مثبّتة`)
};

/**
* | output |
* | --- |
* | "Pinned terms" |
*
* @param {Options_Nav_Glossary_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_glossary_hint = /** @type {((inputs?: Options_Nav_Glossary_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_Glossary_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_glossary_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_glossary_hint(inputs)
	if (locale === "en") return en_options_nav_glossary_hint(inputs)
	if (locale === "ja") return ja_options_nav_glossary_hint(inputs)
	if (locale === "ko") return ko_options_nav_glossary_hint(inputs)
	if (locale === "fr") return fr_options_nav_glossary_hint(inputs)
	if (locale === "de") return de_options_nav_glossary_hint(inputs)
	if (locale === "es") return es_options_nav_glossary_hint(inputs)
	if (locale === "ru") return ru_options_nav_glossary_hint(inputs)
	if (locale === "pt") return pt_options_nav_glossary_hint(inputs)
	if (locale === "it") return it_options_nav_glossary_hint(inputs)
	return ar_options_nav_glossary_hint(inputs)
});