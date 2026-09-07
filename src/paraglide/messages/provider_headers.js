/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_HeadersInputs */

const zh_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`附加请求头（可选）`)
};

const zh_tw2_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`額外請求標頭（選填）`)
};

const en_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Extra headers (optional)`)
};

const ja_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`追加ヘッダー(任意)`)
};

const ko_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`추가 헤더(선택)`)
};

const fr_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En-têtes supplémentaires (facultatifs)`)
};

const de_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Zusätzliche Header (optional)`)
};

const es_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cabeceras adicionales (opcionales)`)
};

const ru_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Дополнительные заголовки (необязательно)`)
};

const pt_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cabeçalhos adicionais (opcionais)`)
};

const it_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Header aggiuntivi (facoltativi)`)
};

const ar_provider_headers = /** @type {(inputs: Provider_HeadersInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترويسات إضافية (اختياري)`)
};

/**
* | output |
* | --- |
* | "Extra headers (optional)" |
*
* @param {Provider_HeadersInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_headers = /** @type {((inputs?: Provider_HeadersInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_HeadersInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_headers(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_headers(inputs)
	if (locale === "en") return en_provider_headers(inputs)
	if (locale === "ja") return ja_provider_headers(inputs)
	if (locale === "ko") return ko_provider_headers(inputs)
	if (locale === "fr") return fr_provider_headers(inputs)
	if (locale === "de") return de_provider_headers(inputs)
	if (locale === "es") return es_provider_headers(inputs)
	if (locale === "ru") return ru_provider_headers(inputs)
	if (locale === "pt") return pt_provider_headers(inputs)
	if (locale === "it") return it_provider_headers(inputs)
	return ar_provider_headers(inputs)
});