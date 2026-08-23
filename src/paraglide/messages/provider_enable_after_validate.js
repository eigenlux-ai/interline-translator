/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Enable_After_ValidateInputs */

const zh_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`验证后才能启用`)
};

const zh_tw2_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`驗證後才能啟用`)
};

const en_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validate before enabling`)
};

const ja_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`検証してから有効にできます`)
};

const ko_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`검증한 뒤에 켤 수 있습니다`)
};

const fr_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validez avant d'activer`)
};

const de_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vor dem Aktivieren prüfen`)
};

const es_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valida antes de activar`)
};

const ru_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Включение — после проверки`)
};

const pt_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valide antes de ativar`)
};

const it_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verifica prima di attivare`)
};

const ar_provider_enable_after_validate = /** @type {(inputs: Provider_Enable_After_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التفعيل بعد التحقق`)
};

/**
* | output |
* | --- |
* | "Validate before enabling" |
*
* @param {Provider_Enable_After_ValidateInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_enable_after_validate = /** @type {((inputs?: Provider_Enable_After_ValidateInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Enable_After_ValidateInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_enable_after_validate(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_enable_after_validate(inputs)
	if (locale === "en") return en_provider_enable_after_validate(inputs)
	if (locale === "ja") return ja_provider_enable_after_validate(inputs)
	if (locale === "ko") return ko_provider_enable_after_validate(inputs)
	if (locale === "fr") return fr_provider_enable_after_validate(inputs)
	if (locale === "de") return de_provider_enable_after_validate(inputs)
	if (locale === "es") return es_provider_enable_after_validate(inputs)
	if (locale === "ru") return ru_provider_enable_after_validate(inputs)
	if (locale === "pt") return pt_provider_enable_after_validate(inputs)
	if (locale === "it") return it_provider_enable_after_validate(inputs)
	return ar_provider_enable_after_validate(inputs)
});