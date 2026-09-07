/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Page_Context_LabelInputs */

const zh_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`参考页面上下文`)
};

const zh_tw2_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`參考頁面上下文`)
};

const en_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use page context`)
};

const ja_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ページの文脈を参照`)
};

const ko_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`페이지 문맥 참조`)
};

const fr_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utiliser le contexte de la page`)
};

const de_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Seitenkontext berücksichtigen`)
};

const es_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usar el contexto de la página`)
};

const ru_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Учитывать контекст страницы`)
};

const pt_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usar o contexto da página`)
};

const it_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usa il contesto della pagina`)
};

const ar_settings_page_context_label = /** @type {(inputs: Settings_Page_Context_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستعانة بسياق الصفحة`)
};

/**
* | output |
* | --- |
* | "Use page context" |
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