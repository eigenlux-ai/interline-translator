/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ball_StyleInputs */

const zh_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`样式`)
};

const zh_tw2_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`樣式`)
};

const en_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Style`)
};

const ja_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`スタイル`)
};

const ko_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`스타일`)
};

const fr_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Style`)
};

const de_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stil`)
};

const es_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estilo`)
};

const ru_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Стиль`)
};

const pt_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Estilo`)
};

const it_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stile`)
};

const ar_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`النمط`)
};

/**
* | output |
* | --- |
* | "Style" |
*
* @param {Ball_StyleInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const ball_style = /** @type {((inputs?: Ball_StyleInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ball_StyleInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_ball_style(inputs)
	if (locale === "zh-TW") return zh_tw2_ball_style(inputs)
	if (locale === "en") return en_ball_style(inputs)
	if (locale === "ja") return ja_ball_style(inputs)
	if (locale === "ko") return ko_ball_style(inputs)
	if (locale === "fr") return fr_ball_style(inputs)
	if (locale === "de") return de_ball_style(inputs)
	if (locale === "es") return es_ball_style(inputs)
	if (locale === "ru") return ru_ball_style(inputs)
	if (locale === "pt") return pt_ball_style(inputs)
	if (locale === "it") return it_ball_style(inputs)
	return ar_ball_style(inputs)
});