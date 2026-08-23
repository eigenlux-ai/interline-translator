/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Skip_Langs_NoneInputs */

const zh_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`无`)
};

const zh_tw2_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`無`)
};

const en_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`None`)
};

const ja_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`なし`)
};

const ko_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`없음`)
};

const fr_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune`)
};

const de_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Keine`)
};

const es_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ninguno`)
};

const ru_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Нет`)
};

const pt_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nenhum`)
};

const it_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nessuna`)
};

const ar_settings_skip_langs_none = /** @type {(inputs: Settings_Skip_Langs_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا شيء`)
};

/**
* | output |
* | --- |
* | "None" |
*
* @param {Settings_Skip_Langs_NoneInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_skip_langs_none = /** @type {((inputs?: Settings_Skip_Langs_NoneInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Skip_Langs_NoneInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_skip_langs_none(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_skip_langs_none(inputs)
	if (locale === "en") return en_settings_skip_langs_none(inputs)
	if (locale === "ja") return ja_settings_skip_langs_none(inputs)
	if (locale === "ko") return ko_settings_skip_langs_none(inputs)
	if (locale === "fr") return fr_settings_skip_langs_none(inputs)
	if (locale === "de") return de_settings_skip_langs_none(inputs)
	if (locale === "es") return es_settings_skip_langs_none(inputs)
	if (locale === "ru") return ru_settings_skip_langs_none(inputs)
	if (locale === "pt") return pt_settings_skip_langs_none(inputs)
	if (locale === "it") return it_settings_skip_langs_none(inputs)
	return ar_settings_skip_langs_none(inputs)
});