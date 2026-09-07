/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_Nav_Providers_HintInputs */

const zh_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`服务商 · 密钥`)
};

const zh_tw2_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`服務商 · 金鑰`)
};

const en_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Providers · Keys`)
};

const ja_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`プロバイダー · キー`)
};

const ko_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`제공자 · 키`)
};

const fr_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fournisseurs · Clés`)
};

const de_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Anbieter · Schlüssel`)
};

const es_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Proveedores · Claves`)
};

const ru_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Провайдеры · Ключи`)
};

const pt_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provedores · Chaves`)
};

const it_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provider · Chiavi`)
};

const ar_options_nav_providers_hint = /** @type {(inputs: Options_Nav_Providers_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المزوّدون · المفاتيح`)
};

/**
* | output |
* | --- |
* | "Providers · Keys" |
*
* @param {Options_Nav_Providers_HintInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_nav_providers_hint = /** @type {((inputs?: Options_Nav_Providers_HintInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_Nav_Providers_HintInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_nav_providers_hint(inputs)
	if (locale === "zh-TW") return zh_tw2_options_nav_providers_hint(inputs)
	if (locale === "en") return en_options_nav_providers_hint(inputs)
	if (locale === "ja") return ja_options_nav_providers_hint(inputs)
	if (locale === "ko") return ko_options_nav_providers_hint(inputs)
	if (locale === "fr") return fr_options_nav_providers_hint(inputs)
	if (locale === "de") return de_options_nav_providers_hint(inputs)
	if (locale === "es") return es_options_nav_providers_hint(inputs)
	if (locale === "ru") return ru_options_nav_providers_hint(inputs)
	if (locale === "pt") return pt_options_nav_providers_hint(inputs)
	if (locale === "it") return it_options_nav_providers_hint(inputs)
	return ar_options_nav_providers_hint(inputs)
});