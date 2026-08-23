/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_AddInputs */

const zh_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`添加引擎`)
};

const zh_tw2_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`新增引擎`)
};

const en_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add engine`)
};

const ja_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`エンジンを追加`)
};

const ko_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`엔진 추가`)
};

const fr_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter un moteur`)
};

const de_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Engine hinzufügen`)
};

const es_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Añadir motor`)
};

const ru_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Добавить движок`)
};

const pt_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adicionar motor`)
};

const it_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aggiungi motore`)
};

const ar_provider_add = /** @type {(inputs: Provider_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إضافة محرّك`)
};

/**
* | output |
* | --- |
* | "Add engine" |
*
* @param {Provider_AddInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_add = /** @type {((inputs?: Provider_AddInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_AddInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_add(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_add(inputs)
	if (locale === "en") return en_provider_add(inputs)
	if (locale === "ja") return ja_provider_add(inputs)
	if (locale === "ko") return ko_provider_add(inputs)
	if (locale === "fr") return fr_provider_add(inputs)
	if (locale === "de") return de_provider_add(inputs)
	if (locale === "es") return es_provider_add(inputs)
	if (locale === "ru") return ru_provider_add(inputs)
	if (locale === "pt") return pt_provider_add(inputs)
	if (locale === "it") return it_provider_add(inputs)
	return ar_provider_add(inputs)
});