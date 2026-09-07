/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Provider_Models_LoadedInputs */

const zh_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`已加载 ${i?.count} 个模型`)
};

const zh_tw2_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`已載入 ${i?.count} 個模型`)
};

const en_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Models loaded: ${i?.count}`)
};

const ja_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.count} 個のモデルを読み込みました`)
};

const ko_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`모델 ${i?.count}개를 불러왔습니다`)
};

const fr_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Modèles chargés : ${i?.count}`)
};

const de_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Geladene Modelle: ${i?.count}`)
};

const es_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Modelos cargados: ${i?.count}`)
};

const ru_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Загружено моделей: ${i?.count}`)
};

const pt_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Modelos carregados: ${i?.count}`)
};

const it_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Modelli caricati: ${i?.count}`)
};

const ar_provider_models_loaded = /** @type {(inputs: Provider_Models_LoadedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`عدد النماذج المحمّلة: ${i?.count}`)
};

/**
* | output |
* | --- |
* | "Models loaded: {count}" |
*
* @param {Provider_Models_LoadedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_models_loaded = /** @type {((inputs: Provider_Models_LoadedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Models_LoadedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_models_loaded(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_models_loaded(inputs)
	if (locale === "en") return en_provider_models_loaded(inputs)
	if (locale === "ja") return ja_provider_models_loaded(inputs)
	if (locale === "ko") return ko_provider_models_loaded(inputs)
	if (locale === "fr") return fr_provider_models_loaded(inputs)
	if (locale === "de") return de_provider_models_loaded(inputs)
	if (locale === "es") return es_provider_models_loaded(inputs)
	if (locale === "ru") return ru_provider_models_loaded(inputs)
	if (locale === "pt") return pt_provider_models_loaded(inputs)
	if (locale === "it") return it_provider_models_loaded(inputs)
	return ar_provider_models_loaded(inputs)
});