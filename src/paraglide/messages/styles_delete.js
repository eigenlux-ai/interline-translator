/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_DeleteInputs */

const zh_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`删除`)
};

const zh_tw2_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`刪除`)
};

const en_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete`)
};

const ja_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`削除`)
};

const ko_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`삭제`)
};

const fr_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer`)
};

const de_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Löschen`)
};

const es_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Eliminar`)
};

const ru_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Удалить`)
};

const pt_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Eliminar`)
};

const it_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Elimina`)
};

const ar_styles_delete = /** @type {(inputs: Styles_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حذف`)
};

/**
* | output |
* | --- |
* | "Delete" |
*
* @param {Styles_DeleteInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_delete = /** @type {((inputs?: Styles_DeleteInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_DeleteInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_delete(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_delete(inputs)
	if (locale === "en") return en_styles_delete(inputs)
	if (locale === "ja") return ja_styles_delete(inputs)
	if (locale === "ko") return ko_styles_delete(inputs)
	if (locale === "fr") return fr_styles_delete(inputs)
	if (locale === "de") return de_styles_delete(inputs)
	if (locale === "es") return es_styles_delete(inputs)
	if (locale === "ru") return ru_styles_delete(inputs)
	if (locale === "pt") return pt_styles_delete(inputs)
	if (locale === "it") return it_styles_delete(inputs)
	return ar_styles_delete(inputs)
});