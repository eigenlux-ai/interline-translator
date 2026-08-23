/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Rich_Text_LabelInputs */

const zh_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`带样式翻译`)
};

const zh_tw2_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`帶樣式翻譯`)
};

const en_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keep inline formatting`)
};

const ja_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`書式を保持して翻訳`)
};

const ko_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`서식 유지 번역`)
};

const fr_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conserver la mise en forme`)
};

const de_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Formatierung beibehalten`)
};

const es_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Conservar el formato`)
};

const ru_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сохранять форматирование`)
};

const pt_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Manter a formatação`)
};

const it_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mantieni la formattazione`)
};

const ar_settings_rich_text_label = /** @type {(inputs: Settings_Rich_Text_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الترجمة مع الاحتفاظ بالتنسيق`)
};

/**
* | output |
* | --- |
* | "Keep inline formatting" |
*
* @param {Settings_Rich_Text_LabelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_rich_text_label = /** @type {((inputs?: Settings_Rich_Text_LabelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Rich_Text_LabelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_rich_text_label(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_rich_text_label(inputs)
	if (locale === "en") return en_settings_rich_text_label(inputs)
	if (locale === "ja") return ja_settings_rich_text_label(inputs)
	if (locale === "ko") return ko_settings_rich_text_label(inputs)
	if (locale === "fr") return fr_settings_rich_text_label(inputs)
	if (locale === "de") return de_settings_rich_text_label(inputs)
	if (locale === "es") return es_settings_rich_text_label(inputs)
	if (locale === "ru") return ru_settings_rich_text_label(inputs)
	if (locale === "pt") return pt_settings_rich_text_label(inputs)
	if (locale === "it") return it_settings_rich_text_label(inputs)
	return ar_settings_rich_text_label(inputs)
});