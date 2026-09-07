/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Skip_Langs_DescInputs */

const zh_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`检测到这些语言时保留原文；目标语言始终无需翻译。`)
};

const zh_tw2_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`偵測到這些語言時保留原文；目標語言一律不翻譯。`)
};

const en_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Skip text in these languages. Text in your target language is always skipped.`)
};

const ja_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`これらの言語の文章は翻訳しません。翻訳先の言語も常に対象外です。`)
};

const ko_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 언어로 감지된 글은 번역하지 않습니다. 번역 대상 언어도 항상 제외됩니다.`)
};

const fr_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le texte détecté dans ces langues est laissé tel quel (la langue cible est toujours ignorée)`)
};

const de_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Text, der in diesen Sprachen erkannt wird, bleibt unberührt (die Zielsprache wird immer übersprungen)`)
};

const es_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`El texto detectado en estos idiomas se deja intacto (el idioma de destino siempre se omite)`)
};

const ru_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Текст на этих языках остаётся без перевода (язык перевода всегда пропускается)`)
};

const pt_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Textos nesses idiomas não são traduzidos. O idioma de destino também é sempre ignorado.`)
};

const it_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Il testo rilevato in queste lingue resta invariato (la lingua di destinazione viene sempre saltata)`)
};

const ar_settings_skip_langs_desc = /** @type {(inputs: Settings_Skip_Langs_DescInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`لا يُترجَم النص المكتشَف بهذه اللغات (تُتخطّى لغة الهدف دائمًا)`)
};

/**
* | output |
* | --- |
* | "Skip text in these languages. Text in your target language is always skipped." |
*
* @param {Settings_Skip_Langs_DescInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const settings_skip_langs_desc = /** @type {((inputs?: Settings_Skip_Langs_DescInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Skip_Langs_DescInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_settings_skip_langs_desc(inputs)
	if (locale === "zh-TW") return zh_tw2_settings_skip_langs_desc(inputs)
	if (locale === "en") return en_settings_skip_langs_desc(inputs)
	if (locale === "ja") return ja_settings_skip_langs_desc(inputs)
	if (locale === "ko") return ko_settings_skip_langs_desc(inputs)
	if (locale === "fr") return fr_settings_skip_langs_desc(inputs)
	if (locale === "de") return de_settings_skip_langs_desc(inputs)
	if (locale === "es") return es_settings_skip_langs_desc(inputs)
	if (locale === "ru") return ru_settings_skip_langs_desc(inputs)
	if (locale === "pt") return pt_settings_skip_langs_desc(inputs)
	if (locale === "it") return it_settings_skip_langs_desc(inputs)
	return ar_settings_skip_langs_desc(inputs)
});