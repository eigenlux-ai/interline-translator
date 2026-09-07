/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_SearchInputs */

const zh_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`搜索术语或译法…`)
};

const zh_tw2_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`搜尋術語或譯法…`)
};

const en_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Search terms or translations…`)
};

const ja_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語や訳語を検索…`)
};

const ko_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어나 번역어 검색…`)
};

const fr_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rechercher un terme ou une traduction…`)
};

const de_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Begriffe oder Übersetzungen suchen…`)
};

const es_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Buscar términos o traducciones…`)
};

const ru_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Поиск терминов или переводов…`)
};

const pt_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Buscar termos ou traduções…`)
};

const it_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cerca termini o traduzioni…`)
};

const ar_glossary_search = /** @type {(inputs: Glossary_SearchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ابحث عن مصطلح أو ترجمة…`)
};

/**
* | output |
* | --- |
* | "Search terms or translations…" |
*
* @param {Glossary_SearchInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_search = /** @type {((inputs?: Glossary_SearchInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_SearchInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_search(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_search(inputs)
	if (locale === "en") return en_glossary_search(inputs)
	if (locale === "ja") return ja_glossary_search(inputs)
	if (locale === "ko") return ko_glossary_search(inputs)
	if (locale === "fr") return fr_glossary_search(inputs)
	if (locale === "de") return de_glossary_search(inputs)
	if (locale === "es") return es_glossary_search(inputs)
	if (locale === "ru") return ru_glossary_search(inputs)
	if (locale === "pt") return pt_glossary_search(inputs)
	if (locale === "it") return it_glossary_search(inputs)
	return ar_glossary_search(inputs)
});