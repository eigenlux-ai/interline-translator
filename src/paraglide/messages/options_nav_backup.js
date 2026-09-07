/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_BackupInputs */

const zh_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`备份`)
};

const zh_tw2_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`備份`)
};

const en_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup`)
};

const ja_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`バックアップ`)
};

const ko_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`백업`)
};

const fr_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sauvegarde`)
};

const de_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sicherung`)
};

const es_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copia de seguridad`)
};

const ru_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Резервная копия`)
};

const pt_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup`)
};

const it_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup`)
};

const ar_options_nav_backup = /** @type {(inputs: Options_Nav_BackupInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النسخ الاحتياطي`)
};

/**
* | output |
* | --- |
* | "Backup" |
*
* @param {Options_Nav_BackupInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_backup = /** @type {((inputs?: Options_Nav_BackupInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_BackupInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_backup(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_backup(inputs)
	if (locale === "en") return en_options_nav_backup(inputs)
	if (locale === "ja") return ja_options_nav_backup(inputs)
	if (locale === "ko") return ko_options_nav_backup(inputs)
	if (locale === "fr") return fr_options_nav_backup(inputs)
	if (locale === "de") return de_options_nav_backup(inputs)
	if (locale === "es") return es_options_nav_backup(inputs)
	if (locale === "ru") return ru_options_nav_backup(inputs)
	if (locale === "pt") return pt_options_nav_backup(inputs)
	if (locale === "it") return it_options_nav_backup(inputs)
	return ar_options_nav_backup(inputs)
});