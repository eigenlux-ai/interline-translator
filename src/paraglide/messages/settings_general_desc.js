/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_General_DescInputs */

const zh_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`设置原文与译文语言、默认翻译引擎及显示方式。`)
};

const zh_tw2_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定原文與譯文語言、預設翻譯引擎及顯示方式。`)
};

const en_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choose your languages, default translation engine, and display preferences.`)
};

const ja_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳する言語、既定のエンジン、訳文の表示方法を設定します。`)
};

const ko_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역할 언어, 기본 번역 엔진, 번역문 표시 방식을 설정합니다.`)
};

const fr_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Paire de langues, moteur par défaut et présentation des traductions.`)
};

const de_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sprachpaar, Standard-Engine und die Darstellung der Übersetzungen.`)
};

const es_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Par de idiomas, motor predeterminado y cómo se presentan las traducciones.`)
};

const ru_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Выберите языки, движок по умолчанию и способ отображения перевода.`)
};

const pt_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Par de idiomas, motor padrão e como as traduções são apresentadas.`)
};

const it_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coppia di lingue, motore predefinito e il modo in cui le traduzioni vengono mostrate.`)
};

const ar_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اختر لغتي الترجمة والمحرّك الافتراضي وطريقة عرض النص المترجم.`)
};

/**
* | output |
* | --- |
* | "Choose your languages, default translation engine, and display preferences." |
*
* @param {Settings_General_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_general_desc = /** @type {((inputs?: Settings_General_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_General_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_general_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_general_desc(inputs)
	if (locale === "en") return en_settings_general_desc(inputs)
	if (locale === "ja") return ja_settings_general_desc(inputs)
	if (locale === "ko") return ko_settings_general_desc(inputs)
	if (locale === "fr") return fr_settings_general_desc(inputs)
	if (locale === "de") return de_settings_general_desc(inputs)
	if (locale === "es") return es_settings_general_desc(inputs)
	if (locale === "ru") return ru_settings_general_desc(inputs)
	if (locale === "pt") return pt_settings_general_desc(inputs)
	if (locale === "it") return it_settings_general_desc(inputs)
	return ar_settings_general_desc(inputs)
});