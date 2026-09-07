/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_TaglineInputs */

const zh_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`为阅读而生的 AI 翻译 · 设置`)
};

const zh_tw2_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`為閱讀而生的 AI 翻譯 · 設定`)
};

const en_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI translation for thoughtful reading · Settings`)
};

const ja_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`読むための AI 翻訳 · 設定`)
};

const ko_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`읽기를 위한 AI 번역 · 설정`)
};

const fr_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduction par IA au service de la lecture · Réglages`)
};

const de_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`KI-Übersetzung zum Lesen · Einstellungen`)
};

const es_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducción con IA para disfrutar de la lectura · Ajustes`)
};

const ru_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ИИ-перевод для вдумчивого чтения · Настройки`)
};

const pt_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Tradução com IA para quem lê · Configurações`)
};

const it_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La traduzione con IA al servizio della lettura · Impostazioni`)
};

const ar_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة بالذكاء الاصطناعي لقراءة أعمق · الإعدادات`)
};

/**
* | output |
* | --- |
* | "AI translation for thoughtful reading · Settings" |
*
* @param {Options_TaglineInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const options_tagline = /** @type {((inputs?: Options_TaglineInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Options_TaglineInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_options_tagline(inputs)
	if (locale === "zh-TW") return zh_tw2_options_tagline(inputs)
	if (locale === "en") return en_options_tagline(inputs)
	if (locale === "ja") return ja_options_tagline(inputs)
	if (locale === "ko") return ko_options_tagline(inputs)
	if (locale === "fr") return fr_options_tagline(inputs)
	if (locale === "de") return de_options_tagline(inputs)
	if (locale === "es") return es_options_tagline(inputs)
	if (locale === "ru") return ru_options_tagline(inputs)
	if (locale === "pt") return pt_options_tagline(inputs)
	if (locale === "it") return it_options_tagline(inputs)
	return ar_options_tagline(inputs)
});