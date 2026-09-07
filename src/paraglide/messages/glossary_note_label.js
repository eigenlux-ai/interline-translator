/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Note_LabelInputs */

const zh_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`备注（可选）`)
};

const zh_tw2_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`備註（選填）`)
};

const en_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note (optional)`)
};

const ja_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`メモ（任意）`)
};

const ko_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`메모(선택)`)
};

const fr_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Note (facultative)`)
};

const de_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Notiz (optional)`)
};

const es_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nota (opcional)`)
};

const ru_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Заметка (необяз.)`)
};

const pt_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nota (opcional)`)
};

const it_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nota (facoltativa)`)
};

const ar_glossary_note_label = /** @type {(inputs: Glossary_Note_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ملاحظة (اختياري)`)
};

/**
* | output |
* | --- |
* | "Note (optional)" |
*
* @param {Glossary_Note_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_note_label = /** @type {((inputs?: Glossary_Note_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Note_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_note_label(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_note_label(inputs)
	if (locale === "en") return en_glossary_note_label(inputs)
	if (locale === "ja") return ja_glossary_note_label(inputs)
	if (locale === "ko") return ko_glossary_note_label(inputs)
	if (locale === "fr") return fr_glossary_note_label(inputs)
	if (locale === "de") return de_glossary_note_label(inputs)
	if (locale === "es") return es_glossary_note_label(inputs)
	if (locale === "ru") return ru_glossary_note_label(inputs)
	if (locale === "pt") return pt_glossary_note_label(inputs)
	if (locale === "it") return it_glossary_note_label(inputs)
	return ar_glossary_note_label(inputs)
});