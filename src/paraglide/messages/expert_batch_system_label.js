/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ salt: NonNullable<unknown> }} Expert_Batch_System_LabelInputs */

const zh_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`整页批量翻译 · 系统模板（须保留 [[${i?.salt}#N]] 标记指令）`)
};

const zh_tw2_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`整頁批次翻譯 · 系統範本（須保留 [[${i?.salt}#N]] 標記指令）`)
};

const en_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Whole-page batch · system template (must keep the [[${i?.salt}#N]] marker instruction)`)
};

const ja_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ページ一括翻訳 · システムテンプレート（[[${i?.salt}#N]] の指示を保持）`)
};

const ko_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`페이지 일괄 번역 · 시스템 템플릿([[${i?.salt}#N]] 지시 유지)`)
};

const fr_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Traduction de page par lots · modèle système (conserver la consigne [[${i?.salt}#N]])`)
};

const de_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ganzseiten-Batch · System-Vorlage (Marker-Anweisung [[${i?.salt}#N]] muss bleiben)`)
};

const es_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Traducción de página por lotes · plantilla del sistema (conservar la instrucción [[${i?.salt}#N]])`)
};

const ru_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Пакетный перевод страницы · системный шаблон (сохраните инструкцию [[${i?.salt}#N]])`)
};

const pt_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Tradução de página em lotes · template do sistema (manter a instrução [[${i?.salt}#N]])`)
};

const it_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Traduzione di pagina in batch · template di sistema (conservare l’istruzione [[${i?.salt}#N]])`)
};

const ar_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ترجمة الصفحة على دفعات · قالب النظام (يجب إبقاء تعليمة [[${i?.salt}#N]])`)
};

/**
* | output |
* | --- |
* | "Whole-page batch · system template (must keep the [[{salt}#N]] marker instruction)" |
*
* @param {Expert_Batch_System_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_batch_system_label = /** @type {((inputs: Expert_Batch_System_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_Batch_System_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_batch_system_label(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_batch_system_label(inputs)
	if (locale === "en") return en_expert_batch_system_label(inputs)
	if (locale === "ja") return ja_expert_batch_system_label(inputs)
	if (locale === "ko") return ko_expert_batch_system_label(inputs)
	if (locale === "fr") return fr_expert_batch_system_label(inputs)
	if (locale === "de") return de_expert_batch_system_label(inputs)
	if (locale === "es") return es_expert_batch_system_label(inputs)
	if (locale === "ru") return ru_expert_batch_system_label(inputs)
	if (locale === "pt") return pt_expert_batch_system_label(inputs)
	if (locale === "it") return it_expert_batch_system_label(inputs)
	return ar_expert_batch_system_label(inputs)
});