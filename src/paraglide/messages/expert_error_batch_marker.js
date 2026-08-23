/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ salt: NonNullable<unknown> }} Expert_Error_Batch_MarkerInputs */

const zh_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`批量模板必须保留字面片段 [[${i?.salt}# ——整页翻译依赖这段标记指令，删掉它会让整页翻译直接失效。`)
};

const zh_tw2_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`批量模板必須保留字面片段 [[${i?.salt}# ——整頁翻譯依賴這段標記指令，刪掉它會讓整頁翻譯直接失效。`)
};

const en_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`The batch template must keep the literal fragment [[${i?.salt}# — whole-page translation depends on this marker instruction; removing it breaks it outright.`)
};

const ja_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`バッチテンプレートには [[${i?.salt}# の断片が必須です。ページ全体の翻訳はこのマーカー指示に依存しており、削除すると動かなくなります。`)
};

const ko_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`배치 템플릿에는 [[${i?.salt}# 조각이 반드시 있어야 합니다. 전체 페이지 번역이 이 마커 지시에 의존하며, 삭제하면 즉시 작동을 멈춥니다.`)
};

const fr_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Le modèle de lot doit garder le fragment littéral [[${i?.salt}# — la traduction pleine page dépend de cette instruction ; la retirer la casse net.`)
};

const de_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Die Batch-Vorlage muss das Fragment [[${i?.salt}# behalten — die Ganzseitenübersetzung hängt an dieser Marker-Anweisung; ohne sie bricht sie sofort.`)
};

const es_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`La plantilla de lote debe conservar el fragmento literal [[${i?.salt}# — la traducción de página completa depende de esa instrucción; quitarla la rompe de inmediato.`)
};

const ru_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`В пакетном шаблоне обязан остаться фрагмент [[${i?.salt}# — перевод всей страницы держится на этой инструкции; без неё он сразу ломается.`)
};

const pt_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`O modelo de lote tem de manter o fragmento literal [[${i?.salt}# — a tradução da página inteira depende dessa instrução; removê-la quebra-a de imediato.`)
};

const it_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Il template batch deve mantenere il frammento [[${i?.salt}# — la traduzione dell'intera pagina dipende da questa istruzione; toglierla la rompe subito.`)
};

const ar_expert_error_batch_marker = /** @type {(inputs: Expert_Error_Batch_MarkerInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`يجب أن يحتفظ قالب الدفعة بالمقطع الحرفي [[${i?.salt}# — تعتمد ترجمة الصفحة الكاملة على هذه التعليمة، وحذفها يعطّلها فوراً.`)
};

/**
* | output |
* | --- |
* | "The batch template must keep the literal fragment [[{salt}# — whole-page translation depends on this marker instruction; removing it breaks it outright." |
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