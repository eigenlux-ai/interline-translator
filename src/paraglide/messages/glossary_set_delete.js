/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Set_DeleteInputs */

const zh_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`删除集合`)
};

const zh_tw2_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`刪除集合`)
};

const en_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete set`)
};

const ja_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語集を削除`)
};

const ko_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어집 삭제`)
};

const fr_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer le jeu`)
};

const de_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set löschen`)
};

const es_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Eliminar conjunto`)
};

const ru_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Удалить набор`)
};

const pt_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Eliminar conjunto`)
};

const it_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Elimina set`)
};

const ar_glossary_set_delete = /** @type {(inputs: Glossary_Set_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حذف المجموعة`)
};

/**
* | output |
* | --- |
* | "Delete set" |
*
* @param {Glossary_Set_DeleteInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_set_delete = /** @type {((inputs?: Glossary_Set_DeleteInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Set_DeleteInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_set_delete(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_set_delete(inputs)
	if (locale === "en") return en_glossary_set_delete(inputs)
	if (locale === "ja") return ja_glossary_set_delete(inputs)
	if (locale === "ko") return ko_glossary_set_delete(inputs)
	if (locale === "fr") return fr_glossary_set_delete(inputs)
	if (locale === "de") return de_glossary_set_delete(inputs)
	if (locale === "es") return es_glossary_set_delete(inputs)
	if (locale === "ru") return ru_glossary_set_delete(inputs)
	if (locale === "pt") return pt_glossary_set_delete(inputs)
	if (locale === "it") return it_glossary_set_delete(inputs)
	return ar_glossary_set_delete(inputs)
});