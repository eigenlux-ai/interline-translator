/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ skipped: NonNullable<unknown> }} Glossary_Import_SkippedInputs */

const zh_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`（另跳过 ${i?.skipped} 条无效或重复行）`)
};

const zh_tw2_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`（另跳過 ${i?.skipped} 條無效或重複行）`)
};

const en_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (${i?.skipped} invalid or duplicate rows skipped)`)
};

const ja_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`（無効・重複 ${i?.skipped} 行をスキップ）`)
};

const ko_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`(유효하지 않거나 중복된 ${i?.skipped}행 건너뜀)`)
};

const fr_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (${i?.skipped} lignes invalides ou en double ignorées)`)
};

const de_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (${i?.skipped} ungültige oder doppelte Zeilen übersprungen)`)
};

const es_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (${i?.skipped} filas inválidas o duplicadas omitidas)`)
};

const ru_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (пропущено ${i?.skipped} неверных или повторных строк)`)
};

const pt_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (${i?.skipped} linhas inválidas ou duplicadas ignoradas)`)
};

const it_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (${i?.skipped} righe non valide o duplicate saltate)`)
};

const ar_glossary_import_skipped = /** @type {(inputs: Glossary_Import_SkippedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (` (تم تخطي ${i?.skipped} صفوف غير صالحة أو مكررة)`)
};

/**
* | output |
* | --- |
* | "({skipped} invalid or duplicate rows skipped)" |
*
* @param {Glossary_Import_SkippedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_import_skipped = /** @type {((inputs: Glossary_Import_SkippedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Import_SkippedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_import_skipped(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_import_skipped(inputs)
	if (locale === "en") return en_glossary_import_skipped(inputs)
	if (locale === "ja") return ja_glossary_import_skipped(inputs)
	if (locale === "ko") return ko_glossary_import_skipped(inputs)
	if (locale === "fr") return fr_glossary_import_skipped(inputs)
	if (locale === "de") return de_glossary_import_skipped(inputs)
	if (locale === "es") return es_glossary_import_skipped(inputs)
	if (locale === "ru") return ru_glossary_import_skipped(inputs)
	if (locale === "pt") return pt_glossary_import_skipped(inputs)
	if (locale === "it") return it_glossary_import_skipped(inputs)
	return ar_glossary_import_skipped(inputs)
});