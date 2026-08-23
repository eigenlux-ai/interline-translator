/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Headers_DescInputs */

const zh_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`每行一条,格式 Header-Name: value`)
};

const zh_tw2_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`每行一條,格式 Header-Name: value`)
};

const en_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`One per line, as Header-Name: value`)
};

const ja_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`1 行に 1 つ、Header-Name: value の形式で`)
};

const ko_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`한 줄에 하나씩, Header-Name: value 형식으로`)
};

const fr_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un par ligne, au format Header-Name: value`)
};

const de_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Einer pro Zeile, als Header-Name: value`)
};

const es_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Una por línea, con el formato Header-Name: value`)
};

const ru_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`По одному в строке, в виде Header-Name: value`)
};

const pt_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Um por linha, no formato Header-Name: value`)
};

const it_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Uno per riga, nel formato Header-Name: value`)
};

const ar_provider_headers_desc = /** @type {(inputs: Provider_Headers_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`واحدة في كل سطر، بالصيغة Header-Name: value`)
};

/**
* | output |
* | --- |
* | "One per line, as Header-Name: value" |
*
* @param {Provider_Headers_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_headers_desc = /** @type {((inputs?: Provider_Headers_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Headers_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_headers_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_headers_desc(inputs)
	if (locale === "en") return en_provider_headers_desc(inputs)
	if (locale === "ja") return ja_provider_headers_desc(inputs)
	if (locale === "ko") return ko_provider_headers_desc(inputs)
	if (locale === "fr") return fr_provider_headers_desc(inputs)
	if (locale === "de") return de_provider_headers_desc(inputs)
	if (locale === "es") return es_provider_headers_desc(inputs)
	if (locale === "ru") return ru_provider_headers_desc(inputs)
	if (locale === "pt") return pt_provider_headers_desc(inputs)
	if (locale === "it") return it_provider_headers_desc(inputs)
	return ar_provider_headers_desc(inputs)
});