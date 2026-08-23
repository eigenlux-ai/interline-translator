/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sel_NotesInputs */

const zh_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`注疏`)
};

const zh_tw2_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`注疏`)
};

const en_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes`)
};

const ja_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`注釈`)
};

const ko_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`주해`)
};

const fr_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notes`)
};

const de_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anmerkungen`)
};

const es_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notas`)
};

const ru_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Примечания`)
};

const pt_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notas`)
};

const it_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note`)
};

const ar_sel_notes = /** @type {(inputs: Sel_NotesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حواشٍ`)
};

/**
* | output |
* | --- |
* | "Notes" |
*
* @param {Sel_NotesInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const sel_notes = /** @type {((inputs?: Sel_NotesInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sel_NotesInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_sel_notes(inputs)
	if (locale === "zh-TW") return zh_tw2_sel_notes(inputs)
	if (locale === "en") return en_sel_notes(inputs)
	if (locale === "ja") return ja_sel_notes(inputs)
	if (locale === "ko") return ko_sel_notes(inputs)
	if (locale === "fr") return fr_sel_notes(inputs)
	if (locale === "de") return de_sel_notes(inputs)
	if (locale === "es") return es_sel_notes(inputs)
	if (locale === "ru") return ru_sel_notes(inputs)
	if (locale === "pt") return pt_sel_notes(inputs)
	if (locale === "it") return it_sel_notes(inputs)
	return ar_sel_notes(inputs)
});