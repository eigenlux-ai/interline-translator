/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Section_DescInputs */

const zh_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`将设置(含 API key)导出为 JSON 文件,或从文件恢复。`)
};

const zh_tw2_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`將設定(含 API key)匯出成 JSON 檔,或從檔案還原。`)
};

const en_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export your settings (API keys included) to a JSON file, or restore from one.`)
};

const ja_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定(API key を含む)を JSON ファイルに書き出す、またはファイルから復元します。`)
};

const ko_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정(API key 포함)을 JSON 파일로 내보내거나 파일에서 복원합니다.`)
};

const fr_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportez vos réglages (clés API comprises) dans un fichier JSON, ou restaurez-les depuis un fichier.`)
};

const de_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportieren Sie Ihre Einstellungen (samt API keys) in eine JSON-Datei oder stellen Sie sie aus einer Datei wieder her.`)
};

const es_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporta tus ajustes (claves API incluidas) a un archivo JSON, o restáuralos desde uno.`)
};

const ru_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспортируйте настройки (вместе с API keys) в файл JSON или восстановите их из файла.`)
};

const pt_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporte as suas definições (API keys incluídas) para um ficheiro JSON, ou reponha-as a partir de um ficheiro.`)
};

const it_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta le tue impostazioni (API key incluse) in un file JSON, o ripristinale da un file.`)
};

const ar_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صدّر إعداداتك (بما فيها مفاتيح API) إلى ملف JSON، أو استعِدها من ملف.`)
};

/**
* | output |
* | --- |
* | "Export your settings (API keys included) to a JSON file, or restore from one." |
*
* @param {Backup_Section_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const backup_section_desc = /** @type {((inputs?: Backup_Section_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Backup_Section_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_backup_section_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_backup_section_desc(inputs)
	if (locale === "en") return en_backup_section_desc(inputs)
	if (locale === "ja") return ja_backup_section_desc(inputs)
	if (locale === "ko") return ko_backup_section_desc(inputs)
	if (locale === "fr") return fr_backup_section_desc(inputs)
	if (locale === "de") return de_backup_section_desc(inputs)
	if (locale === "es") return es_backup_section_desc(inputs)
	if (locale === "ru") return ru_backup_section_desc(inputs)
	if (locale === "pt") return pt_backup_section_desc(inputs)
	if (locale === "it") return it_backup_section_desc(inputs)
	return ar_backup_section_desc(inputs)
});