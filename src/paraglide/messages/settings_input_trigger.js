/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Input_TriggerInputs */

const zh_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`连续按空格键的次数`)
};

const zh_tw2_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`連續按空白鍵的次數`)
};

const en_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Consecutive Space presses`)
};

const ja_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`スペースキーを連続で押す回数`)
};

const ko_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`스페이스바 연속 입력 횟수`)
};

const fr_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Appuis consécutifs sur Espace`)
};

const de_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aufeinanderfolgende Leertastendrücke`)
};

const es_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pulsaciones seguidas de Espacio`)
};

const ru_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Число нажатий пробела подряд`)
};

const pt_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Toques seguidos na barra de espaço`)
};

const it_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pressioni consecutive della barra spaziatrice`)
};

const ar_settings_input_trigger = /** @type {(inputs: Settings_Input_TriggerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`عدد الضغطات المتتالية على المسافة`)
};

/**
* | output |
* | --- |
* | "Consecutive Space presses" |
*
* @param {Settings_Input_TriggerInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_input_trigger = /** @type {((inputs?: Settings_Input_TriggerInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Input_TriggerInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_input_trigger(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_input_trigger(inputs)
	if (locale === "en") return en_settings_input_trigger(inputs)
	if (locale === "ja") return ja_settings_input_trigger(inputs)
	if (locale === "ko") return ko_settings_input_trigger(inputs)
	if (locale === "fr") return fr_settings_input_trigger(inputs)
	if (locale === "de") return de_settings_input_trigger(inputs)
	if (locale === "es") return es_settings_input_trigger(inputs)
	if (locale === "ru") return ru_settings_input_trigger(inputs)
	if (locale === "pt") return pt_settings_input_trigger(inputs)
	if (locale === "it") return it_settings_input_trigger(inputs)
	return ar_settings_input_trigger(inputs)
});