/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Backup_Section_DescInputs */

const zh_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`将设置导出为 JSON 文件，默认不包含 API 密钥和自定义请求头；也可从文件恢复设置。`)
};

const zh_tw2_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`將設定匯出為 JSON 檔案，預設不包含 API 金鑰和自訂請求標頭；也可從檔案還原設定。`)
};

const en_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export your settings to a JSON file — API keys and custom headers are left out by default — or restore from one.`)
};

const ja_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定を JSON ファイルにエクスポート、またはファイルから復元します。API キーとカスタムヘッダーは既定では含まれません。`)
};

const ko_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정을 JSON 파일로 내보내거나 파일에서 복원합니다. API 키와 사용자 지정 헤더는 기본적으로 제외됩니다.`)
};

const fr_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportez vos paramètres dans un fichier JSON ou restaurez-les depuis un fichier. Les clés API et les en-têtes personnalisés sont exclus par défaut.`)
};

const de_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportieren Sie Ihre Einstellungen als JSON-Datei oder stellen Sie sie daraus wieder her. API-Schlüssel und benutzerdefinierte Header werden standardmäßig weggelassen.`)
};

const es_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporta tus ajustes a un archivo JSON o restáuralos desde uno. Las claves API y las cabeceras personalizadas se excluyen de forma predeterminada.`)
};

const ru_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспортируйте настройки в файл JSON или восстановите их из файла. Ключи API и пользовательские заголовки по умолчанию не включаются.`)
};

const pt_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporte as configurações para um arquivo JSON ou restaure-as de um arquivo. As chaves de API e os cabeçalhos personalizados são excluídos por padrão.`)
};

const it_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta le impostazioni in un file JSON o ripristinale da un file. Le chiavi API e le intestazioni personalizzate sono escluse per impostazione predefinita.`)
};

const ar_backup_section_desc = /** @type {(inputs: Backup_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`صدّر إعداداتك إلى ملف JSON أو استعدها منه. تُستبعد مفاتيح API والترويسات المخصصة افتراضيًا.`)
};

/**
* | output |
* | --- |
* | "Export your settings to a JSON file — API keys and custom headers are left out by default — or restore from one." |
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