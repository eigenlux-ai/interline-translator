/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Validate_Hint_ReadyInputs */

const zh_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`验证后即可启用此引擎。`)
};

const zh_tw2_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`驗證後即可啟用這個引擎。`)
};

const en_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validate to enable this engine.`)
};

const ja_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`検証するとこのエンジンを有効にできます。`)
};

const ko_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`검증하면 이 엔진을 켤 수 있습니다.`)
};

const fr_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validez pour activer ce moteur.`)
};

const de_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prüfen, um diese Engine zu aktivieren.`)
};

const es_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valida para activar este motor.`)
};

const ru_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверьте, чтобы включить этот движок.`)
};

const pt_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valide para ativar este motor.`)
};

const it_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verifica per attivare questo motore.`)
};

const ar_provider_validate_hint_ready = /** @type {(inputs: Provider_Validate_Hint_ReadyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تحقّق لتفعيل هذا المحرّك.`)
};

/**
* | output |
* | --- |
* | "Validate to enable this engine." |
*
* @param {Provider_Validate_Hint_ReadyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_validate_hint_ready = /** @type {((inputs?: Provider_Validate_Hint_ReadyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Validate_Hint_ReadyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_validate_hint_ready(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_validate_hint_ready(inputs)
	if (locale === "en") return en_provider_validate_hint_ready(inputs)
	if (locale === "ja") return ja_provider_validate_hint_ready(inputs)
	if (locale === "ko") return ko_provider_validate_hint_ready(inputs)
	if (locale === "fr") return fr_provider_validate_hint_ready(inputs)
	if (locale === "de") return de_provider_validate_hint_ready(inputs)
	if (locale === "es") return es_provider_validate_hint_ready(inputs)
	if (locale === "ru") return ru_provider_validate_hint_ready(inputs)
	if (locale === "pt") return pt_provider_validate_hint_ready(inputs)
	if (locale === "it") return it_provider_validate_hint_ready(inputs)
	return ar_provider_validate_hint_ready(inputs)
});