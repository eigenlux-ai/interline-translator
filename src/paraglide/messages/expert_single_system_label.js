/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expert_Single_System_LabelInputs */

const zh_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`单条翻译 · 系统模板`)
};

const zh_tw2_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`單筆翻譯 · 系統範本`)
};

const en_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Single translation · system template`)
};

const ja_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`単発翻訳 · システムテンプレート`)
};

const ko_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`단건 번역 · 시스템 템플릿`)
};

const fr_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction individuelle · modèle système`)
};

const de_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Einzelübersetzung · System-Vorlage`)
};

const es_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción individual · plantilla del sistema`)
};

const ru_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Отдельный перевод · системный шаблон`)
};

const pt_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução individual · template do sistema`)
};

const it_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzione singola · template di sistema`)
};

const ar_expert_single_system_label = /** @type {(inputs: Expert_Single_System_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة فردية · قالب النظام`)
};

/**
* | output |
* | --- |
* | "Single translation · system template" |
*
* @param {Expert_Single_System_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_single_system_label = /** @type {((inputs?: Expert_Single_System_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_Single_System_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_single_system_label(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_single_system_label(inputs)
	if (locale === "en") return en_expert_single_system_label(inputs)
	if (locale === "ja") return ja_expert_single_system_label(inputs)
	if (locale === "ko") return ko_expert_single_system_label(inputs)
	if (locale === "fr") return fr_expert_single_system_label(inputs)
	if (locale === "de") return de_expert_single_system_label(inputs)
	if (locale === "es") return es_expert_single_system_label(inputs)
	if (locale === "ru") return ru_expert_single_system_label(inputs)
	if (locale === "pt") return pt_expert_single_system_label(inputs)
	if (locale === "it") return it_expert_single_system_label(inputs)
	return ar_expert_single_system_label(inputs)
});