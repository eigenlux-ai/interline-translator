/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Remove_Confirm_TextInputs */

const zh_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`将移除此引擎及其 API 密钥。`)
};

const zh_tw2_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`將移除此引擎及其 API 金鑰。`)
};

const en_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This removes the engine and its API key.`)
};

const ja_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このエンジンと API キー を削除します。`)
};

const ko_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 엔진과 API 키를 제거합니다.`)
};

const fr_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cela supprime le moteur et sa clé API.`)
};

const de_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Damit werden die Engine und ihr API-Schlüssel entfernt.`)
};

const es_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Se eliminarán este motor y su clave API.`)
};

const ru_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Движок и его API-ключ будут удалены.`)
};

const pt_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Este motor e sua chave de API serão removidos.`)
};

const it_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verranno rimossi il motore e la sua chiave API.`)
};

const ar_provider_remove_confirm_text = /** @type {(inputs: Provider_Remove_Confirm_TextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`سيؤدي هذا إلى إزالة المحرّك ومفتاح API الخاص به.`)
};

/**
* | output |
* | --- |
* | "This removes the engine and its API key." |
*
* @param {Provider_Remove_Confirm_TextInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_remove_confirm_text = /** @type {((inputs?: Provider_Remove_Confirm_TextInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Remove_Confirm_TextInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_remove_confirm_text(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_remove_confirm_text(inputs)
	if (locale === "en") return en_provider_remove_confirm_text(inputs)
	if (locale === "ja") return ja_provider_remove_confirm_text(inputs)
	if (locale === "ko") return ko_provider_remove_confirm_text(inputs)
	if (locale === "fr") return fr_provider_remove_confirm_text(inputs)
	if (locale === "de") return de_provider_remove_confirm_text(inputs)
	if (locale === "es") return es_provider_remove_confirm_text(inputs)
	if (locale === "ru") return ru_provider_remove_confirm_text(inputs)
	if (locale === "pt") return pt_provider_remove_confirm_text(inputs)
	if (locale === "it") return it_provider_remove_confirm_text(inputs)
	return ar_provider_remove_confirm_text(inputs)
});