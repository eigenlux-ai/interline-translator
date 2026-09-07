/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Reasoning_Required_DescInputs */

const zh_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`此模型必须使用推理功能，无法通过此开关关闭。`)
};

const zh_tw2_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`此模型必須使用推理功能，無法透過此開關停用。`)
};

const en_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This model requires reasoning. This switch cannot turn it off.`)
};

const ja_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このモデルでは推論が必須です。このスイッチでは無効にできません。`)
};

const ko_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 모델은 추론이 필수이므로 이 스위치로 끌 수 없습니다.`)
};

const fr_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce modèle nécessite le raisonnement. Cet interrupteur ne peut pas le désactiver.`)
};

const de_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dieses Modell benötigt Reasoning. Dieser Schalter kann es nicht deaktivieren.`)
};

const es_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Este modelo necesita razonar. Este interruptor no permite desactivarlo.`)
};

const ru_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Этой модели необходимо рассуждение. Отключить его этим переключателем нельзя.`)
};

const pt_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Este modelo exige raciocínio. Este botão não permite desativá-lo.`)
};

const it_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Questo modello richiede il ragionamento. Questo interruttore non può disattivarlo.`)
};

const ar_provider_reasoning_required_desc = /** @type {(inputs: Provider_Reasoning_Required_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يتطلب هذا النموذج الاستدلال، ولا يمكن إيقافه بهذا المفتاح.`)
};

/**
* | output |
* | --- |
* | "This model requires reasoning. This switch cannot turn it off." |
*
* @param {Provider_Reasoning_Required_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_reasoning_required_desc = /** @type {((inputs?: Provider_Reasoning_Required_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Reasoning_Required_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_reasoning_required_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_reasoning_required_desc(inputs)
	if (locale === "en") return en_provider_reasoning_required_desc(inputs)
	if (locale === "ja") return ja_provider_reasoning_required_desc(inputs)
	if (locale === "ko") return ko_provider_reasoning_required_desc(inputs)
	if (locale === "fr") return fr_provider_reasoning_required_desc(inputs)
	if (locale === "de") return de_provider_reasoning_required_desc(inputs)
	if (locale === "es") return es_provider_reasoning_required_desc(inputs)
	if (locale === "ru") return ru_provider_reasoning_required_desc(inputs)
	if (locale === "pt") return pt_provider_reasoning_required_desc(inputs)
	if (locale === "it") return it_provider_reasoning_required_desc(inputs)
	return ar_provider_reasoning_required_desc(inputs)
});