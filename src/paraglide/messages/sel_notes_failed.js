/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sel_Notes_FailedInputs */

const zh_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`未能生成注疏`)
};

const zh_tw2_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`未能產生注疏`)
};

const en_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couldn't produce notes`)
};

const ja_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`注釈を作成できませんでした`)
};

const ko_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`주해를 만들지 못했습니다`)
};

const fr_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de produire les notes`)
};

const de_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anmerkungen konnten nicht erstellt werden`)
};

const es_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No se pudieron generar las notas`)
};

const ru_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось составить примечания`)
};

const pt_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Não foi possível gerar as notas`)
};

const it_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossibile generare le note`)
};

const ar_sel_notes_failed = /** @type {(inputs: Sel_Notes_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر إنشاء الحواشي`)
};

/**
* | output |
* | --- |
* | "Couldn't produce notes" |
*
* @param {Sel_Notes_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const sel_notes_failed = /** @type {((inputs?: Sel_Notes_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sel_Notes_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_sel_notes_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_sel_notes_failed(inputs)
	if (locale === "en") return en_sel_notes_failed(inputs)
	if (locale === "ja") return ja_sel_notes_failed(inputs)
	if (locale === "ko") return ko_sel_notes_failed(inputs)
	if (locale === "fr") return fr_sel_notes_failed(inputs)
	if (locale === "de") return de_sel_notes_failed(inputs)
	if (locale === "es") return es_sel_notes_failed(inputs)
	if (locale === "ru") return ru_sel_notes_failed(inputs)
	if (locale === "pt") return pt_sel_notes_failed(inputs)
	if (locale === "it") return it_sel_notes_failed(inputs)
	return ar_sel_notes_failed(inputs)
});