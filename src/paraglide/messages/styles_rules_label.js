/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Rules_LabelInputs */

const zh_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`网站专属翻译风格`)
};

const zh_tw2_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`個別網站翻譯風格`)
};

const en_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Per-site style rules`)
};

const ja_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サイト別スタイル`)
};

const ko_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`사이트별 스타일 규칙`)
};

const fr_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Règles de style par site`)
};

const de_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stilregeln pro Website`)
};

const es_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reglas de estilo por sitio`)
};

const ru_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Правила стиля по сайтам`)
};

const pt_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regras de estilo por site`)
};

const it_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Regole di stile per sito`)
};

const ar_styles_rules_label = /** @type {(inputs: Styles_Rules_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قواعد النمط حسب الموقع`)
};

/**
* | output |
* | --- |
* | "Per-site style rules" |
*
* @param {Styles_Rules_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_rules_label = /** @type {((inputs?: Styles_Rules_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Rules_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_rules_label(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_rules_label(inputs)
	if (locale === "en") return en_styles_rules_label(inputs)
	if (locale === "ja") return ja_styles_rules_label(inputs)
	if (locale === "ko") return ko_styles_rules_label(inputs)
	if (locale === "fr") return fr_styles_rules_label(inputs)
	if (locale === "de") return de_styles_rules_label(inputs)
	if (locale === "es") return es_styles_rules_label(inputs)
	if (locale === "ru") return ru_styles_rules_label(inputs)
	if (locale === "pt") return pt_styles_rules_label(inputs)
	if (locale === "it") return it_styles_rules_label(inputs)
	return ar_styles_rules_label(inputs)
});