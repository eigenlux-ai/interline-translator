/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Models_FailedInputs */

const zh_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`未能获取模型列表，请检查网络或 API key`)
};

const zh_tw2_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`無法取得模型列表，請檢查網路或 API key`)
};

const en_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couldn't fetch the model list — check your network or API key`)
};

const ja_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`モデル一覧を取得できませんでした。ネットワークまたは API キーを確認してください`)
};

const ko_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`모델 목록을 가져오지 못했습니다. 네트워크나 API 키를 확인해 주세요`)
};

const fr_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de récupérer la liste des modèles — vérifiez votre réseau ou votre clé API`)
};

const de_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modellliste konnte nicht abgerufen werden — bitte Netzwerk oder API-Schlüssel prüfen`)
};

const es_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No se pudo obtener la lista de modelos. Comprueba tu red o tu clave API`)
};

const ru_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось получить список моделей — проверьте сеть или API-ключ`)
};

const pt_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Não foi possível obter a lista de modelos — verifique a rede ou a chave API`)
};

const it_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossibile recuperare l'elenco dei modelli — controlla la rete o la chiave API`)
};

const ar_provider_models_failed = /** @type {(inputs: Provider_Models_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذر جلب قائمة النماذج — يرجى التحقق من الشبكة أو مفتاح API`)
};

/**
* | output |
* | --- |
* | "Couldn't fetch the model list — check your network or API key" |
*
* @param {Provider_Models_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_models_failed = /** @type {((inputs?: Provider_Models_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Models_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_models_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_models_failed(inputs)
	if (locale === "en") return en_provider_models_failed(inputs)
	if (locale === "ja") return ja_provider_models_failed(inputs)
	if (locale === "ko") return ko_provider_models_failed(inputs)
	if (locale === "fr") return fr_provider_models_failed(inputs)
	if (locale === "de") return de_provider_models_failed(inputs)
	if (locale === "es") return es_provider_models_failed(inputs)
	if (locale === "ru") return ru_provider_models_failed(inputs)
	if (locale === "pt") return pt_provider_models_failed(inputs)
	if (locale === "it") return it_provider_models_failed(inputs)
	return ar_provider_models_failed(inputs)
});