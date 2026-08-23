/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Error_NetworkInputs */

const zh_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`网络连接失败，请检查网络后重试。`)
};

const zh_tw2_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`網路連線失敗，請檢查網路後重試。`)
};

const en_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Network connection failed. Please check your connection and retry.`)
};

const ja_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ネットワーク接続に失敗しました。接続を確認して再試行してください。`)
};

const ko_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`네트워크 연결에 실패했습니다. 네트워크를 확인하고 다시 시도해 주세요.`)
};

const fr_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Échec de la connexion réseau. Veuillez vérifier votre connexion et réessayer.`)
};

const de_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Netzwerkverbindung fehlgeschlagen. Bitte Verbindung überprüfen und erneut versuchen.`)
};

const es_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Error de conexión de red. Comprueba tu conexión y vuelve a intentarlo.`)
};

const ru_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ошибка сети. Проверьте подключение и повторите попытку.`)
};

const pt_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Falha na conexão de rede. Verifique a sua conexão e tente novamente.`)
};

const it_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connessione di rete non riuscita. Controlla la connessione e riprova.`)
};

const ar_error_network = /** @type {(inputs: Error_NetworkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`فشل الاتصال بالشبكة. يرجى التحقق من اتصالك والمحاولة مرة أخرى.`)
};

/**
* | output |
* | --- |
* | "Network connection failed. Please check your connection and retry." |
*
* @param {Error_NetworkInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const error_network = /** @type {((inputs?: Error_NetworkInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Error_NetworkInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_error_network(inputs)
	if (locale === "zh-TW") return zh_tw2_error_network(inputs)
	if (locale === "en") return en_error_network(inputs)
	if (locale === "ja") return ja_error_network(inputs)
	if (locale === "ko") return ko_error_network(inputs)
	if (locale === "fr") return fr_error_network(inputs)
	if (locale === "de") return de_error_network(inputs)
	if (locale === "es") return es_error_network(inputs)
	if (locale === "ru") return ru_error_network(inputs)
	if (locale === "pt") return pt_error_network(inputs)
	if (locale === "it") return it_error_network(inputs)
	return ar_error_network(inputs)
});