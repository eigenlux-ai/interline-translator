/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ target: NonNullable<unknown>, source: NonNullable<unknown>, title: NonNullable<unknown>, text: NonNullable<unknown>, salt: NonNullable<unknown> }} Expert_Placeholders_HintInputs */

const zh_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`可用占位符：${i?.target} 目标语 · ${i?.source} 源语 · ${i?.title} 页面标题 · ${i?.text} 待译文本（仅正文模板）· ${i?.salt} 批量标记盐值（仅批量模板）`)
};

const zh_tw2_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`可用佔位符：${i?.target} 目標語 · ${i?.source} 來源語 · ${i?.title} 頁面標題 · ${i?.text} 待譯文字（僅內文模板）· ${i?.salt} 批量標記鹽值（僅批量模板）`)
};

const en_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Placeholders: ${i?.target} target language · ${i?.source} source language · ${i?.title} page title · ${i?.text} the text (user template only) · ${i?.salt} batch marker salt (batch template only)`)
};

const ja_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`プレースホルダー：${i?.target} 目標言語 · ${i?.source} 原語 · ${i?.title} ページタイトル · ${i?.text} 対象テキスト（本文のみ）· ${i?.salt} バッチ用ソルト（バッチのみ）`)
};

const ko_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`자리표시자: ${i?.target} 대상 언어 · ${i?.source} 원어 · ${i?.title} 페이지 제목 · ${i?.text} 대상 텍스트(본문 전용) · ${i?.salt} 배치 마커 솔트(배치 전용)`)
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
	return /** @type {LocalizedString} */ (`Marcadores: ${i?.target} língua de destino · ${i?.source} língua de origem · ${i?.title} título da página · ${i?.text} o texto (apenas modelo de utilizador) · ${i?.salt} sal dos marcadores (apenas lote)`)
};

const it_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Segnaposto: ${i?.target} lingua di destinazione · ${i?.source} lingua di origine · ${i?.title} titolo pagina · ${i?.text} il testo (solo template utente) · ${i?.salt} salt dei marker (solo batch)`)
};

const ar_expert_placeholders_hint = /** @type {(inputs: Expert_Placeholders_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`العناصر النائبة: ${i?.target} اللغة الهدف · ${i?.source} لغة المصدر · ${i?.title} عنوان الصفحة · ${i?.text} النص (قالب النص فقط) · ${i?.salt} ملح العلامات (قالب الدفعة فقط)`)
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