/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Input_UndoInputs */

const zh_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ 还原原文`)
};

const zh_tw2_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ 還原原文`)
};

const en_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ Restore original`)
};

const ja_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ 原文に戻す`)
};

const ko_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ 원문 복원`)
};

const fr_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ Rétablir l'original`)
};

const de_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ Original wiederherstellen`)
};

const es_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ Restaurar el original`)
};

const ru_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ Вернуть оригинал`)
};

const pt_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ Restaurar o original`)
};

const it_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ Ripristina l'originale`)
};

const ar_input_undo = /** @type {(inputs: Input_UndoInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`↩ استعادة الأصل`)
};

/**
* | output |
* | --- |
* | "↩ Restore original" |
*
* @param {Input_UndoInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const input_undo = /** @type {((inputs?: Input_UndoInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Input_UndoInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_input_undo(inputs)
	if (locale === "zh-TW") return zh_tw2_input_undo(inputs)
	if (locale === "en") return en_input_undo(inputs)
	if (locale === "ja") return ja_input_undo(inputs)
	if (locale === "ko") return ko_input_undo(inputs)
	if (locale === "fr") return fr_input_undo(inputs)
	if (locale === "de") return de_input_undo(inputs)
	if (locale === "es") return es_input_undo(inputs)
	if (locale === "ru") return ru_input_undo(inputs)
	if (locale === "pt") return pt_input_undo(inputs)
	if (locale === "it") return it_input_undo(inputs)
	return ar_input_undo(inputs)
});