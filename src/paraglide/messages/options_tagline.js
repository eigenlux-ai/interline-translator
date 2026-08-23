/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Options_TaglineInputs */

const zh_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI 原生的读者翻译器 · 设置`)
};

const zh_tw2_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI 原生的讀者翻譯器 · 設定`)
};

const en_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An AI-native reader's translator · Settings`)
};

const ja_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI ネイティブの読み手のための翻訳ツール · 設定`)
};

const ko_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`AI 네이티브 독자용 번역기 · 설정`)
};

const fr_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un traducteur pour le lecteur, nativement IA · Réglages`)
};

const de_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ein KI-nativer Übersetzer für Lesende · Einstellungen`)
};

const es_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un traductor para quien lee, nativo de IA · Ajustes`)
};

const ru_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Переводчик для читателя, созданный вокруг ИИ · Настройки`)
};

const pt_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Um tradutor para quem lê, nativo de IA · Definições`)
};

const it_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Un traduttore per chi legge, nativo IA · Impostazioni`)
};

const ar_options_tagline = /** @type {(inputs: Options_TaglineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مترجم للقارئ أصيل الذكاء الاصطناعي · الإعدادات`)
};

/**
* | output |
* | --- |
* | "An AI-native reader's translator · Settings" |
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