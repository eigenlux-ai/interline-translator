/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Panel_Input_PlaceholderInputs */

const zh_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`输入或粘贴要翻译的文本…`)
};

const zh_tw2_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`輸入或貼上要翻譯的文字…`)
};

const en_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type or paste text to translate…`)
};

const ja_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳する文章を入力または貼り付け…`)
};

const ko_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역할 텍스트를 입력하거나 붙여넣기…`)
};

const fr_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisissez ou collez le texte à traduire…`)
};

const de_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Text zum Übersetzen eingeben oder einfügen…`)
};

const es_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escribe o pega el texto que quieras traducir…`)
};

const ru_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Введите или вставьте текст для перевода…`)
};

const pt_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escreva ou cole o texto a traduzir…`)
};

const it_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scrivi o incolla il testo da tradurre…`)
};

const ar_panel_input_placeholder = /** @type {(inputs: Panel_Input_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اكتب أو الصق النص المراد ترجمته…`)
};

/**
* | output |
* | --- |
* | "Type or paste text to translate…" |
*
* @param {Panel_Input_PlaceholderInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const panel_input_placeholder = /** @type {((inputs?: Panel_Input_PlaceholderInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Panel_Input_PlaceholderInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_panel_input_placeholder(inputs)
	if (locale === "zh-TW") return zh_tw2_panel_input_placeholder(inputs)
	if (locale === "en") return en_panel_input_placeholder(inputs)
	if (locale === "ja") return ja_panel_input_placeholder(inputs)
	if (locale === "ko") return ko_panel_input_placeholder(inputs)
	if (locale === "fr") return fr_panel_input_placeholder(inputs)
	if (locale === "de") return de_panel_input_placeholder(inputs)
	if (locale === "es") return es_panel_input_placeholder(inputs)
	if (locale === "ru") return ru_panel_input_placeholder(inputs)
	if (locale === "pt") return pt_panel_input_placeholder(inputs)
	if (locale === "it") return it_panel_input_placeholder(inputs)
	return ar_panel_input_placeholder(inputs)
});