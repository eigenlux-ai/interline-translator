/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_RemoveInputs */

const zh_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`移除`)
};

const zh_tw2_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`移除`)
};

const en_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remove`)
};

const ja_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`削除`)
};

const ko_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`제거`)
};

const fr_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer`)
};

const de_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entfernen`)
};

const es_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quitar`)
};

const ru_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Удалить`)
};

const pt_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remover`)
};

const it_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rimuovi`)
};

const ar_provider_remove = /** @type {(inputs: Provider_RemoveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إزالة`)
};

/**
* | output |
* | --- |
* | "Remove" |
*
* @param {Provider_RemoveInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_remove = /** @type {((inputs?: Provider_RemoveInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_RemoveInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_remove(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_remove(inputs)
	if (locale === "en") return en_provider_remove(inputs)
	if (locale === "ja") return ja_provider_remove(inputs)
	if (locale === "ko") return ko_provider_remove(inputs)
	if (locale === "fr") return fr_provider_remove(inputs)
	if (locale === "de") return de_provider_remove(inputs)
	if (locale === "es") return es_provider_remove(inputs)
	if (locale === "ru") return ru_provider_remove(inputs)
	if (locale === "pt") return pt_provider_remove(inputs)
	if (locale === "it") return it_provider_remove(inputs)
	return ar_provider_remove(inputs)
});