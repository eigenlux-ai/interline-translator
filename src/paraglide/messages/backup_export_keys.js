/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Export_KeysInputs */

const zh_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`含密钥导出`)
};

const zh_tw2_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`含金鑰匯出`)
};

const en_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export with API keys`)
};

const ja_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API キーを含めて書き出す`)
};

const ko_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`API 키 포함 내보내기`)
};

const fr_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporter avec les clés API`)
};

const de_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mit API-Schlüsseln exportieren`)
};

const es_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar con claves API`)
};

const ru_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспортировать с API-ключами`)
};

const pt_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar com chaves de API`)
};

const it_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta con chiavi API`)
};

const ar_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدير مع مفاتيح API`)
};

/**
* | output |
* | --- |
* | "Export with API keys" |
*
* @param {Backup_Export_KeysInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_export_keys = /** @type {((inputs?: Backup_Export_KeysInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Export_KeysInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_export_keys(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_export_keys(inputs)
	if (locale === "en") return en_backup_export_keys(inputs)
	if (locale === "ja") return ja_backup_export_keys(inputs)
	if (locale === "ko") return ko_backup_export_keys(inputs)
	if (locale === "fr") return fr_backup_export_keys(inputs)
	if (locale === "de") return de_backup_export_keys(inputs)
	if (locale === "es") return es_backup_export_keys(inputs)
	if (locale === "ru") return ru_backup_export_keys(inputs)
	if (locale === "pt") return pt_backup_export_keys(inputs)
	if (locale === "it") return it_backup_export_keys(inputs)
	return ar_backup_export_keys(inputs)
});