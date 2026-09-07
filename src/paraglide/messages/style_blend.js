/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Style_BlendInputs */

const zh_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`融入页面`)
};

const zh_tw2_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`融入頁面`)
};

const en_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Match page`)
};

const ja_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`ページになじませる`)
};

const ko_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`페이지에 맞춤`)
};

const fr_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Intégré à la page`)
};

const de_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`An Seite anpassen`)
};

const es_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Integrado en la página`)
};

const ru_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Как на странице`)
};

const pt_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Integrado à página`)
};

const it_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Integrato nella pagina`)
};

const ar_style_blend = /** @type {(inputs: Style_BlendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`مطابقة مظهر الصفحة`)
};

/**
* | output |
* | --- |
* | "Match page" |
*
* @param {Style_BlendInputs} inputs
* @param {{ locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }} options
* @returns {LocalizedString}
*/
export const style_blend = /** @type {((inputs?: Style_BlendInputs, options?: { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Style_BlendInputs, { locale?: "zh" | "zh-TW" | "en" | "ja" | "ko" | "fr" | "de" | "es" | "ru" | "pt" | "it" | "ar" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "zh") return zh_style_blend(inputs)
	if (locale === "zh-TW") return zh_tw2_style_blend(inputs)
	if (locale === "en") return en_style_blend(inputs)
	if (locale === "ja") return ja_style_blend(inputs)
	if (locale === "ko") return ko_style_blend(inputs)
	if (locale === "fr") return fr_style_blend(inputs)
	if (locale === "de") return de_style_blend(inputs)
	if (locale === "es") return es_style_blend(inputs)
	if (locale === "ru") return ru_style_blend(inputs)
	if (locale === "pt") return pt_style_blend(inputs)
	if (locale === "it") return it_style_blend(inputs)
	return ar_style_blend(inputs)
});