/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Fill_Key_FirstInputs */

const zh_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`请先输入 API 密钥`)
};

const zh_tw2_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`請先輸入 API 金鑰`)
};

const en_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter an API key first`)
};

const ja_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先に API キー を入力してください`)
};

const ko_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`먼저 API 키를 입력하세요`)
};

const fr_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisissez d'abord une clé API`)
};

const de_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zuerst einen API-Schlüssel eingeben`)
};

const es_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Introduce primero una clave API`)
};

const ru_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сначала введите API-ключ`)
};

const pt_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Insira uma chave de API primeiro`)
};

const it_provider_fill_key_first = /** @type {(inputs: Provider_Fill_Key_FirstInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Inserisci prima una chiave API`)
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