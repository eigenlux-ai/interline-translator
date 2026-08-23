/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Fetch_ModelsInputs */

const zh_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`获取模型列表`)
};

const zh_tw2_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`取得模型清單`)
};

const en_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fetch model list`)
};

const ja_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`モデル一覧を取得`)
};

const ko_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모델 목록 가져오기`)
};

const fr_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Récupérer la liste des modèles`)
};

const de_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modellliste abrufen`)
};

const es_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Obtener la lista de modelos`)
};

const ru_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Получить список моделей`)
};

const pt_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Obter a lista de modelos`)
};

const it_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recupera l'elenco dei modelli`)
};

const ar_provider_fetch_models = /** @type {(inputs: Provider_Fetch_ModelsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`جلب قائمة النماذج`)
};

/**
* | output |
* | --- |
* | "Fetch model list" |
*
* @param {Provider_Fetch_ModelsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_fetch_models = /** @type {((inputs?: Provider_Fetch_ModelsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Fetch_ModelsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_fetch_models(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_fetch_models(inputs)
	if (locale === "en") return en_provider_fetch_models(inputs)
	if (locale === "ja") return ja_provider_fetch_models(inputs)
	if (locale === "ko") return ko_provider_fetch_models(inputs)
	if (locale === "fr") return fr_provider_fetch_models(inputs)
	if (locale === "de") return de_provider_fetch_models(inputs)
	if (locale === "es") return es_provider_fetch_models(inputs)
	if (locale === "ru") return ru_provider_fetch_models(inputs)
	if (locale === "pt") return pt_provider_fetch_models(inputs)
	if (locale === "it") return it_provider_fetch_models(inputs)
	return ar_provider_fetch_models(inputs)
});