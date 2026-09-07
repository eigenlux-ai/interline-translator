/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Preview_ReadyInputs */

const zh_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`备份已读取，可确认导入`)
};

const zh_tw2_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已讀取備份，可確認匯入`)
};

const en_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup ready to import`)
};

const ja_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`バックアップを読み込みました`)
};

const ko_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`백업을 불러왔습니다`)
};

const fr_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sauvegarde prête à importer`)
};

const de_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sicherung zum Import bereit`)
};

const es_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copia lista para importar`)
};

const ru_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Резервная копия готова к импорту`)
};

const pt_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup pronto para importar`)
};

const it_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup pronto da importare`)
};

const ar_backup_preview_ready = /** @type {(inputs: Backup_Preview_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النسخة الاحتياطية جاهزة للاستيراد`)
};

/**
* | output |
* | --- |
* | "Backup ready to import" |
*
* @param {Backup_Preview_ReadyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_preview_ready = /** @type {((inputs?: Backup_Preview_ReadyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Preview_ReadyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_preview_ready(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_preview_ready(inputs)
	if (locale === "en") return en_backup_preview_ready(inputs)
	if (locale === "ja") return ja_backup_preview_ready(inputs)
	if (locale === "ko") return ko_backup_preview_ready(inputs)
	if (locale === "fr") return fr_backup_preview_ready(inputs)
	if (locale === "de") return de_backup_preview_ready(inputs)
	if (locale === "es") return es_backup_preview_ready(inputs)
	if (locale === "ru") return ru_backup_preview_ready(inputs)
	if (locale === "pt") return pt_backup_preview_ready(inputs)
	if (locale === "it") return it_backup_preview_ready(inputs)
	return ar_backup_preview_ready(inputs)
});