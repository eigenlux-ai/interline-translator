/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Default_ProviderInputs */

const zh_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`默认翻译引擎`)
};

const zh_tw2_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`預設翻譯引擎`)
};

const en_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default engine`)
};

const ja_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定の翻訳エンジン`)
};

const ko_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본 번역 엔진`)
};

const fr_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Moteur par défaut`)
};

const de_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Standard-Engine`)
};

const es_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motor predeterminado`)
};

const ru_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Движок по умолчанию`)
};

const pt_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motor padrão`)
};

const it_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Motore predefinito`)
};

const ar_settings_default_provider = /** @type {(inputs: Settings_Default_ProviderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المحرّك الافتراضي`)
};

/**
* | output |
* | --- |
* | "Default engine" |
*
* @param {Settings_Default_ProviderInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_default_provider = /** @type {((inputs?: Settings_Default_ProviderInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Default_ProviderInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_default_provider(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_default_provider(inputs)
	if (locale === "en") return en_settings_default_provider(inputs)
	if (locale === "ja") return ja_settings_default_provider(inputs)
	if (locale === "ko") return ko_settings_default_provider(inputs)
	if (locale === "fr") return fr_settings_default_provider(inputs)
	if (locale === "de") return de_settings_default_provider(inputs)
	if (locale === "es") return es_settings_default_provider(inputs)
	if (locale === "ru") return ru_settings_default_provider(inputs)
	if (locale === "pt") return pt_settings_default_provider(inputs)
	if (locale === "it") return it_settings_default_provider(inputs)
	return ar_settings_default_provider(inputs)
});