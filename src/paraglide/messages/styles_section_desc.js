/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Styles_Section_DescInputs */

const zh_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`用自然语言控制译文的语气、文风与用词——所选风格在整页、划词与输入翻译中一并生效。`)
};

const zh_tw2_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`以自然語言指定譯文的語氣、文風與用詞，適用於整頁、選取文字及輸入框翻譯。`)
};

const en_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Shape tone, register, and word choice with natural language — the active style applies to page, selection, and input translation alike.`)
};

const ja_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`自然言語で訳文の語調・文体・語彙を指定します。選択したスタイルはページ・選択・入力翻訳のすべてに適用されます。`)
};

const ko_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`자연어로 번역문의 어조·문체·어휘를 지정합니다. 선택한 스타일은 페이지·선택·입력 번역 모두에 적용됩니다.`)
};

const fr_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Définissez le ton, le registre et le vocabulaire en langage naturel — le style actif s'applique à la page, à la sélection et à la saisie.`)
};

const de_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Steuern Sie Ton, Register und Wortwahl in natürlicher Sprache — der aktive Stil gilt für Seiten-, Auswahl- und Eingabeübersetzung.`)
};

const es_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Define el tono, el registro y el vocabulario en lenguaje natural: el estilo activo se aplica a la página, la selección y la escritura.`)
};

const ru_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Задавайте тон, стиль и лексику обычным языком — активный стиль действует для страницы, выделения и ввода.`)
};

const pt_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Defina o tom, o registro e o vocabulário com suas próprias palavras. O estilo escolhido vale para páginas, textos selecionados e campos de texto.`)
};

const it_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Definisci tono, registro e lessico in linguaggio naturale: lo stile attivo vale per pagina, selezione e input.`)
};

const ar_styles_section_desc = /** @type {(inputs: Styles_Section_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حدّد النبرة والأسلوب والمفردات بلغة طبيعية — يسري النمط النشط على ترجمة الصفحة والتحديد والإدخال.`)
};

/**
* | output |
* | --- |
* | "Shape tone, register, and word choice with natural language — the active style applies to page, selection, and input translation alike." |
*
* @param {Styles_Section_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const styles_section_desc = /** @type {((inputs?: Styles_Section_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Styles_Section_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_styles_section_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_styles_section_desc(inputs)
	if (locale === "en") return en_styles_section_desc(inputs)
	if (locale === "ja") return ja_styles_section_desc(inputs)
	if (locale === "ko") return ko_styles_section_desc(inputs)
	if (locale === "fr") return fr_styles_section_desc(inputs)
	if (locale === "de") return de_styles_section_desc(inputs)
	if (locale === "es") return es_styles_section_desc(inputs)
	if (locale === "ru") return ru_styles_section_desc(inputs)
	if (locale === "pt") return pt_styles_section_desc(inputs)
	if (locale === "it") return it_styles_section_desc(inputs)
	return ar_styles_section_desc(inputs)
});