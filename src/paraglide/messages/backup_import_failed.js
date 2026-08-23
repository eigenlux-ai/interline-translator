/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ error: NonNullable<unknown> }} Backup_Import_FailedInputs */

const zh_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`导入失败：${i?.error}`)
};

const zh_tw2_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`匯入失敗：${i?.error}`)
};

const en_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Import failed: ${i?.error}`)
};

const ja_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`インポートに失敗しました：${i?.error}`)
};

const ko_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`가져오기 실패: ${i?.error}`)
};

const fr_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Échec de l'importation : ${i?.error}`)
};

const de_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Import fehlgeschlagen: ${i?.error}`)
};

const es_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Error al importar: ${i?.error}`)
};

const ru_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ошибка импорта: ${i?.error}`)
};

const pt_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Falha ao importar: ${i?.error}`)
};

const it_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Importazione non riuscita: ${i?.error}`)
};

const ar_backup_import_failed = /** @type {(inputs: Backup_Import_FailedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`فشل الاستيراد: ${i?.error}`)
};

/**
* | output |
* | --- |
* | "Import failed: {error}" |
*
* @param {Backup_Import_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_import_failed = /** @type {((inputs: Backup_Import_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Import_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_import_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_import_failed(inputs)
	if (locale === "en") return en_backup_import_failed(inputs)
	if (locale === "ja") return ja_backup_import_failed(inputs)
	if (locale === "ko") return ko_backup_import_failed(inputs)
	if (locale === "fr") return fr_backup_import_failed(inputs)
	if (locale === "de") return de_backup_import_failed(inputs)
	if (locale === "es") return es_backup_import_failed(inputs)
	if (locale === "ru") return ru_backup_import_failed(inputs)
	if (locale === "pt") return pt_backup_import_failed(inputs)
	if (locale === "it") return it_backup_import_failed(inputs)
	return ar_backup_import_failed(inputs)
});