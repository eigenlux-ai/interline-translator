/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Validate_FailedInputs */

const zh_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`验证失败`)
};

const zh_tw2_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`驗證失敗`)
};

const en_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validation failed`)
};

const ja_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`検証に失敗`)
};

const ko_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`검증 실패`)
};

const fr_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échec de la validation`)
};

const de_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prüfung fehlgeschlagen`)
};

const es_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Error de validación`)
};

const ru_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверка не пройдена`)
};

const pt_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Falha na validação`)
};

const it_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verifica non riuscita`)
};

const ar_provider_validate_failed = /** @type {(inputs: Provider_Validate_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فشل التحقق`)
};

/**
* | output |
* | --- |
* | "Validation failed" |
*
* @param {Provider_Validate_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_validate_failed = /** @type {((inputs?: Provider_Validate_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Validate_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_validate_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_validate_failed(inputs)
	if (locale === "en") return en_provider_validate_failed(inputs)
	if (locale === "ja") return ja_provider_validate_failed(inputs)
	if (locale === "ko") return ko_provider_validate_failed(inputs)
	if (locale === "fr") return fr_provider_validate_failed(inputs)
	if (locale === "de") return de_provider_validate_failed(inputs)
	if (locale === "es") return es_provider_validate_failed(inputs)
	if (locale === "ru") return ru_provider_validate_failed(inputs)
	if (locale === "pt") return pt_provider_validate_failed(inputs)
	if (locale === "it") return it_provider_validate_failed(inputs)
	return ar_provider_validate_failed(inputs)
});