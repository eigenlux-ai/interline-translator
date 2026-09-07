/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Page_Context_DescInputs */

const zh_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译前，将页面文本的前 8,000 个字符以内（可能包含尚未滚动到的内容）发送给 AI 引擎生成上下文，帮助统一译名和术语。每页额外请求一次，仅适用于 AI 引擎。`)
};

const zh_tw2_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯前，將頁面文字的前 8,000 個字元以內（可能包含尚未捲動到的內容）傳送給 AI 引擎產生上下文，協助統一譯名與術語。每頁額外請求一次，僅適用於 AI 引擎。`)
};

const en_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Before translating, send up to the first 8,000 characters of page text, including content outside the viewport, to the AI engine for context. This helps keep names and terminology consistent and adds one request per page. AI engines only.`)
};

const ja_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳前に、画面外の内容を含むページの先頭から最大 8,000 文字を AI エンジンに送り、文脈を把握します。訳名や用語の統一に役立ちます。ページごとにリクエストが 1 回増えます。AI エンジンのみ対応しています。`)
};

const ko_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 전에 화면 밖의 내용을 포함한 페이지 텍스트의 처음 최대 8,000자를 AI 엔진에 보내 문맥을 파악합니다. 이름과 용어를 일관되게 번역하는 데 도움이 됩니다. 페이지당 요청이 1회 추가되며 AI 엔진에서만 사용할 수 있습니다.`)
};

const fr_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Avant la traduction, envoie au moteur d’IA jusqu’aux 8 000 premiers caractères de la page, y compris du contenu hors écran, pour en dégager le contexte. Cela aide à harmoniser les noms et les termes et ajoute une requête par page. Moteurs d’IA uniquement.`)
};

const de_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sendet vor der Übersetzung bis zu 8.000 Zeichen vom Anfang der Seite an die KI-Engine, auch Inhalte außerhalb des sichtbaren Bereichs. Der daraus gewonnene Kontext hilft, Namen und Begriffe einheitlich zu übersetzen. Eine zusätzliche Anfrage pro Seite; nur für KI-Engines.`)
};

const es_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Antes de traducir, envía al motor de IA hasta los primeros 8.000 caracteres de la página, incluido contenido fuera de la vista, para obtener contexto. Ayuda a unificar nombres y términos y añade una solicitud por página. Solo para motores de IA.`)
};

const ru_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перед переводом отправляет ИИ-движку до 8 000 символов с начала страницы, включая содержимое за пределами экрана, для определения контекста. Это помогает единообразно переводить имена и термины. Один дополнительный запрос на страницу; только для ИИ-движков.`)
};

const pt_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Antes de traduzir, envia ao motor de IA até os primeiros 8.000 caracteres da página, incluindo conteúdo fora da área visível, para obter contexto. Ajuda a uniformizar nomes e termos e adiciona uma solicitação por página. Apenas para motores de IA.`)
};

const it_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prima di tradurre, invia al motore di IA fino ai primi 8.000 caratteri della pagina, inclusi contenuti fuori dalla vista, per ricavarne il contesto. Aiuta a uniformare nomi e termini e aggiunge una richiesta per pagina. Solo per motori di IA.`)
};

const ar_settings_page_context_desc = /** @type {(inputs: Settings_Page_Context_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يرسل إلى محرّك الذكاء الاصطناعي ما يصل إلى أول 8,000 محرف من الصفحة، بما فيها محتوى خارج الجزء الظاهر، لفهم السياق قبل الترجمة. يساعد ذلك على توحيد الأسماء والمصطلحات، ويضيف طلبًا واحدًا لكل صفحة. لمحرّكات الذكاء الاصطناعي فقط.`)
};

/**
* | output |
* | --- |
* | "Before translating, send up to the first 8,000 characters of page text, including content outside the viewport, to the AI engine for context. This helps keep..." |
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