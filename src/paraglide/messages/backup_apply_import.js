/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Apply_ImportInputs */

const zh_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`确认导入设置`)
};

const zh_tw2_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`確認匯入設定`)
};

const en_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import these settings`)
};

const ja_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`この設定を読み込む`)
};

const ko_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 설정 가져오기`)
};

const fr_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importer ces réglages`)
};

const de_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Diese Einstellungen importieren`)
};

const es_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importar estos ajustes`)
};

const ru_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Импортировать эти настройки`)
};

const pt_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importar estas configurações`)
};

const it_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importa queste impostazioni`)
};

const ar_backup_apply_import = /** @type {(inputs: Backup_Apply_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استيراد هذه الإعدادات`)
};

/**
* | output |
* | --- |
* | "Import these settings" |
*
* @param {Backup_Apply_ImportInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_apply_import = /** @type {((inputs?: Backup_Apply_ImportInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Apply_ImportInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_apply_import(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_apply_import(inputs)
	if (locale === "en") return en_backup_apply_import(inputs)
	if (locale === "ja") return ja_backup_apply_import(inputs)
	if (locale === "ko") return ko_backup_apply_import(inputs)
	if (locale === "fr") return fr_backup_apply_import(inputs)
	if (locale === "de") return de_backup_apply_import(inputs)
	if (locale === "es") return es_backup_apply_import(inputs)
	if (locale === "ru") return ru_backup_apply_import(inputs)
	if (locale === "pt") return pt_backup_apply_import(inputs)
	if (locale === "it") return it_backup_apply_import(inputs)
	return ar_backup_apply_import(inputs)
});