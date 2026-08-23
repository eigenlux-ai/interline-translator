/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_ExportInputs */

const zh_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导出配置`)
};

const zh_tw2_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯出設定`)
};

const en_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export config`)
};

const ja_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定を書き出す`)
};

const ko_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정 내보내기`)
};

const fr_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporter la configuration`)
};

const de_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Konfiguration exportieren`)
};

const es_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar la configuración`)
};

const ru_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспортировать настройки`)
};

const pt_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar a configuração`)
};

const it_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta la configurazione`)
};

const ar_backup_export = /** @type {(inputs: Backup_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدير الإعدادات`)
};

/**
* | output |
* | --- |
* | "Export config" |
*
* @param {Backup_ExportInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_export = /** @type {((inputs?: Backup_ExportInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_ExportInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_export(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_export(inputs)
	if (locale === "en") return en_backup_export(inputs)
	if (locale === "ja") return ja_backup_export(inputs)
	if (locale === "ko") return ko_backup_export(inputs)
	if (locale === "fr") return fr_backup_export(inputs)
	if (locale === "de") return de_backup_export(inputs)
	if (locale === "es") return es_backup_export(inputs)
	if (locale === "ru") return ru_backup_export(inputs)
	if (locale === "pt") return pt_backup_export(inputs)
	if (locale === "it") return it_backup_export(inputs)
	return ar_backup_export(inputs)
});