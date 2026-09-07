/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ salt: NonNullable<unknown> }} Expert_Error_Batch_MarkerInputs */

const zh_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`批量模板须原样保留 [[${i?.salt}#，以便将每段译文与原文对应。`)
};

const zh_tw2_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`批次範本須原樣保留 [[${i?.salt}#，才能讓每段譯文對應到原文。`)
};

const en_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Keep the exact fragment [[${i?.salt}# in the batch template. It is required to match each translation to its source text.`)
};

const ja_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`一括翻訳テンプレートには [[${i?.salt}# をそのまま残してください。訳文をそれぞれの原文に対応付けるために必要です。`)
};

const ko_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`일괄 번역 템플릿에 [[${i?.salt}# 부분을 그대로 남겨 두세요. 각 번역문을 해당 원문과 연결하는 데 필요합니다.`)
};

const fr_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Conservez exactement le fragment [[${i?.salt}# dans le modèle de lot. Il permet d’associer chaque traduction à son texte source.`)
};

const de_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Behalten Sie das Fragment [[${i?.salt}# unverändert in der Batch-Vorlage. Es wird benötigt, um jede Übersetzung ihrem Ausgangstext zuzuordnen.`)
};

const es_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Conserva el fragmento exacto [[${i?.salt}# en la plantilla por lotes. Permite vincular cada traducción con su texto original.`)
};

const ru_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Сохраните в пакетном шаблоне точный фрагмент [[${i?.salt}#. Он нужен для сопоставления каждого перевода с исходным текстом.`)
};

const pt_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Mantenha o trecho exato [[${i?.salt}# no template em lotes. Ele permite associar cada tradução ao texto original.`)
};

const it_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Conserva il frammento esatto [[${i?.salt}# nel template batch. Serve ad associare ogni traduzione al testo originale.`)
};

const ar_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`أبقِ المقطع [[${i?.salt}# كما هو في قالب الدفعة. فهو ضروري لربط كل ترجمة بنصها الأصلي.`)
};

/**
* | output |
* | --- |
* | "Keep the exact fragment [[{salt}# in the batch template. It is required to match each translation to its source text." |
*
* @param {Expert_Error_Batch_MarkerInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_error_batch_marker = /** @type {((inputs: Expert_Error_Batch_MarkerInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_Error_Batch_MarkerInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_error_batch_marker(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_error_batch_marker(inputs)
	if (locale === "en") return en_expert_error_batch_marker(inputs)
	if (locale === "ja") return ja_expert_error_batch_marker(inputs)
	if (locale === "ko") return ko_expert_error_batch_marker(inputs)
	if (locale === "fr") return fr_expert_error_batch_marker(inputs)
	if (locale === "de") return de_expert_error_batch_marker(inputs)
	if (locale === "es") return es_expert_error_batch_marker(inputs)
	if (locale === "ru") return ru_expert_error_batch_marker(inputs)
	if (locale === "pt") return pt_expert_error_batch_marker(inputs)
	if (locale === "it") return it_expert_error_batch_marker(inputs)
	return ar_expert_error_batch_marker(inputs)
});