/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Params_DescInputs */

const zh_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`留空则使用模型默认值。可用参数因模型而异；部分推理模型不支持自定义温度。`)
};

const zh_tw2_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`留空即使用模型預設值。可用參數依模型而異；部分推理模型不支援自訂溫度。`)
};

const en_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leave fields blank to use the model defaults. Supported parameters depend on the model; some reasoning models use a fixed temperature.`)
};

const ja_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`空欄の場合はモデルの既定値を使用します。対応するパラメーターはモデルによって異なり、一部の推論モデルは温度が固定されています。`)
};

const ko_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`비워 두면 모델의 기본값을 사용합니다. 지원하는 매개변수는 모델마다 다르며, 일부 추론 모델은 온도가 고정되어 있습니다.`)
};

const fr_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Laissez les champs vides pour utiliser les valeurs par défaut. Les paramètres disponibles dépendent du modèle ; certains modèles de raisonnement imposent une température fixe.`)
};

const de_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leere Felder verwenden die Modellvorgaben. Welche Parameter unterstützt werden, hängt vom Modell ab; einige Reasoning-Modelle haben eine feste Temperatur.`)
};

const es_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deja los campos vacíos para usar los valores predeterminados. Los parámetros disponibles dependen del modelo; algunos modelos de razonamiento tienen una temperatura fija.`)
};

const ru_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оставьте поля пустыми, чтобы использовать значения по умолчанию. Поддерживаемые параметры зависят от модели; у некоторых моделей рассуждения температура фиксирована.`)
};

const pt_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Deixe os campos vazios para usar os valores padrão. Os parâmetros disponíveis dependem do modelo; alguns modelos de raciocínio têm temperatura fixa.`)
};

const it_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lascia i campi vuoti per usare i valori predefiniti. I parametri supportati dipendono dal modello; alcuni modelli di ragionamento hanno una temperatura fissa.`)
};

const ar_provider_params_desc = /** @type {(inputs: Provider_Params_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اترك الحقول فارغة لاستخدام القيم الافتراضية. تختلف المعاملات المدعومة حسب النموذج؛ وبعض نماذج الاستدلال تستخدم درجة حرارة ثابتة.`)
};

/**
* | output |
* | --- |
* | "Leave fields blank to use the model defaults. Supported parameters depend on the model; some reasoning models use a fixed temperature." |
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