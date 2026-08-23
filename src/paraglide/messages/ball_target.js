/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Ball_TargetInputs */

const zh_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`译入`)
};

const zh_tw2_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`譯入`)
};

const en_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Into`)
};

const ja_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`翻訳先`)
};

const ko_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`번역 언어`)
};

const fr_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vers`)
};

const de_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nach`)
};

const es_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`A`)
};

const ru_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`На`)
};

const pt_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Para`)
};

const it_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`In`)
};

const ar_ball_target = /** @type {(inputs: Ball_TargetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`إلى`)
};

/**
* | output |
* | --- |
* | "Into" |
*
* @param {Ball_TargetInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const ball_target = /** @type {((inputs?: Ball_TargetInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Ball_TargetInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_ball_target(inputs)
	if (locale === "zh-TW") return zh_tw2_ball_target(inputs)
	if (locale === "en") return en_ball_target(inputs)
	if (locale === "ja") return ja_ball_target(inputs)
	if (locale === "ko") return ko_ball_target(inputs)
	if (locale === "fr") return fr_ball_target(inputs)
	if (locale === "de") return de_ball_target(inputs)
	if (locale === "es") return es_ball_target(inputs)
	if (locale === "ru") return ru_ball_target(inputs)
	if (locale === "pt") return pt_ball_target(inputs)
	if (locale === "it") return it_ball_target(inputs)
	return ar_ball_target(inputs)
});