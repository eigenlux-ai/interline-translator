/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sel_Notes_LoadingInputs */

const zh_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`批注中…`)
};

const zh_tw2_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`批註中…`)
};

const en_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annotating…`)
};

const ja_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`注釈を作成中…`)
};

const ko_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`주해 다는 중…`)
};

const fr_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annotation…`)
};

const de_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wird annotiert…`)
};

const es_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anotando…`)
};

const ru_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Составление примечаний…`)
};

const pt_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anotando…`)
};

const it_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annotazione…`)
};

const ar_sel_notes_loading = /** @type {(inputs: Sel_Notes_LoadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جارٍ إعداد الحواشي…`)
};

/**
* | output |
* | --- |
* | "Annotating…" |
*
* @param {Sel_Notes_LoadingInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const sel_notes_loading = /** @type {((inputs?: Sel_Notes_LoadingInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sel_Notes_LoadingInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_sel_notes_loading(inputs)
	if (locale === "zh-TW") return zh_tw2_sel_notes_loading(inputs)
	if (locale === "en") return en_sel_notes_loading(inputs)
	if (locale === "ja") return ja_sel_notes_loading(inputs)
	if (locale === "ko") return ko_sel_notes_loading(inputs)
	if (locale === "fr") return fr_sel_notes_loading(inputs)
	if (locale === "de") return de_sel_notes_loading(inputs)
	if (locale === "es") return es_sel_notes_loading(inputs)
	if (locale === "ru") return ru_sel_notes_loading(inputs)
	if (locale === "pt") return pt_sel_notes_loading(inputs)
	if (locale === "it") return it_sel_notes_loading(inputs)
	return ar_sel_notes_loading(inputs)
});