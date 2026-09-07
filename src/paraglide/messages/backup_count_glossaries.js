/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Backup_Count_GlossariesInputs */

const zh_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`术语集：${i?.count}`)
};

const zh_tw2_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`術語集：${i?.count}`)
};

const en_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Glossary sets: ${i?.count}`)
};

const ja_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`用語集：${i?.count}`)
};

const ko_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`용어집: ${i?.count}`)
};

const fr_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Glossaires : ${i?.count}`)
};

const de_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Glossare: ${i?.count}`)
};

const es_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Glosarios: ${i?.count}`)
};

const ru_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Наборов терминов: ${i?.count}`)
};

const pt_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Glossários: ${i?.count}`)
};

const it_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Glossari: ${i?.count}`)
};

const ar_backup_count_glossaries = /** @type {(inputs: Backup_Count_GlossariesInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`مجموعات المصطلحات: ${i?.count}`)
};

/**
* | output |
* | --- |
* | "Glossary sets: {count}" |
*
* @param {Backup_Count_GlossariesInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_count_glossaries = /** @type {((inputs: Backup_Count_GlossariesInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Count_GlossariesInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_count_glossaries(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_count_glossaries(inputs)
	if (locale === "en") return en_backup_count_glossaries(inputs)
	if (locale === "ja") return ja_backup_count_glossaries(inputs)
	if (locale === "ko") return ko_backup_count_glossaries(inputs)
	if (locale === "fr") return fr_backup_count_glossaries(inputs)
	if (locale === "de") return de_backup_count_glossaries(inputs)
	if (locale === "es") return es_backup_count_glossaries(inputs)
	if (locale === "ru") return ru_backup_count_glossaries(inputs)
	if (locale === "pt") return pt_backup_count_glossaries(inputs)
	if (locale === "it") return it_backup_count_glossaries(inputs)
	return ar_backup_count_glossaries(inputs)
});