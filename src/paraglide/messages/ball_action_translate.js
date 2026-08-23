/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ball_Action_TranslateInputs */

const zh_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻译此页`)
};

const zh_tw2_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻譯這一頁`)
};

const en_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Translate this page`)
};

const ja_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`このページを翻訳`)
};

const ko_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`이 페이지 번역`)
};

const fr_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduire cette page`)
};

const de_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Diese Seite übersetzen`)
};

const es_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traducir esta página`)
};

const ru_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Перевести страницу`)
};

const pt_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduzir esta página`)
};

const it_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Traduci questa pagina`)
};

const ar_ball_action_translate = /** @type {(inputs: Ball_Action_TranslateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ترجمة هذه الصفحة`)
};

/**
* | output |
* | --- |
* | "Translate this page" |
*
* @param {Ball_Action_TranslateInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const ball_action_translate = /** @type {((inputs?: Ball_Action_TranslateInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ball_Action_TranslateInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_ball_action_translate(inputs)
	if (locale === "zh-TW") return zh_tw2_ball_action_translate(inputs)
	if (locale === "en") return en_ball_action_translate(inputs)
	if (locale === "ja") return ja_ball_action_translate(inputs)
	if (locale === "ko") return ko_ball_action_translate(inputs)
	if (locale === "fr") return fr_ball_action_translate(inputs)
	if (locale === "de") return de_ball_action_translate(inputs)
	if (locale === "es") return es_ball_action_translate(inputs)
	if (locale === "ru") return ru_ball_action_translate(inputs)
	if (locale === "pt") return pt_ball_action_translate(inputs)
	if (locale === "it") return it_ball_action_translate(inputs)
	return ar_ball_action_translate(inputs)
});