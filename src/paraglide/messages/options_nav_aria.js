/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_AriaInputs */

const zh_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`设置分区`)
};

const zh_tw2_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定分區`)
};

const en_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings sections`)
};

const ja_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定の分類`)
};

const ko_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정 구역`)
};

const fr_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sections des réglages`)
};

const de_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Einstellungsbereiche`)
};

const es_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Secciones de ajustes`)
};

const ru_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Разделы настроек`)
};

const pt_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Secções das definições`)
};

const it_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sezioni delle impostazioni`)
};

const ar_options_nav_aria = /** @type {(inputs: Options_Nav_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أقسام الإعدادات`)
};

/**
* | output |
* | --- |
* | "Settings sections" |
*
* @param {Options_Nav_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_aria = /** @type {((inputs?: Options_Nav_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_aria(inputs)
	if (locale === "en") return en_options_nav_aria(inputs)
	if (locale === "ja") return ja_options_nav_aria(inputs)
	if (locale === "ko") return ko_options_nav_aria(inputs)
	if (locale === "fr") return fr_options_nav_aria(inputs)
	if (locale === "de") return de_options_nav_aria(inputs)
	if (locale === "es") return es_options_nav_aria(inputs)
	if (locale === "ru") return ru_options_nav_aria(inputs)
	if (locale === "pt") return pt_options_nav_aria(inputs)
	if (locale === "it") return it_options_nav_aria(inputs)
	return ar_options_nav_aria(inputs)
});