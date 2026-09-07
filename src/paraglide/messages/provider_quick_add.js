/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Quick_AddInputs */

const zh_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`快捷添加`)
};

const zh_tw2_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`快速新增`)
};

const en_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quick add`)
};

const ja_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`クイック追加`)
};

const ko_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`빠른 추가`)
};

const fr_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajout rapide`)
};

const de_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Schnell hinzufügen`)
};

const es_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Añadir rápidamente`)
};

const ru_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Быстрое добавление`)
};

const pt_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adição rápida`)
};

const it_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggiunta rapida`)
};

const ar_provider_quick_add = /** @type {(inputs: Provider_Quick_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة سريعة`)
};

/**
* | output |
* | --- |
* | "Quick add" |
*
* @param {Provider_Quick_AddInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_quick_add = /** @type {((inputs?: Provider_Quick_AddInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Quick_AddInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_quick_add(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_quick_add(inputs)
	if (locale === "en") return en_provider_quick_add(inputs)
	if (locale === "ja") return ja_provider_quick_add(inputs)
	if (locale === "ko") return ko_provider_quick_add(inputs)
	if (locale === "fr") return fr_provider_quick_add(inputs)
	if (locale === "de") return de_provider_quick_add(inputs)
	if (locale === "es") return es_provider_quick_add(inputs)
	if (locale === "ru") return ru_provider_quick_add(inputs)
	if (locale === "pt") return pt_provider_quick_add(inputs)
	if (locale === "it") return it_provider_quick_add(inputs)
	return ar_provider_quick_add(inputs)
});