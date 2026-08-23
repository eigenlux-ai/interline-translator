/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Name_LabelInputs */

const zh_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`名称`)
};

const zh_tw2_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`名稱`)
};

const en_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const ja_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`名前`)
};

const ko_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이름`)
};

const fr_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom`)
};

const de_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const es_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nombre`)
};

const ru_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Название`)
};

const pt_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nome`)
};

const it_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nome`)
};

const ar_styles_name_label = /** @type {(inputs: Styles_Name_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاسم`)
};

/**
* | output |
* | --- |
* | "Name" |
*
* @param {Styles_Name_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_name_label = /** @type {((inputs?: Styles_Name_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Name_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_name_label(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_name_label(inputs)
	if (locale === "en") return en_styles_name_label(inputs)
	if (locale === "ja") return ja_styles_name_label(inputs)
	if (locale === "ko") return ko_styles_name_label(inputs)
	if (locale === "fr") return fr_styles_name_label(inputs)
	if (locale === "de") return de_styles_name_label(inputs)
	if (locale === "es") return es_styles_name_label(inputs)
	if (locale === "ru") return ru_styles_name_label(inputs)
	if (locale === "pt") return pt_styles_name_label(inputs)
	if (locale === "it") return it_styles_name_label(inputs)
	return ar_styles_name_label(inputs)
});