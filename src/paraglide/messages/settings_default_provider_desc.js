/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Default_Provider_DescInputs */

const zh_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`请求未指定引擎时使用`)
};

const zh_tw2_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`請求未指定引擎時使用`)
};

const en_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Used when a request names no engine`)
};

const ja_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`リクエストでエンジンを指定しないとき使用します`)
};

const ko_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`요청에서 엔진을 지정하지 않을 때 사용합니다`)
};

const fr_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utilisé quand une requête ne nomme aucun moteur`)
};

const de_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wird verwendet, wenn eine Anfrage keine Engine nennt`)
};

const es_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se usa cuando una solicitud no indica ningún motor`)
};

const ru_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Используется, когда в запросе не указан движок`)
};

const pt_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usado quando um pedido não indica nenhum motor`)
};

const it_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usato quando una richiesta non indica alcun motore`)
};

const ar_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يُستخدَم عندما لا يحدّد الطلب أي محرّك`)
};

/**
* | output |
* | --- |
* | "Used when a request names no engine" |
*
* @param {Settings_Default_Provider_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_default_provider_desc = /** @type {((inputs?: Settings_Default_Provider_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Default_Provider_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_default_provider_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_default_provider_desc(inputs)
	if (locale === "en") return en_settings_default_provider_desc(inputs)
	if (locale === "ja") return ja_settings_default_provider_desc(inputs)
	if (locale === "ko") return ko_settings_default_provider_desc(inputs)
	if (locale === "fr") return fr_settings_default_provider_desc(inputs)
	if (locale === "de") return de_settings_default_provider_desc(inputs)
	if (locale === "es") return es_settings_default_provider_desc(inputs)
	if (locale === "ru") return ru_settings_default_provider_desc(inputs)
	if (locale === "pt") return pt_settings_default_provider_desc(inputs)
	if (locale === "it") return it_settings_default_provider_desc(inputs)
	return ar_settings_default_provider_desc(inputs)
});