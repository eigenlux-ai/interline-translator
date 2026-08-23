/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Params_DescInputs */

const zh_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`留空则用模型自己的默认值。推理模型(OpenAI o 系列、gpt-5)通常只接受默认温度。`)
};

const zh_tw2_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`欄位留空就沿用模型自己的預設值。推理模型(OpenAI o 系列、gpt-5)通常只接受預設溫度。`)
};

const en_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leave a field empty to use the model's own default. Reasoning models (OpenAI o-series, gpt-5) usually accept only the default temperature.`)
};

const ja_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`空欄にすると、モデル自身の既定値を使います。推論モデル(OpenAI o シリーズ、gpt-5)は既定の温度しか受け付けないことが多いです。`)
};

const ko_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`비워 두면 모델 자체의 기본값을 사용합니다. 추론 모델(OpenAI o 시리즈, gpt-5)은 보통 기본 온도만 받습니다.`)
};

const fr_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Laissez un champ vide pour utiliser la valeur par défaut du modèle lui-même. Les modèles de raisonnement (série o d'OpenAI, gpt-5) n'acceptent en général que la température par défaut.`)
};

const de_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ein leeres Feld nutzt den Standardwert des Modells selbst. Reasoning-Modelle (OpenAI o-Serie, gpt-5) akzeptieren meist nur die Standard-Temperatur.`)
};

const es_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deja un campo vacío para usar el valor por defecto del propio modelo. Los modelos de razonamiento (serie o de OpenAI, gpt-5) suelen aceptar solo la temperatura predeterminada.`)
};

const ru_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оставьте поле пустым, чтобы взять значение по умолчанию у самой модели. Рассуждающие модели (серия o от OpenAI, gpt-5) обычно принимают только температуру по умолчанию.`)
};

const pt_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deixe um campo vazio para usar o valor predefinido do próprio modelo. Os modelos de raciocínio (série o da OpenAI, gpt-5) costumam aceitar apenas a temperatura predefinida.`)
};

const it_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lascia un campo vuoto per usare il valore predefinito del modello stesso. I modelli di ragionamento (serie o di OpenAI, gpt-5) di solito accettano solo la temperatura predefinita.`)
};

const ar_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اترك الحقل فارغًا لاستخدام القيمة الافتراضية للنموذج نفسه. نماذج الاستدلال (سلسلة o من OpenAI و gpt-5) لا تقبل عادةً سوى درجة الحرارة الافتراضية.`)
};

/**
* | output |
* | --- |
* | "Leave a field empty to use the model's own default. Reasoning models (OpenAI o-series, gpt-5) usually accept only the default temperature." |
*
* @param {Provider_Params_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_params_desc = /** @type {((inputs?: Provider_Params_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Params_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_params_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_params_desc(inputs)
	if (locale === "en") return en_provider_params_desc(inputs)
	if (locale === "ja") return ja_provider_params_desc(inputs)
	if (locale === "ko") return ko_provider_params_desc(inputs)
	if (locale === "fr") return fr_provider_params_desc(inputs)
	if (locale === "de") return de_provider_params_desc(inputs)
	if (locale === "es") return es_provider_params_desc(inputs)
	if (locale === "ru") return ru_provider_params_desc(inputs)
	if (locale === "pt") return pt_provider_params_desc(inputs)
	if (locale === "it") return it_provider_params_desc(inputs)
	return ar_provider_params_desc(inputs)
});