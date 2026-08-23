/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Fill_Key_FirstInputs */

const zh_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先填入 API key`)
};

const zh_tw2_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先填入 API key`)
};

const en_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter an API key first`)
};

const ja_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先に API key を入力してください`)
};

const ko_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`먼저 API key를 입력하세요`)
};

const fr_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisissez d'abord une clé API`)
};

const de_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zuerst einen API key eingeben`)
};

const es_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Introduce primero una clave API`)
};

const ru_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сначала введите API key`)
};

const pt_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Introduza primeiro uma API key`)
};

const it_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inserisci prima una API key`)
};

const ar_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`أدخِل مفتاح API أولًا`)
};

/**
* | output |
* | --- |
* | "Enter an API key first" |
*
* @param {Provider_Fill_Key_FirstInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_fill_key_first = /** @type {((inputs?: Provider_Fill_Key_FirstInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Fill_Key_FirstInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_fill_key_first(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_fill_key_first(inputs)
	if (locale === "en") return en_provider_fill_key_first(inputs)
	if (locale === "ja") return ja_provider_fill_key_first(inputs)
	if (locale === "ko") return ko_provider_fill_key_first(inputs)
	if (locale === "fr") return fr_provider_fill_key_first(inputs)
	if (locale === "de") return de_provider_fill_key_first(inputs)
	if (locale === "es") return es_provider_fill_key_first(inputs)
	if (locale === "ru") return ru_provider_fill_key_first(inputs)
	if (locale === "pt") return pt_provider_fill_key_first(inputs)
	if (locale === "it") return it_provider_fill_key_first(inputs)
	return ar_provider_fill_key_first(inputs)
});