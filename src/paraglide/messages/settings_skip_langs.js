/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Skip_LangsInputs */

const zh_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`无需翻译的语言`)
};

const zh_tw2_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`不需翻譯的語言`)
};

const en_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Languages you understand`)
};

const ja_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳しない言語`)
};

const ko_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역하지 않을 언어`)
};

const fr_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langues que vous comprenez`)
};

const de_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sprachen, die Sie verstehen`)
};

const es_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idiomas que entiendes`)
};

const ru_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Языки, которые вы уже понимаете`)
};

const pt_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Idiomas que você entende`)
};

const it_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lingue che conosci`)
};

const ar_settings_skip_langs = /** @type {(inputs: Settings_Skip_LangsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`اللغات التي تفهمها`)
};

/**
* | output |
* | --- |
* | "Languages you understand" |
*
* @param {Settings_Skip_LangsInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_skip_langs = /** @type {((inputs?: Settings_Skip_LangsInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Skip_LangsInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_skip_langs(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_skip_langs(inputs)
	if (locale === "en") return en_settings_skip_langs(inputs)
	if (locale === "ja") return ja_settings_skip_langs(inputs)
	if (locale === "ko") return ko_settings_skip_langs(inputs)
	if (locale === "fr") return fr_settings_skip_langs(inputs)
	if (locale === "de") return de_settings_skip_langs(inputs)
	if (locale === "es") return es_settings_skip_langs(inputs)
	if (locale === "ru") return ru_settings_skip_langs(inputs)
	if (locale === "pt") return pt_settings_skip_langs(inputs)
	if (locale === "it") return it_settings_skip_langs(inputs)
	return ar_settings_skip_langs(inputs)
});