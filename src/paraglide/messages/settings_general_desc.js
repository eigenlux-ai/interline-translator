/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_General_DescInputs */

const zh_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`语言对、默认引擎,以及译文的呈现方式。`)
};

const zh_tw2_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`語言配對、預設引擎,以及譯文的呈現方式。`)
};

const en_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language pair, default engine, and how translations are presented.`)
};

const ja_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`言語ペア、既定のエンジン、そして訳文の見せ方。`)
};

const ko_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`언어 쌍, 기본 엔진, 그리고 번역문을 보여 주는 방식.`)
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
	return /** @type {LocalizedString} */ (`Пара языков, движок по умолчанию и то, как показывается перевод.`)
};

const pt_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Par de idiomas, motor padrão e como as traduções são apresentadas.`)
};

const it_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Coppia di lingue, motore predefinito e il modo in cui le traduzioni vengono mostrate.`)
};

const ar_settings_general_desc = /** @type {(inputs: Settings_General_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`زوج اللغتين، والمحرّك الافتراضي، وطريقة عرض الترجمات.`)
};

/**
* | output |
* | --- |
* | "Language pair, default engine, and how translations are presented." |
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