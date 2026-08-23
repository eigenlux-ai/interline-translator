/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Page_Context_DescInputs */

const zh_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先概览整页再翻译：全页译名与语境更连贯。会把页面全文（含未滚动到的部分）发送给翻译引擎，且每页多一次调用。仅对 AI 引擎生效。`)
};

const zh_tw2_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先概覽整頁再翻譯：全頁譯名與語境更連貫。會把頁面全文（含未捲動到的部分）傳送給翻譯引擎，且每頁多一次呼叫。僅對 AI 引擎生效。`)
};

const en_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Overview the page before translating: names and context stay consistent page-wide. Sends the FULL page text (including parts you never scroll to) to the engine, and costs one extra call per page. AI engines only.`)
};

const ja_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳前にページ全体を概観し、訳名と文脈をページ全体で一貫させます。ページ全文（未スクロール部分を含む）をエンジンに送信し、ページごとに 1 回追加の呼び出しが発生します。AI エンジンのみ。`)
};

const ko_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 전에 페이지 전체를 개관하여 번역어와 문맥을 페이지 전체에서 일관되게 유지합니다. 스크롤하지 않은 부분을 포함한 전체 텍스트를 엔진에 전송하며 페이지당 호출이 1회 추가됩니다. AI 엔진 전용.`)
};

const fr_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Survole la page avant de traduire : noms et contexte restent cohérents sur toute la page. Envoie le texte COMPLET (y compris les parties jamais affichées) au moteur, avec un appel supplémentaire par page. Moteurs IA uniquement.`)
};

const de_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verschafft sich vor dem Übersetzen einen Überblick: Namen und Kontext bleiben seitenweit konsistent. Sendet den GESAMTEN Seitentext (auch nie gescrollte Teile) an die Engine und kostet einen zusätzlichen Aufruf pro Seite. Nur KI-Engines.`)
};

const es_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revisa la página antes de traducir: nombres y contexto coherentes en toda la página. Envía el texto COMPLETO (incluidas partes nunca desplazadas) al motor, con una llamada extra por página. Solo motores de IA.`)
};

const ru_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Просматривает страницу перед переводом: имена и контекст согласованы по всей странице. Отправляет ПОЛНЫЙ текст (включая непрокрученные части) движку и добавляет один вызов на страницу. Только ИИ-движки.`)
};

const pt_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Faz uma visão geral antes de traduzir: nomes e contexto coerentes em toda a página. Envia o texto COMPLETO (incluindo partes nunca vistas) ao motor, com uma chamada extra por página. Apenas motores de IA.`)
};

const it_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Panoramica della pagina prima di tradurre: nomi e contesto coerenti in tutta la pagina. Invia il testo COMPLETO (incluse parti mai scorse) al motore, con una chiamata extra per pagina. Solo motori IA.`)
};

const ar_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يستعرض الصفحة قبل الترجمة لتبقى الأسماء والسياق متسقة عبر الصفحة. يرسل النص الكامل (بما فيه الأجزاء غير المعروضة) إلى المحرك مع استدعاء إضافي لكل صفحة. لمحركات الذكاء الاصطناعي فقط.`)
};

/**
* | output |
* | --- |
* | "Overview the page before translating: names and context stay consistent page-wide. Sends the FULL page text (including parts you never scroll to) to the engi..." |
*
* @param {Settings_Page_Context_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_page_context_desc = /** @type {((inputs?: Settings_Page_Context_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Page_Context_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_page_context_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_page_context_desc(inputs)
	if (locale === "en") return en_settings_page_context_desc(inputs)
	if (locale === "ja") return ja_settings_page_context_desc(inputs)
	if (locale === "ko") return ko_settings_page_context_desc(inputs)
	if (locale === "fr") return fr_settings_page_context_desc(inputs)
	if (locale === "de") return de_settings_page_context_desc(inputs)
	if (locale === "es") return es_settings_page_context_desc(inputs)
	if (locale === "ru") return ru_settings_page_context_desc(inputs)
	if (locale === "pt") return pt_settings_page_context_desc(inputs)
	if (locale === "it") return it_settings_page_context_desc(inputs)
	return ar_settings_page_context_desc(inputs)
});