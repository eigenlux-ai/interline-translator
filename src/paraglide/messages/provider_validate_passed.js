/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Validate_PassedInputs */

const zh_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`验证通过`)
};

const zh_tw2_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`驗證通過`)
};

const en_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validated`)
};

const ja_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`検証に成功`)
};

const ko_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`검증 통과`)
};

const fr_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validé`)
};

const de_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geprüft`)
};

const es_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validado`)
};

const ru_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверено`)
};

const pt_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validado`)
};

const it_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verificato`)
};

const ar_provider_validate_passed = /** @type {(inputs: Provider_Validate_PassedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التحقق`)
};

/**
* | output |
* | --- |
* | "Validated" |
*
* @param {Provider_Validate_PassedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_validate_passed = /** @type {((inputs?: Provider_Validate_PassedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Validate_PassedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_validate_passed(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_validate_passed(inputs)
	if (locale === "en") return en_provider_validate_passed(inputs)
	if (locale === "ja") return ja_provider_validate_passed(inputs)
	if (locale === "ko") return ko_provider_validate_passed(inputs)
	if (locale === "fr") return fr_provider_validate_passed(inputs)
	if (locale === "de") return de_provider_validate_passed(inputs)
	if (locale === "es") return es_provider_validate_passed(inputs)
	if (locale === "ru") return ru_provider_validate_passed(inputs)
	if (locale === "pt") return pt_provider_validate_passed(inputs)
	if (locale === "it") return it_provider_validate_passed(inputs)
	return ar_provider_validate_passed(inputs)
});