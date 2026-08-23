/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Base_Url_InsecureInputs */

const zh_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`请填 https:// 地址，http:// 只对本机开放。`)
};

const zh_tw2_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`請填 https:// 網址，http:// 僅對本機開放。`)
};

const en_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use an https:// URL — http:// only works for localhost.`)
};

const ja_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`https:// の URL を入力してください。http:// はローカルホストのみ有効です。`)
};

const ko_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`https:// 주소를 입력하세요. http://는 로컬호스트에서만 쓸 수 있습니다.`)
};

const fr_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utilisez une URL https:// — http:// n'est accepté que pour localhost.`)
};

const de_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bitte eine https://-URL angeben — http:// gilt nur für localhost.`)
};

const es_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usa una URL https:// — http:// solo se admite para localhost.`)
};

const ru_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Укажите адрес https:// — http:// допустим только для localhost.`)
};

const pt_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Use um URL https:// — http:// só é aceite para localhost.`)
};

const it_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usa un URL https:// — http:// è ammesso solo per localhost.`)
};

const ar_provider_base_url_insecure = /** @type {(inputs: Provider_Base_Url_InsecureInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استخدم عنوان https:// — لا يُسمح بـ http:// إلا مع localhost.`)
};

/**
* | output |
* | --- |
* | "Use an https:// URL — http:// only works for localhost." |
*
* @param {Provider_Base_Url_InsecureInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_base_url_insecure = /** @type {((inputs?: Provider_Base_Url_InsecureInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Base_Url_InsecureInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_base_url_insecure(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_base_url_insecure(inputs)
	if (locale === "en") return en_provider_base_url_insecure(inputs)
	if (locale === "ja") return ja_provider_base_url_insecure(inputs)
	if (locale === "ko") return ko_provider_base_url_insecure(inputs)
	if (locale === "fr") return fr_provider_base_url_insecure(inputs)
	if (locale === "de") return de_provider_base_url_insecure(inputs)
	if (locale === "es") return es_provider_base_url_insecure(inputs)
	if (locale === "ru") return ru_provider_base_url_insecure(inputs)
	if (locale === "pt") return pt_provider_base_url_insecure(inputs)
	if (locale === "it") return it_provider_base_url_insecure(inputs)
	return ar_provider_base_url_insecure(inputs)
});