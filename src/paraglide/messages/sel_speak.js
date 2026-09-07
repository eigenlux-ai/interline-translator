/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Sel_SpeakInputs */

const zh_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`朗读译文`)
};

const zh_tw2_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`朗讀譯文`)
};

const en_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Read translation aloud`)
};

const ja_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`訳文を読み上げる`)
};

const ko_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역문 읽어주기`)
};

const fr_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Lire la traduction à voix haute`)
};

const de_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung vorlesen`)
};

const es_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leer la traducción en voz alta`)
};

const ru_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Прочитать перевод вслух`)
};

const pt_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ler tradução em voz alta`)
};

const it_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Leggi la traduzione ad alta voce`)
};

const ar_sel_speak = /** @type {(inputs: Sel_SpeakInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`قراءة الترجمة بصوت عالٍ`)
};

/**
* | output |
* | --- |
* | "Read translation aloud" |
*
* @param {Sel_SpeakInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const sel_speak = /** @type {((inputs?: Sel_SpeakInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Sel_SpeakInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_sel_speak(inputs)
	if (locale === "zh-TW") return zh_tw2_sel_speak(inputs)
	if (locale === "en") return en_sel_speak(inputs)
	if (locale === "ja") return ja_sel_speak(inputs)
	if (locale === "ko") return ko_sel_speak(inputs)
	if (locale === "fr") return fr_sel_speak(inputs)
	if (locale === "de") return de_sel_speak(inputs)
	if (locale === "es") return es_sel_speak(inputs)
	if (locale === "ru") return ru_sel_speak(inputs)
	if (locale === "pt") return pt_sel_speak(inputs)
	if (locale === "it") return it_sel_speak(inputs)
	return ar_sel_speak(inputs)
});