/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_EditInputs */

const zh_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`编辑`)
};

const zh_tw2_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`編輯`)
};

const en_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit`)
};

const ja_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`編集`)
};

const ko_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`편집`)
};

const fr_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier`)
};

const de_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bearbeiten`)
};

const es_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Editar`)
};

const ru_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Изменить`)
};

const pt_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Editar`)
};

const it_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifica`)
};

const ar_styles_edit = /** @type {(inputs: Styles_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحرير`)
};

/**
* | output |
* | --- |
* | "Edit" |
*
* @param {Styles_EditInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_edit = /** @type {((inputs?: Styles_EditInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_EditInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_edit(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_edit(inputs)
	if (locale === "en") return en_styles_edit(inputs)
	if (locale === "ja") return ja_styles_edit(inputs)
	if (locale === "ko") return ko_styles_edit(inputs)
	if (locale === "fr") return fr_styles_edit(inputs)
	if (locale === "de") return de_styles_edit(inputs)
	if (locale === "es") return es_styles_edit(inputs)
	if (locale === "ru") return ru_styles_edit(inputs)
	if (locale === "pt") return pt_styles_edit(inputs)
	if (locale === "it") return it_styles_edit(inputs)
	return ar_styles_edit(inputs)
});