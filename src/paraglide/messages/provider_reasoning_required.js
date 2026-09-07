/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Reasoning_RequiredInputs */

const zh_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`强制推理`)
};

const zh_tw2_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`必要推理`)
};

const en_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reasoning required`)
};

const ja_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`推論必須`)
};

const ko_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`추론 필수`)
};

const fr_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Raisonnement obligatoire`)
};

const de_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reasoning erforderlich`)
};

const es_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Razonamiento obligatorio`)
};

const ru_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Рассуждение обязательно`)
};

const pt_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Raciocínio obrigatório`)
};

const it_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ragionamento obbligatorio`)
};

const ar_provider_reasoning_required = /** @type {(inputs: Provider_Reasoning_RequiredInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`الاستدلال مطلوب`)
};

/**
* | output |
* | --- |
* | "Reasoning required" |
*
* @param {Provider_Reasoning_RequiredInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_reasoning_required = /** @type {((inputs?: Provider_Reasoning_RequiredInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Reasoning_RequiredInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_reasoning_required(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_reasoning_required(inputs)
	if (locale === "en") return en_provider_reasoning_required(inputs)
	if (locale === "ja") return ja_provider_reasoning_required(inputs)
	if (locale === "ko") return ko_provider_reasoning_required(inputs)
	if (locale === "fr") return fr_provider_reasoning_required(inputs)
	if (locale === "de") return de_provider_reasoning_required(inputs)
	if (locale === "es") return es_provider_reasoning_required(inputs)
	if (locale === "ru") return ru_provider_reasoning_required(inputs)
	if (locale === "pt") return pt_provider_reasoning_required(inputs)
	if (locale === "it") return it_provider_reasoning_required(inputs)
	return ar_provider_reasoning_required(inputs)
});