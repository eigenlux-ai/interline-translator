/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} About_Data_TitleInputs */

const zh_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`数据与模型`)
};

const zh_tw2_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`資料與模型`)
};

const en_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Data & models`)
};

const ja_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`データとモデル`)
};

const ko_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`데이터 및 모델`)
};

const fr_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Données et modèles`)
};

const de_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Daten und Modelle`)
};

const es_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Datos y modelos`)
};

const ru_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Данные и модели`)
};

const pt_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dados e modelos`)
};

const it_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dati e modelli`)
};

const ar_about_data_title = /** @type {(inputs: About_Data_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`البيانات والنماذج`)
};

/**
* | output |
* | --- |
* | "Data & models" |
*
* @param {About_Data_TitleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const about_data_title = /** @type {((inputs?: About_Data_TitleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<About_Data_TitleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_about_data_title(inputs)
	if (locale === "zh-TW") return zh_tw2_about_data_title(inputs)
	if (locale === "en") return en_about_data_title(inputs)
	if (locale === "ja") return ja_about_data_title(inputs)
	if (locale === "ko") return ko_about_data_title(inputs)
	if (locale === "fr") return fr_about_data_title(inputs)
	if (locale === "de") return de_about_data_title(inputs)
	if (locale === "es") return es_about_data_title(inputs)
	if (locale === "ru") return ru_about_data_title(inputs)
	if (locale === "pt") return pt_about_data_title(inputs)
	if (locale === "it") return it_about_data_title(inputs)
	return ar_about_data_title(inputs)
});