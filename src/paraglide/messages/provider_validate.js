/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_ValidateInputs */

const zh_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`验证连接`)
};

const zh_tw2_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`驗證連線`)
};

const en_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validate connection`)
};

const ja_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`接続を検証`)
};

const ko_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`연결 검증`)
};

const fr_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valider la connexion`)
};

const de_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verbindung prüfen`)
};

const es_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validar la conexión`)
};

const ru_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Проверить соединение`)
};

const pt_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Validar conexão`)
};

const it_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Verifica la connessione`)
};

const ar_provider_validate = /** @type {(inputs: Provider_ValidateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`التحقق من الاتصال`)
};

/**
* | output |
* | --- |
* | "Validate connection" |
*
* @param {Provider_ValidateInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_validate = /** @type {((inputs?: Provider_ValidateInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_ValidateInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_validate(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_validate(inputs)
	if (locale === "en") return en_provider_validate(inputs)
	if (locale === "ja") return ja_provider_validate(inputs)
	if (locale === "ko") return ko_provider_validate(inputs)
	if (locale === "fr") return fr_provider_validate(inputs)
	if (locale === "de") return de_provider_validate(inputs)
	if (locale === "es") return es_provider_validate(inputs)
	if (locale === "ru") return ru_provider_validate(inputs)
	if (locale === "pt") return pt_provider_validate(inputs)
	if (locale === "it") return it_provider_validate(inputs)
	return ar_provider_validate(inputs)
});