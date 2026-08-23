/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Models_EmptyInputs */

const zh_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`该端点未返回任何模型`)
};

const zh_tw2_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`這個端點沒有傳回任何模型`)
};

const en_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The endpoint returned no models`)
};

const ja_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このエンドポイントはモデルを返しませんでした`)
};

const ko_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 엔드포인트가 모델을 반환하지 않았습니다`)
};

const fr_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce point de terminaison n'a renvoyé aucun modèle`)
};

const de_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dieser Endpunkt hat keine Modelle zurückgegeben`)
};

const es_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Este endpoint no devolvió ningún modelo`)
};

const ru_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Эта конечная точка не вернула ни одной модели`)
};

const pt_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Este endpoint não devolveu nenhum modelo`)
};

const it_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Questo endpoint non ha restituito alcun modello`)
};

const ar_provider_models_empty = /** @type {(inputs: Provider_Models_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لم تُرجِع نقطة النهاية أي نموذج`)
};

/**
* | output |
* | --- |
* | "The endpoint returned no models" |
*
* @param {Provider_Models_EmptyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_models_empty = /** @type {((inputs?: Provider_Models_EmptyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Models_EmptyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_models_empty(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_models_empty(inputs)
	if (locale === "en") return en_provider_models_empty(inputs)
	if (locale === "ja") return ja_provider_models_empty(inputs)
	if (locale === "ko") return ko_provider_models_empty(inputs)
	if (locale === "fr") return fr_provider_models_empty(inputs)
	if (locale === "de") return de_provider_models_empty(inputs)
	if (locale === "es") return es_provider_models_empty(inputs)
	if (locale === "ru") return ru_provider_models_empty(inputs)
	if (locale === "pt") return pt_provider_models_empty(inputs)
	if (locale === "it") return it_provider_models_empty(inputs)
	return ar_provider_models_empty(inputs)
});