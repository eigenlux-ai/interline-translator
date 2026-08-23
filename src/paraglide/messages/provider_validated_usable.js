/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Validated_UsableInputs */

const zh_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已验证 · 可以使用`)
};

const zh_tw2_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`已驗證 · 可以使用`)
};

const en_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validated · ready to use`)
};

const ja_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`検証済み · 使用できます`)
};

const ko_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`검증됨 · 사용 가능`)
};

const fr_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validé · prêt à l'emploi`)
};

const de_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Geprüft · einsatzbereit`)
};

const es_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validado · listo para usar`)
};

const ru_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверено · готово к работе`)
};

const pt_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validado · pronto a usar`)
};

const it_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verificato · pronto all'uso`)
};

const ar_provider_validated_usable = /** @type {(inputs: Provider_Validated_UsableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم التحقق · جاهز للاستخدام`)
};

/**
* | output |
* | --- |
* | "Validated · ready to use" |
*
* @param {Provider_Validated_UsableInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_validated_usable = /** @type {((inputs?: Provider_Validated_UsableInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Validated_UsableInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_validated_usable(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_validated_usable(inputs)
	if (locale === "en") return en_provider_validated_usable(inputs)
	if (locale === "ja") return ja_provider_validated_usable(inputs)
	if (locale === "ko") return ko_provider_validated_usable(inputs)
	if (locale === "fr") return fr_provider_validated_usable(inputs)
	if (locale === "de") return de_provider_validated_usable(inputs)
	if (locale === "es") return es_provider_validated_usable(inputs)
	if (locale === "ru") return ru_provider_validated_usable(inputs)
	if (locale === "pt") return pt_provider_validated_usable(inputs)
	if (locale === "it") return it_provider_validated_usable(inputs)
	return ar_provider_validated_usable(inputs)
});