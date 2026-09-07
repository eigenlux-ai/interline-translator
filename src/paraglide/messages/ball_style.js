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
	return /** @type {LocalizedString} */ (`Appearance`)
};

const ja_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`表示形式`)
};

const ko_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`표시 방식`)
};

const fr_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apparence`)
};

const de_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Darstellung`)
};

const es_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Apariencia`)
};

const ru_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Оформление`)
};

const pt_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aparência`)
};

const it_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aspetto`)
};

const ar_ball_style = /** @type {(inputs: Ball_StyleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`المظهر`)
};

/**
* | output |
* | --- |
* | "Appearance" |
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