/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expert_ResetInputs */

const zh_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`恢复默认`)
};

const zh_tw2_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`還原預設值`)
};

const en_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restore defaults`)
};

const ja_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`既定に戻す`)
};

const ko_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`기본값 복원`)
};

const fr_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rétablir les valeurs par défaut`)
};

const de_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Standard wiederherstellen`)
};

const es_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restaurar valores predeterminados`)
};

const ru_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Вернуть по умолчанию`)
};

const pt_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Restaurar padrões`)
};

const it_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ripristina predefiniti`)
};

const ar_expert_reset = /** @type {(inputs: Expert_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`استعادة الافتراضي`)
};

/**
* | output |
* | --- |
* | "Restore defaults" |
*
* @param {Expert_ResetInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const expert_reset = /** @type {((inputs?: Expert_ResetInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expert_ResetInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_expert_reset(inputs)
	if (locale === "zh-TW") return zh_tw2_expert_reset(inputs)
	if (locale === "en") return en_expert_reset(inputs)
	if (locale === "ja") return ja_expert_reset(inputs)
	if (locale === "ko") return ko_expert_reset(inputs)
	if (locale === "fr") return fr_expert_reset(inputs)
	if (locale === "de") return de_expert_reset(inputs)
	if (locale === "es") return es_expert_reset(inputs)
	if (locale === "ru") return ru_expert_reset(inputs)
	if (locale === "pt") return pt_expert_reset(inputs)
	if (locale === "it") return it_expert_reset(inputs)
	return ar_expert_reset(inputs)
});