/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Pattern_LabelInputs */

const zh_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`站点（可选，空 = 所有站点）`)
};

const zh_tw2_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`站點（可選，空 = 所有站點）`)
};

const en_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Site (optional, empty = everywhere)`)
};

const ja_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サイト（任意、空 = すべて）`)
};

const ko_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사이트(선택, 비우면 전체)`)
};

const fr_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Site (facultatif, vide = partout)`)
};

const de_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Website (optional, leer = überall)`)
};

const es_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sitio (opcional, vacío = todos)`)
};

const ru_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сайт (необяз., пусто = везде)`)
};

const pt_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Site (opcional, vazio = todos)`)
};

const it_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sito (facoltativo, vuoto = ovunque)`)
};

const ar_glossary_pattern_label = /** @type {(inputs: Glossary_Pattern_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الموقع (اختياري، فارغ = الكل)`)
};

/**
* | output |
* | --- |
* | "Site (optional, empty = everywhere)" |
*
* @param {Glossary_Pattern_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_pattern_label = /** @type {((inputs?: Glossary_Pattern_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Pattern_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_pattern_label(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_pattern_label(inputs)
	if (locale === "en") return en_glossary_pattern_label(inputs)
	if (locale === "ja") return ja_glossary_pattern_label(inputs)
	if (locale === "ko") return ko_glossary_pattern_label(inputs)
	if (locale === "fr") return fr_glossary_pattern_label(inputs)
	if (locale === "de") return de_glossary_pattern_label(inputs)
	if (locale === "es") return es_glossary_pattern_label(inputs)
	if (locale === "ru") return ru_glossary_pattern_label(inputs)
	if (locale === "pt") return pt_glossary_pattern_label(inputs)
	if (locale === "it") return it_glossary_pattern_label(inputs)
	return ar_glossary_pattern_label(inputs)
});