/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Enable_AriaInputs */

const zh_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`启用翻译引擎`)
};

const zh_tw2_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`啟用翻譯引擎`)
};

const en_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable translation engine`)
};

const ja_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳エンジンを有効にする`)
};

const ko_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 엔진 활성화`)
};

const fr_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer le moteur de traduction`)
};

const de_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzungs-Engine aktivieren`)
};

const es_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activar el motor de traducción`)
};

const ru_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включить движок перевода`)
};

const pt_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ativar motor de tradução`)
};

const it_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attiva il motore di traduzione`)
};

const ar_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تفعيل محرّك الترجمة`)
};

/**
* | output |
* | --- |
* | "Enable translation engine" |
*
* @param {Provider_Enable_AriaInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_enable_aria = /** @type {((inputs?: Provider_Enable_AriaInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Enable_AriaInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_enable_aria(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_enable_aria(inputs)
	if (locale === "en") return en_provider_enable_aria(inputs)
	if (locale === "ja") return ja_provider_enable_aria(inputs)
	if (locale === "ko") return ko_provider_enable_aria(inputs)
	if (locale === "fr") return fr_provider_enable_aria(inputs)
	if (locale === "de") return de_provider_enable_aria(inputs)
	if (locale === "es") return es_provider_enable_aria(inputs)
	if (locale === "ru") return ru_provider_enable_aria(inputs)
	if (locale === "pt") return pt_provider_enable_aria(inputs)
	if (locale === "it") return it_provider_enable_aria(inputs)
	return ar_provider_enable_aria(inputs)
});