/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ target: NonNullable<unknown>, source: NonNullable<unknown>, title: NonNullable<unknown>, text: NonNullable<unknown>, salt: NonNullable<unknown> }} Expert_Placeholders_HintInputs */

const zh_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`可用占位符：${i?.target} 目标语言 · ${i?.source} 源语言 · ${i?.title} 页面标题 · ${i?.text} 待译文本（仅用户模板）· ${i?.salt} 批量标记标识（仅批量模板）`)
};

const zh_tw2_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`可用預留位置：${i?.target} 目標語言 · ${i?.source} 來源語言 · ${i?.title} 頁面標題 · ${i?.text} 待譯文字（僅使用者範本）· ${i?.salt} 批次標記識別值（僅批次範本）`)
};

const en_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Placeholders: ${i?.target} target language · ${i?.source} source language · ${i?.title} page title · ${i?.text} the text (user template only) · ${i?.salt} batch marker salt (batch template only)`)
};

const ja_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`変数：${i?.target} 翻訳先の言語 · ${i?.source} 元の言語 · ${i?.title} ページタイトル · ${i?.text} 翻訳する文章（ユーザーテンプレートのみ）· ${i?.salt} 一括翻訳マーカーの識別子（一括テンプレートのみ）`)
};

const ko_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`변수: ${i?.target} 대상 언어 · ${i?.source} 원본 언어 · ${i?.title} 페이지 제목 · ${i?.text} 번역할 글(사용자 템플릿 전용) · ${i?.salt} 일괄 번역 마커 식별자(일괄 템플릿 전용)`)
};

const fr_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Espaces réservés : ${i?.target} langue cible · ${i?.source} langue source · ${i?.title} titre de la page · ${i?.text} le texte (modèle utilisateur) · ${i?.salt} sel des marqueurs (modèle lot)`)
};

const de_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Platzhalter: ${i?.target} Zielsprache · ${i?.source} Quellsprache · ${i?.title} Seitentitel · ${i?.text} der Text (nur User-Vorlage) · ${i?.salt} Marker-Salt (nur Batch-Vorlage)`)
};

const es_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Marcadores: ${i?.target} idioma de destino · ${i?.source} idioma de origen · ${i?.title} título de la página · ${i?.text} el texto (solo plantilla de usuario) · ${i?.salt} sal de marcadores (solo lote)`)
};

const ru_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Плейсхолдеры: ${i?.target} целевой язык · ${i?.source} исходный язык · ${i?.title} заголовок страницы · ${i?.text} текст (только шаблон сообщения) · ${i?.salt} соль маркеров (только пакетный)`)
};

const pt_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Variáveis: ${i?.target} idioma de destino · ${i?.source} idioma de origem · ${i?.title} título da página · ${i?.text} texto a traduzir (apenas template do usuário) · ${i?.salt} identificador dos marcadores (apenas template em lotes)`)
};

const it_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Segnaposto: ${i?.target} lingua di destinazione · ${i?.source} lingua di origine · ${i?.title} titolo pagina · ${i?.text} il testo (solo template utente) · ${i?.salt} salt dei marker (solo batch)`)
};

const ar_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`المتغيّرات: ${i?.target} لغة الهدف · ${i?.source} لغة المصدر · ${i?.title} عنوان الصفحة · ${i?.text} النص المراد ترجمته (قالب المستخدم فقط) · ${i?.salt} معرّف علامات الدفعة (قالب الدفعة فقط)`)
};

/**
* | output |
* | --- |
* | "Placeholders: {target} target language · {source} source language · {title} page title · {text} the text (user template only) · {salt} batch marker salt (bat..." |
*
* @param {Expert_Placeholders_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_placeholders_hint = /** @type {((inputs: Expert_Placeholders_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_Placeholders_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_placeholders_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_placeholders_hint(inputs)
	if (locale === "en") return en_expert_placeholders_hint(inputs)
	if (locale === "ja") return ja_expert_placeholders_hint(inputs)
	if (locale === "ko") return ko_expert_placeholders_hint(inputs)
	if (locale === "fr") return fr_expert_placeholders_hint(inputs)
	if (locale === "de") return de_expert_placeholders_hint(inputs)
	if (locale === "es") return es_expert_placeholders_hint(inputs)
	if (locale === "ru") return ru_expert_placeholders_hint(inputs)
	if (locale === "pt") return pt_expert_placeholders_hint(inputs)
	if (locale === "it") return it_expert_placeholders_hint(inputs)
	return ar_expert_placeholders_hint(inputs)
});