/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Section_DescInputs */

const zh_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`将设置导出为 JSON 文件（默认不含 API 密钥），或从备份文件恢复。`)
};

const zh_tw2_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`將設定匯出為 JSON 檔案（預設不含 API 金鑰），或從備份檔案還原。`)
};

const en_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export your settings to a JSON file — API keys are left out by default — or restore from one.`)
};

const ja_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定を JSON ファイルに書き出します（既定では API キーを含みません）。ファイルから復元もできます。`)
};

const ko_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정을 JSON 파일로 내보냅니다(기본적으로 API 키 제외). 파일에서 복원할 수도 있습니다.`)
};

const fr_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportez vos réglages dans un fichier JSON — les clés API en sont exclues par défaut — ou restaurez-les depuis un fichier.`)
};

const de_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportieren Sie Ihre Einstellungen in eine JSON-Datei — API-Schlüssel sind standardmäßig nicht enthalten — oder stellen Sie sie aus einer Datei wieder her.`)
};

const es_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporta tus ajustes a un archivo JSON —las claves API se excluyen de forma predeterminada— o restáuralos desde uno.`)
};

const ru_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспортируйте настройки в файл JSON — API-ключи по умолчанию не включаются — или восстановите их из резервной копии.`)
};

const pt_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporte suas configurações para um arquivo JSON — as chaves de API ficam de fora por padrão — ou restaure um backup.`)
};

const it_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta le impostazioni in un file JSON — le chiavi API sono escluse per impostazione predefinita — oppure ripristinale da un backup.`)
};

const ar_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صدّر إعداداتك إلى ملف JSON — دون مفاتيح API افتراضيًا — أو استعِدها من ملف.`)
};

/**
* | output |
* | --- |
* | "Export your settings to a JSON file — API keys are left out by default — or restore from one." |
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