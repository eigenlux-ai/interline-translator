/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Directives_LabelInputs */

const zh_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`风格指令`)
};

const zh_tw2_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`風格指令`)
};

const en_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Style directives`)
};

const ja_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`スタイル指示`)
};

const ko_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`스타일 지시`)
};

const fr_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Directives de style`)
};

const de_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stilvorgaben`)
};

const es_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Directrices de estilo`)
};

const ru_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Стилевые указания`)
};

const pt_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Diretivas de estilo`)
};

const it_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Direttive di stile`)
};

const ar_styles_directives_label = /** @type {(inputs: Styles_Directives_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التوجيهات الأسلوبية`)
};

/**
* | output |
* | --- |
* | "Style directives" |
*
* @param {Styles_Directives_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_directives_label = /** @type {((inputs?: Styles_Directives_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Directives_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_directives_label(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_directives_label(inputs)
	if (locale === "en") return en_styles_directives_label(inputs)
	if (locale === "ja") return ja_styles_directives_label(inputs)
	if (locale === "ko") return ko_styles_directives_label(inputs)
	if (locale === "fr") return fr_styles_directives_label(inputs)
	if (locale === "de") return de_styles_directives_label(inputs)
	if (locale === "es") return es_styles_directives_label(inputs)
	if (locale === "ru") return ru_styles_directives_label(inputs)
	if (locale === "pt") return pt_styles_directives_label(inputs)
	if (locale === "it") return it_styles_directives_label(inputs)
	return ar_styles_directives_label(inputs)
});