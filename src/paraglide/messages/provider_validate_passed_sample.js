/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ sample: NonNullable<unknown> }} Provider_Validate_Passed_SampleInputs */

const zh_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`验证通过：「${i?.sample}」`)
};

const zh_tw2_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`驗證通過：「${i?.sample}」`)
};

const en_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Validated: “${i?.sample}”`)
};

const ja_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`検証に成功:「${i?.sample}」`)
};

const ko_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`검증 통과: 「${i?.sample}」`)
};

const fr_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Validé : « ${i?.sample} »`)
};

const de_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Geprüft: „${i?.sample}“`)
};

const es_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Validado: «${i?.sample}»`)
};

const ru_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Проверено: «${i?.sample}»`)
};

const pt_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Validado: «${i?.sample}»`)
};

const it_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Verificato: «${i?.sample}»`)
};

const ar_provider_validate_passed_sample = /** @type {(inputs: Provider_Validate_Passed_SampleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`تم التحقق: «${i?.sample}»`)
};

/**
* | output |
* | --- |
* | "Validated: “{sample}”" |
*
* @param {Provider_Validate_Passed_SampleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_validate_passed_sample = /** @type {((inputs: Provider_Validate_Passed_SampleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Validate_Passed_SampleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_validate_passed_sample(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_validate_passed_sample(inputs)
	if (locale === "en") return en_provider_validate_passed_sample(inputs)
	if (locale === "ja") return ja_provider_validate_passed_sample(inputs)
	if (locale === "ko") return ko_provider_validate_passed_sample(inputs)
	if (locale === "fr") return fr_provider_validate_passed_sample(inputs)
	if (locale === "de") return de_provider_validate_passed_sample(inputs)
	if (locale === "es") return es_provider_validate_passed_sample(inputs)
	if (locale === "ru") return ru_provider_validate_passed_sample(inputs)
	if (locale === "pt") return pt_provider_validate_passed_sample(inputs)
	if (locale === "it") return it_provider_validate_passed_sample(inputs)
	return ar_provider_validate_passed_sample(inputs)
});