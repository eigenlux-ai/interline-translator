/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_ExportInputs */

const zh_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导出`)
};

const zh_tw2_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯出`)
};

const en_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Export`)
};

const ja_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`エクスポート`)
};

const ko_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`내보내기`)
};

const fr_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exporter`)
};

const de_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportieren`)
};

const es_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar`)
};

const ru_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Экспорт`)
};

const pt_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Exportar`)
};

const it_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Esporta`)
};

const ar_glossary_export = /** @type {(inputs: Glossary_ExportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تصدير`)
};

/**
* | output |
* | --- |
* | "Export" |
*
* @param {Glossary_ExportInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_export = /** @type {((inputs?: Glossary_ExportInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_ExportInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_export(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_export(inputs)
	if (locale === "en") return en_glossary_export(inputs)
	if (locale === "ja") return ja_glossary_export(inputs)
	if (locale === "ko") return ko_glossary_export(inputs)
	if (locale === "fr") return fr_glossary_export(inputs)
	if (locale === "de") return de_glossary_export(inputs)
	if (locale === "es") return es_glossary_export(inputs)
	if (locale === "ru") return ru_glossary_export(inputs)
	if (locale === "pt") return pt_glossary_export(inputs)
	if (locale === "it") return it_glossary_export(inputs)
	return ar_glossary_export(inputs)
});