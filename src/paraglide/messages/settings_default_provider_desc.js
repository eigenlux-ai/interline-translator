/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Default_Provider_DescInputs */

const zh_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`未另行选择引擎时，使用此引擎翻译。`)
};

const zh_tw2_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`未另外選擇引擎時，使用此引擎翻譯。`)
};

const en_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Used unless you choose another engine for a translation.`)
};

const ja_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`別のエンジンを選択しない場合に使用します。`)
};

const ko_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`다른 엔진을 선택하지 않으면 이 엔진을 사용합니다.`)
};

const fr_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Utilisé si vous ne choisissez pas un autre moteur.`)
};

const de_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Wird verwendet, wenn Sie keine andere Engine auswählen.`)
};

const es_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se usa cuando una solicitud no indica ningún motor`)
};

const ru_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Используется, когда в запросе не указан движок`)
};

const pt_settings_default_provider_desc = /** @type {(inputs: Settings_Default_Provider_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usado quando você não escolhe outro motor.`)
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
* | "Used unless you choose another engine for a translation." |
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