/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Section_TitleInputs */

const zh_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`备份与重置`)
};

const zh_tw2_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`備份與重設`)
};

const en_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup & reset`)
};

const ja_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`バックアップとリセット`)
};

const ko_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`백업 및 초기화`)
};

const fr_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sauvegarde et réinitialisation`)
};

const de_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sicherung & Zurücksetzen`)
};

const es_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Copia y restablecimiento`)
};

const ru_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Резервная копия и сброс`)
};

const pt_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cópia de segurança e reposição`)
};

const it_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Backup e ripristino`)
};

const ar_backup_section_title = /** @type {(inputs: Backup_Section_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النسخ الاحتياطي وإعادة التعيين`)
};

/**
* | output |
* | --- |
* | "Backup & reset" |
*
* @param {Backup_Section_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_section_title = /** @type {((inputs?: Backup_Section_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Section_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_section_title(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_section_title(inputs)
	if (locale === "en") return en_backup_section_title(inputs)
	if (locale === "ja") return ja_backup_section_title(inputs)
	if (locale === "ko") return ko_backup_section_title(inputs)
	if (locale === "fr") return fr_backup_section_title(inputs)
	if (locale === "de") return de_backup_section_title(inputs)
	if (locale === "es") return es_backup_section_title(inputs)
	if (locale === "ru") return ru_backup_section_title(inputs)
	if (locale === "pt") return pt_backup_section_title(inputs)
	if (locale === "it") return it_backup_section_title(inputs)
	return ar_backup_section_title(inputs)
});