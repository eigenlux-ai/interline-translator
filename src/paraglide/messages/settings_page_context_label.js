/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Page_Context_LabelInputs */

const zh_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`通读全文`)
};

const zh_tw2_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`通讀全文`)
};

const en_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read the whole page first`)
};

const ja_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ページ全体を先読み`)
};

const ko_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`전체 페이지 먼저 읽기`)
};

const fr_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lire d'abord toute la page`)
};

const de_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zuerst die ganze Seite lesen`)
};

const es_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leer primero toda la página`)
};

const ru_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сначала прочитать всю страницу`)
};

const pt_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ler primeiro a página inteira`)
};

const it_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leggi prima l'intera pagina`)
};

const ar_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة الصفحة كاملة أولاً`)
};

/**
* | output |
* | --- |
* | "Read the whole page first" |
*
* @param {Settings_Page_Context_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_page_context_label = /** @type {((inputs?: Settings_Page_Context_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Page_Context_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_page_context_label(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_page_context_label(inputs)
	if (locale === "en") return en_settings_page_context_label(inputs)
	if (locale === "ja") return ja_settings_page_context_label(inputs)
	if (locale === "ko") return ko_settings_page_context_label(inputs)
	if (locale === "fr") return fr_settings_page_context_label(inputs)
	if (locale === "de") return de_settings_page_context_label(inputs)
	if (locale === "es") return es_settings_page_context_label(inputs)
	if (locale === "ru") return ru_settings_page_context_label(inputs)
	if (locale === "pt") return pt_settings_page_context_label(inputs)
	if (locale === "it") return it_settings_page_context_label(inputs)
	return ar_settings_page_context_label(inputs)
});