/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Model_PlaceholderInputs */

const zh_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`输入或选择模型`)
};

const zh_tw2_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`輸入或選擇模型`)
};

const en_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Type or pick a model`)
};

const ja_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`モデルを入力または選択`)
};

const ko_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모델 입력 또는 선택`)
};

const fr_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisir ou choisir un modèle`)
};

const de_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modell eingeben oder auswählen`)
};

const es_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escribe o elige un modelo`)
};

const ru_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Введите или выберите модель`)
};

const pt_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Escreva ou escolha um modelo`)
};

const it_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Scrivi o scegli un modello`)
};

const ar_provider_model_placeholder = /** @type {(inputs: Provider_Model_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اكتب نموذجًا أو اختره`)
};

/**
* | output |
* | --- |
* | "Type or pick a model" |
*
* @param {Provider_Model_PlaceholderInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_model_placeholder = /** @type {((inputs?: Provider_Model_PlaceholderInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Model_PlaceholderInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_model_placeholder(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_model_placeholder(inputs)
	if (locale === "en") return en_provider_model_placeholder(inputs)
	if (locale === "ja") return ja_provider_model_placeholder(inputs)
	if (locale === "ko") return ko_provider_model_placeholder(inputs)
	if (locale === "fr") return fr_provider_model_placeholder(inputs)
	if (locale === "de") return de_provider_model_placeholder(inputs)
	if (locale === "es") return es_provider_model_placeholder(inputs)
	if (locale === "ru") return ru_provider_model_placeholder(inputs)
	if (locale === "pt") return pt_provider_model_placeholder(inputs)
	if (locale === "it") return it_provider_model_placeholder(inputs)
	return ar_provider_model_placeholder(inputs)
});