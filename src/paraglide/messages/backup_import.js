/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_ImportInputs */

const zh_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导入配置`)
};

const zh_tw2_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯入設定`)
};

const en_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import config`)
};

const ja_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定を読み込む`)
};

const ko_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정 가져오기`)
};

const fr_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importer la configuration`)
};

const de_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Konfiguration importieren`)
};

const es_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importar la configuración`)
};

const ru_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Импортировать настройки`)
};

const pt_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importar a configuração`)
};

const it_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importa la configurazione`)
};

const ar_backup_import = /** @type {(inputs: Backup_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استيراد الإعدادات`)
};

/**
* | output |
* | --- |
* | "Import config" |
*
* @param {Backup_ImportInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_import = /** @type {((inputs?: Backup_ImportInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_ImportInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_import(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_import(inputs)
	if (locale === "en") return en_backup_import(inputs)
	if (locale === "ja") return ja_backup_import(inputs)
	if (locale === "ko") return ko_backup_import(inputs)
	if (locale === "fr") return fr_backup_import(inputs)
	if (locale === "de") return de_backup_import(inputs)
	if (locale === "es") return es_backup_import(inputs)
	if (locale === "ru") return ru_backup_import(inputs)
	if (locale === "pt") return pt_backup_import(inputs)
	if (locale === "it") return it_backup_import(inputs)
	return ar_backup_import(inputs)
});