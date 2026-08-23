/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Input_FailedInputs */

const zh_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`未能翻译，原文未动`)
};

const zh_tw2_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`未能翻譯,原文未動`)
};

const en_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Couldn't translate — your draft is untouched`)
};

const ja_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳できませんでした。原文はそのままです`)
};

const ko_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역하지 못했습니다. 원문은 그대로입니다`)
};

const fr_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduction impossible — votre texte est intact`)
};

const de_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Übersetzung nicht möglich — Ihr Text bleibt unberührt`)
};

const es_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No se pudo traducir: tu texto está intacto`)
};

const ru_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Не удалось перевести — ваш текст не тронут`)
};

const pt_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Não foi possível traduzir — o seu texto está intacto`)
};

const it_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossibile tradurre — il tuo testo è intatto`)
};

const ar_input_failed = /** @type {(inputs: Input_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`تعذّرت الترجمة — نصّك كما هو`)
};

/**
* | output |
* | --- |
* | "Couldn't translate — your draft is untouched" |
*
* @param {Input_FailedInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const input_failed = /** @type {((inputs?: Input_FailedInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Input_FailedInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_input_failed(inputs)
	if (locale === "zh-TW") return zh_tw2_input_failed(inputs)
	if (locale === "en") return en_input_failed(inputs)
	if (locale === "ja") return ja_input_failed(inputs)
	if (locale === "ko") return ko_input_failed(inputs)
	if (locale === "fr") return fr_input_failed(inputs)
	if (locale === "de") return de_input_failed(inputs)
	if (locale === "es") return es_input_failed(inputs)
	if (locale === "ru") return ru_input_failed(inputs)
	if (locale === "pt") return pt_input_failed(inputs)
	if (locale === "it") return it_input_failed(inputs)
	return ar_input_failed(inputs)
});