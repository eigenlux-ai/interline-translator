/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Backup_Count_ProvidersInputs */

const zh_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`翻译引擎：${i?.count}`)
};

const zh_tw2_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`翻譯引擎：${i?.count}`)
};

const en_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Translation engines: ${i?.count}`)
};

const ja_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`翻訳エンジン：${i?.count}`)
};

const ko_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`번역 엔진: ${i?.count}`)
};

const fr_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Moteurs de traduction : ${i?.count}`)
};

const de_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Übersetzungs-Engines: ${i?.count}`)
};

const es_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Motores de traducción: ${i?.count}`)
};

const ru_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Движков перевода: ${i?.count}`)
};

const pt_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Motores de tradução: ${i?.count}`)
};

const it_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Motori di traduzione: ${i?.count}`)
};

const ar_backup_count_providers = /** @type {(inputs: Backup_Count_ProvidersInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`محرّكات الترجمة: ${i?.count}`)
};

/**
* | output |
* | --- |
* | "Translation engines: {count}" |
*
* @param {Backup_Count_ProvidersInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_count_providers = /** @type {((inputs: Backup_Count_ProvidersInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Count_ProvidersInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_count_providers(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_count_providers(inputs)
	if (locale === "en") return en_backup_count_providers(inputs)
	if (locale === "ja") return ja_backup_count_providers(inputs)
	if (locale === "ko") return ko_backup_count_providers(inputs)
	if (locale === "fr") return fr_backup_count_providers(inputs)
	if (locale === "de") return de_backup_count_providers(inputs)
	if (locale === "es") return es_backup_count_providers(inputs)
	if (locale === "ru") return ru_backup_count_providers(inputs)
	if (locale === "pt") return pt_backup_count_providers(inputs)
	if (locale === "it") return it_backup_count_providers(inputs)
	return ar_backup_count_providers(inputs)
});