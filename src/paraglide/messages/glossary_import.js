/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Glossary_ImportInputs */

const zh_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`导入术语集`)
};

const zh_tw2_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`匯入術語集`)
};

const en_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Import set`)
};

const ja_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用語集をインポート`)
};

const ko_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`용어집 가져오기`)
};

const fr_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importer un glossaire`)
};

const de_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Glossar importieren`)
};

const es_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importar glosario`)
};

const ru_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Импортировать набор`)
};

const pt_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importar glossário`)
};

const it_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Importa glossario`)
};

const ar_glossary_import = /** @type {(inputs: Glossary_ImportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استيراد مجموعة`)
};

/**
* | output |
* | --- |
* | "Import set" |
*
* @param {Glossary_ImportInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const glossary_import = /** @type {((inputs?: Glossary_ImportInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Glossary_ImportInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_glossary_import(inputs)
	if (locale === "zh-TW") return zh_tw2_glossary_import(inputs)
	if (locale === "en") return en_glossary_import(inputs)
	if (locale === "ja") return ja_glossary_import(inputs)
	if (locale === "ko") return ko_glossary_import(inputs)
	if (locale === "fr") return fr_glossary_import(inputs)
	if (locale === "de") return de_glossary_import(inputs)
	if (locale === "es") return es_glossary_import(inputs)
	if (locale === "ru") return ru_glossary_import(inputs)
	if (locale === "pt") return pt_glossary_import(inputs)
	if (locale === "it") return it_glossary_import(inputs)
	return ar_glossary_import(inputs)
});