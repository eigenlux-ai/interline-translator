/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_Import_Err_EmptyInputs */

const zh_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`文件里没有可用的术语行——需要 source/target 两列（CSV/TSV）或对应的 JSON 字段。`)
};

const zh_tw2_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`檔案裡沒有可用的術語行——需要 source/target 兩欄（CSV/TSV）或對應的 JSON 欄位。`)
};

const en_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No usable term rows in the file — it needs source/target columns (CSV/TSV) or the matching JSON fields.`)
};

const ja_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ファイルに有効な用語行がありません。source/target の 2 列（CSV/TSV）または対応する JSON フィールドが必要です。`)
};

const ko_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`파일에 사용할 수 있는 용어 행이 없습니다. source/target 두 열(CSV/TSV) 또는 해당 JSON 필드가 필요합니다.`)
};

const fr_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune ligne de terme exploitable — il faut des colonnes source/target (CSV/TSV) ou les champs JSON correspondants.`)
};

const de_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keine verwertbaren Begriffszeilen — es braucht source/target-Spalten (CSV/TSV) oder die passenden JSON-Felder.`)
};

const es_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No hay filas de términos utilizables: se necesitan columnas source/target (CSV/TSV) o los campos JSON correspondientes.`)
};

const ru_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`В файле нет пригодных строк терминов — нужны колонки source/target (CSV/TSV) или соответствующие поля JSON.`)
};

const pt_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sem linhas de termos utilizáveis — são precisas colunas source/target (CSV/TSV) ou os campos JSON correspondentes.`)
};

const it_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nessuna riga di termini utilizzabile — servono colonne source/target (CSV/TSV) o i campi JSON corrispondenti.`)
};

const ar_glossary_import_err_empty = /** @type {(inputs: Glossary_Import_Err_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا توجد صفوف مصطلحات صالحة — يلزم عمودا source/target (CSV/TSV) أو حقول JSON المقابلة.`)
};

/**
* | output |
* | --- |
* | "No usable term rows in the file — it needs source/target columns (CSV/TSV) or the matching JSON fields." |
*
* @param {Glossary_Import_Err_EmptyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_import_err_empty = /** @type {((inputs?: Glossary_Import_Err_EmptyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Import_Err_EmptyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_import_err_empty(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_import_err_empty(inputs)
	if (locale === "en") return en_glossary_import_err_empty(inputs)
	if (locale === "ja") return ja_glossary_import_err_empty(inputs)
	if (locale === "ko") return ko_glossary_import_err_empty(inputs)
	if (locale === "fr") return fr_glossary_import_err_empty(inputs)
	if (locale === "de") return de_glossary_import_err_empty(inputs)
	if (locale === "es") return es_glossary_import_err_empty(inputs)
	if (locale === "ru") return ru_glossary_import_err_empty(inputs)
	if (locale === "pt") return pt_glossary_import_err_empty(inputs)
	if (locale === "it") return it_glossary_import_err_empty(inputs)
	return ar_glossary_import_err_empty(inputs)
});