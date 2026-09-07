/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Import_Err_UnrecognizedInputs */

const zh_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`无法解析文件。支持导出的 JSON 术语集，以及包含 source、target 和可选 note 列的 CSV/TSV 文件。`)
};

const zh_tw2_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`無法解析檔案。支援匯出的 JSON 術語集，以及包含 source、target 與選填 note 欄的 CSV/TSV 檔案。`)
};

const en_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not parse the file — supported: an exported JSON set, or CSV/TSV rows of source,target[,note].`)
};

const ja_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ファイルを解析できません。エクスポートされた JSON 用語集、または source,target[,note] 形式の CSV/TSV に対応しています。`)
};

const ko_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`파일을 해석할 수 없습니다. 내보낸 JSON 용어집 또는 source,target[,note] 형식의 CSV/TSV를 지원합니다.`)
};

const fr_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de lire le fichier. Utilisez un glossaire JSON exporté ou un fichier CSV/TSV avec les colonnes source, target et, éventuellement, note.`)
};

const de_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Die Datei konnte nicht gelesen werden. Verwenden Sie ein exportiertes JSON-Glossar oder eine CSV/TSV-Datei mit source, target und optional note als Spalten.`)
};

const es_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No se pudo leer el archivo. Usa un glosario JSON exportado o un archivo CSV/TSV con las columnas source, target y, opcionalmente, note.`)
};

const ru_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось разобрать файл — поддерживаются экспортированный JSON-набор или строки CSV/TSV вида source,target[,note].`)
};

const pt_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Não foi possível ler o arquivo. Use um glossário JSON exportado ou um arquivo CSV/TSV com as colunas source, target e, opcionalmente, note.`)
};

const it_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossibile leggere il file. Usa un glossario JSON esportato o un file CSV/TSV con le colonne source, target e, facoltativamente, note.`)
};

const ar_glossary_import_err_unrecognized = /** @type {(inputs: Glossary_Import_Err_UnrecognizedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّر تحليل الملف — المدعوم: مجموعة JSON مصدَّرة أو صفوف CSV/TSV بصيغة source,target[,note].`)
};

/**
* | output |
* | --- |
* | "Could not parse the file — supported: an exported JSON set, or CSV/TSV rows of source,target[,note]." |
*
* @param {Glossary_Import_Err_UnrecognizedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_import_err_unrecognized = /** @type {((inputs?: Glossary_Import_Err_UnrecognizedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Import_Err_UnrecognizedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_import_err_unrecognized(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_import_err_unrecognized(inputs)
	if (locale === "en") return en_glossary_import_err_unrecognized(inputs)
	if (locale === "ja") return ja_glossary_import_err_unrecognized(inputs)
	if (locale === "ko") return ko_glossary_import_err_unrecognized(inputs)
	if (locale === "fr") return fr_glossary_import_err_unrecognized(inputs)
	if (locale === "de") return de_glossary_import_err_unrecognized(inputs)
	if (locale === "es") return es_glossary_import_err_unrecognized(inputs)
	if (locale === "ru") return ru_glossary_import_err_unrecognized(inputs)
	if (locale === "pt") return pt_glossary_import_err_unrecognized(inputs)
	if (locale === "it") return it_glossary_import_err_unrecognized(inputs)
	return ar_glossary_import_err_unrecognized(inputs)
});