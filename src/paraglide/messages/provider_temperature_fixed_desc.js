/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Temperature_Fixed_DescInputs */

const zh_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`此模型使用固定采样温度，自定义温度设置将被忽略。`)
};

const zh_tw2_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`此模型使用固定取樣溫度，自訂溫度設定將被忽略。`)
};

const en_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This model uses a fixed sampling temperature. Custom temperature settings are ignored.`)
};

const ja_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このモデルのサンプリング温度は固定されています。独自の温度設定は適用されません。`)
};

const ko_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 모델은 샘플링 온도가 고정되어 있습니다. 사용자 지정 온도는 적용되지 않습니다.`)
};

const fr_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La température d’échantillonnage de ce modèle est fixe. Les valeurs personnalisées sont ignorées.`)
};

const de_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dieses Modell hat eine feste Sampling-Temperatur. Eigene Temperaturwerte werden ignoriert.`)
};

const es_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Este modelo usa una temperatura de muestreo fija. Se ignoran los valores personalizados.`)
};

const ru_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`У этой модели фиксированная температура сэмплирования. Пользовательское значение игнорируется.`)
};

const pt_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Este modelo usa uma temperatura de amostragem fixa. Os valores personalizados são ignorados.`)
};

const it_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Questo modello usa una temperatura di campionamento fissa. I valori personalizzati vengono ignorati.`)
};

const ar_provider_temperature_fixed_desc = /** @type {(inputs: Provider_Temperature_Fixed_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يستخدم هذا النموذج درجة حرارة ثابتة لأخذ العينات. تُتجاهل القيم المخصصة.`)
};

/**
* | output |
* | --- |
* | "This model uses a fixed sampling temperature. Custom temperature settings are ignored." |
*
* @param {Provider_Temperature_Fixed_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_temperature_fixed_desc = /** @type {((inputs?: Provider_Temperature_Fixed_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Temperature_Fixed_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_temperature_fixed_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_temperature_fixed_desc(inputs)
	if (locale === "en") return en_provider_temperature_fixed_desc(inputs)
	if (locale === "ja") return ja_provider_temperature_fixed_desc(inputs)
	if (locale === "ko") return ko_provider_temperature_fixed_desc(inputs)
	if (locale === "fr") return fr_provider_temperature_fixed_desc(inputs)
	if (locale === "de") return de_provider_temperature_fixed_desc(inputs)
	if (locale === "es") return es_provider_temperature_fixed_desc(inputs)
	if (locale === "ru") return ru_provider_temperature_fixed_desc(inputs)
	if (locale === "pt") return pt_provider_temperature_fixed_desc(inputs)
	if (locale === "it") return it_provider_temperature_fixed_desc(inputs)
	return ar_provider_temperature_fixed_desc(inputs)
});