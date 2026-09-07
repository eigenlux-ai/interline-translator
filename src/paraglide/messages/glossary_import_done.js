/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ name: NonNullable<unknown>, count: NonNullable<unknown> }} Glossary_Import_DoneInputs */

const zh_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`已导入「${i?.name}」：${i?.count} 条`)
};

const zh_tw2_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`已匯入「${i?.name}」：${i?.count} 筆術語`)
};

const en_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Imported “${i?.name}”. Terms: ${i?.count}`)
};

const ja_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`「${i?.name}」をインポート：${i?.count} 件`)
};

const ko_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`“${i?.name}” 가져옴: ${i?.count}개`)
};

const fr_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`« ${i?.name} » importé. Nombre de termes : ${i?.count}`)
};

const de_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`„${i?.name}“ importiert. Begriffe: ${i?.count}`)
};

const es_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`«${i?.name}» importado. Términos: ${i?.count}`)
};

const ru_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Набор «${i?.name}» импортирован. Терминов: ${i?.count}`)
};

const pt_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`“${i?.name}” importado. Termos: ${i?.count}`)
};

const it_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`«${i?.name}» importato. Termini: ${i?.count}`)
};

const ar_glossary_import_done = /** @type {(inputs: Glossary_Import_DoneInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم استيراد «${i?.name}». عدد المصطلحات: ${i?.count}`)
};

/**
* | output |
* | --- |
* | "Imported “{name}”. Terms: {count}" |
*
* @param {Glossary_Import_DoneInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_import_done = /** @type {((inputs: Glossary_Import_DoneInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_Import_DoneInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_import_done(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_import_done(inputs)
	if (locale === "en") return en_glossary_import_done(inputs)
	if (locale === "ja") return ja_glossary_import_done(inputs)
	if (locale === "ko") return ko_glossary_import_done(inputs)
	if (locale === "fr") return fr_glossary_import_done(inputs)
	if (locale === "de") return de_glossary_import_done(inputs)
	if (locale === "es") return es_glossary_import_done(inputs)
	if (locale === "ru") return ru_glossary_import_done(inputs)
	if (locale === "pt") return pt_glossary_import_done(inputs)
	if (locale === "it") return it_glossary_import_done(inputs)
	return ar_glossary_import_done(inputs)
});