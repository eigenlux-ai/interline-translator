/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Validate_Hint_ModelInputs */

const zh_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`请先选择模型，再验证连接以启用。`)
};

const zh_tw2_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`請先選擇模型，再驗證連線以啟用。`)
};

const en_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Set a model, then validate to enable.`)
};

const ja_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`先にモデルを設定し、検証して有効にします。`)
};

const ko_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`먼저 모델을 설정한 뒤 검증해 켜세요.`)
};

const fr_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Définissez un modèle, puis validez pour activer.`)
};

const de_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erst ein Modell festlegen, dann zum Aktivieren prüfen.`)
};

const es_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Define un modelo y luego valida para activarlo.`)
};

const ru_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Сначала укажите модель, затем проверьте и включите.`)
};

const pt_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Defina um modelo e depois valide para ativar.`)
};

const it_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Imposta prima un modello, poi verifica per attivarlo.`)
};

const ar_provider_validate_hint_model = /** @type {(inputs: Provider_Validate_Hint_ModelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`حدّد نموذجًا أولًا، ثم تحقّق للتفعيل.`)
};

/**
* | output |
* | --- |
* | "Set a model, then validate to enable." |
*
* @param {Provider_Validate_Hint_ModelInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_validate_hint_model = /** @type {((inputs?: Provider_Validate_Hint_ModelInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Validate_Hint_ModelInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_validate_hint_model(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_validate_hint_model(inputs)
	if (locale === "en") return en_provider_validate_hint_model(inputs)
	if (locale === "ja") return ja_provider_validate_hint_model(inputs)
	if (locale === "ko") return ko_provider_validate_hint_model(inputs)
	if (locale === "fr") return fr_provider_validate_hint_model(inputs)
	if (locale === "de") return de_provider_validate_hint_model(inputs)
	if (locale === "es") return es_provider_validate_hint_model(inputs)
	if (locale === "ru") return ru_provider_validate_hint_model(inputs)
	if (locale === "pt") return pt_provider_validate_hint_model(inputs)
	if (locale === "it") return it_provider_validate_hint_model(inputs)
	return ar_provider_validate_hint_model(inputs)
});