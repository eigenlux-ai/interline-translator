/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Export_Keys_ConfirmInputs */

const zh_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`确认含密钥导出`)
};

const zh_tw2_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`確認含金鑰匯出`)
};

const en_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yes, export with API keys`)
};

const ja_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`はい、API キーを含めて書き出す`)
};

const ko_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`네, API 키 포함 내보내기`)
};

const fr_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Oui, exporter avec les clés API`)
};

const de_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ja, mit API-Schlüsseln exportieren`)
};

const es_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sí, exportar con claves API`)
};

const ru_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Да, экспортировать с API-ключами`)
};

const pt_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sim, exportar com chaves de API`)
};

const it_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sì, esporta con chiavi API`)
};

const ar_backup_export_keys_confirm = /** @type {(inputs: Backup_Export_Keys_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`نعم، صدّر مع مفاتيح API`)
};

/**
* | output |
* | --- |
* | "Yes, export with API keys" |
*
* @param {Backup_Export_Keys_ConfirmInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_export_keys_confirm = /** @type {((inputs?: Backup_Export_Keys_ConfirmInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Export_Keys_ConfirmInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_export_keys_confirm(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_export_keys_confirm(inputs)
	if (locale === "en") return en_backup_export_keys_confirm(inputs)
	if (locale === "ja") return ja_backup_export_keys_confirm(inputs)
	if (locale === "ko") return ko_backup_export_keys_confirm(inputs)
	if (locale === "fr") return fr_backup_export_keys_confirm(inputs)
	if (locale === "de") return de_backup_export_keys_confirm(inputs)
	if (locale === "es") return es_backup_export_keys_confirm(inputs)
	if (locale === "ru") return ru_backup_export_keys_confirm(inputs)
	if (locale === "pt") return pt_backup_export_keys_confirm(inputs)
	if (locale === "it") return it_backup_export_keys_confirm(inputs)
	return ar_backup_export_keys_confirm(inputs)
});