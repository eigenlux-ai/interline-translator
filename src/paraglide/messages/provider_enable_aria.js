/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Enable_AriaInputs */

const zh_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`启用`)
};

const zh_tw2_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`啟用`)
};

const en_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enable`)
};

const ja_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`有効にする`)
};

const ko_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`켜기`)
};

const fr_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activer`)
};

const de_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aktivieren`)
};

const es_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Activar`)
};

const ru_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включить`)
};

const pt_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ativar`)
};

const it_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attiva`)
};

const ar_provider_enable_aria = /** @type {(inputs: Provider_Enable_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تفعيل`)
};

/**
* | output |
* | --- |
* | "Enable" |
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