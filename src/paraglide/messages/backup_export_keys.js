/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Export_KeysInputs */

const zh_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`包含凭据导出`)
};

const zh_tw2_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`包含憑證匯出`)
};

const en_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export with credentials`)
};

const ja_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`認証情報を含めてエクスポート`)
};

const ko_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`인증 정보 포함 내보내기`)
};

const fr_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporter avec les identifiants`)
};

const de_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mit Zugangsdaten exportieren`)
};

const es_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar con credenciales`)
};

const ru_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспорт с учётными данными`)
};

const pt_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar com credenciais`)
};

const it_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta con credenziali`)
};

const ar_backup_export_keys = /** @type {(inputs: Backup_Export_KeysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدير مع بيانات الاعتماد`)
};

/**
* | output |
* | --- |
* | "Export with credentials" |
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