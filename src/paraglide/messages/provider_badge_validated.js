/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Badge_ValidatedInputs */

const zh_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已验证`)
};

const zh_tw2_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已驗證`)
};

const en_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validated`)
};

const ja_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`検証済み`)
};

const ko_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`검증됨`)
};

const fr_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validé`)
};

const de_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geprüft`)
};

const es_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validado`)
};

const ru_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверено`)
};

const pt_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validado`)
};

const it_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verificato`)
};

const ar_provider_badge_validated = /** @type {(inputs: Provider_Badge_ValidatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مُتحقَّق منه`)
};

/**
* | output |
* | --- |
* | "Validated" |
*
* @param {Provider_Badge_ValidatedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_badge_validated = /** @type {((inputs?: Provider_Badge_ValidatedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Badge_ValidatedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_badge_validated(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_badge_validated(inputs)
	if (locale === "en") return en_provider_badge_validated(inputs)
	if (locale === "ja") return ja_provider_badge_validated(inputs)
	if (locale === "ko") return ko_provider_badge_validated(inputs)
	if (locale === "fr") return fr_provider_badge_validated(inputs)
	if (locale === "de") return de_provider_badge_validated(inputs)
	if (locale === "es") return es_provider_badge_validated(inputs)
	if (locale === "ru") return ru_provider_badge_validated(inputs)
	if (locale === "pt") return pt_provider_badge_validated(inputs)
	if (locale === "it") return it_provider_badge_validated(inputs)
	return ar_provider_badge_validated(inputs)
});