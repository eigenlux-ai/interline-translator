/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ salt: NonNullable<unknown> }} Expert_Batch_System_LabelInputs */

const zh_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`整页批量 · system 模板（必须保留 [[${i?.salt}#N]] 标记指令）`)
};

const zh_tw2_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`整頁批量 · system 模板（必須保留 [[${i?.salt}#N]] 標記指令）`)
};

const en_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Whole-page batch · system template (must keep the [[${i?.salt}#N]] marker instruction)`)
};

const ja_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ページ一括 · system テンプレート（[[${i?.salt}#N]] マーカー指示は必須）`)
};

const ko_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`페이지 일괄 · system 템플릿([[${i?.salt}#N]] 마커 지시 필수)`)
};

const fr_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lot pleine page · modèle system (doit garder l'instruction de marqueur [[${i?.salt}#N]])`)
};

const de_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ganzseiten-Batch · System-Vorlage (Marker-Anweisung [[${i?.salt}#N]] muss bleiben)`)
};

const es_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lote de página · plantilla system (debe conservar la instrucción de marcador [[${i?.salt}#N]])`)
};

const ru_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Пакет страницы · шаблон system (инструкция маркеров [[${i?.salt}#N]] обязательна)`)
};

const pt_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lote de página · modelo system (tem de manter a instrução de marcador [[${i?.salt}#N]])`)
};

const it_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Batch di pagina · template system (deve mantenere l'istruzione marker [[${i?.salt}#N]])`)
};

const ar_expert_batch_system_label = /** @type {(inputs: Expert_Batch_System_LabelInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`دفعة الصفحة · قالب system (يجب إبقاء تعليمة العلامة [[${i?.salt}#N]])`)
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