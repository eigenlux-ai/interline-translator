/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Provider_Conn_ChangedInputs */

const zh_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`配置已更改，请重新验证`)
};

const zh_tw2_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定已更改，請重新驗證`)
};

const en_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Settings changed — please validate again`)
};

const ja_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`設定が変更されました。もう一度検証してください`)
};

const ko_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`설정이 변경되었습니다. 연결을 다시 검증해 주세요.`)
};

const fr_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les paramètres ont changé — veuillez valider à nouveau`)
};

const de_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Einstellungen geändert. Bitte prüfen Sie die Verbindung erneut.`)
};

const es_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La configuración ha cambiado. Por favor, vuelve a validar`)
};

const ru_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Настройки изменены. Проверьте соединение ещё раз.`)
};

const pt_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Configurações alteradas — valide novamente`)
};

const it_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impostazioni modificate. Verifica di nuovo la connessione.`)
};

const ar_provider_conn_changed = /** @type {(inputs: Provider_Conn_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تم تغيير الإعدادات — يرجى التحقق مرة أخرى`)
};

/**
* | output |
* | --- |
* | "Settings changed — please validate again" |
*
* @param {Provider_Conn_ChangedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const provider_conn_changed = /** @type {((inputs?: Provider_Conn_ChangedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Provider_Conn_ChangedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_provider_conn_changed(inputs)
	if (locale === "zh-TW") return zh_tw2_provider_conn_changed(inputs)
	if (locale === "en") return en_provider_conn_changed(inputs)
	if (locale === "ja") return ja_provider_conn_changed(inputs)
	if (locale === "ko") return ko_provider_conn_changed(inputs)
	if (locale === "fr") return fr_provider_conn_changed(inputs)
	if (locale === "de") return de_provider_conn_changed(inputs)
	if (locale === "es") return es_provider_conn_changed(inputs)
	if (locale === "ru") return ru_provider_conn_changed(inputs)
	if (locale === "pt") return pt_provider_conn_changed(inputs)
	if (locale === "it") return it_provider_conn_changed(inputs)
	return ar_provider_conn_changed(inputs)
});