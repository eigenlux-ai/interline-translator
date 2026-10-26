/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Third_PartyInputs */

const zh_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`第三方服务`)
};

const zh_tw2_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`第三方服務`)
};

const en_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Third-party service`)
};

const ja_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`サードパーティサービス`)
};

const ko_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`타사 서비스`)
};

const fr_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Service tiers`)
};

const de_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Drittanbieter-Dienst`)
};

const es_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Servicio de terceros`)
};

const ru_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сторонний сервис`)
};

const pt_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Serviço de terceiros`)
};

const it_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Servizio di terze parti`)
};

const ar_provider_third_party = /** @type {(inputs: Provider_Third_PartyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`خدمة طرف ثالث`)
};

/**
* | output |
* | --- |
* | "Third-party service" |
*
* @param {Provider_Third_PartyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_third_party = /** @type {((inputs?: Provider_Third_PartyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Third_PartyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_third_party(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_third_party(inputs)
	if (locale === "en") return en_provider_third_party(inputs)
	if (locale === "ja") return ja_provider_third_party(inputs)
	if (locale === "ko") return ko_provider_third_party(inputs)
	if (locale === "fr") return fr_provider_third_party(inputs)
	if (locale === "de") return de_provider_third_party(inputs)
	if (locale === "es") return es_provider_third_party(inputs)
	if (locale === "ru") return ru_provider_third_party(inputs)
	if (locale === "pt") return pt_provider_third_party(inputs)
	if (locale === "it") return it_provider_third_party(inputs)
	return ar_provider_third_party(inputs)
});