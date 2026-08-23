/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_NameInputs */

const zh_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`名称`)
};

const zh_tw2_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`名稱`)
};

const en_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const ja_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`名前`)
};

const ko_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이름`)
};

const fr_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nom`)
};

const de_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Name`)
};

const es_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nombre`)
};

const ru_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Название`)
};

const pt_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nome`)
};

const it_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nome`)
};

const ar_provider_name = /** @type {(inputs: Provider_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاسم`)
};

/**
* | output |
* | --- |
* | "Name" |
*
* @param {Provider_NameInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_name = /** @type {((inputs?: Provider_NameInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_NameInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_name(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_name(inputs)
	if (locale === "en") return en_provider_name(inputs)
	if (locale === "ja") return ja_provider_name(inputs)
	if (locale === "ko") return ko_provider_name(inputs)
	if (locale === "fr") return fr_provider_name(inputs)
	if (locale === "de") return de_provider_name(inputs)
	if (locale === "es") return es_provider_name(inputs)
	if (locale === "ru") return ru_provider_name(inputs)
	if (locale === "pt") return pt_provider_name(inputs)
	if (locale === "it") return it_provider_name(inputs)
	return ar_provider_name(inputs)
});