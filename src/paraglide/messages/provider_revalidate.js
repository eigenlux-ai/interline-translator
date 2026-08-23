/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_RevalidateInputs */

const zh_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`重新验证`)
};

const zh_tw2_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`重新驗證`)
};

const en_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Re-validate`)
};

const ja_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`再検証`)
};

const ko_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`다시 검증`)
};

const fr_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Revalider`)
};

const de_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erneut prüfen`)
};

const es_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Volver a validar`)
};

const ru_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверить снова`)
};

const pt_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validar de novo`)
};

const it_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verifica di nuovo`)
};

const ar_provider_revalidate = /** @type {(inputs: Provider_RevalidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إعادة التحقق`)
};

/**
* | output |
* | --- |
* | "Re-validate" |
*
* @param {Provider_RevalidateInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_revalidate = /** @type {((inputs?: Provider_RevalidateInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_RevalidateInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_revalidate(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_revalidate(inputs)
	if (locale === "en") return en_provider_revalidate(inputs)
	if (locale === "ja") return ja_provider_revalidate(inputs)
	if (locale === "ko") return ko_provider_revalidate(inputs)
	if (locale === "fr") return fr_provider_revalidate(inputs)
	if (locale === "de") return de_provider_revalidate(inputs)
	if (locale === "es") return es_provider_revalidate(inputs)
	if (locale === "ru") return ru_provider_revalidate(inputs)
	if (locale === "pt") return pt_provider_revalidate(inputs)
	if (locale === "it") return it_provider_revalidate(inputs)
	return ar_provider_revalidate(inputs)
});