/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_No_KeyInputs */

const zh_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`此引擎尚未设置 API 密钥，请前往设置添加。`)
};

const zh_tw2_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`此引擎尚未設定 API 金鑰，請前往設定新增。`)
};

const en_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This engine is missing an API key. Please add one in settings.`)
};

const ja_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このエンジンには API キーが設定されていません。設定から追加してください。`)
};

const ko_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 엔진에는 API 키가 구성되지 않았습니다. 설정에서 추가해 주세요.`)
};

const fr_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce moteur n’a pas de clé API. Ajoutez-en une dans les réglages.`)
};

const de_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dieser Engine fehlt ein API-Schlüssel. Bitte in den Einstellungen hinzufügen.`)
};

const es_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A este motor le falta una clave API. Añádela en los ajustes.`)
};

const ru_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Этому движку нужен API-ключ. Пожалуйста, добавьте его в настройках.`)
};

const pt_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Este motor precisa de uma chave de API. Adicione-a nas configurações.`)
};

const it_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A questo motore manca una chiave API. Aggiungila nelle impostazioni.`)
};

const ar_error_no_key = /** @type {(inputs: Error_No_KeyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`يفتقر هذا المحرك إلى مفتاح API. يرجى إضافته في الإعدادات.`)
};

/**
* | output |
* | --- |
* | "This engine is missing an API key. Please add one in settings." |
*
* @param {Error_No_KeyInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const error_no_key = /** @type {((inputs?: Error_No_KeyInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_No_KeyInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_error_no_key(inputs)
	if (locale === "zh-TW") return zh_tw2_error_no_key(inputs)
	if (locale === "en") return en_error_no_key(inputs)
	if (locale === "ja") return ja_error_no_key(inputs)
	if (locale === "ko") return ko_error_no_key(inputs)
	if (locale === "fr") return fr_error_no_key(inputs)
	if (locale === "de") return de_error_no_key(inputs)
	if (locale === "es") return es_error_no_key(inputs)
	if (locale === "ru") return ru_error_no_key(inputs)
	if (locale === "pt") return pt_error_no_key(inputs)
	if (locale === "it") return it_error_no_key(inputs)
	return ar_error_no_key(inputs)
});